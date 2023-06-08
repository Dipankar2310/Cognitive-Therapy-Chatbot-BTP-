import axios from "axios";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, set, ref } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import styles from "../../CSSFiles/LoginPage.module.scss";
import { useRef } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { topPathsArray } from "../constant";
import { useLocation } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import { LoggedInstate } from "../MidSection";

export const LoginPage = (props: any) => {
  const isLoggedIn = useSetRecoilState(LoggedInstate);

  let email = useRef<HTMLInputElement>(null);
  let password = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const handleSubmit = (event: any) => {
    if (email.current != null && password.current != null) {
      try {
        axios
          .get(
            `http://localhost:5000/api/v1/auth/login?email=${email.current.value}&password=${password.current.value}`
          )
          .then((userCredential) => {
            if (userCredential.data.status === "failure") {
              alert("Invalid Email/Password");
              return;
            }
            const user = userCredential.data.data.user;
            alert("Log-In Successful, Press OK to Continue");
            isLoggedIn(true);
            localStorage.setItem("LoggedIn", "true");
            localStorage.setItem(
              "AccessToken",
              userCredential.data.data.user.stsTokenManager.accessToken
            );
            localStorage.setItem("UserId", userCredential.data.data.user.uid);
            navigate(topPathsArray.homePath, { replace: true });
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            alert(errorMessage);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleForgotPassword = () => {
    if (email.current && email.current.value.length > 0) {
      // sendPasswordResetEmail(auth, email.current.value)
      //   .then(() => {
      //     // Password reset email sent!
      //     // ..
      //     alert("Password reset link sent to your registered email!");
      //   })
      //   .catch((error) => {
      //     console.log(email?.current?.value);
      //     const errorCode = error.code;
      //     const errorMessage = error.message;
      //     console.log(error.code);
      //     alert(errorMessage);
      //     // ..
      //   });
    }
  };

  return (
    <>
      <div className={`${styles.wrapper} ${styles.login}`}>
        <div className={styles.container}>
          <div className={styles.colleft}>
            <div className={styles.logintext}>
              <h2>Welcome!</h2>
              <p>
                Create your account.
                <br />
                For Free!
              </p>{" "}
              <a className={styles.btn} onClick={props.handleRegister}>
                Sign Up
              </a>
            </div>
          </div>
          <div className={styles.colright}>
            <div className={styles.loginform}>
              <h2>Login</h2>
              <p>
                {" "}
                <label>
                  Email address<span>*</span>
                </label>{" "}
                <input
                  type="text"
                  required
                  name="email"
                  placeholder="E-mail"
                  ref={email}
                />
              </p>
              <p>
                {" "}
                <label>
                  Password<span>*</span>
                </label>{" "}
                <input
                  ref={password}
                  type="password"
                  name="password"
                  placeholder="Password"
                />
              </p>
              <p>
                <input
                  type="submit"
                  name="login"
                  value="Login"
                  onClick={handleSubmit}
                />
              </p>
              {/* <p> */}{" "}
              <button id={styles.forgotPassword} onClick={handleForgotPassword}>
                Forgot password?
              </button>{" "}
              {/* </p> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
