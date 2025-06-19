import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../../utils/constants';
import { Box, Typography, Avatar, Paper } from '@mui/material';
import { useLanguage } from '../../hooks/LanguageContext';
import messages from '../../utils/translations.json';
import { useTheme } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';

// Estilos adaptados a la guía visual general y Material UI
const styles = {
  profileContainer: (theme) => ({
    width: '100%',
    maxWidth: 420,
    minWidth: 260,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.palette.background.default,
    borderRadius: 4,
    boxShadow: theme.shadows[8],
    border: `1.5px solid ${theme.palette.divider}`,
    p: { xs: 2, sm: 3 },
    m: 0,
    transition: 'background-color 0.3s, color 0.3s, box-shadow 0.3s',
    boxSizing: 'border-box',
    gap: 2,
  }),
  name: (theme) => ({
    fontWeight: 'bold',
    fontSize: { xs: '1.3rem', sm: '1.5rem' },
    color: theme.palette.secondary.main,
    letterSpacing: 0.5,
    mb: 1,
    textAlign: 'center',
  }),
  avatar: (theme) => ({
    bgcolor: theme.palette.secondary.main, 
    width: 100,
    height: 100,
    fontSize: '2.5rem',
    mb: 2,
    boxShadow: theme.shadows[4],
    transition: 'box-shadow 0.3s, border 0.3s',
  }),
  error: {
    color: 'red',
    fontSize: '1rem',
    textAlign: 'center',
    mt: 2,
  },
  loading: (theme) => ({
    fontSize: '1rem',
    color: theme.palette.text.secondary,
    textAlign: 'center',
    mt: 2,
  }),
  // Detalles alineados a la izquierda y con iconos
  detailRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1.2,
    textAlign: 'left',
    mb: 0.5,
  },
  detailLabel: (theme) => ({
    fontWeight: 600,
    color: theme.palette.secondary.main,
    fontSize: '1rem',
    mr: 1,
    minWidth: 80,
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
  }),
  detailValue: (theme) => ({
    fontSize: '1rem',
    color: theme.palette.text.primary,
    wordBreak: 'break-word',
    flex: 1,
  }),
  // Estilos para el layout principal
  mainBox: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 1,
  },
  icon: (theme) => ({
    color: theme.palette.text.primary,
    fontSize: 20,
    verticalAlign: 'middle',
    mr: 0.5,
  }),
};

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState(() => {
    const storedColor = localStorage.getItem('profileColor');
    return storedColor || null;
  });
  const { language } = useLanguage();
  const theme = useTheme();

  // Genera las iniciales del nombre y apellidos
  const getInitials = (nombre, apellidos) => {
    const firstName = nombre?.split(' ')[0] || '';
    const lastName = apellidos ? apellidos.split(' ')[0] : '';
    return `${firstName[0] || ''}${lastName ? lastName[0] : ''}`.toUpperCase();
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
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(response.data);
        if (!backgroundColor) {
          const newColor = generateRandomColor();
          setBackgroundColor(newColor);
          localStorage.setItem('profileColor', newColor);
        }
      } catch (err) {
        setError(messages[language]?.fetchError);
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, [backgroundColor, language]);

  if (error) {
    return <Typography sx={styles.error}>{error}</Typography>;
  }
  if (!profileData) {
    return <Typography sx={styles.loading(theme)}>{messages[language]?.loading}</Typography>;
  }
  const initials = getInitials(profileData.nombre, profileData.apellidos);

  return (
    <Box sx={styles.mainBox}>
      <Paper elevation={0} sx={styles.profileContainer(theme)}>
        {/* Título "Perfil" */}
        <Typography sx={styles.name(theme)}>
          {messages[language]?.profileTitle}
        </Typography>
        {/* Foto de perfil */}
        <Avatar sx={styles.avatar(theme, backgroundColor)}>
          {initials}
        </Avatar>
        {/* Detalles del perfil */}
        <Box sx={styles.detailsBox}>
          <Box sx={styles.detailRow}>
            <Typography sx={styles.detailLabel(theme)}>
              <PersonIcon sx={styles.icon(theme)} />
              {messages[language]?.name}:
            </Typography>
            <Typography sx={styles.detailValue(theme)}>{profileData.nombre}</Typography>
          </Box>
          <Box sx={styles.detailRow}>
            <Typography sx={styles.detailLabel(theme)}>
              <BadgeIcon sx={styles.icon(theme)} />
              {messages[language]?.lastName}:
            </Typography>
            <Typography sx={styles.detailValue(theme)}>{profileData.apellidos}</Typography>
          </Box>
          <Box sx={styles.detailRow}>
            <Typography sx={styles.detailLabel(theme)}>
              <EmailIcon sx={styles.icon(theme)} />
              {messages[language]?.email}:
            </Typography>
            <Typography sx={styles.detailValue(theme)}>{profileData.email}</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;