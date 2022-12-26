import MessageInput from "./messageInput";
import MessageList from "./messageList";

import { io } from "socket.io-client";
import { useState } from "react";

const ChatBox = (props) => {
  const { id } = props;

  // const [messages, setMessages] = useState(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      id_person: 1,
      firstname: "Romain",
      lastname: "Pierron",
      message: "Hello, how are you ?",
      date: "2021-05-01",
    },
    {
      id: 2,
      id_person: 2,
      firstname: "Rayan",
      lastname: "Lekebab",
      message: "Rallo team , im fine and you ?",
      date: "2021-05-01",
    },
  ]);

  const socket = io("http://localhost:3000");
  // connect to the room = id
  socket.emit("joinRoom", id);

  // if joinRoom is successful, get the messages
  socket.on("joinRoom", (messages) => {
    console.log(messages);
  });

  if (!messages) {
    return <div></div>;
  }

  return (
    <div className="mainChatbox">
      <MessageList messages={messages} />
      <MessageInput />
    </div>
  );
};

export default ChatBox;
