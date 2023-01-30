import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const BotMessage = (props) => {
  const { message, id_person, step, anwers } = props;

  const token = JSON.parse(localStorage.getItem("user")).token ?? null;
  const userId = JSON.parse(localStorage.getItem("user")).user.id ?? null;

  const [lastMessageUser, setlastMessageUser] = useState("");

  const [isMyMessage, setIsMyMessage] = useState(false);

  const [botResume, setBotResume] = useState([
    {
      userId: userId,
      step: null,
      newMessageUser: null,
      anwers: null,
    },
  ]);

  useState(() => {
    if (anwers === 1) {
      setIsMyMessage(true);
    }
  }, []);

  const handleClick = (step, message) => {
    console.log("click");
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
    socket.emit("response-message-bot", botResume);
  }, [lastMessageUser != botResume.newMessageUser]);

  return (
    <div
      className={
        anwers === 1
          ? "message message--right cursor"
          : "message message--left cursor"
      }
      onClick={() => handleClick(step, message)}
    >
      <div className="message__main">
        <div className="message__content">
          <p
            className={
              anwers === 1
                ? "message--right__content__text message__content__text"
                : "message--left__content__text message__content__text"
            }
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BotMessage;
