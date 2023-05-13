import { MidSection } from "../MidSection";
import { useState } from "react";
import styles from "../../CSSFiles/HomePage.module.scss";
import { ChatbotPage } from "./ChatbotPage";
import { useRef } from "react";
export const HomePage = (props: any) => {
  const [botIsShown, setbotIsShown] = useState(false);

  const showbotHandler = () => {
    setbotIsShown(true);
  };
  const HidebotHandler = () => {
    setbotIsShown(false);
  };
  const storeSummaryRef = useRef(null);
  return (
    <>
      {botIsShown && (
        <div className={styles.backdrop} onClick={HidebotHandler} />
      )}
      {botIsShown && (
        <ChatbotPage
          onClose={HidebotHandler}
          storeSummaryRef={storeSummaryRef}
        />
      )}

      <MidSection
        onShowChat={showbotHandler}
        storeSummary={storeSummaryRef.current}
      />
    </>
  );
};
