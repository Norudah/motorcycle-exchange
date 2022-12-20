import React, { useState } from "react";
import { Avatar, Card, Col, Grid, Row, Spacer, Text } from "@nextui-org/react";
import ListPeople from "../../components/List/listPeople";
import ChatBox from "../../components/Messages/chatBox";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      id_person: 1,
      firstname: "Romain",
      lastname: "Pierron",
      message: "Hello, how are you ?",
      date: "2021-05-01",
    },
    {
      id: 2,
      id_person: 2,
      firstname: "Rayan",
      lastname: "Lekebab",
      message: "Rallo team , im fine and you ?",
      date: "2021-05-01",
    },
    {
      id: 3,
      id_person: 1,
      firstname: "Romain",
      lastname: "Pierron",
      message: "I'm fine too, thanks for asking",
      date: "2021-05-01",
    },
  ]);

  const [people, setPeople] = useState([
    {
      id: 1,
      firstname: "Romain",
      lastname: "Pierron",
    },
    {
      id: 2,
      firstname: "John",
      lastname: "Leclerc",
    },
  ]);

  return (
    <div>
      <Grid.Container>
        <Grid xs={3}>
          <Col className="sticky-main">
            {people.map((person) => (
              <ListPeople
                key={person.id}
                firstname={person.firstname}
                lastname={person.lastname}
              />
            ))}
          </Col>
        </Grid>
        <Grid xs={9}>
          <Col style={{}}>
            <ChatBox messages={messages} />
          </Col>
        </Grid>
      </Grid.Container>
    </div>
  );
};

export default Chat;
