import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const BotMessage = (props) => {
  const { message, id_person, step } = props;

  const token = JSON.parse(localStorage.getItem("user")).token ?? null;
  const userId = JSON.parse(localStorage.getItem("user")).user.id ?? null;

  const [lastMessageUser, setlastMessageUser] = useState("");

  const [botResume, setBotResume] = useState([
    {
      userId: userId,
      step: null,
      newMessageUser: null,
    },
  ]);

  useState(() => {
    if (id_person === userId) {
      setIsMyMessage(true);
    }
  }, []);

  const handleClick = (step, message) => {
    setBotResume({
      userId: userId,
      step: step,
      newMessageUser: message,
    });

    setlastMessageUser(botResume.newMessageUser);
  };

  useEffect(() => {
    const socket = io("http://localhost:3000/user", {
      auth: {
        token,
      },
    });
    console.log("in useEffect");
    socket.emit("response-message-bot", botResume);
  }, [lastMessageUser != botResume.newMessageUser]);

  return (
    <div
      className="cursor message message--left"
      onClick={() => handleClick(step, message)}
    >
      <div className="message__main">
        <div className="message__content">
          <p className="message--right__content__text message__content__text">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BotMessage;
