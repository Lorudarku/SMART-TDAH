import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SettingsIcon from '@mui/icons-material/Settings';
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
      <IconButton onClick={() => navigate('/')} color="inherit" sx={{ mb: 2 }}>
        <HomeIcon fontSize="large" />
      </IconButton>

      {/* Linea para mejor separación */}
      <Divider sx={{ width: '100%', mb: 2 }} />

      {/* Botón para la lista de alumnos */}
      <IconButton onClick={() => navigate('/alumnos')} color="inherit" sx={{ mb: 2 }}>
        <ListAltIcon fontSize="large" />
      </IconButton>

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
