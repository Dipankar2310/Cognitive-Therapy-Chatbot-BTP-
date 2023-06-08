import styles from "../CSSFiles/Footer.module.scss";
import illustrationIntro from "../images/illustration-intro.png";
import img4 from "../images/img4.png";
import AccessIcon from "../images/icon-access-anywhere";
import IconSecurity from "../images/icon-security";
import CollabrationIcon from "../images/icon-collaboration";
import AnyFileIcon from "../images/icon-any-file";
import StayProdIllustration from "../images/OurStoryIllustration.svg";
import iconArrow from "../images/icon-arrow.svg";
import bgQuotes from "../images/bg-quotes.png";
import profile1 from "../images/profile-1.jpg";
import profile2 from "../images/profile-2.jpg";
import profile3 from "../images/profile-3.jpg";
import logo from "../images/luxlogofinal.svg";
import github from "../images/Github.svg";
import Instagram from "../images/Instagram.svg";
import Facebook from "../images/Facebook.svg";
import iconPhone from "../images/icon-phone.svg";
import iconLocation from "../images/icon-location.svg";
import iconEmail from "../images/icon-email.svg";
import ChatBotAnimation from "../images/ChatBotAnimation";
import { Link, useNavigate } from "react-router-dom";
import { topPathsArray } from "./constant";
import { useState } from "react";
import { numMessages } from "../App";
import { useRecoilState, atom, selector, useResetRecoilState } from "recoil";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
export const LoggedInstate = atom<boolean>({
  key: "LoggedInstate",
  default: localStorage.getItem("LoggedIn") === "true" ? true : false,
});

