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
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZ1cWkZPj-TpouGYI0t9tWwe8B4yZuGHQ",
  authDomain: "lbp-auth.firebaseapp.com",
  databaseURL: "https://lbp-auth-default-rtdb.firebaseio.com",
  projectId: "lbp-auth",
  storageBucket: "lbp-auth.appspot.com",
  messagingSenderId: "901285538050",
  appId: "1:901285538050:web:10e00ae35c6dd624933a1b",
  measurementId: "G-6VVKL2TYBJ",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

export const LoginPage = (props: any) => {
  const isLoggedIn = useSetRecoilState(LoggedInstate);

  let email = useRef<HTMLInputElement>(null);
  let password = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const handleSubmit = (event: any) => {
    if (email.current != null && password.current != null) {
      signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          alert("Log in succesful, press ok to continue");
          isLoggedIn(true);
          localStorage.setItem("LoggedIn", "true");
          navigate(topPathsArray.homePath, { replace: true });
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          alert(errorMessage);
        });
    }
  };
  const handleForgotPassword = () => {
    if (email.current && email.current.value.length > 0) {
      sendPasswordResetEmail(auth, email.current.value)
        .then(() => {
          // Password reset email sent!
          // ..
          alert("Password reset link sent to your registered email!");
        })
        .catch((error) => {
          console.log(email?.current?.value);
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error.code);
          alert(errorMessage);
          // ..
        });
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
