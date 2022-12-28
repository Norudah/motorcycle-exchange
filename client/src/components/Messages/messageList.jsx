import Message from "./message";

const MessageList = (props) => {
  const { messages } = props;

  if (messages.length === 0) {
    return <div className="messageList">No messages</div>;
  }

  return (
    <div className="messageList">
      {messages.map((message) => (
        <Message
          key={message.id}
          id={message.id}
          id_person={message.id_person}
          message={message.message}
          date={message.date}
          firstname={message.userLastname}
          lastname={message.userLastname}
        />
      ))}
    </div>
  );
};

export default MessageList;
