// =============================
// Componente Banner.jsx
// =============================
// Banner superior con logo, título, selector de idioma, modo oscuro y logout.
// Todos los estilos están centralizados en la constante styles.

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

// =====================
// Estilos centralizados
// =====================
// Todos los estilos visuales del componente están aquí agrupados y documentados.
const styles = {
  // --- Toolbar principal del banner ---
  toolbar: {
    backgroundColor: '#047acf', // Color de fondo principal
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)', // Sombra inferior
    position: 'fixed', // Fijo arriba
    top: 0,
    height: '64px', // Altura estándar
    width: '100vw', // Ocupa todo el ancho de la ventana
    minWidth: 0, // Permite reducirse en móvil
    zIndex: 1000, // Siempre encima
    paddingLeft: '8px', // Padding lateral
    paddingRight: '8px',
    whiteSpace: 'nowrap', // Evita saltos de línea
    boxSizing: 'border-box', // Padding incluido en el ancho
    // --- Responsive para móvil ---
    '@media (maxWidth:600px)': {
      height: '54px', // Menor altura en móvil
      paddingLeft: '2px',
      paddingRight: '2px',
    },
  },
  // --- Contenedor logo + título ---
  logoTitleContainer: {
    display: 'flex', // Layout horizontal
    alignItems: 'center', // Centrado vertical
    cursor: 'pointer', // Cursor de mano
    color: 'white', // Color texto
    minWidth: 0, // Permite recorte del título
  },
  // --- Logo de la app ---
  logo: {
    marginRight: 10, // Espacio a la derecha
    width: 36, // Tamaño fijo
    height: 36,
    // --- Responsive para móvil ---
    '@media (maxWidth:600px)': {
      width: 28,
      height: 28,
      marginRight: 6,
    },
  },
  // --- Contenedor derecho (idioma, switch, logout) ---
  rightContainer: {
    display: 'flex', // Layout horizontal
    alignItems: 'center', // Centrado vertical
    marginLeft: 'auto', // Empuja a la derecha
    color: 'white',
    minWidth: 0, // Permite recorte
  },
  // --- Separador visual ---
  divider: {
    width: '2px', // Ancho línea
    height: '40px', // Alto línea
    backgroundColor: 'white',
    margin: '0px 10px',
    // --- Responsive para móvil ---
    '@media (maxWidth:600px)': {
      height: '28px',
      margin: '0px 4px',
    },
  },
  // --- Título de la app ---
  title: {
    fontFamily: 'Impact', // Fuente llamativa
    fontSize: '50px', // Tamaño grande en desktop
    textDecoration: 'none',
    color: 'white',
    whiteSpace: 'nowrap', // No saltar línea
    overflow: 'hidden', // Recorta si no cabe
    textOverflow: 'ellipsis', // Muestra '...'
    maxWidth: 'calc(100vw - 480px)', // Ajuste más preciso: deja espacio para logo y botones
    minWidth: 0, // Permite recorte
    transition: 'max-width 0.2s', // Transición suave
    // --- Responsive para tablet y móvil ---
    '@media (max-width:900px)': {
      fontSize: '38px',
      maxWidth: 'calc(100vw - 340px)', // Ajuste para tablet
    },
    '@media (max-width:750px)': {
      fontSize: '28px',
      maxWidth: 'calc(100vw - 220px)', // Transición hacia pantallas pequeñas
    },
    '@media (max-width:600px)': {
      maxWidth: 'calc(100vw - 110px)', // Ajuste para móvil
    },
  },
  // --- Contenedor bandera + idioma ---
  flagBox: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 15,
    marginLeft: 0.5,
    // --- Responsive para móvil ---
    '@media (maxWidth:600px)': {
      fontSize: 12,
    },
  },
  // --- Bandera pequeña (idioma actual) ---
  flagImg: {
    width: 15,
    marginRight: 3,
    // --- Responsive para móvil ---
    '@media (maxWidth:600px)': {
      width: 12,
      marginRight: 2,
    },
  },
  // --- Bandera en menú de idiomas ---
  menuFlagImg: {
    width: 20,
    marginRight: 8,
    // --- Responsive para móvil ---
    '@media (maxWidth:600px)': {
      width: 15,
      marginRight: 4,
    },
  },
};

// =====================
// Mapa de banderas por idioma
// =====================
const flagMap = {
  en: flagEn,
  es: flagEs,
  pt: flagPt,
};

// =============================
// Componente principal Banner
// =============================
function Banner({ setIsLoggedIn }) {
  // --- Contextos globales de color y navegación ---
  const colorMode = useContext(ColorModeContext); // Contexto para modo claro/oscuro
  const isDarkMode = colorMode.mode === 'dark'; // Estado actual del modo
  const navigate = useNavigate(); // Hook de navegación de React Router

  // --- Contexto de idioma ---
  const { changeLanguage, language } = useLanguage();
  // --- Estado para el menú de selección de idioma ---
  const [anchorEl, setAnchorEl] = useState(null);

  // --- Abre el menú de idiomas (al hacer click en el icono) ---
  const handleLanguageMenuOpen = (event) => setAnchorEl(event.currentTarget);

  // --- Cierra el menú de idiomas ---
  const handleLanguageMenuClose = () => setAnchorEl(null);

  // --- Cambia el idioma y cierra el menú ---
  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    handleLanguageMenuClose();
  };

  // --- Cierra sesión y redirige al login ---
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/login');
  };

  // =============================
  // Renderizado visual del banner
  // =============================
  return (
    // Toolbar principal fija en la parte superior
    <Toolbar
      sx={styles.toolbar}
      disableGutters
    >
      {/* Logo y título agrupados, clicable para volver al inicio */}
      <Box sx={styles.logoTitleContainer} onClick={() => navigate('/')}> 
        <img src={logo} alt="Logo" style={styles.logo} />
        <Typography sx={styles.title}>
          SMART-TDAH
        </Typography>
      </Box>

      {/* Contenedor derecho: idioma, switch de modo, logout */}
      <Box sx={styles.rightContainer}>
        {/* Selector de idioma con bandera e idioma actual */}
        <IconButton
          color="inherit"
          onClick={handleLanguageMenuOpen}
          aria-label="select language"
          sx={{ mr: 0 }}
        >
          <Language />
          <Box sx={styles.flagBox}>
            <img
              src={flagMap[language]}
              alt={language}
              style={styles.flagImg}
            />
            <i>{language}</i>
          </Box>
        </IconButton>

        {/* Menú desplegable de idiomas */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleLanguageMenuClose}
        >
          {Object.entries(flagMap).map(([lang, flag]) => (
            <MenuItem key={lang} onClick={() => handleLanguageChange(lang)}>
              <Box display="flex" alignItems="center">
                <img src={flag} alt={lang} style={styles.menuFlagImg} />
                {lang === 'en' ? 'English' : lang === 'es' ? 'Español' : 'Português'}
              </Box>
            </MenuItem>
          ))}
        </Menu>

        {/* Switch para modo claro/oscuro */}
        <Switch
          checked={isDarkMode}
          onChange={colorMode.toggleColorMode}
          icon={<WbSunny style={{ color: "orange", position: "relative", top: "-1px" }} />} 
          checkedIcon={<NightlightRound style={{ color: "yellow", position: "relative", top: "-1px" }} />} 
        />

        {/* Separador visual */}
        <Divider sx={styles.divider} />

        {/* Botón de logout */}
        <IconButton color="inherit" onClick={handleLogout}>
          <Logout />
        </IconButton>
      </Box>
    </Toolbar>
  );
}

export default Banner;
