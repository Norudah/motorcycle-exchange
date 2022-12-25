import MessageInput from "./messageInput";
import MessageList from "./messageList";

const ChatBox = (props) => {
  const { messages } = props;

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
