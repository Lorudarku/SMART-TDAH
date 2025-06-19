import React from 'react';
import Profile from '../../components/Profile/Profile';
import ChangePasswordForm from '../../components/ChangePasswordForm/ChangePasswordForm';
import { useLanguage } from '../../hooks/LanguageContext';
import messages from '../../utils/translations.json';
import { Box, Typography, Paper, useTheme } from '@mui/material';

const Settings = () => {
  const { language } = useLanguage();
  const theme = useTheme();

  // --- ESTILOS CSS-in-JS ---
  // Título principal
  const titleSx = {
    fontSize: { xs: '1.7rem', sm: '2rem' },
    fontWeight: 'bold',
    mb: 3,
    color: theme.palette.primary.main,
    letterSpacing: 0.5,
    textShadow:
      theme.palette.mode === 'dark'
        ? '0 2px 8px rgba(0,0,0,0.18)'
        : '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'color 0.3s, text-shadow 0.3s',
    textAlign: 'center',
  };
  // Paper externo de configuración
  const configuracionPaperSx = {
    m: { xs: 1.5, sm: 3, md: 4 },
    borderRadius: 5,
    boxShadow: theme.shadows[8],
    background: theme.palette.background.paper,
    border: `1.5px solid ${theme.palette.divider}`,
    p: { xs: 2, sm: 3 },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'background-color 0.3s, color 0.3s, box-shadow 0.3s',
    width: '100%',
    maxWidth: 900,
    overflow: 'visible',
  };
  // Layout principal: horizontal en desktop, vertical en móvil
  const mainCardSx = {
    width: '100%',
    maxWidth: 900,
    borderRadius: 0,
    boxShadow: 'none',
    background: 'transparent',
    border: 'none',
    p: 0,
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: 'stretch',
    gap: { xs: 2, md: 4 },
    transition: 'background-color 0.3s, color 0.3s, box-shadow 0.3s',
    minHeight: 0,
    overflow: 'visible',
  };
  // Contenedor del perfil
  const profileSectionSx = {
    flex: 1,
    minWidth: 260,
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    px: { xs: 0, md: 2 },
    py: { xs: 0, md: 1 },
    boxSizing: 'border-box',
    overflow: 'visible',
    height: 'auto',
    alignSelf: { xs: 'center', md: 'flex-start' },
  };

  return (
    <Box display="flex" justifyContent="center" width="100%">
      <Paper elevation={5} sx={configuracionPaperSx}>
        <Typography sx={titleSx} component="h1">
          {messages[language]?.settingsTitle}
        </Typography>
        <Box sx={mainCardSx}>
          <Box sx={profileSectionSx}>
            <Profile />
          </Box>
            <ChangePasswordForm messages={messages} language={language} />
        </Box>
      </Paper>
    </Box>
  );
};

export default Settings;