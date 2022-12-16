import React, { useState } from "react";
import Message from "./message";

const MessageList = (props) => {
  const { messages } = props;

  return (
    <div className="messageList">
      {messages.map((message) => (
        <Message
          message={message.message}
          id={message.id}
          firstname={message.firstname}
          lastname={message.lastname}
          date={message.date}
        />
      ))}
    </div>
  );
};

export default MessageList;
