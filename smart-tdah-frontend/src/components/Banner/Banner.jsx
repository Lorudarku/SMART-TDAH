import React, { useContext, useState } from 'react';
import { Toolbar, Typography, Switch, IconButton, Menu, MenuItem, Divider, Box } from '@mui/material';
import { WbSunny, NightlightRound, Language, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ColorModeContext } from '../../App';
import { useLanguage } from '../../hooks/LanguageContext';
import styles from './banner.module.scss';
import logo from '../../assets/favicon.ico';
import flagEn from '../../assets/english.png';
import flagEs from '../../assets/spanish.png';
import flagPt from '../../assets/brazilian.png';

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
    <Toolbar className={styles.toolbar}>
      <div className={styles.logoTitleContainer} onClick={() => navigate('/')}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <Typography className={styles.title}>SMART-TDAH</Typography>
      </div>

      <div className={styles.rightContainer}>
        <IconButton
          color="inherit"
          onClick={handleLanguageMenuOpen}
          aria-label="select language"
          sx={{ mr: 0 }}
        >
          <Language />
          <Box display="flex" alignItems="center" className={styles.language}>
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
          className={styles.switch}
          checked={isDarkMode}
          onChange={colorMode.toggleColorMode}
          icon={<WbSunny style={{ color: "orange", position: "relative", top: "-1px" }} />} // Ajusta la posición del sol
          checkedIcon={<NightlightRound style={{ color: "yellow", position: "relative", top: "-1px" }} />} // Ajusta la posición de la luna
        />

        <Divider className={styles.divider} />

        <IconButton color="inherit" onClick={handleLogout}>
          <Logout />
        </IconButton>
      </div>
    </Toolbar>
  );
};

export default Banner;
