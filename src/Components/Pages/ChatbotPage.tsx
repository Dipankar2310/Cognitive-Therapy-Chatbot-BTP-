import axios from "axios";
import { useState, useEffect } from "react";
import Chatbot from "../Form/Chatbot";
import { Interaction } from "../Form/Chatbot";

import { numMessages } from "../../App";
import { UserMentalState } from "../../App";
import { useRecoilState, useRecoilValue } from "recoil";

import { useRef } from "react";
import { response } from "express";

export const ChatbotPage = (props: any) => {
  const [msgCount, setCount] = useRecoilState(numMessages);
  const [userMent, setUserMent] = useRecoilState(UserMentalState);
  const [userCred, setUserCred] = useState<UserInfo>({
    age: 18,
    email: "",
    gender: "",
    summary: "",
    username: "",
    password: "",
    symptom: "",
    userId: "",
    belief: "",
    chat: [],
  });

  const getData = async () => {
    let userId = localStorage.getItem("UserId");
    let accessToken = localStorage.getItem("AccessToken");
    axios
      .get(
        `http://localhost:4000/api/v1/db/user?userId=${userId}&accessToken=${accessToken}`
      )
      .then((response) => {
        setUserCred({
          age: response.data.data.userData.age,
          email: response.data.data.userData.email,
          gender: response.data.data.userData.gender,
          summary: response.data.data.userData.summary,
          username: response.data.data.userData.username,
          password: response.data.data.userData.password,
          symptom: response.data.data.userData.symptom,
          userId: response.data.data.userData.userId,
          belief: response.data.data.userData.belief,
          chat: response.data.data.userData.chat,
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const shortResponse: string = `The length of your response should be less than 50 words.`;
  const defDaVinci: string = `This conversation is between a Therapist and a Patient:`;
  const checkBeliefs: string = `From this conversation determine if the patient has any negative beliefs. Your response should look like "Yes/No. {negative beliefs}"`;
  const askHelp: string = `The following conversation is between ${userCred.username} and a therapist, should he seek help from a therapist. Strictly answer with Yes or No`;
  const proffesionalHelp: string = `The following conversation is between ${userCred.username} and a therapist, should he seek any proffesional help. Strictly answer with Yes or No`;
  const summarize: string = `Write a summary of the following conversation between a mental health therapist and ${userCred.username}.`;
  const defaultString: string = `You are a mental health therapist providing online therapy to a person named ${userCred.username}, who is a ${userCred.age} years old ${userCred.gender}.`;
  const shortDefString: string = `You are a mental health therapist, you are giving therapy to a person named ${userCred.username}`;
  const newUserInstruction: string =
    defaultString +
    ` You Greet ${userCred.username}  and be Friendly. If ${userCred.username} is not opening up Find out topics they are open to talk about.`;
  const oldUserInstruction: string =
    defaultString +
    ` You Greet ${userCred.username}  and be like friend who know each other.`;

  //
  //
  //
  // TURBO RESPONSE
  //
  //
  //

  const getResponseTurbo = async (
    userInputVal: string,
    count: number,
    systemRole: string = defaultString
  ) => {
    let d: Interaction[] = [];
    let userId = localStorage.getItem("UserId");
    let accessToken = localStorage.getItem("AccessToken");

    try {
      const res = await axios.get(
        `http://localhost:2000/api/v1/gpt/response/turbo?userId=${userId}&userInput=${userInputVal}&accessToken=${accessToken}`
      );
      setUserCred((prev: UserInfo) => {
        d = [
          ...prev.chat.slice(0, -1),
          {
            userInput: userInputVal,
            response:
              res.data.data.response.content.length > 0
                ? res.data.data.response.content
                : "Tell me more",
            id: prev.chat[prev.chat.length - 2]?.id
              ? prev.chat[prev.chat.length - 2].id + 1
              : 2,
            key: prev.chat[prev.chat.length - 2]?.key
              ? prev.chat[prev.chat.length - 2].key + 1
              : 2,
          },
        ];
        return { ...prev, chat: d };
      });
      axios
        .post(`http://localhost:4000/api/v1/db/chat`, {
          userId: userId,
          accessToken: accessToken,
          chatObject: {
            id: 1,
            key: 1,
            response:
              res.data.data.response.content.length > 0
                ? res.data.data.response.content
                : "Tell me more",
            userInput: userInputVal,
          },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error.message);
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
        return { ...prev, chat: d };
      });
    }
    setCount((prevCount) => {
      return prevCount + 1;
    });
  };

  //
  //
  // HANDLE FUNCTIONS
  //
  //
  //

  const handleFormSubmit = async (userInputvalue: any) => {
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
    await getResponseTurbo(
      userInputvalue,
      3,
      `you are a mental health therapist. Give the user small task which they can do while talking to you to feel better. ${shortResponse}`
    );
  };

  const handleFormChange = (input: string) => {};

  const handleFormClear = () => {
    setUserCred((prev: UserInfo) => {
      return { ...prev, chat: [] };
    });
    props.onClose();
  };

  return (
    <>
      <Chatbot
        onFormChange={handleFormChange}
        onFormSubmit={handleFormSubmit}
        onFormClear={handleFormClear}
        onClose={props.onClose}
        data={userCred.chat}
      ></Chatbot>
    </>
  );
};

interface UserInfo {
  age: number;
  email: string;
  gender: string;
  summary: string;
  username: string;
  chat: Interaction[];
  belief: string;
  symptom: string;
  userId: string;
  password: string;
}
export interface UserMentality {
  helpNeeded: Boolean;
  negBelief: string;
}
