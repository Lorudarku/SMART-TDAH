import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { backendUrl } from '../../utils/constants';
import { useLanguage } from '../../hooks/LanguageContext';
import messages from '../../utils/translations.json';
import { useTheme } from '@mui/material/styles';

const styles = {
  boxContainer: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
    padding: { xs: 2, sm: 0 },
  }),
  paper: (theme) => ({
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
    backdropFilter: 'blur(2px)',
    transition: 'background-color 0.3s, color 0.3s',
  }),
  titleSignUp: (theme) => ({
    fontWeight: 'bold',
    mt: 1,
    mb: 2,
    color: theme.palette.text.primary,
    letterSpacing: 1,
    textAlign: 'center',
  }),
  form: {
    width: '100%',
    marginTop: 1,
  },
  submitButton: (theme) => ({
    mt: 1,
    mb: 2,
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
  }),
};

const SignUp = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { language } = useLanguage(); // Obtiene el idioma actual
  const theme = useTheme();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/signup`, { email, nombre, apellidos, password });
      console.log('User registered:', response.data);
      navigate('/login');
    } catch (err) {
      setError(messages[language]?.signUpError);
    }
  };

  return (
    <Container>
      <Box sx={styles.boxContainer(theme)}>
        <Box sx={styles.paper(theme)}>
          <Typography component="h1" variant="h5" sx={styles.titleSignUp(theme)}>
            {messages[language]?.signUpTitle}
          </Typography>
          <Box component="form" onSubmit={handleSignUp} noValidate sx={styles.form}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="Nombre"
              label={messages[language]?.name}
              name="Nombre"
              autoComplete="Nombre"
              autoFocus
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
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
              id="Apellidos"
              label={messages[language]?.lastName}
              name="Apellidos"
              autoComplete="Apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
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
              id="email"
              label={messages[language]?.email}
              name="email"
              autoComplete="email"
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
              sx={styles.submitButton(theme)}
            >
              {messages[language]?.signUpButton}
            </Button>
            {error && <Typography color="error">{error}</Typography>}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;