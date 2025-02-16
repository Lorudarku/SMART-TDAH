import Login from "../../components/Login/Login";
import messages from '../../utils/translations.json';
import { useLanguage } from '../../hooks/LanguageContext';
import styles from './HomePage.module.scss'
import { Navigate } from "react-router-dom";
import logo from '../../assets/logo1.png';

function HomePage ({isLoggedIn, setIsLoggedIn}){
    const {language} = useLanguage();
 
    return (
      isLoggedIn ? (
        // Página principal
        <div className={styles.homePage}>
          <div className={styles.textContainer}>
              <h1>{messages[language]?.welcome}</h1>
              <p>{messages[language]?.description}</p>
          </div>

          <div className={styles.logoContainer}>
            <img src={logo} className={styles.logo} alt="Logo" />
          </div>
        </div>
        ) : (
          <main>
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