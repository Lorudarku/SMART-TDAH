import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { backendUrl } from '../../utils/constants';
import styles from './signUp.module.scss'; // Importa los estilos

const SignUp = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/signup`, { email, nombre, apellidos, password });
      console.log('User registered:', response.data);
      navigate('/login');
    } catch (err) {
      setError('Error registering new user');
    }
  };

  return (
    <Container>
      <Box className={styles.boxContainer}>
        <Typography component="h1" variant="h5" className={styles.titleSignUp}>
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSignUp} noValidate className={styles.form}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="Nombre"
            label="Nombre"
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
            label="Apellidos"
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
            label="Email Address"
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
            label="Password"
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
            Sign Up
          </Button>
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;