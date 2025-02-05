// src/App.js
import React, { useState, createContext, useMemo } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Banner from "./components/Banner/Banner";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import HomePage from "./pages/HomePage/HomePage"
import SidePanel from "./components/SidePanel/SidePanel";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LanguageProvider } from './hooks/LanguageContext'; // Importamos el hook de idioma
import AlumnoList from "./components/AlumnoList/AlumnoList";


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

  return (
    <ColorModeContext.Provider value={colorMode}>
      <LanguageProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Banner />
          <Router>
            <Routes>
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} /> 
              <Route path="/signup" element={<SignUp />} />
              <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/test" element={<AlumnoList/>} />
            </Routes>
          </Router>
        </ThemeProvider>
      </LanguageProvider>
    </ColorModeContext.Provider>  
  );
}

export default App;