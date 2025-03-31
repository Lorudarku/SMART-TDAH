import React from 'react';
import Profile from '../../components/Profile/Profile';
import styles from './Settings.module.scss';

const Settings = () => {
  return (
    <div className={styles.settingsPage}>
      <h1 className={styles.title}>Configuración</h1>
      <Profile />
    </div>
  );
};

export default Settings;