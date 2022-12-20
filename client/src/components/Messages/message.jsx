import React, { useState } from "react";

const Message = (props) => {
  const { message, id, firstname, lastname, date, id_person } = props;
  const [show, setShow] = useState(false);

  console.table({ message, id_person });

  return (
    <div
      className={
        id_person === 1 ? "message message--right" : "message message--left"
      }
    >
      <div className="message__main">
        <div className="message__header">
          <h3>
            {firstname} {lastname}
          </h3>
        </div>
        <p className="message__header__date">{date}</p>

        <div className="message__content">
          <p className="message__content__text">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Message;
