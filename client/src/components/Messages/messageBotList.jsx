import MessageBot from "./botMessage";

const messageBotList = (props) => {
  const { messages } = props;

  return (
    <div>
      {messages.map((message) => (
        <MessageBot
          key={message.message}
          id_person={message.id_person}
          message={message.message}
          step={message.step}
          anwers={message.anwers}
        />
      ))}
    </div>
  );
};

export default messageBotList;
