import { useState, useEffect } from "react";
import Chatbot from "../Form/Chatbot";
import { Interaction } from "../Form/Chatbot";
import { initializeApp } from "firebase/app";
import { numMessages } from "../../App";
import { UserMentalState } from "../../App";
import { useRecoilState, useRecoilValue } from "recoil";
import { Configuration, OpenAIApi } from "openai";
import { getDatabase, ref, get, child, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useRef } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyAzqB8sbcmuDBo6eMsmjWY84RIAQ_3s6sA",
  authDomain: "healthgpt-1a9b2.firebaseapp.com",
  databaseURL: "https://healthgpt-1a9b2-default-rtdb.firebaseio.com",
  projectId: "healthgpt-1a9b2",
  storageBucket: "healthgpt-1a9b2.appspot.com",
  messagingSenderId: "431429000193",
  appId: "1:431429000193:web:799ed9852f1fbed9eaf400",
  measurementId: "G-E7Z9SS8BD2"
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

  const [helpText, setHelpText] = useState<string>("mental illness");
  const helpTextRef = useRef<string>("mental illness");

  useEffect(() => {
    if(helpText != "mental illness"){
      helpTextRef.current = helpText
    }
    console.log('the helpText in ChatbotPage is: ', helpTextRef.current);
    props.onHelpTextChange(helpTextRef.current);
  }, [helpText])


  const [msgCount, setCount] = useRecoilState(numMessages);
  const [userMent, setUserMent] = useRecoilState(UserMentalState);
  const [userCred, setUserCred] = useState<UserInfo>({
    age: 18,
    email: "",
    gender: "Male",
    summary: "",
    username: "User",
    userhelptype: helpText,
    chat: [],
  });

  const getData = async () => {
    get(child(dbRef, `users/${user?.uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const res = snapshot.val();
          setHelpText(res.userhelptype);
          setUserCred({
            age: res.age,
            email: res.email,
            gender: res.gender,
            summary: res.summary ? res.summary : "",
            username: res.username,
            userhelptype: res.userhelptype,
            chat: res.chat ? res.chat : [],
          });
        } else {
          // console.log("No data available");
        }
      })
      .catch((error) => {
        // console.error(error);
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

useEffect(() => {
  if(user?.uid === undefined || helpText === "mental illness"){
    return () => {}
  }
  update(ref(database, "users/" + user?.uid), {
      userhelptype: helpText,
    });
}, [userCred])


  const shortResponse: string = `The length of your response should be less than 50 words.`;
  const defDaVinci: string = `This conversation is between a Therapist and a Patient:`;
  const checkBeliefs: string = `From this conversation determine if the patient has any negative beliefs. Your response should look like "Yes/No. {negative beliefs}"`;
  const askHelp: string = `The following conversation is between ${userCred.username} and a therapist, should he seek help from a therapist. Strictly answer with Yes or No`;
  const proffesionalHelp: string = `The following conversation is between ${userCred.username} and a therapist, should he seek any proffesional help. Strictly answer with Yes or No`;
  const summarize: string = `Write a summary of the following conversation between a mental health therapist and ${userCred.username}.`;
  const defaultString: string = `You are a mental health therapist providing online therapy to a person named ${userCred.username}, who is a ${userCred.age} years old ${userCred.gender}.`;
  const shortDefString: string = `You are a mental health therapist, you are giving therapy to a person named ${userCred.username}`;
  const helpType: string = `Based on given input, you have to identify one mental illness type the user is suffering from. types=['anxiety', 'depression', 'ptsd', 'trauma', 'stress', 'schizophrenia', 'personality disorder', 'bipolar disorder', 'autism', 'memory loss']. If user himself is specifying problem, consider that and compare the closest one from 'types'. I can see you're confusing between stress and anxiety, note that if user himself is writing anxiety, you have to tell anxiety as response, if user is typing stress, you should give stress as response, otherwise one closest from the 'types' array. You just have to answer in one word, which one from types the user is suffering from. If there are mutiple, tell anyone without any explanation and your response should be in all lowercase exactly matching one from 'types' array (or closest one) and without any full stop. Don't explaing anything, just give answer in one word the string matching from 'types' array.`;
  const newUserInstruction: string =
    defaultString +
    ` You Greet ${userCred.username}  and be Friendly. If ${userCred.username} is not opening up Find out topics they are open to talk about.`;
  const oldUserInstruction: string =
    defaultString +
    ` You Greet ${userCred.username}  and be like friend who know each other.`;
  const getResponseTurbo = async (
    userInputVal: string,
    count: number,
    systemRole: string = defaultString
  ) => {
    let chat: any = [];
    for (
      let i = Math.max(userCred.chat.length - Math.min(count, msgCount), 0);
      i < userCred.chat.length;
      i++
    ) {
      chat.push({ role: "user", content: userCred.chat[i].userInput });
      chat.push({ role: "assistant", content: userCred.chat[i].response });
    }
    chat.push({ role: "user", content: userInputVal });
    let d: Interaction[] = [];
    // console.log(userCred.chat);
    try {
      const res = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: systemRole }, ...chat],
      });
      // console.log(res);
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
        // console.log(prev.chat);
        // console.log(d);
        return { ...prev, chat: d , userhelptype: helpText};
      });
    } catch (error) {
      const errorResponse = [
        "Can you find any specific thing that can be done to help you feel better?",
        "That sounds really difficult. How are you coping?",
        "I'm really sorry you're going through this. I'm here for you if you need me.",
        "Let me know what you need. I'll try to help you in any way possible.",
        "Tell me what you see as your choices here. What are the things that you can do to be in a better situation.",
        "I understand how you feel.",
      ];
      const x = Math.floor(Math.random() * errorResponse.length);
      setUserCred((prev: UserInfo) => {
        d = [
          ...prev.chat.slice(0, -1),
          {
            userInput: userInputVal,
            response: errorResponse[x],
            id: prev.chat[prev.chat.length - 2]?.id
              ? prev.chat[prev.chat.length - 2].id + 1
              : 2,
            key: prev.chat[prev.chat.length - 2]?.key
              ? prev.chat[prev.chat.length - 2].key + 1
              : 2,
          },
        ];
        // console.log(prev.chat);
        // console.log(d);
        return { ...prev, chat: d };
      });
    }
    await update(ref(database, "users/" + user?.uid), {
      chat: d,
      userhelptype: helpText,
    });

    // console.log(res);
    //console.log(d);
    setCount((prevCount) => {
      // console.log(prevCount + 1);
      return prevCount + 1;
    });
  };

  //
  //
  //  TURBO RESPONSE
  //
  //

  const getHelpType = async (
    userInputVal: string,
    systemRole: string = defaultString
  ) => {
    let chat: any = [];
    for (
      let i = 0;
      i < userCred.chat.length;
      i++
    ) {
      chat.push({ role: "user", content: userCred.chat[i].userInput });
      chat.push({ role: "assistant", content: userCred.chat[i].response });
    }
    chat.push({ role: "user", content: userInputVal });
    chat.push({ role: "system", content: helpType });
    let d: Interaction[] = [];
    // console.log(userCred.chat);
    try {
      const res = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: systemRole }, ...chat],
      });
      // console.log('help type: ', res.data.choices[0].message?.content);
      const temp = res.data.choices[0].message?.content;
      setHelpText(temp || "mental illness");
    } catch (error) {
      // console.log('help type: ', 'stress');
      setHelpText('mental illness');
    }
  };

  //
  //
  //  ADA RESPONSE
  //
  //

  const getAdaResponse = async (
    userInputVal: string = "",
    instruction: string = summarize,
    count: number = 6
  ) => {
    let chat: any = "";
    for (
      let i = Math.max(userCred.chat.length - Math.min(count, msgCount), 0);
      i < userCred.chat.length;
      i++
    ) {
      chat = chat + `Patient: ${userCred.chat[i].userInput} \n`;
      chat = chat + `Therapist: ${userCred.chat[i].response} \n`;
    }
    chat = chat + `Patient: ${userInputVal} \n`;

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
  //DaVinci
  //
  //
  const getDaVinciResponse = async (
    userInputVal: string = "",
    count: number = 6
  ) => {
    let chat: any = "";
    for (
      let i = Math.max(userCred.chat.length - Math.min(count, msgCount), 0);
      i < userCred.chat.length;
      i++
    ) {
      chat = chat + `Patient: ${userCred.chat[i].userInput} \n`;
      chat = chat + `Therapist: ${userCred.chat[i].response} \n`;
    }
    chat = chat + `Patient: ${userInputVal} \n`;

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${defDaVinci} : \n ${chat} \n ${checkBeliefs}`,
        // prompt:
        //   "write a summary of the following conversation between two people:\nRohit: You look bit down. What's the matter?\n\nMahesh: (Sighs) Nothing much.\n\nRohit: Looks like something isn’t right.\n\nMahesh: Ya. It’s at the job front. You know that the telecom industry is going through a rough patch because of falling prices and shrinking margins. These factors along with consolidation in the industry is threatening the stability of our jobs. And even if the job remains, career growth isn’t exciting.\n\nRohit: I know. I’ve been reading about some of these issues about your industry in the newspapers. So have you thought of any plan?\n\nMahesh: I’ve been thinking about it for a while, but haven’t concretized anything so far.\n\n\n\nMahesh is talking about his job front, which is the site of the job and which is facing a number of issues due to falling prices and shrinking margins. He has been thinking about some plan to save the job, but has not yet succeeded.",
        temperature: 0,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      return response.data.choices[0].text?.slice(2);
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
    await getHelpType(
      userInputvalue,
      `${
        oldUserInstruction
      } ${shortResponse}`
    );

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
    
    if (msgCount < 3) {
      await getResponseTurbo(
        userInputvalue,
        3,
        `${
          userCred.chat.length > 5 ? oldUserInstruction : newUserInstruction
        } ${shortResponse}`
      );
    } else if (msgCount < 6) {
      await getResponseTurbo(
        userInputvalue,
        3,
        `${defaultString}, You continue this conversation and empathize with the user to know about any problems ${userCred.username} is facing. ${shortResponse}`
      );
      const res = await getDaVinciResponse(userInputvalue);
      if (res?.slice(0, 2) !== "No") {
        setUserMent((prev) => {
          return {
            ...prev,
            negBelief: res?.slice(4) == undefined ? "" : res?.slice(4),
          };
        });
      }
    } else if (msgCount < 10 && userMent.negBelief === "") {
      await getResponseTurbo(
        userInputvalue,
        3,
        `${shortDefString}, play a little trust building excercise with ${userCred.username}.${shortResponse}`
      );
    } else if (userMent.negBelief === "") {
      await getResponseTurbo(
        userInputvalue,
        3,

        `${defaultString} You continue the conversation with probing questions in an empathetic manner to get a deeper understanding of the problem ${userCred.username} is facing. ${shortResponse}`
      );
      const res = await getDaVinciResponse(userInputvalue);
      if (res?.slice(0, 2) !== "No") {
        setUserMent((prev) => {
          return {
            ...prev,
            negBelief: res?.slice(4) == undefined ? "" : res?.slice(4),
          };
        });
      }
      const p = await getAdaResponse(userInputvalue, summarize);
    } else if (userMent.negBelief !== "" && msgCount < 20) {
      if (msgCount < 9) {
        await getResponseTurbo(
          userInputvalue,
          3,
          `you are a mental health therapist. Give the user small task which they can do while talking to you to feel better. ${shortResponse}`
        );
      } else if (msgCount < 12) {
        await getResponseTurbo(
          userInputvalue,
          3,
          `You are a mental health therapist. The user has ${userMent.negBelief}, You convince the user that having such beliefs can have negative consequences on their life and replace the negative belief with something positive. ${shortResponse}`
        );
        const res = await getDaVinciResponse(userInputvalue);
        if (res?.slice(0, 2) !== "No") {
          setUserMent((prev) => {
            return {
              ...prev,
              negBelief: res?.slice(4) == undefined ? "" : res?.slice(4),
            };
          });
        }
      } else if (msgCount < 20) {
        await getResponseTurbo(
          userInputvalue,
          6,
          `You are a mental health therapist, out of different strategies like, Cognitive restructuring or reframing, Guided discovery, Exposure therapy, Journaling and thought records, Relaxation and stress reduction techniques, You answer as a therapist to the user using one of the techniques. ${shortResponse}`
        );
      }
    } else if (!userMent.helpNeeded) {
      await getResponseTurbo(
        userInputvalue,
        3,
        `You are a mental health therapist, tell the user ways to cope up about any mental issues the user has. ${shortResponse}`
      );
      const res = await getAdaResponse(userInputvalue, askHelp);
      if (
        res &&
        res.length > 0 &&
        res.length >= 3 &&
        (res[0] + res[1] + res[2]).toLowerCase() == "yes"
      ) {
        setUserMent((prev) => {
          return {
            ...prev,
            helpNeeded: true,
          };
        });
      }
      const p = await getAdaResponse(userInputvalue, summarize);
    } else {
      if (msgCount % 2 == 0)
        await getResponseTurbo(
          userInputvalue,
          3,
          `You are a mental health therapist, suggest them that they shou;d seek proffesional help, meanwhile also suggest methods to cope with the situation. The length of your response should be less than 60 words. ${shortResponse}`
        );
      else {
        await getResponseTurbo(
          userInputvalue,
          3,
          `you are a mental health therapist. Give the user small task which they can do while talking to you to feel better. ${shortResponse}`
        );
      }
      const res = await getAdaResponse(userInputvalue, askHelp);
      if (
        res &&
        res.length > 0 &&
        res.length >= 3 &&
        (res[0] + res[1] + res[2]).toLowerCase() == "yes"
      ) {
        setUserMent((prev) => {
          return {
            ...prev,
            helpNeeded: true,
          };
        });
      }
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
  userhelptype: string;
  chat: Interaction[];
}
export interface UserMentality {
  helpNeeded: Boolean;
  negBelief: string;
}
