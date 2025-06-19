import React, { useContext, useState } from 'react';
import { Toolbar, Typography, Switch, IconButton, Menu, MenuItem, Divider, Box } from '@mui/material';
import { WbSunny, NightlightRound, Language, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ColorModeContext } from '../../App';
import { useLanguage } from '../../hooks/LanguageContext';
import logo from '../../assets/favicon.ico';
import flagEn from '../../assets/english.png';
import flagEs from '../../assets/spanish.png';
import flagPt from '../../assets/brazilian.png';

// Estilos migrados desde banner.module.scss a objetos JS para uso con sx y Box
const styles = {
  toolbar: {
    backgroundColor: '#047acf',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
    position: 'fixed',
    top: 0,
    height: '64px',
    width: '100%',
    minWidth: '520px',
    zIndex: 1000,
    paddingLeft: '8px',
    paddingRight: '8px',
    whiteSpace: 'nowrap', // Evita saltos de línea en el contenido
  },
  logoTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    color: 'white',
  },
  rightContainer: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
    color: 'white',
  },
  divider: {
    width: '2px',
    height: '40px',
    backgroundColor: 'white',
    margin: '0px 10px',
  },
  title: {
    fontFamily: 'Impact',
    fontSize: '50px',
    textDecoration: 'none',
    color: 'white',
    whiteSpace: 'nowrap', // Evita que el título se divida
    overflow: 'hidden',
    textOverflow: 'ellipsis', // Si el espacio es insuficiente, muestra puntos suspensivos
  },
};

const Banner = ({ setIsLoggedIn }) => {
  const colorMode = useContext(ColorModeContext);
  const isDarkMode = colorMode.mode === 'dark';
  const navigate = useNavigate();

  const { changeLanguage, language } = useLanguage();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLanguageMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    handleLanguageMenuClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const getFlagForLanguage = (lang) => {
    switch (lang) {
      case 'en':
        return flagEn;
      case 'es':
        return flagEs;
      case 'pt':
        return flagPt;
      default:
        return null;
    }
  };

  return (
    <Toolbar
      sx={styles.toolbar}
      disableGutters // Elimina padding horizontal por defecto de MUI Toolbar
    >
      {/* Logo y título agrupados */}
      <Box sx={styles.logoTitleContainer} onClick={() => navigate('/')}> 
        <img src={logo} alt="Logo" style={{ marginRight: 10 }} />
        <Typography sx={styles.title}>
          SMART-TDAH
        </Typography>
      </Box>

      {/* Contenedor derecho: idioma, switch, logout */}
      <Box sx={styles.rightContainer}>
        <IconButton
          color="inherit"
          onClick={handleLanguageMenuOpen}
          aria-label="select language"
          sx={{ mr: 0 }}
        >
          <Language />
          <Box display="flex" alignItems="center" sx={{ fontSize: 15, ml: 0.5 }}>
            <img
              src={getFlagForLanguage(language)}
              alt={language}
              style={{ width: 15, marginRight: 3 }}
            />
            <i>{language}</i>
          </Box>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleLanguageMenuClose}
        >
          <MenuItem onClick={() => handleLanguageChange("en")}>
            <Box display="flex" alignItems="center">
              <img src={flagEn} alt="English" style={{ width: 20, marginRight: 8 }} />
              English
            </Box>
          </MenuItem>
          <MenuItem onClick={() => handleLanguageChange("es")}>
            <Box display="flex" alignItems="center">
              <img src={flagEs} alt="Español" style={{ width: 20, marginRight: 8 }} />
              Español
            </Box>
          </MenuItem>
          <MenuItem onClick={() => handleLanguageChange("pt")}>
            <Box display="flex" alignItems="center">
              <img src={flagPt} alt="Português" style={{ width: 20, marginRight: 8 }} />
              Português
            </Box>
          </MenuItem>
        </Menu>

        <Switch
          checked={isDarkMode}
          onChange={colorMode.toggleColorMode}
          icon={<WbSunny style={{ color: "orange", position: "relative", top: "-1px" }} />} // Ajusta la posición del sol
          checkedIcon={<NightlightRound style={{ color: "yellow", position: "relative", top: "-1px" }} />} // Ajusta la posición de la luna
        />

        <Divider sx={styles.divider} />

        <IconButton color="inherit" onClick={handleLogout}>
          <Logout />
        </IconButton>
      </Box>
    </Toolbar>
  );
};

export default Banner;
