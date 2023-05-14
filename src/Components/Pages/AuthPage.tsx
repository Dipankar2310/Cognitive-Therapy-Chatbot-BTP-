import { useState } from "react";
import { LoginPage } from "./LoginPage";
import { SignupPage } from "./SignupPage";
import { useLocation } from "react-router-dom";
import { topPathsArray } from "../constant";
import styles from "../../CSSFiles/AuthPage.module.scss";
import { Link } from "react-router-dom";
import logo from "../../images/logo.svg";
export const AuthPage = () => {
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  const showLogin = () => {
    setIsRegistered(true);
  };
  const showSignup = () => {
    setIsRegistered(false);
  };
  return (
    <div className={styles.container}>
      <header>
        <img className={styles.logo} src={logo} alt="" />
        <div className={styles.divbtn}>
          <Link style={{ textDecoration: "none" }} to={topPathsArray.homePath}>
            <button className={styles.btn1}>Return to Home</button>
          </Link>
        </div>
      </header>
      {isRegistered ? (
        <LoginPage handleRegister={showSignup} />
      ) : (
        <SignupPage handleRegister={showLogin} />
      )}
    </div>
  );
};
