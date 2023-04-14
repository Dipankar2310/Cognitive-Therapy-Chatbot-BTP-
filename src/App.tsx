import { TodoPage } from "./Components/Pages/TodoPage";
import { HomePage } from "./Components/Pages/HomePage";
import { AuthPage } from "./Components/Pages/AuthPage";
import { BlogPage } from "./Components/Pages/BlogPage";
import { ChatbotPage } from "./Components/Pages/ChatbotPage";
import { useState } from "react";
import { topPathsArray } from "./Components/constant";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import styles from "./App.module.scss";

function App() {
  // const [cartIsShown, setCartIsShown] = useState(false);
  // const showCartHandler = () => {
  //   setCartIsShown(true);
  // };
  // const HideCartHandler = () => {
  //   setCartIsShown(false);
  // };
  return (
    <RecoilRoot>
      {/* {cartIsShown && (
        <div className={styles.backdrop} onClick={HideCartHandler} />
      )}
      {cartIsShown && <ChatbotPage onClose={HideCartHandler} />} */}

      {/* <HomePage /> */}

      <Routes>
        <Route path={topPathsArray.homePath} element={<HomePage />} />
        <Route path={topPathsArray.blogPath} element={<BlogPage />} />
        <Route path={topPathsArray.loginPath} element={<AuthPage />} />
        {/* <Navigate to={topPathsArray.homePath} replace={true} /> */}
      </Routes>
    </RecoilRoot>
  );
}

export default App;
