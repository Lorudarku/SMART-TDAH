import React, { useContext, useState } from 'react';
import { Toolbar, Typography, Switch, IconButton, Menu, MenuItem, Divider } from '@mui/material';
import { WbSunny, NightlightRound, Language, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ColorModeContext } from '../../App';
import { useLanguage } from '../../hooks/LanguageContext';
import styles from './banner.module.scss';
import logo from '../../assets/favicon.ico';


const Banner = ({ setIsLoggedIn }) => {
  const colorMode = useContext(ColorModeContext);
  const isDarkMode = colorMode.mode === 'dark';
  const navigate = useNavigate();

  // Estado para el idioma y el menú de selección de idioma
  const { changeLanguage, language } = useLanguage();
  const [anchorEl, setAnchorEl] = useState(null);

  // Abre el menú de idiomas
  const handleLanguageMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Cierra el menú de idiomas
  const handleLanguageMenuClose = () => {
    setAnchorEl(null);
  };

  // Cambia el idioma seleccionado
  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    handleLanguageMenuClose();
  };

  // Maneja el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Eliminar el token de autenticación
    setIsLoggedIn(false); // Actualizar el estado de autenticación
    navigate('/login'); // Redirigir a la pantalla de Login
  };

  return (
    <Toolbar className={styles.toolbar}>
      {/* Contenedor para el logo y el título */}
      <div className={styles.logoTitleContainer} onClick={() => navigate('/')}>
        {/* Logo de la aplicación */}
        <img src={logo} alt="Logo" className={styles.logo} />
        
        {/* Título de la aplicación */}
        <Typography className={styles.title}>
          SMART-TDAH
        </Typography>
      </div>

      
      {/* Contenedor para el switch y el botón de logout */}
      <div className={styles.rightContainer}>
        {/* Botón para cambiar de idioma */}
        <IconButton
          color="inherit"
          onClick={handleLanguageMenuOpen}
          aria-label="select language"
          sx={{ mr: 0 }}
        >
          <Language />
          <i className={styles.language}>{language}</i>
        </IconButton>

        {/* Menú desplegable para seleccionar idioma */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleLanguageMenuClose}
        >
          <MenuItem onClick={() => handleLanguageChange("en")}>English</MenuItem>
          <MenuItem onClick={() => handleLanguageChange("es")}>Español</MenuItem>
          <MenuItem onClick={() => handleLanguageChange("pt")}>Português</MenuItem>
        </Menu>

        {/* Switch para cambiar entre el tema claro y oscuro */}
        <Switch
          className={styles.switch}
          checked={isDarkMode}
          onChange={colorMode.toggleColorMode}
          icon={<WbSunny style={{ color: "orange" }} />}
          checkedIcon={<NightlightRound style={{ color: "yellow" }} />}
        />

        {/* Separador */}
        <Divider className={styles.divider} />

        {/* Botón de cerrar sesión */}
        <IconButton color="inherit" onClick={handleLogout}>
          <Logout />
        </IconButton>
      </div>
    </Toolbar>
  );
};

export default Banner;
