import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../../utils/constants';
import { Box, Typography, Avatar, Paper } from '@mui/material';
import { useLanguage } from '../../hooks/LanguageContext';
import messages from '../../utils/translations.json';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState(null); // Estado para almacenar el color de fondo
  const { language } = useLanguage(); // Obtiene el idioma actual

  // Genera las iniciales del nombre y apellidos
  const getInitials = (nombre, apellidos) => {
    const firstName = nombre.split(' ')[0];
    const lastName = apellidos ? apellidos.split(' ')[0] : '';
    return `${firstName[0]}${lastName ? lastName[0] : ''}`.toUpperCase();
  };

  // Genera un color aleatorio para la foto de perfil
  const generateRandomColor = () => {
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
        setError(messages[language]?.noTokenProvided);
        return;
      }

      try {
        const response = await axios.get(`${backendUrl}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data);

        // Generar y establecer el color de fondo solo la primera vez que se cargan los datos
        if (!backgroundColor) {
          setBackgroundColor(generateRandomColor());
        }
      } catch (err) {
        setError(messages[language]?.fetchError);
      }
    };

    fetchProfile();
  }, [backgroundColor, language]); // Dependencia para asegurarse de que el idioma se actualiza

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!profileData) {
    return <Typography>{messages[language]?.loading}</Typography>;
  }

  const initials = getInitials(profileData.nombre, profileData.apellidos);

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
            bgcolor: backgroundColor, // Usa el color almacenado en el estado
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
            <strong>{messages[language]?.name}:</strong> {profileData.nombre}
          </Typography>
          <Typography variant="body1">
            <strong>{messages[language]?.lastName}:</strong> {profileData.apellidos}
          </Typography>
          <Typography variant="body1">
            <strong>{messages[language]?.email}:</strong> {profileData.email}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;