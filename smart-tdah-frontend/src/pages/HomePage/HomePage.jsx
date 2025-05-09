import React from "react";
import { Paper, Box } from "@mui/material";
import messages from "../../utils/translations.json";
import { useLanguage } from "../../hooks/LanguageContext";
import styles from "./HomePage.module.scss";
import { Navigate } from "react-router-dom";
import logo from "../../assets/logo1.png";

function HomePage({ isLoggedIn, setIsLoggedIn }) {
  const { language } = useLanguage();

  return isLoggedIn ? (
    <Box display="flex" justifyContent="center" mt={4} mb={10}>
      <Paper
        elevation={5}
        sx={{
          padding: 3,
          maxWidth: 1600,
          maxHeight: 1000,
          width: "95%", // Reduce el ancho para dejar márgenes laterales
          margin: "0 auto", // Centra el Paper horizontalmente
        }}
      >
        <div className={styles.homePage}>
          <div className={styles.textContainer}>
            <h1>{messages[language]?.welcome}</h1>
            <p>{messages[language]?.description}</p>
          </div>

          <div className={styles.logoContainer}>
            <img src={logo} className={styles.logo} alt="Logo" />
          </div>
        </div>
      </Paper>
    </Box>
  ) : (
    <main>
      <Navigate
        to={{
          pathname: "/login",
        }}
      />
    </main>
  );
}

export default HomePage;