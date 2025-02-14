import Login from "../../components/Login/Login";
import messages from '../../utils/translations.json';
import { useLanguage } from '../../hooks/LanguageContext';
import styles from './homePage.module.scss'
import { Navigate } from "react-router-dom";

function HomePage ({isLoggedIn, setIsLoggedIn}){
    const {language} = useLanguage();

    // Verificar si el idioma está definido en las traducciones
    // if (!messages[language]) {
    //   console.error(`Language "${language}" is not defined in translations.`);
    //   return null;
    // }
 
    return (
      isLoggedIn ? (
          <div className={styles.homePage}>
            <main className={styles.container}>
              <h1>{messages[language]?.welcome}</h1>
              <p>{messages[language]?.description}</p>
            </main>
          </div>
        ) : (
          <main className={styles.login}>
            <Navigate
              to={{
              pathname: "/login",
              }}
            />
          </main>
        )
    )
}

export default HomePage;