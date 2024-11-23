// src/components/SidePanel.js
import React from 'react';
import { Box, IconButton, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const SidePanel = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: 80,
        height: '95vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        p: 2,
        boxShadow: 1, // Para añadir sombra y diferenciar el panel del fondo
      }}
    >
      {/* Botón de inicio en la parte superior */}
      <IconButton onClick={() => navigate('/home')} color="inherit" sx={{ mb: 2 }}>
        <HomeIcon fontSize="large" />
      </IconButton>

      {/* Divider opcional para mejor separación */}
      <Divider sx={{ width: '100%', mb: 2 }} />

      {/* Icono de ajustes en la parte inferior */}
      <Box sx={{ mt: 'auto' }}>
        <IconButton onClick={() => navigate('/settings')} color="inherit">
          <SettingsIcon fontSize="large" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SidePanel;
