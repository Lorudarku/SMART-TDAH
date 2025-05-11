import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Divider, Toolbar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import styles from './sidePanel.module.scss';
import { useLanguage } from '../../hooks/LanguageContext';
import messages from '../../utils/translations.json';

const SidePanel = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <Toolbar className={styles.sidePanel}>
      {/* Botón de inicio en la parte superior */}
      <IconButton onClick={() => navigate('/')}>
        <HomeIcon className={styles.button} />
        <span>{messages[language]?.home}</span>
      </IconButton>

      {/* separación */}
      <Divider className={styles.divider} />

      {/* Botón para la lista de alumnos */}
      <IconButton onClick={() => navigate('/alumnos')}>
        <ListAltIcon className={styles.button} />
        <span>{messages[language]?.students}</span>
      </IconButton>

      {/* separación */}
      <div className={styles.settingsContainer}>
        <Divider className={styles.divider} />

        {/* Icono de ajustes en la parte inferior */}
        <IconButton onClick={() => navigate('/settings')}>
          <SettingsIcon className={styles.button} />
          <span>{messages[language]?.settings}</span>
        </IconButton>
      </div>
    </Toolbar>
  );
};

export default SidePanel;
