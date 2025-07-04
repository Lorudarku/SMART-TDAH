import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Divider, Toolbar, useTheme } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import { useLanguage } from '../../hooks/LanguageContext';
import messages from '../../utils/translations.json';

// =====================
// Estilos centralizados
// =====================
// Todos los estilos visuales del componente están aquí agrupados y documentados.
const styles = (theme) => ({
  sidePanel: {
    display: 'flex',
    flexDirection: 'column',
    width: 60,
    height: 'calc(100% - 64px)',
    position: 'fixed',
    top: 64,
    left: 0,
    zIndex: 999,
    pt: '10px', // padding-top
    pb: '10px', // padding-bottom
    // Estilos según el tema
    backgroundColor: theme.palette.background.paper, // color de fondo dependiente del tema
    color: theme.palette.text.primary, // color de texto dependiente del tema
    border: `1.5px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[8],
    backdropFilter: 'blur(2px)',
    transition: 'background-color 0.3s, color 0.3s',
    // --- Responsive para móvil ---
    '@media (maxWidth:600px)': {
      height: 'calc(100% - 54px)',
      width: 48,
      pt: '6px',
      pb: '6px',
    },
  },
  button: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    width: 40,
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: 12,
    // Estilos según el tema
    color: theme.palette.text.primary,
    '& span': {
      marginTop: 2,
      fontSize: 10,
      color: theme.palette.text.secondary,
    },
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  divider: {
    width: 40,
    height: 2,
    my: 2.5, // marginY: 20px aprox
    alignSelf: 'center',
    backgroundColor: theme.palette.divider,
  },
  settingsContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 'auto',
  },
});

const SidePanel = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const theme = useTheme(); // Acceso al tema actual (claro/oscuro)
  const sx = styles(theme); // Obtenemos los estilos centralizados

  return (
    <Toolbar sx={sx.sidePanel}>
      {/* Botón de inicio en la parte superior */}
      <IconButton onClick={() => navigate('/')}>
        <HomeIcon sx={sx.button} />
        <span>{messages[language]?.home}</span>
      </IconButton>

      {/* separación */}
      <Divider sx={sx.divider} />

      {/* Botón para la lista de alumnos */}
      <IconButton onClick={() => navigate('/alumnos')}>
        <ListAltIcon sx={sx.button} />
        <span>{messages[language]?.students}</span>
      </IconButton>

      {/* separación y ajustes en la parte inferior */}
      <div style={sx.settingsContainer}>
        <Divider sx={sx.divider} />
        <IconButton onClick={() => navigate('/settings')}>
          <SettingsIcon sx={sx.button} />
          <span>{messages[language]?.settings}</span>
        </IconButton>
      </div>
    </Toolbar>
  );
};

export default SidePanel;
