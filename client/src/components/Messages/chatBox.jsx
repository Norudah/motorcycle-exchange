import { Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

import { PaperPlaneTilt } from "phosphor-react";
import { SendButton } from "./sendButton";
// import MessageInput from "./messageInput";
import MessageList from "./messageList";
import Message from "./message";

const ChatBox = (props) => {
  const { id } = props;
  const [messages, setMessage] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    socket.emit("join-room", id);
    console.log("SocketIO: join-room", id);
  }, [id]);

  // ecouter les messages du salon
  useEffect(() => {
    socket.on("message", (message, room, from, messageId, date) => {
      console.log("Receive from Room : ", room, " -> ", message);
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
      {/* <MessageList messages={messages} /> */}

      <div className="messageList">
        {messages.map((message) => (
          <Message
            key={message.id}
            id={message.id}
            id_person={message.id_person}
            message={message.message}
            firstname={message.firstname}
            lastname={message.lastname}
            date={message.date}
          />
        ))}
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