export const MidSection = (props: any) => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoggedInstate);
  const auth = getAuth();
  const navigate = useNavigate();
  const resetMessages = useResetRecoilState(numMessages);
  const logOutHandler = () => {
    auth.signOut();
    alert("You have been logged out successfuly, press ok to continue.");
    setIsLoggedIn(false);
    localStorage.setItem("LoggedIn", "false");
    localStorage.setItem("UserId", "");
    localStorage.setItem("AccessToken", "");

    if (props.storeSummary) {
      props.storeSummary();
    }
    resetMessages();
    navigate(topPathsArray.homePath, { replace: true });
  };
  const redirectToLogin = () => {
    alert("Please Sign-In to Chat with Lux");
    navigate(topPathsArray.loginPath, { replace: true });
  };
  return (
    <div>
      <section className={styles.top}>
        <header>
          <img className={styles.logo} src={logo} alt="" />

          <div className={styles.divbtn}>
            <div className={styles.topbtn}>
              <Link
                style={{ textDecoration: "none" }}
                to={topPathsArray.homePath}
              >
                <button className={styles.btn1}>Home</button>
              </Link>
            </div>
            <div className={styles.topbtn}>
              <Link
                style={{ textDecoration: "none" }}
                to={topPathsArray.blogPath}
              >
                <button className={styles.btn1}> Blogs</button>
              </Link>
            </div>
            <div className={styles.topbtn}>
              {isLoggedIn ? (
                <button className={styles.btn1} onClick={logOutHandler}>
                  Log Out
                </button>
              ) : (
                <Link
                  to={topPathsArray.loginPath}
                  style={{ textDecoration: "none" }}
                >
                  <button className={styles.btn1}>Log In</button>
                </Link>
              )}
            </div>
          </div>
        </header>
        <div className={styles.centered}>
          {/* <img src={img4} alt="" /> */}
          <ChatBotAnimation />
          <p> Mental Health Support For Everyone.</p>
          <button onClick={isLoggedIn ? props.onShowChat : redirectToLogin}>
            Chat with Lux
          </button>
        </div>
      </section>
      <section id={styles.blue}>
        <article className={styles.article1}>
          <div className={styles.blocks}>
            <div className={styles.img}>
              <AccessIcon />
            </div>
            <span className={styles.bold}> Access anywhere</span>

            <p>
              The ability to use a smartphone, tablet, or computer to access Lux
              means you can use it anywhere.
            </p>
          </div>
          <div id={styles.security} className={styles.blocks}>
            <div className={styles.img}>
              {" "}
              <IconSecurity />
            </div>
            <span className={styles.bold}> Security you can trust</span>

            <p>
              {" "}
              2-factor authentication and user-controlled encryption are just a
              couple of the security features we allow to help secure your
              files.
            </p>
          </div>
          <div className={styles.blocks}>
            <div className={styles.img}>
              {" "}
              <CollabrationIcon />
            </div>
            <span className={styles.bold}> Verified Experts</span>

            <p>
              Masters or higher degree, solid practice experience & 2 step
              background verification.
            </p>
          </div>
          <div className={styles.blocks}>
            <div className={styles.img}>
              {" "}
              <AnyFileIcon />
            </div>
            <span className={styles.bold}> Discussion Forum</span>

            <p>
              Ask anything & initiate discussions with a community of
              like-minded users and psychologists
            </p>
          </div>
        </article>
        <article className={styles.article2}>
          <div className={styles.block2}>
            {/* <div className={styles.illustration}> */}
            <img className={styles.img} src={StayProdIllustration} alt="" />
            {/* </div> */}
          </div>
          <div className={styles.block2}>
            {" "}
            <span>Our Story</span>
            <p>
              In an effort to make the world more mentally resilient, we
              developed Lux - an AI chatbot that leverages evidence-based
              cognitive-behavioral techniques (CBT) to make you feel heard.
              Blended with professional human support, Lux provides 24/7
              high-quality mental health support.
            </p>
            <a href="">
              {" "}
              See how Lux works <img src={iconArrow} alt="" />
            </a>
          </div>
        </article>

        <article className={styles.article3}>
          <div className={styles.box1}>
            <img className={styles.quotes} src={bgQuotes} alt="" />
            <p>
              We have long believed that mental well-being should be treated as
              seriously as physical health. By accelerating our relationship
              with Wysa, we are providing early mental well-being support at
              scale and, through this, hope to alleviate some of the pressure
              people are feeling during this incredibly challenging time.
            </p>

            <span>
              <img className={styles.pic} src={profile1} alt="" />
              <p className={styles.p1}> Dr. Robert Morris</p>
              <p className={styles.p2}>
                Chief Technology Strategist, Ministry of Health Transformation
                Office
              </p>
            </span>
          </div>

          <div className={styles.box2}>
            <p>
              We are often inundated with information when all we really need is
              a chance to be listened to. Think of this as a constant companion
              and trusted friend, who listens to us and guides us through our
              challenges in a privacy-preserving & non-judgmental manner. If
              needed, it will guide us on how to reach out for help.
            </p>

            <span>
              <img className={styles.pic} src={profile2} alt="" />
              <p className={styles.p1}> Richard di Benedetto</p>
              <p className={styles.p2}>President Aetna International</p>
            </span>
          </div>

          <div className={styles.box3}>
            <p>
              These self-help techniques are important because anxiety is common
              among the population. Unfortunately, anxiety often goes
              undiagnosed, and then untreated for long periods of time, it helps
              everyone build skills to manage their mental health in the new
              normal.
            </p>

            <span>
              {" "}
              <img className={styles.pic} src={profile3} alt="" />
              <p className={styles.p1}> Iva Boyd</p>
              <p className={styles.p2}>Founder & CEO, Huddle</p>
            </span>
          </div>
        </article>
      </section>
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerColumn}>
            <h3>About Us</h3>
            <p>HealthGPT</p>
            <p>IIT, Roorkee</p>
          </div>

          <div className={styles.footerColumn}>
            <h3>Contact</h3>
            <p>Phone: +91 1234567890</p>
            <p>Email: healthgpt@gmail.com</p>
          </div>

          <div className={styles.footerColumn}>
            <h3>Follow Us</h3>
            <div className={styles.socialIcons}>
              <a href="#">
                <img src={github} alt="Facebook" />
              </a>
              <a href="#">
                <img src={Instagram} alt="Twitter" />
              </a>
              <a href="#">
                <img src={Facebook} alt="Instagram" />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>
            &copy; {new Date().getFullYear()} HealthGPT. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
