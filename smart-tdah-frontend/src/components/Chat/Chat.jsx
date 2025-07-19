import React, { useState, useRef } from 'react';
import { useParams} from 'react-router-dom';
import axios from 'axios';
import { Box, IconButton, TextField, Typography, Paper, useTheme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useLanguage } from '../../hooks/LanguageContext';
import messages from '../../utils/translations.json';



// Ancho inicial y mínimo/máximo del chat
const CHAT_INITIAL_WIDTH = 400;
const CHAT_MIN_WIDTH = 280;
const CHAT_MAX_WIDTH = 600;
const CHAT_COLLAPSED_WIDTH = 36;
const BANNER_HEIGHT_DESKTOP = 64; // px, igual que el Banner en desktop
const BANNER_HEIGHT_MOBILE = 54; // px, igual que el Banner en móvil


/**
 * Chat lateral derecho con ancho ajustable y colapsable.
 * Desplaza el contenido principal usando padding/margin en el layout.
 * El usuario puede arrastrar el borde izquierdo para cambiar el ancho.
 */

/**
 * Chat lateral derecho con ancho y colapso controlados por el padre.
 * El componente solo notifica eventos (onCollapse, setWidth).
 */
/**
 * Chat lateral derecho con modo desplazamiento o superposición (overlay).
 * overlay=true: el chat se superpone y no desplaza el contenido.
 * overlay=false: el chat desplaza el contenido principal.
 */
