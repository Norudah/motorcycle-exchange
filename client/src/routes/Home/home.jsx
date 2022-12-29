import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { Button } from "@nextui-org/react";

const Home = () => {
  const token = JSON.parse(localStorage.getItem("user")).token ?? null;
  const user = JSON.parse(localStorage.getItem("user")).user ?? null;

  const [responseButton, setResponseButton] = useState([]);

  const [botResume, setBotResume] = useState([
    {
      step : null,
      lastMessageUser : null,
    },
  ]);

  useEffect(() => {
    const socket = io("http://localhost:3000/user", {
      auth: {
        token,
      },
    });

    socket.on("welcome-bot", (userId, message, response) => {
      if(userId === user.id)
      {
        console.log("welcome-bot", userId, message, response );
        setResponseButton(Object.entries(response));
      }
    });

    socket.on("bot-contact", (userId, message, step, response) => {
      if(userId === user.id)
      {
        console.log("bot-contact", userId, message, step, response);
        setResponseButton(responseButton.concat(Object.entries(response)));
      }
    });
  }, []);

  const handleClick = () => {
    const socket = io("http://localhost:3000/user", {
      auth: {
        token,
      },
    });

    socket.emit("join-room-bot", (user.id));
  };

  const sendResponse = (step, message) => {
    const socket = io("http://localhost:3000/user", {
      auth: {
        token,
      },
    });

    if(botResume.step == null)
    {
      console.log("in if");
      setBotResume({
        step : step,
        lastMessageUser : message,
      });
      console.log('after populate', botResume.step, step);
    }
    else
    {
      console.log("in else");
      setBotResume({
        step : botResume.step,
        lastMessageUser : message,
      });
    }

    console.log(botResume);

    if(botResume.step != null && botResume.lastMessageUser != null)
      socket.emit("send-message-bot", user.id, botResume);
  };


  return (
    <div className="main">
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">Home</h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Welcome to the home page.</p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">This is the home page. </p>
          </div>
        </div>
      </section>
      <section className="bg-white dark:bg-gray-900">
        <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded" onClick={handleClick}>connect to bot</button>
        {
          responseButton.map((item, index) => {
            return (
              <Button key={index} onPress={() => sendResponse(item[0], item[1])}>{item[1]}</Button>
            )
          })
        }
      </section>
    </div>
  );
};

export default Home;
