import React from 'react';
import Profile from '../../components/Profile/Profile';
import styles from './Settings.module.scss';
import { useLanguage } from '../../hooks/LanguageContext';
import messages from '../../utils/translations.json';

const Settings = () => {
  const { language } = useLanguage(); // Obtiene el idioma actual

  return (
    <div className={styles.settingsPage}>
      <h1 className={styles.title}>{messages[language]?.settingsTitle}</h1>
      <Profile />
    </div>
  );
};

export default Settings;