const Chat = ({ width, setWidth, collapsed, onCollapse, overlay = false }) => {
  const [messagesList, setMessagesList] = useState([]); // Lista de mensajes
  const [input, setInput] = useState(''); // Estado para el mensaje de entrada
  const [IaModel, setIaModel] = useState('gemini'); // Estado para el motor de ia
  const [loading, setLoading] = useState(false); // Estado de carga para la respuesta
  const [error, setError] = useState(null); // Estado de error para la respuesta
  const { language } = useLanguage();
  const theme = useTheme();
  const resizing = useRef(false); // Flag de resize
  const startX = useRef(0); // X inicial del mouse
  const startWidth = useRef(CHAT_INITIAL_WIDTH); // Ancho inicial al empezar a arrastrar
  const { id_alumno } = useParams();
  /**
   * Envía la pregunta al backend Gemini y muestra la respuesta.
   * No guarda historial, solo muestra la respuesta actual.
   */
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    setError(null);
    setLoading(true);
    const userMessage = { text: input, sender: 'user' };
    setMessagesList((prev) => [...prev, userMessage]);
    setInput('');
    try {
      // Obtener el token JWT del localStorage
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token provided');
      // Obtenemos el userId del contexto o estado global
      // TODO: Implementar lógica para obtener el userId
      // Por ahora, lo dejamos como undefined para no romper la llamada
      const studentId = id_alumno;
      console.log(process.env.REACT_APP_BACKEND_URL)
      // Llamada al endpoint Gemini
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/gemini/ask`,
        { question: userMessage.text, studentId, IaModel},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data)
      const answer = res.data?.text || '';
      setMessagesList((prev) => [...prev, { text: answer, sender: 'gemini' }]);
    } catch (err) {
      console.log(err, "errores varios")
      setError(messages[language]?.fetchError || 'Error al consultar Gemini');
    } finally {
      setLoading(false);
    }
  };


  // Inicia el resize
  const handleResizeStart = (e) => {
    resizing.current = true;
    startX.current = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    startWidth.current = width;
    document.body.style.cursor = 'ew-resize';
    window.addEventListener('mousemove', handleResizeMove);
    window.addEventListener('mouseup', handleResizeEnd);
    window.addEventListener('touchmove', handleResizeMove);
    window.addEventListener('touchend', handleResizeEnd);
  };

  // Cambia el ancho durante el resize
  const handleResizeMove = (e) => {
    if (!resizing.current) return;
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const newWidth = Math.min(
      CHAT_MAX_WIDTH,
      Math.max(CHAT_MIN_WIDTH, startWidth.current + (startX.current - clientX))
    );
    setWidth(newWidth);
  };

  // Finaliza el resize
  const handleResizeEnd = () => {
    resizing.current = false;
    document.body.style.cursor = '';
    window.removeEventListener('mousemove', handleResizeMove);
    window.removeEventListener('mouseup', handleResizeEnd);
    window.removeEventListener('touchmove', handleResizeMove);
    window.removeEventListener('touchend', handleResizeEnd);
  };

  // Notifica colapso al padre
  const handleCollapse = () => {
    if (typeof onCollapse === 'function') onCollapse();
  };

  // =====================
  // Estilos centralizados y documentados para el chat
  // =====================
  const chatSx = {
    position: 'fixed',
    top: { xs: BANNER_HEIGHT_MOBILE, sm: BANNER_HEIGHT_DESKTOP },
    right: 0,
    height: {
      xs: `calc(100vh - ${BANNER_HEIGHT_MOBILE}px)`,
      sm: `calc(100vh - ${BANNER_HEIGHT_DESKTOP}px)`
    },
    width: collapsed ? CHAT_COLLAPSED_WIDTH : width,
    zIndex: overlay ? 2000 : 1202,
    transition: 'width 0.2s cubic-bezier(0.4,0,0.2,1)',
    boxShadow: overlay ? 12 : 6,
    display: 'flex',
    flexDirection: 'row',
    background: collapsed ? 'transparent' : theme.palette.background.paper,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderLeft: `2px solid ${theme.palette.divider}`,
    borderRight: 'none',
    overflow: 'visible',
    userSelect: resizing.current ? 'none' : 'auto',
    pointerEvents: 'auto',
  };

  return (
    <Box sx={chatSx}>
      {/* Handler de resize (borde izquierdo) */}
      {!collapsed && (
        <Box
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeStart}
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 8,
            height: '100%',
            cursor: 'ew-resize',
            zIndex: 1204,
            background: 'transparent',
            '&:hover': { background: theme.palette.action.hover },
          }}
          aria-label="Ajustar ancho del chat"
        />
      )}

      {/* Flecha para replegar/desplegar el chat */}
      <IconButton
        onClick={handleCollapse}
        sx={{
          position: 'absolute',
          left: -20,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'background.paper',
          border: `1.5px solid ${theme.palette.divider}`,
          boxShadow: 2,
          zIndex: 1203,
          width: 36,
          height: 36,
          borderRadius: '50%',
          p: 0,
          transition: 'background 0.2s',
          '&:hover': { bgcolor: 'primary.light' },
        }}
        aria-label={collapsed ? messages[language]?.expandChat : messages[language]?.collapseChat}
      >
        {collapsed ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>

      {/* Chat expandido */}
      {!collapsed && (
        <Paper
          elevation={0}
          sx={{
            width: width,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 0,
            boxShadow: 'none',
            background: 'inherit',
            overflow: 'hidden',
          }}
        >
          {/* Área de mensajes */}
          <Box sx={{ p: 2, flex: 1, overflowY: 'auto', bgcolor: 'background.paper' }}>
            {messagesList.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  textAlign: msg.sender === 'user' ? 'right' : 'left',
                  mb: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    display: 'inline-block',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor:
                      msg.sender === 'user'
                        ? 'primary.light'
                        : msg.sender === 'gemini'
                        ? 'secondary.light'
                        : 'grey.300',
                  }}
                >
                  {msg.text}
                </Typography>
              </Box>
            ))}
            {loading && (
              <Box sx={{ textAlign: 'left', mb: 1 }}>
                <Typography variant="body2" sx={{ display: 'inline-block', px: 1.5, py: 0.5, borderRadius: 1, bgcolor: 'secondary.light', color: 'text.secondary' }}>
                  {messages[language]?.loading || 'Cargando...'}
                </Typography>
              </Box>
            )}
            {error && (
              <Box sx={{ textAlign: 'left', mb: 1 }}>
                <Typography variant="body2" color="error" sx={{ display: 'inline-block', px: 1.5, py: 0.5, borderRadius: 1 }}>
                  {error}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Campo de entrada de mensaje */}
          <Box sx={{ display: 'flex', p: 1, bgcolor: 'background.default' }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder={messages[language]?.chatPlaceholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <IconButton onClick={handleSendMessage} color="primary">
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Chat;