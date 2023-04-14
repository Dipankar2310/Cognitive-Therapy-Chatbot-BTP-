import { Card } from "../Card/card";
import { useState, useEffect } from "react";
import Form from "../Form/Form";
import Chatbot from "../Form/Chatbot";
import { Interaction } from "../Form/Chatbot";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  set,
  ref,
  get,
  child,
  update,
  DatabaseReference,
} from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
  User,
} from "firebase/auth";
// import fetch from "node-fetch";

// const API_TOKEN = "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";
// async function query(data: string) {
//   const response = await fetch(
//     "https://api-inference.huggingface.co/models/deepset/roberta-base-squad2",
//     {
//       headers: { Authorization: `Bearer ${API_TOKEN}` },
//       method: "POST",
//       body: JSON.stringify(data),
//     }
//   );
//   const result = await response.json();
//   return result;
// }
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

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
const getChats = async (dbRef: DatabaseReference, user: User) => {};
export const ChatbotPage = (props: any) => {
  const dbRef = ref(database);
  const user = auth.currentUser;

  const [data, setData] = useState<Interaction[]>([]);
  console.log(data);
  const [userInput, setUserInput] = useState<string>("");
  useEffect(() => {
    get(child(dbRef, `users/${user?.uid}/chat`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const res = snapshot.val();
          setData(res);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  console.log(data);
  const getResponse = async (input: string) => {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: input,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    console.log(response);
    return response;
  };
  const handleFormChange = (input: string) => {
    setUserInput(input);
  };
  const handleFormSubmit = async (userInputvalue: any) => {
    setUserInput(userInputvalue);
    const res = await getResponse(userInputvalue + "\n");
    //const res = await query(userInput);
    const d: Interaction[] = [
      ...data,
      {
        userInput: userInputvalue,
        response: res.data.choices[0].text,
        id: data[data.length - 1]?.id ? data[data.length - 1].id + 1 : 1,
        key: data[data.length - 1]?.key ? data[data.length - 1].key + 1 : 1,
      },
    ];
    setData(d);
    update(ref(database, "users/" + user?.uid), {
      chat: d,
    });

    console.log(d);
    //console.log(d);
  };
  const handleFormClear = () => {
    setData([]);
    props.onClose();
  };
  return (
    // <Modal>

    <>
      <Chatbot
        userInput={userInput}
        onFormChange={handleFormChange}
        onFormSubmit={handleFormSubmit}
        onFormClear={handleFormClear}
        data={data}
      ></Chatbot>

      {/* <Card listOfTodos={data}></Card> */}
    </>
    // </Modal>
  );
};
