import { MidSection } from "../MidSection";
import { useState } from "react";
import styles from "../../CSSFiles/HomePage.module.scss";
import { ChatbotPage } from "./ChatbotPage";

export const HomePage = (props: any) => {
  const [botIsShown, setbotIsShown] = useState(false);

  const showbotHandler = () => {
    setbotIsShown(true);
  };
  const HidebotHandler = () => {
    setbotIsShown(false);
  };
  return (
    <>
      {botIsShown && (
        <div className={styles.backdrop} onClick={HidebotHandler} />
      )}
      {botIsShown && <ChatbotPage onClose={HidebotHandler} />}

      <MidSection onShowChat={showbotHandler} />
    </>
  );
};
