import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Divider, Toolbar, useTheme } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import { useLanguage } from '../../hooks/LanguageContext';
import messages from '../../utils/translations.json';

// Migración de estilos SCSS a CSS-in-JS siguiendo buenas prácticas y modularidad
const styles = {
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
    // Responsividad: en pantallas pequeñas, el panel puede ocultarse o cambiar de tamaño si se desea
    '@media (max-width:600px)': {
      width: 48,
      pt: '6px',
      pb: '6px',
    },
  },
  button: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'white',
    width: 40,
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: 12,
    '& span': {
      marginTop: 2,
      fontSize: 10,
      color: 'white',
    },
    '&:hover': {
      color: 'primary.main',
    },
  },
  divider: {
    width: 40,
    height: 2,
    my: 2.5, // marginY: 20px aprox
    alignSelf: 'center',
  },
  settingsContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 'auto',
  },
};

const SidePanel = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const theme = useTheme(); // Acceso al tema actual (claro/oscuro)

  // Estilos adaptados al tema actual
  const themedStyles = {
    ...styles,
    sidePanel: {
      ...styles.sidePanel,
      backgroundColor: theme.palette.background.paper, 
      color: theme.palette.text.primary,
      border: `1.5px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[8],
      backdropFilter: 'blur(2px)',
      transition: 'background-color 0.3s, color 0.3s',
    },
    button: {
      ...styles.button,
      color: theme.palette.text.primary,
      '& span': {
        ...styles.button['& span'],
        color: theme.palette.text.secondary,
      },
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    divider: {
      ...styles.divider,
      backgroundColor: theme.palette.divider,
    },
  };

  return (
    <Toolbar sx={themedStyles.sidePanel}>
      {/* Botón de inicio en la parte superior */}
      <IconButton onClick={() => navigate('/')}>
        <HomeIcon sx={themedStyles.button}/>
        <span>{messages[language]?.home}</span>
      </IconButton>

      {/* separación */}
      <Divider sx={themedStyles.divider} />

      {/* Botón para la lista de alumnos */}
      <IconButton onClick={() => navigate('/alumnos')}>
        <ListAltIcon sx={themedStyles.button}/>
        <span>{messages[language]?.students}</span>
      </IconButton>

      {/* separación y ajustes en la parte inferior */}
      <div style={styles.settingsContainer}>
        <Divider sx={themedStyles.divider} />
        <IconButton onClick={() => navigate('/settings')} >
          <SettingsIcon sx={themedStyles.button}/>
          <span>{messages[language]?.settings}</span>
        </IconButton>
      </div>
    </Toolbar>
  );
};

export default SidePanel;
