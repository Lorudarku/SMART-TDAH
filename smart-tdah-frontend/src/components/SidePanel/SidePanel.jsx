import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Divider, Toolbar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import styles from './sidePanel.module.scss';

const SidePanel = () => {
  const navigate = useNavigate();

  return (
    <Toolbar className={styles.sidePanel}>
      {/* Botón de inicio en la parte superior */}
      <IconButton onClick={() => navigate('/')}>
        <HomeIcon className={styles.button} />
      </IconButton>

      {/* separación */}
      <Divider className={styles.divider} />

      {/* Botón para la lista de alumnos */}
      <IconButton  onClick={() => navigate('/alumnos')}>
        <ListAltIcon className={styles.button}/>
      </IconButton>

      {/* separación */}
      <div className={styles.settingsContainer}>
        <Divider className={styles.divider} />

        {/* Icono de ajustes en la parte inferior */}
          <IconButton  onClick={() => navigate('/settings')}>
            <SettingsIcon className={styles.button}/>
          </IconButton>
      </div>
    </Toolbar>
  );
};

export default SidePanel;
