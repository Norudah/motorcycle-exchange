import { Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

import { PaperPlaneTilt } from "phosphor-react";
import { SendButton } from "./sendButton";
import Message from "./message";
import MessageList from "./messageList";
import { useParams } from "react-router-dom";

const ChatBox = (props) => {
  const { id } = props;
  const [messages, setMessage] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const params = useParams(id);

  useEffect(() => {
    setMessage([]);
  }, [params]);

  useEffect(() => {
    socket.emit("join-room", id);
    console.log("SocketIO: join-room", id);
  }, [id]);

  // Lisen to message from server
  useEffect(() => {
    socket.on("message", (message, room, from, messageId, date) => {
      setMessage((messages) => [
        ...messages,
        {
          id: messageId,
          id_person: from,
          message: message,
          date: date,
        },
      ]);
    });
  }, []);

  // Send message to server
  const sendMessage = () => {
    if (inputMessage) {
      socket.emit("send-message", inputMessage, id);
      setMessage((messages) => [
        ...messages,
        {
          id: Date.now(),
          id_person: 1,
          message: inputMessage,
          date: Date.now(),
        },
      ]);
      setInputMessage("");
    }
  };

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
