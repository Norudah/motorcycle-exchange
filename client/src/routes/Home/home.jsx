import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Card, Col, Text } from "@nextui-org/react";

import { Button } from "@nextui-org/react";

const Home = () => {
  const token = JSON.parse(localStorage.getItem("user")).token ?? null;
  const user = JSON.parse(localStorage.getItem("user")).user ?? null;

  const [responseButton, setResponseButton] = useState([]);

  const [historics, sethistorics] = useState([]);

  const [lastMessageUser, setlastMessageUser] = useState("");

  const [botResume, setBotResume] = useState([
    {
      userId : user.id,
      step : null,
      newMessageUser : null,
      modifStep : null,
    },
  ]);

  useEffect(() => {
    const socket = io("http://localhost:3000/user", {
      auth: {
        token,
      },
    });

    socket.on("welcome-bot", (botResume, message, response) => {
      if(botResume.userId === user.id)
      {
        sethistorics(historics.concat(message));
        setResponseButton(Object.entries(response));
      }
    });

    socket.on("send-bot-message", (botResume, message, response) => {
      console.log('Response botResume', botResume, message, response);
      if(botResume.userId === user.id)
      {
        if(botResume.modifStep == 1)
        {
          setBotResume({
            userId : botResume.userId,
            step : botResume.step,
            newMessageUser : botResume.newMessageUser,
            modifStep : 1,
          });
        }
        if(response != null)
        {
          setResponseButton(responseButton.concat(Object.entries(response)));
        }
      }
    });
  }, []);

  const handleClick = () => {
    const socket = io("http://localhost:3000/user", {
      auth: {
        token,
      },
    });

    setBotResume({
      userId : user.id,
      step : null,
      newMessageUser : null,
      modifStep : null,
    });

    socket.emit("join-room-bot", botResume);
  };

  const sendResponse = (step, message) => {
    console.log('before populate', step, message, botResume, 'lastMessageUser', lastMessageUser);
    if(botResume.modifStep == 1 || botResume.modifStep == null)
    {
      console.log("in if");
      setBotResume({
        userId : user.id,
        step : step,
        newMessageUser : message,
        modifStep : 0,
      });
    }
    else
    {
      console.log("in else");
      setBotResume({
        userId : user.id,
        step : botResume.step,
        newMessageUser : message,
        modifStep : 0,
      });
    }
    setlastMessageUser(botResume.newMessageUser);
  };

  useEffect(() => {
    const socket = io("http://localhost:3000/user", {
      auth: {
        token,
      },
    });

    console.log('lastMessageUser', lastMessageUser);
    console.log('after populate', botResume);
    socket.emit("response-message-bot", botResume);
  }, [lastMessageUser != botResume.newMessageUser]);

  return (
    <div className="main">
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">Welcom to Yamaha</h1>
          </div>
        </div>

        <Card>
          <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
            <Col>
              <Text size={12} weight="bold" transform="uppercase" color="#kkkkkk">
                What to watch
              </Text>
            </Col>
          </Card.Header>
          <Card.Image
            src="https://i.pinimg.com/736x/5c/bb/cf/5cbbcf3649a24deee4a9c707ee04fe28.jpg"
            objectFit="cover"
            width="100%"
            height={340}
            alt="Card image background"
          />
        </Card>
      </section>
      <section className="bg-white dark:bg-gray-900">
        <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded" onClick={handleClick}>connect to bot</button>
        {
          historics.map((item, index) => {
            return (
              <h3 key={index}>{item}</h3>
            )
          })
        }
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
