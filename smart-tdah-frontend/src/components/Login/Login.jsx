// c:\Users\lorda\Documents\SMART-TDAH\smart-tdah-frontend\src\components\Login\Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Box, Link, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { backendUrl } from '../../utils/constants';
import logo from '../../assets/logo1.png';
import { useLanguage } from '../../hooks/LanguageContext';
import messages from '../../utils/translations.json';

// Estilos base, el fondo del Paper se adapta dinámicamente según el modo
const styles = {
  logo: {
    width: 300,
    height: 'auto',
    mb: 2,
  },
  boxContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: '100vh',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
};

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { language } = useLanguage();
  const theme = useTheme(); // Detecta el modo claro/oscuro

  // Estilos adaptados al tema
  const themedStyles = {
    logo: styles.logo,
    boxContainer: styles.boxContainer,
    paper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: { xs: 2, sm: 4 },
      maxWidth: 500,
      width: '100%',
      margin: '0 auto',
      borderRadius: 3,
      boxSizing: 'border-box',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      border: `1.5px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[8],
      transition: 'background-color 0.3s, color 0.3s',
    },
    titleLogin: {
      mt: 0.5,
      fontWeight: 'bold',
      letterSpacing: 1,
      color: theme.palette.text.primary,
      transition: 'background-color 0.3s, color 0.3s',
    },
    submitButton: {
      mt: 0.5,
      mb: 1.25,
      fontWeight: 'bold',
      letterSpacing: 1,
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
      boxShadow: theme.shadows[2],
      borderRadius: 2,
      transition: 'background-color 0.3s, color 0.3s',
    },
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
      navigate('/');
    } catch (err) {
      setError(messages[language]?.invalidCredentials);
    }
  };

  return (
      <Box sx={styles.boxContainer}>
        <Paper elevation={0} sx={themedStyles.paper}>
          {/* Logo de la aplicación */}
          <img src={logo} alt="Logo" style={styles.logo} />
          <Typography component="h1" variant="h5" sx={themedStyles.titleLogin}>
            {messages[language]?.loginTitle}
          </Typography>
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={messages[language]?.email}
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                backgroundColor: theme.palette.background.default,
                borderRadius: 1,
                mb: 1,
                input: { color: theme.palette.text.primary },
              }}
              InputLabelProps={{
                style: { color: theme.palette.text.secondary },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={messages[language]?.password}
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                backgroundColor: theme.palette.background.default,
                borderRadius: 1,
                mb: 1,
                input: { color: theme.palette.text.primary },
              }}
              InputLabelProps={{
                style: { color: theme.palette.text.secondary },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={themedStyles.submitButton}
            >
              {messages[language]?.loginButton}
            </Button>
            {error && <Typography color="error">{error}</Typography>}
            <Typography variant="body2" sx={{ mt: 1 }}>
              {messages[language]?.noAccount}{' '}
              <Link href="#" onClick={() => navigate('/signup')}>
                {messages[language]?.signUp}
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
  );
};

export default Login;