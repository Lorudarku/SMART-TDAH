// src/components/Banner.js
import React, { useContext, useState } from 'react'; // Import useState here
import { AppBar, Toolbar, Typography, Switch, IconButton, Menu, MenuItem } from '@mui/material'; // Include IconButton, Menu, MenuItem
import { WbSunny, NightlightRound, Language } from '@mui/icons-material'; // Include Language icon
import { Link } from 'react-router-dom';
import { ColorModeContext } from '../../App';
import { useLanguage } from '../../hooks/LanguageContext';
import styles from './banner.module.scss'


const Banner = () => {
  const colorMode = useContext(ColorModeContext);
  const isDarkMode = colorMode.mode === 'dark';

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

  return (
    <AppBar position="static" sx={{ backgroundColor: "#6f6f6f" }}>
      <Toolbar>

        {/* Botón para cambiar de idioma */}
        <IconButton
          color="inherit"
          onClick={handleLanguageMenuOpen}
          aria-label="select language"
          sx={{ mr: 2 }}
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

        {/* Título de la aplicación */}
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <Link to="/" className={styles.clickableTitle}>
            SMART-TDAH
          </Link>
        </Typography>

        {/* Switch para cambiar entre el tema claro y oscuro */}
        <Switch
          checked={isDarkMode}
          onChange={colorMode.toggleColorMode}
          icon={<WbSunny style={{ color: "orange" }} />}
          checkedIcon={<NightlightRound style={{ color: "yellow" }} />}
          inputProps={{ 'aria-label': 'toggle theme' }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Banner;
