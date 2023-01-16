import { Input } from "@nextui-org/react";

import { PaperPlaneTilt } from "phosphor-react";
import { SendButton } from "./sendButton";

const MessageInput = () => {
  return (
    <div className="messageInput">
      <Input
        clearable
        contentRightStyling={false}
        placeholder="Type your message..."
        contentRight={
          <SendButton>
            <PaperPlaneTilt size={20} color="#d0d2d1" weight="light" />
          </SendButton>
        }
      />
    </div>
  );
};

export default MessageInput;
