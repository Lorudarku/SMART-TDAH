import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { backendUrl } from '../../utils/constants';
import styles from './signUp.module.scss'; // Importa los estilos
import { useLanguage } from '../../hooks/LanguageContext';
import messages from '../../utils/translations.json';

const SignUp = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { language } = useLanguage(); // Obtiene el idioma actual

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
      <Box className={styles.boxContainer}>
        <Typography component="h1" variant="h5" className={styles.titleSignUp}>
          {messages[language]?.signUpTitle}
        </Typography>
        <Box component="form" onSubmit={handleSignUp} noValidate className={styles.form}>
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
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className={styles.submitButton}
          >
            {messages[language]?.signUpButton}
          </Button>
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;