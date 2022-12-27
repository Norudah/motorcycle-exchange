import { useState } from "react";

const Message = (props) => {
  const { message, id, userName, date, id_person } = props;
  const [show, setShow] = useState(false);

  // convert date to string
  const dateToString = (date) => {
    const dateObj = new Date(date);
    const dateStr = dateObj.toLocaleString();
    return dateStr;
  };

  return (
    <div
      className={
        id_person === 1 ? "message message--right" : "message message--left"
      }
    >
      <div className="message__main">
        <div className="message__header">
          {id_person === 1 ? null : (
            <p className="message__header">{userName}</p>
          )}
        </div>
        <p className="message__header__date ">{dateToString(date)}</p>

        <div className="message__content">
          <p
            className={
              id_person === 1
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
