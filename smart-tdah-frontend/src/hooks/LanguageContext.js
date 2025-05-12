import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('pt'); // Idioma predeterminado
  // Puedes cambiar 'pt' a 'en' o 'es' según tus necesidades

  // Función para cambiar el idioma
  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
export const useLanguage = () => useContext(LanguageContext);

