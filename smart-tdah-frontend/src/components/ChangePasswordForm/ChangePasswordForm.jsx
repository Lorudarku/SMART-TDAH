import React, { useState } from 'react';
import { Box, TextField, Button, Typography, useTheme } from '@mui/material';
import axios from 'axios';
import { backendUrl } from '../../utils/constants';

/**
 * Formulario de cambio de contraseña para el usuario logueado.
 * Modularizado para cumplir SRP y facilitar testeo y reutilización.
 * @param {object} props
 * @param {object} props.messages - Diccionario de mensajes traducidos.
 * @param {string} props.language - Idioma actual.
 */
const ChangePasswordForm = ({ messages, language }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const theme = useTheme();

  // Estilos del formulario
  const formSx = {
    flex: 1.2,
    width: '100%',
    maxWidth: 340,
    alignSelf: { xs: 'center', md: 'flex-start' },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    border: 'none',
    p: 0,
    boxSizing: 'border-box',
    overflow: 'hidden',
  };
  // Estilos del título y botón
  const titleSx = {
    fontSize: { xs: '1.1rem', sm: '1.3rem' },
    fontWeight: 'bold',
    mb: 2,
    color: theme.palette.text.primary,
    textAlign: 'center',
  };
  // Estilos del botón de envío
  const submitButtonSx = {
    mt: 3,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 200,
    borderRadius: 2,
    py: 1.5,
    transition: 'background-color 0.3s, transform 0.3s',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      transform: 'scale(1.05)',
    },
  };
  // Estilos de los campos de texto
  const textFieldSx = {
    backgroundColor: theme.palette.background.default,
    borderRadius: 1,
    mb: 1,
    input: { color: theme.palette.text.primary },
  };

  // Lógica de cambio de contraseña
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword !== confirmNewPassword) {
      setError(messages[language]?.passwordMismatch);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${backendUrl}/change-password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(messages[language]?.passwordChangeSuccess);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setError(messages[language]?.passwordChangeError);
    }
  };

  return (
    <Box sx={formSx} component="form" onSubmit={handleChangePassword}>
      <Typography sx={titleSx} component="h2">
        {messages[language]?.changePasswordTitle}
      </Typography>
      <TextField
        label={messages[language]?.currentPassword}
        type="password"
        fullWidth
        margin="normal"
        required
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        sx={textFieldSx}
      />
      <TextField
        label={messages[language]?.newPassword}
        type="password"
        fullWidth
        margin="normal"
        required
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        sx={textFieldSx}
      />
      <TextField
        label={messages[language]?.confirmNewPassword}
        type="password"
        fullWidth
        margin="normal"
        required
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        sx={textFieldSx}
      />
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={submitButtonSx}
      >
        {messages[language]?.changePasswordButton}
      </Button>
    </Box>
  );
};

export default ChangePasswordForm;
