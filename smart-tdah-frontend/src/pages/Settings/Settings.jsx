import React, { useState } from 'react';
import Profile from '../../components/Profile/Profile';
import styles from './Settings.module.scss';
import { useLanguage } from '../../hooks/LanguageContext';
import messages from '../../utils/translations.json';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { backendUrl } from '../../utils/constants';
import { useTheme } from '@mui/material/styles';

const Settings = () => {
  const { language } = useLanguage(); // Obtiene el idioma actual
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const theme = useTheme(); // Obtiene el tema actual

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
    <div className={styles.settingsPage}>
      <h1 className={styles.title}>{messages[language]?.settingsTitle}</h1>
      <Profile />
      <Box display="flex" justifyContent="center" mt={4}>
        <Paper
          elevation={5}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 3,
            maxWidth: 800,
            width: '100%',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          <Typography variant="h6" className={styles.changePasswordTitle}>
            {messages[language]?.changePasswordTitle}
          </Typography>
          <TextField
            label={messages[language]?.currentPassword}
            type="password"
            fullWidth
            margin="normal"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            label={messages[language]?.newPassword}
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label={messages[language]?.confirmNewPassword}
            type="password"
            fullWidth
            margin="normal"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="primary">{success}</Typography>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={styles.submitButton}
            onClick={handleChangePassword}
          >
            {messages[language]?.changePasswordButton}
          </Button>
        </Paper>
      </Box>
    </div>
  );
};

export default Settings;