import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import { Input } from "@nextui-org/react";
import { PaperPlaneTilt } from "phosphor-react";
import MessageList from "./messageList";
import MessageBotList from "./messageBotList";
import { SendButton } from "./sendButton";
import BotMessage from "./botMessage";

const ChatBox = (props) => {
  const { params } = props;

  const token = JSON.parse(localStorage.getItem("user")).token ?? null;
  const user = JSON.parse(localStorage.getItem("user")).user ?? null;

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [messages, setMessage] = useState([]);
  const [botMessages, setBotMessage] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [usersInRoom, setUsersInRoom] = useState([]);

  if (params !== "bot") {
    const { data } = useQuery(["usersInRoom", params], fetchUserInRoom, {
      onSuccess: (data) => {
        setUsersInRoom(data?.salon?.users);

        if (
          !data?.salon?.users?.some((userInRoom) => userInRoom.id === user.id)
        ) {
          navigate("/chats");
        } else {
          console.log("ok");
        }
      },
      onError: (error) => {
        console.log(error);
      },
    });
  }

  async function fetchUserInRoom() {
    const response = await fetch(
      `http://localhost:3000/salon/users/${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  }

  useEffect(() => {
    const socket = io("http://localhost:3000/user", {
      auth: {
        token,
      },
    });
    socket.on("send-message", (message, room, user) => {
      if (params === room) {
        setMessage((messages) => [
          ...messages,
          {
            id: Date.now(),
            id_person: user.id,
            message: message,
            date: Date.now(),
            userFirstname: user.firstName,
            userLastname: user.lastName,
          },
        ]);
      }
    });

    socket.on("welcome-bot", (botResume, response) => {
      if (botResume.userId === user.id) {
        response.map((message) => {
          setBotMessage((botMessages) => [
            ...botMessages,
            {
              id: Date.now(),
              id_person: "bot",
              message: message.message,
              step: message.step,
            },
          ]);
        });
      }
    });

    socket.on("delete-room", (room) => {
      if (params == room) {
        navigate("/chats");
      }
    });

    socket.on("delete-user", (idOfUser, room) => {
      if (params == room && idOfUser == user.id) {
        navigate("/chats");
        queryClient.invalidateQueries("salons");
      }
    });
  }, [params]);

  useEffect(() => {
    const socket = io("http://localhost:3000/user", {
      auth: {
        token,
      },
    });

    socket.on("send-bot-message", (botResume, response) => {
      if (botResume.userId === user.id) {
        response.map((message) => {
          setBotMessage((botMessages) => [
            ...botMessages,
            {
              id: Date.now(),
              id_person: "bot",
              message: message.message,
              step: message.step,
            },
          ]);
        });
      }
    });
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:3000/user", {
      auth: {
        token,
      },
    });

    socket.on("clear-bot", () => {
      console.log("clear");
      setBotMessage([]);
    });
  }, []);

  const sendMessage = () => {
    if (inputMessage) {
      const socket = io("http://localhost:3000/user", {
        auth: {
          token,
        },
      });

      socket.emit("send-message", inputMessage, params, user);
    }
    setInputMessage("");
  };

  useEffect(() => {
    setMessage([]);
  }, [params]);

  useEffect(() => {
    setBotMessage([]);
  }, [params]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputMessage]);

  return (
    <div className="mainChatbox">
      <div className="messageList">
        <MessageList messages={messages} />
        <MessageBotList messages={botMessages} />
      </div>

      <div className="messageInput">
        <Input
          onChange={(e) => setInputMessage(e.target.value)}
          value={inputMessage}
          clearable
          contentRightStyling={false}
          placeholder="Type your message..."
          contentRight={
            <SendButton onClick={sendMessage}>
              <PaperPlaneTilt size={20} color="#d0d2d1" weight="light" />
            </SendButton>
          }
        />
      </div>
    </div>
  );
};

export default ChatBox;
