// src/App.js
import React, { useState, createContext, useMemo, useEffect } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { LanguageProvider } from './hooks/LanguageContext'; 
import Banner from "./components/Banner/Banner";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import HomePage from "./pages/HomePage/HomePage";
import AlumnoData from "./pages/AlumnoData/AlumnoData";
import AlumnoList from "./components/AlumnoList/AlumnoList";
import SidePanelLayout from "./layouts/SidePanelLayout";
import Settings from "./pages/Settings/Settings";


// Creamos el contexto para compartir el modo oscuro/claro entre componentes
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  const [mode, setMode] = useState(() => {
    // Carga el tema desde localStorage o usa "light" como predeterminado
    return localStorage.getItem("themeMode") || "light";
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado de autenticación

  useEffect(() => {
    // Verifica si el token existe en localStorage al cargar la aplicación
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true); // Si el token existe, establece el estado como autenticado
    } else {
      setIsLoggedIn(false); // Si no hay token, establece el estado como no autenticado
    }
  }, []); // Solo se ejecuta al cargar la aplicación

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("themeMode", newMode); // Guarda el tema en localStorage
          return newMode;
        });
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo( // Crear el tema de MUI según el estado del modo oscuro
    () => // Devuelve el tema de MUI
      createTheme({ // Crear el tema de MUI
        palette: { // Personalizar la paleta de colores
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
          <Router>
            <Banner setIsLoggedIn={setIsLoggedIn} />
            <Routes>
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/"
                element={
                  isLoggedIn ? (
                    <SidePanelLayout
                      render={<HomePage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/alumnos"
                element={
                  isLoggedIn ? (
                    <SidePanelLayout render={<AlumnoList />} />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/alumnos/:id_alumno"
                element={
                  isLoggedIn ? (
                    <SidePanelLayout render={<AlumnoData isLoggedIn={isLoggedIn} />} />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/settings"
                element={
                  isLoggedIn ? (
                    <SidePanelLayout render={<Settings />} />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </Routes>
          </Router>
        </ThemeProvider>
      </LanguageProvider>
    </ColorModeContext.Provider>
  );
}

export default App;