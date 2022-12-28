import { useState } from "react";

const Message = (props) => {
  const { message, id, firstname, lastname, date, id_person } = props;
  const [show, setShow] = useState(false);
  const [isMyMessage, setIsMyMessage] = useState(false);

  const userId = JSON.parse(localStorage.getItem("user")).user.id ?? null;

  useState(() => {
    if (id_person === userId) {
      setIsMyMessage(true);
    }
  }, []);

  const dateToString = (date) => {
    const dateObj = new Date(date);
    const dateStr = dateObj.toLocaleString();
    return dateStr;
  };

  return (
    <div
      className={
        isMyMessage ? "message message--right" : "message message--left"
      }
    >
      <div className="message__main">
        <div className="message__header">
          {isMyMessage ? null : (
            <p className="message__header">{(firstname, lastname)}</p>
          )}
        </div>
        <p className="message__header__date ">{dateToString(date)}</p>

        <div className="message__content">
          <p
            className={
              isMyMessage
                ? "message--right__content__text message__content__text"
                : "message--left__content__text message__content__text"
            }
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Message;
