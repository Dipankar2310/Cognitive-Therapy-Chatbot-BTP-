import react, { useRef, useEffect } from "react";
import styles from "../../CSSFiles/Chatbot.module.scss";
import TypingAnimation from "../../UI/TypingAnimation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faVideo,
  faPaperPlane,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
const Chatbot = ({
  onFormChange,
  onFormSubmit,
  onFormClear,
  onClose,
  data,
}: PropsForm) => {
  const formRef: any = useRef();
  const userInputRef: any = useRef();
  const handleChange = (event: any) => {
    onFormChange(event.target.value);
  };
  const handleSubmit = (event: any) => {
    event.preventDefault();
    onFormSubmit(userInputRef.current.value);
    userInputRef.current.value = "";
  };
  const handleClose = () => {
    onClose();
  };
  const scrollToBottom = () => {
    formRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    console.log(data);
  }, [data]);
  // const formStyle = { width: "24px", height: "24px" };
  const cell = data ? (
    data.map((item) => {
      return (
        <div key={item.key}>
          {item?.userInput?.length && item?.userInput?.length > 0 ? (
            <article className={styles.msgContainer}>
              <div className={styles.outgoing}>
                <div className={styles.bubble}>{item.userInput}</div>
              </div>
            </article>
          ) : (
            <></>
          )}

          {item?.response?.length && item?.response?.length > 0 ? (
            <article className={styles.msgContainer}>
              <div className={styles.incoming}>
                <div className={`${styles.bubble} `}>{item.response}</div>
              </div>
            </article>
          ) : data.indexOf(item) == data.length - 1 ? (
            <article className={styles.msgContainer}>
              <div className={styles.typing}>
                <div className={styles.bubble}>
                  <TypingAnimation />
                </div>
              </div>
            </article>
          ) : (
            <></>
          )}
        </div>
      );
    })
  ) : (
    <></>
  );
  return (
    <>
      <div className={`${styles.chatbox} ${styles.modal}`}>
        <div className={styles.topbar}>
          <div className={styles.avatar}>
            <p>M</p>
          </div>
          <div className={styles.name}>Morphy</div>
          <div className={styles.icons}>
            <FontAwesomeIcon icon={faPhone} className={styles.fas} />
            <FontAwesomeIcon icon={faVideo} className={styles.fas} />
            <button className={styles.exitbutton} onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} className={` ${styles.cross} `} />
            </button>
          </div>
        </div>
        {/* top bar finish, Middle starts */}
        <div className={styles.middle}>
          {/* <div className={styles.voldemort}> */}
          {cell}

          <div ref={formRef}></div>
          {/* </div> */}
        </div>
        <div className={`${styles.bottombar} ${styles.chatinput}`}>
          <form onSubmit={handleSubmit}>
            <div className={styles.chat}>
              <input
                type="text"
                required
                // value={userInput}
                autoComplete="on"
                placeholder="Type a message"
                ref={userInputRef}
                // style={{ textDecoration: "none" }}
              />

              <button type="submit">
                <FontAwesomeIcon icon={faPaperPlane} className={styles.fas} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
    // <section>
    //   <section className={`${styles.chatbox} ${styles.modal}`}>
    //     <section className={styles.chatWindow}>
    //       {cell}
    //       <div ref={formRef}></div>
    //     </section>

    //     <form className={styles.chatInput} onSubmit={handleSubmit}>
    //       <input
    //         type="text"
    //         required
    //         value={userInput}
    //         autoComplete="on"
    //         placeholder="Type a message"
    //         onChange={handleChange}
    //         // style={{ textDecoration: "none" }}
    //       />
    //       <button type="submit">
    //         <svg style={formStyle} viewBox="0 0 24 24">
    //           <path
    //             fill="rgba(0,0,0,.38)"
    //             d="M17,12L12,17V14H8V10H12V7L17,12M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L5,8.09V15.91L12,19.85L19,15.91V8.09L12,4.15Z"
    //           />
    //         </svg>
    //       </button>
    //     </form>
    //     <button type="button" onClick={handleClear}>
    //       Clear
    //     </button>
    //   </section>
    // </section>
  );
};
export interface Interaction {
  id: number;
  key: number;
  userInput: string;
  response: string;
}
interface PropsForm {
  // userInput: any;
  onClose: any;
  onFormChange: any;
  onFormSubmit: any;
  onFormClear: any;
  data: Interaction[];
}

export default Chatbot;
