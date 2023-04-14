import react, { useRef, useEffect } from "react";
import styles from "../../CSSFiles/Form.module.scss";
import TypingAnimation from "../../UI/TypingAnimation";
const Form = ({
  userInput,
  onFormChange,
  onFormSubmit,
  onFormClear,
  data,
}: PropsForm) => {
  const formRef: any = useRef();
  const handleChange = (event: any) => {
    onFormChange(event.target.value);
  };
  const handleSubmit = (event: any) => {
    event.preventDefault();
    onFormSubmit();
  };
  const handleClear = () => {
    onFormClear();
  };
  const scrollToBottom = () => {
    formRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [data]);
  const formStyle = { width: "24px", height: "24px" };

  const cell = data.map((todo) => {
    //console.log(todo.key);
    // console.log(todo?.userInput?.length);
    return (
      <div key={todo.key}>
        {todo?.userInput?.length && todo?.userInput?.length > 0 ? (
          <article
            className={`${styles.msgContainer} ${styles.msgRemote}`}
            id={styles.msg0}
          >
            <div className={styles.msgBox}>
              <img
                className={styles.userImg}
                id={styles.user0}
                src="//gravatar.com/avatar/00034587632094500000000000000000?d=retro"
              />
              <div className={styles.flr}>
                <div className={styles.messages}>
                  <p className={styles.msg} id={styles.msg0}>
                    {todo.userInput}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ) : (
          <></>
        )}

        {todo?.response?.length == 0 ? (
          <div className={styles.typing}>
            <TypingAnimation />
          </div>
        ) : (
          <article
            className={`${styles.msgContainer} ${styles.msgSelf}`}
            id={styles.msg0}
          >
            <div className={styles.msgBox}>
              <div className={styles.flr}>
                <div className={styles.messages}>
                  {
                    <p className={styles.msg} id={styles.msg1}>
                      {todo.response}
                    </p>
                  }
                  {/* <p className={styles.msg} id={styles.msg2}>
                  Praesent varius
                </p> */}
                </div>
              </div>
              <img
                className={styles.userImg}
                id={styles.user0}
                src="//gravatar.com/avatar/56234674574535734573000000000001?d=retro"
              />
            </div>
          </article>
        )}
      </div>
    );
  });
  return (
    <section>
      <section className={`${styles.chatbox} ${styles.modal}`}>
        <section className={styles.chatWindow}>
          {cell}
          <div ref={formRef}></div>
        </section>

        <form className={styles.chatInput} onSubmit={handleSubmit}>
          <input
            type="text"
            required
            value={userInput}
            autoComplete="on"
            placeholder="Type a message"
            onChange={handleChange}
          />
          <button type="submit">
            <svg style={formStyle} viewBox="0 0 24 24">
              <path
                fill="rgba(0,0,0,.38)"
                d="M17,12L12,17V14H8V10H12V7L17,12M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L5,8.09V15.91L12,19.85L19,15.91V8.09L12,4.15Z"
              />
            </svg>
          </button>
        </form>
        <button type="button" onClick={handleClear}>
          Clear
        </button>
      </section>
    </section>
  );
};
interface Interaction {
  id: number;
  key: number;
  userInput: string;
  response: string[];
}
interface PropsForm {
  userInput: any;
  onFormChange: any;
  onFormSubmit: any;
  onFormClear: any;
  data: Interaction[];
}

export default Form;
