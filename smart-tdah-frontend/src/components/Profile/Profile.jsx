import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../../utils/constants';
import { Box, Typography, Avatar, Paper } from '@mui/material';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);

  // Genera las iniciales del nombre y apellidos
  const getInitials = (nombre, apellidos) => {
    const firstName = nombre.split(' ')[0];
    const lastName = apellidos ? apellidos.split(' ')[0] : '';
    return `${firstName[0]}${lastName ? lastName[0] : ''}`.toUpperCase();
  };

  // Genera un color aleatorio para la foto de perfil
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token provided');
        return;
      }

      try {
        const response = await axios.get(`${backendUrl}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data);
      } catch (err) {
        setError('Error fetching profile data');
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!profileData) {
    return <Typography>Cargando...</Typography>;
  }

  const initials = getInitials(profileData.nombre, profileData.apellidos);
  const backgroundColor = getRandomColor();

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Paper
        elevation={5}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3,
          maxWidth: 800,
          width: '100%',
        }}
      >
        {/* Foto de perfil */}
        <Avatar
          sx={{
            bgcolor: backgroundColor,
            width: 150,
            height: 150,
            fontSize: '4rem',
            marginRight: 10,
          }}
        >
          {initials}
        </Avatar>

        {/* Detalles del perfil */}
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="body1">
            <strong>Nombre:</strong> {profileData.nombre}
          </Typography>
          <Typography variant="body1">
            <strong>Apellidos:</strong> {profileData.apellidos}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {profileData.email}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;