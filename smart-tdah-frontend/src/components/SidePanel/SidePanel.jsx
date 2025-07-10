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
const sidePanelSx = (theme) => ({
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
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  border: `1.5px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[8],
  backdropFilter: 'blur(2px)',
  transition: 'background-color 0.3s, color 0.3s',
  [theme.breakpoints.down('sm')]: {
    height: 'calc(100% - 54px)',
    top: 54,
    width: 48,
    pt: '6px',
    pb: '6px',
  },
});

const buttonSx = (theme) => ({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  width: 40,
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontSize: 12,
  color: theme.palette.text.primary,
  '& span': {
    marginTop: 2,
    fontSize: 10,
    color: theme.palette.text.secondary,
  },
  '&:hover': {
    color: theme.palette.primary.main,
  },
  [theme.breakpoints.down('sm')]: {
    width: 32,
    fontSize: 10,
    '& span': {
      fontSize: 8,
    },
  },
});

const dividerSx = (theme) => ({
  width: 40,
  height: 2,
  my: 2.5, // marginY: 20px aprox
  alignSelf: 'center',
  backgroundColor: theme.palette.divider,
  [theme.breakpoints.down('sm')]: {
    width: 32,
  },
});

const settingsContainerSx = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  marginTop: 'auto',
};

const SidePanel = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const theme = useTheme(); // Acceso al tema actual (claro/oscuro)
  // Usamos sx con funciones para breakpoints MUI
  return (
    <Toolbar sx={sidePanelSx(theme)}>
      {/* Botón de inicio en la parte superior */}
      <IconButton onClick={() => navigate('/')}> 
        <HomeIcon sx={buttonSx(theme)} />
        <span style={{ fontSize: 10 }}>{messages[language]?.home}</span>
      </IconButton>

      {/* separación */}
      <Divider sx={dividerSx(theme)} />

      {/* Botón para la lista de alumnos */}
      <IconButton onClick={() => navigate('/alumnos')}>
        <ListAltIcon sx={buttonSx(theme)} />
        <span style={{ fontSize: 10 }}>{messages[language]?.students}</span>
      </IconButton>

      {/* separación y ajustes en la parte inferior */}
      <div style={settingsContainerSx}>
        <Divider sx={dividerSx(theme)} />
        <IconButton onClick={() => navigate('/settings')}>
          <SettingsIcon sx={buttonSx(theme)} />
          <span style={{ fontSize: 10 }}>{messages[language]?.settings}</span>
        </IconButton>
      </div>
    </Toolbar>
  );
};

export default SidePanel;
