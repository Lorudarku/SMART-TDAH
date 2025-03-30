import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { backendUrl } from '../../utils/constants';
import styles from './login.module.scss';
import logo from '../../assets/logo1.png';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/login`, { email, password });
      localStorage.setItem('token', response.data.token); 
      setIsLoggedIn(true); // Actualizar el estado de autenticación
      navigate('/'); // Redirigir al usuario a la página principal
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Container>
      <Box className={styles.boxContainer}>
        {/* Logo de la aplicación */}
        <img src={logo} alt="Logo" className={styles.logo} />

        <Typography component="h1" variant="h5" className={styles.titleLogin}>
            Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
            Login
          </Button>
          {error && <Typography color="error">{error}</Typography>}
          <Typography variant="body2">
            {"Don't have an account? "}
            <Link href="#" onClick={() => navigate('/signup')}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;