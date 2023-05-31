import { HomePage } from "./Components/Pages/HomePage";
import { AuthPage } from "./Components/Pages/AuthPage";
import { BlogPage } from "./Components/Pages/BlogPage";
import { topPathsArray } from "./Components/constant";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { UserMentality } from "./Components/Pages/ChatbotPage";
import { atom } from "recoil";
import { useState } from "react";
export const numMessages = atom({
  key: "myMessageCounter",
  default: 0,
});
export const UserMentalState = atom<UserMentality>({
  key: "helpNeededBool",
  default: { helpNeeded: false, negBelief: "" },
});
function App() {
  const [helpTextValue, setHelpTextValue] = useState<string>("mental illness");
  const handleHelpTextValueChange = (props: any) => {
    console.log('the helpText in App is: ', props)
    setHelpTextValue(props)
  }

  const [blogType, setBlogType] = useState('mental illness');
  // const [cartIsShown, setCartIsShown] = useState(false);
  // const showCartHandler = () => {
  //   setCartIsShown(true);
  // };
  // const HideCartHandler = () => {
  //   setCartIsShown(false);
  // };

  return (
    <>
      {/* {cartIsShown && (
        <div className={styles.backdrop} onClick={HideCartHandler} />
      )}
      {cartIsShown && <ChatbotPage onClose={HideCartHandler} />} */}

      {/* <HomePage /> */}

      <Routes>
        <Route path={topPathsArray.homePath} element={<HomePage onHelpTextValueChange={handleHelpTextValueChange}/>} />
        <Route path={topPathsArray.blogPath} element={<BlogPage helpText={helpTextValue}/>} />
        <Route path={topPathsArray.loginPath} element={<AuthPage />} />
        {/* <Navigate to={topPathsArray.homePath} replace={true} /> */}
      </Routes>
    </>
  );
}

export default App;
