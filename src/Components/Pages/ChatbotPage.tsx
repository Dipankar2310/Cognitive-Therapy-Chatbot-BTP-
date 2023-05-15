import { useState, useEffect } from "react";
import Chatbot from "../Form/Chatbot";
import { Interaction } from "../Form/Chatbot";
import { initializeApp } from "firebase/app";
import { numMessages } from "../../App";
import { helpNeeded } from "../../App";
import { useRecoilState, useRecoilValue } from "recoil";
import { Configuration, OpenAIApi } from "openai";
import { getDatabase, ref, get, child, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import { Await } from "react-router-dom";

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

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

export const ChatbotPage = (props: any) => {
  const dbRef = ref(database);
  const user = auth.currentUser;
  const [msgCount, setCount] = useRecoilState(numMessages);
  const [helpBool, setHelpBool] = useRecoilState(helpNeeded);
  const [userCred, setUserCred] = useState<UserInfo>({
    age: 18,
    email: "",
    gender: "Male",
    summary: "",
    username: "User",
    chat: [],
  });

  const getData = async () => {
    get(child(dbRef, `users/${user?.uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const res = snapshot.val();

          setUserCred({
            age: res.age,
            email: res.email,
            gender: res.gender,
            summary: res.summary ? res.summary : "",
            username: res.username,
            chat: res.chat ? res.chat : [],
          });
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getData();
    props.storeSummaryRef.current = getAdaResponse;
  }, []);
  //
  //
  //
  // TURBO RESPONSE
  //
  //
  //

  const shortResponse: string = `Keep your response short and concise.`;
  const askHelp: string = `The following conversation is between ${userCred.username} and a therapist, should he seek help from a therapist. Strictly answer with Yes or No`;
  const proffesionalHelp: string = `The following conversation is between ${userCred.username} and a therapist, should he seek any proffesional help. Strictly answer with Yes or No`;
  const summarize: string = `Write a summary of the following conversation between a mental health therapist and ${userCred.username}.`;
  const defaultString: string = `You are a mental health therapist, talking to ${userCred.username}, who is a ${userCred.age} years old ${userCred.gender}.`;
  const getResponseTurbo = async (
    userInputVal: string,
    count: number,
    systemRole: string = defaultString
  ) => {
    let chat: any = [];
    for (
      let i = Math.max(userCred.chat.length - count, 0);
      i < userCred.chat.length;
      i++
    ) {
      chat.push({ role: "user", content: userCred.chat[i].userInput });
      chat.push({ role: "assistant", content: userCred.chat[i].response });
    }
    let d: Interaction[] = [];
    // console.log(userCred.chat);
    try {
      const res = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemRole },
          ...chat,

          { role: "user", content: userInputVal },
        ],
      });
      console.log(res);

      // console.log(userCred.chat);

      setUserCred((prev: UserInfo) => {
        d = [
          ...prev.chat.slice(0, -1),
          {
            userInput: userInputVal,
            response: res.data.choices[0].message?.content
              ? res.data.choices[0].message?.content
              : "Tell me more",
            id: prev.chat[prev.chat.length - 2]?.id
              ? prev.chat[prev.chat.length - 2].id + 1
              : 2,
            key: prev.chat[prev.chat.length - 2]?.key
              ? prev.chat[prev.chat.length - 2].key + 1
              : 2,
          },
        ];
        console.log(prev.chat);
        console.log(d);
        return { ...prev, chat: d };
      });
    } catch (error) {
      setUserCred((prev: UserInfo) => {
        d = [
          ...prev.chat.slice(0, -1),
          {
            userInput: userInputVal,
            response:
              "Hey, there seems to be an issue with my server, you can continue talking while the issue gets resolved, but if my responses dont make any sense then please come back later, sorry for the inconvinience",
            id: prev.chat[prev.chat.length - 2]?.id
              ? prev.chat[prev.chat.length - 2].id + 1
              : 2,
            key: prev.chat[prev.chat.length - 2]?.key
              ? prev.chat[prev.chat.length - 2].key + 1
              : 2,
          },
        ];
        console.log(prev.chat);
        console.log(d);
        return { ...prev, chat: d };
      });
    }
    await update(ref(database, "users/" + user?.uid), {
      chat: d,
    });

    // console.log(res);
    //console.log(d);
    setCount((prevCount) => {
      console.log(prevCount + 1);
      return prevCount + 1;
    });
  };

  //
  //
  //  ADA RESPONSE
  //
  //

  const getAdaResponse = async (
    userInputVal: string = "",
    instruction: string = summarize,
    count: number = msgCount
  ) => {
    let chat: any = "";
    for (let i = 0; i < userCred.chat.length; i++) {
      chat = chat + `${userCred.username}: ${userCred.chat[i].userInput} \n`;
      chat = chat + `Therapist: ${userCred.chat[i].response} \n`;
    }
    chat = chat + `${userCred.username}: ${userInputVal} \n`;

    try {
      const response = await openai.createCompletion({
        model: "text-ada-001",
        prompt: `${instruction} : \n ${chat} `,
        // prompt:
        //   "write a summary of the following conversation between two people:\nRohit: You look bit down. What's the matter?\n\nMahesh: (Sighs) Nothing much.\n\nRohit: Looks like something isn’t right.\n\nMahesh: Ya. It’s at the job front. You know that the telecom industry is going through a rough patch because of falling prices and shrinking margins. These factors along with consolidation in the industry is threatening the stability of our jobs. And even if the job remains, career growth isn’t exciting.\n\nRohit: I know. I’ve been reading about some of these issues about your industry in the newspapers. So have you thought of any plan?\n\nMahesh: I’ve been thinking about it for a while, but haven’t concretized anything so far.\n\n\n\nMahesh is talking about his job front, which is the site of the job and which is facing a number of issues due to falling prices and shrinking margins. He has been thinking about some plan to save the job, but has not yet succeeded.",
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      if (instruction === summarize) {
        setUserCred((prev: UserInfo) => {
          return {
            ...prev,
            summary: response.data.choices[0].text
              ? response.data.choices[0].text
              : "",
          };
        });
        await update(ref(database, "users/" + user?.uid), {
          summary: response.data.choices[0].text,
        });
      }
      return response.data.choices[0].text;
    } catch (error) {
      return "";
    }
    // console.log("SummaryStored");
  };

  //
  //
  // HANDLE FUNCTIONS
  //
  //
  //
  const handleFormSubmit = async (userInputvalue: any) => {
    // setUserInput(userInputvalue);
    setUserCred((prev: UserInfo) => {
      return {
        ...prev,
        chat: [
          ...prev.chat,
          {
            userInput: userInputvalue,
            response: "",
            id: 1000000007,
            key: 1000000007,
          },
        ],
      };
    });
    if (msgCount < 2) {
      await getResponseTurbo(
        userInputvalue,
        3,
        `${defaultString} Greet ${userCred.username} and have a small talk.`
      );
    } else if (msgCount < 6) {
      await getResponseTurbo(
        userInputvalue,
        3,
        `${defaultString} Continue this conversation and ease
        the user to ask questions and to learn about any
        problems ${userCred.username} is facing. ${shortResponse}`
      );
    } else if (!helpNeeded) {
      await getResponseTurbo(
        userInputvalue,
        3,
        `${defaultString} Ask probing questions to get a
        deeper understanding of the problem ${userCred.username} is facing. ${shortResponse}`
      );
      const res = await getAdaResponse(userInputvalue, askHelp);
      if (
        res &&
        res.length > 0 &&
        res.length >= 3 &&
        (res[0] + res[1] + res[2]).toLowerCase() == "yes"
      ) {
        setHelpBool(true);
      }
      const p = await getAdaResponse(userInputvalue, summarize);
    } else {
      await getResponseTurbo(
        userInputvalue,
        3,
        `${defaultString} Above is a small piece of conversation and the summary of the previous conversation is that ${userCred.summary},
      Suggest some methods to solve the issue. ${shortResponse}`
      );
    }
    //const res = await query(userInput);
  };
  const handleFormChange = (input: string) => {
    // setUserInput(input);
  };
  const handleFormClear = () => {
    setUserCred((prev: UserInfo) => {
      return { ...prev, chat: [] };
    });
    props.onClose();
  };

  return (
    // <Modal>

    <>
      <Chatbot
        // userInput={userInput}
        onFormChange={handleFormChange}
        onFormSubmit={handleFormSubmit}
        onFormClear={handleFormClear}
        onClose={props.onClose}
        data={userCred.chat}
      ></Chatbot>

      {/* <Card listOfTodos={data}></Card> */}
    </>
    // </Modal>
  );
};

interface UserInfo {
  age: number;
  email: string;
  gender: string;
  summary: string;
  username: string;
  chat: Interaction[];
}
