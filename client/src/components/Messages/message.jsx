import React, { useState } from "react";

const Message = (props) => {
  const { message, id, firstname, lastname, date } = props;
  const [show, setShow] = useState(false);

  return (
    <div className="message">
      <div className="message__header">
        <h3 className="message__header__name">
          {firstname} {lastname}
        </h3>
        <p className="message__header__date">{date}</p>
      </div>
      <div className="message__content">
        <p className="message__content__text">{message}</p>
      </div>
    </div>
  );
};

export default Message;
