import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";

import { Input } from "@nextui-org/react";
import { PaperPlaneTilt } from "phosphor-react";
import { SendButton } from "./sendButton";
import MessageList from "./messageList";

const ChatBox = (props) => {
  const { id } = props;

  const token = JSON.parse(localStorage.getItem("user")).token ?? null;
  const user = JSON.parse(localStorage.getItem("user")).user ?? null;
  const [messages, setMessage] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const params = useParams();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  useEffect(() => {
    const socket = io("http://localhost:3000/user", {
      auth: {
        token,
      },
    });
    socket.on("send-message", (message, room, user) => {
      if (room === id) {
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

    socket.on("delete-room", (room) => {
      if (params.roomId == room) {
        navigate("/chats");
      }
    });

    socket.on("delete-user", (idOfUser, room) => {
      if (params.roomId == room && idOfUser == user.id) {
        navigate("/chats");
        queryClient.invalidateQueries("salons");
      }
    });
  }, []);

  const sendMessage = () => {
    if (inputMessage) {
      const socket = io("http://localhost:3000/user", {
        auth: {
          token,
        },
      });

      socket.emit("send-message", inputMessage, id, user);
    }
    setInputMessage("");
  };

  useEffect(() => {
    setMessage([]);
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
      <MessageList messages={messages} />

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
