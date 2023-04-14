import { Card } from "../Card/card";
import { useState, useEffect } from "react";
import Form from "../Form/Form";
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const getResponse = async () => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "talk to following person as a therapist.\n",
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  console.log(response);
};

export const TodoPage = (props: any) => {
  const [data, setData] = useState<any>([{}]);
  const [userInput, setUserInput] = useState<string>("");
  useEffect(() => {
    fetch("/api")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        const d = data.map((element: any) => {
          return (element = { ...element, key: element.id });
        });
        setData(d);
      });
  }, []);
  const handleFormChange = (input: string) => {
    setUserInput(input);
  };
  const handleFormSubmit = () => {
    getResponse();
    const d = [
      ...data,
      { userInput: userInput, response: "", id: 1000, key: 1000 },
    ];
    console.log(d);
    setData(d);

    fetch("/api/predict", {
      method: "POST",
      body: JSON.stringify({
        userInput: userInput,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((message) => {
        //console.log(message);
        setUserInput("");
        getLatestTodos();
      });
  };
  const getLatestTodos = () => {
    fetch("/api")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        const d = data.map((element: any) => {
          return (element = { ...element, key: element.id });
        });

        setData(d);
        console.log(d);
      });
  };
  const handleFormClear = () => {
    fetch("/api/clear")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => setData(data));
    props.onClose();
  };
  return (
    // <Modal>
    <>
      <Form
        userInput={userInput}
        onFormChange={handleFormChange}
        onFormSubmit={handleFormSubmit}
        onFormClear={handleFormClear}
        data={data}
      ></Form>

      {/* <Card listOfTodos={data}></Card> */}
    </>
    // </Modal>
  );
};
