// src/components/Login.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Avatar, CssBaseline, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function Login({ setIsLoggedIn }) { // Recibimos setIsLoggedIn como prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(''); // Limpiar cualquier error previo

    // Verificar si el email y la contraseña coinciden con los valores de prueba
    if (email === 'admin@gmail.com' && password === 'admin1234') {
      setIsLoggedIn(true); // Actualizamos el estado en App
      console.log('Login successful!');
    } else {
      // Si las credenciales no son correctas, mostrar un mensaje de error
      setErrorMessage('Invalid email or password');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>

        {/* Mostrar el mensaje de error si las credenciales no son válidas */}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>

          <Typography variant="body2">
            {"Don't have an account? Sign Up"}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
