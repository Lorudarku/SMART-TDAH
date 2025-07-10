// src/components/Chat.js
import React, { useState } from 'react';
import { Box, IconButton, TextField, Typography, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useLanguage } from '../../hooks/LanguageContext';
import messages from '../../utils/translations.json';

const Chat = () => {
  const [messagesList, setMessagesList] = useState([]); // Lista de mensajes
  const [input, setInput] = useState(''); // Estado para el mensaje de entrada
  const { language } = useLanguage();

  // Maneja el envío de mensajes
  const handleSendMessage = () => {
    if (input.trim()) {
      setMessagesList([...messagesList, { text: input, sender: 'user' }]);
      setInput('');
    }
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        right: 20,
        width: 300,
        maxHeight: 400,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 3,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Título del chat */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
        <Typography variant="h6">{messages[language]?.chatTitle}</Typography>
      </Box>

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
                  bgcolor: msg.sender === 'user' ? 'primary.light' : 'grey.300',
                }}
              >
                {msg.text}
              </Typography>
          </Box>
        ))}
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
  );
};

export default Chat;
