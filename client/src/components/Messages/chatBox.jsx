import React, { useState } from "react";
import MessageInput from "./messageInput";
import MessageList from "./messageList";

const ChatBox = (props) => {
  const { messages } = props;

  return (
    <div className="mainChatbox">
      <MessageList messages={messages} />
      <MessageInput />
    </div>
  );
};

export default ChatBox;
