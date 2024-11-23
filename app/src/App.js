// src/App.js
import React, { useState, createContext, useMemo } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Banner from "./frontend/Banner";
import Login from "./frontend/Login";
import SidePanel from "./frontend/SidePanel";
import { BrowserRouter as Router } from "react-router-dom";
import Chat from './frontend/Chat';
import	{	useLanguage	}	from	'./frontend/LanguageContext';

// Creamos el contexto para compartir el modo oscuro/claro entre componentes
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  const [mode, setMode] = useState("light");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado de autenticación

  // Función para alternar el tema
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
      mode, // Pasamos el modo actual ("light" o "dark")
    }),
    [mode]
  );

  // Crear el tema de MUI según el estado del modo oscuro
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          background: {
            default: mode === "dark" ? "#121212" : "#f5f5f5", // Fondo oscuro o claro
            paper: mode === "dark" ? "#1d1d1d" : "#fff", // Fondo de tarjetas, etc.
          },
          text: {
            primary: mode === "dark" ? "#ffffff" : "#000000", // Color del texto
          },
        },
      }),
    [mode]
  );

  
    const messages = {
      es: {
        welcome: 'Bienvenido al Panel Principal',
        description: 'Este es el contenido principal que se muestra después de iniciar sesión.',
      },
      en: {
        welcome: 'Welcome to the Main Panel',
        description: 'This is the main content displayed after logging in.',
      },
      pt: {
        welcome: 'Bem-vindo ao Painel Principal',
        description: 'Este é o conteúdo principal exibido após o login.',
      },
    };

  // Obtener el idioma actual
  const { language } = useLanguage();  

  return (
    <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Banner />
          <Router>
            {isLoggedIn ? (
              <div style={{ display: "flex" }}>
                <SidePanel />
                <main style={{ padding: "20px", flexGrow: 1 }}>
                  <h1>{messages[language].welcome}</h1>
                  <p>{messages[language].description}</p>
                </main>
              </div>
            ) : (
              <main style={{ padding: "20px" }}>
                <Login setIsLoggedIn={setIsLoggedIn} />
              </main>
            )}
          </Router>
          <Chat />
        </ThemeProvider>
    </ColorModeContext.Provider>
  );
  
}

export default App;
