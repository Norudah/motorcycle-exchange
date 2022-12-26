import { useState } from "react";

const Message = (props) => {
  const { message, id, firstname, lastname, date, id_person } = props;
  const [show, setShow] = useState(false);

  return (
    <div
      className={
        id_person === 1 ? "message message--right" : "message message--left"
      }
    >
      <div className="message__main">
        <div className="message__header">
          {id_person === 1 ? null : (
            <h6>
              {firstname} {lastname}
            </h6>
          )}
        </div>
        <p className="message__header__date">{date}</p>

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
