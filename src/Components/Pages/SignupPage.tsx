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
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { LoggedInstate } from "../MidSection";

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
export const SignupPage = (props: any) => {
  const isLoggedIn = useSetRecoilState(LoggedInstate);

  let email = useRef<HTMLInputElement>(null);
  let userName = useRef<HTMLInputElement>(null);
  let password = useRef<HTMLInputElement>(null);
  let age = useRef<HTMLInputElement>(null);
  let gender = useRef<HTMLSelectElement>(null);
  const navigate = useNavigate();
  const handleSubmit = () => {
    if (
      email.current != null &&
      password.current != null &&
      userName.current != null
    ) {
      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;

          set(ref(database, "users/" + user.uid), {
            username: userName.current?.value,
            email: email.current?.value,
            age: age.current?.value,
            gender: gender.current?.value,
            chat: [
              {
                id: 1,
                key: 1,
                userInput: "",
                response: `Hello ${userName.current?.value}, I am Morphy, an AI chatbot made to provide mental health support, I'm pleased to see you here, what would you like to talk about today?`,
              },
            ],
            summary: "",
          });

          alert("Sign In Successful, Press OK to Continue");
          isLoggedIn(true);
          localStorage.setItem("LoggedIn", "true");
          navigate(topPathsArray.homePath, { replace: true });
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

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
                Already have an <br />
                account?
              </p>{" "}
              <a className={styles.btn} onClick={props.handleRegister}>
                Log In
              </a>
            </div>
          </div>
          <div className={styles.colright}>
            <div className={styles.loginform}>
              <h2>Sign Up</h2>
              <p>
                <label>
                  Username <span>*</span>
                </label>
                <input
                  ref={userName}
                  type="text"
                  required
                  name="username"
                  placeholder="Username"
                />
              </p>
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
                  Create Password<span>*</span>
                </label>
                <input
                  required
                  ref={password}
                  type="password"
                  name="password"
                  placeholder="Create Password"
                />
              </p>
              <label>
                Age
                <span>*</span>
              </label>
              <p>
                <input ref={age} type="text" name="Age" placeholder="Age" />
              </p>
              <label>
                Gender <span>*</span>
              </label>
              <p>
                <select ref={gender}>
                  <option>Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </p>
              <p>
                <input
                  type="submit"
                  name="SignUp"
                  value="Sign Up"
                  onClick={handleSubmit}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
