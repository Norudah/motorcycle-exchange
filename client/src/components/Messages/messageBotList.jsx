import MessageBot from "./botMessage";

const messageBotList = (props) => {
  const { messages } = props;

  return (
    <div>
      {messages.map((message) => (
        <MessageBot
          key={message.id}
          id_person={message.id_person}
          message={message.message}
          step={message.step}
        />
      ))}
    </div>
  );
};

export default messageBotList;
