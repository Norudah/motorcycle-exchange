import { Avatar, Card, Col, Grid, Row, Spacer, Text } from "@nextui-org/react";
import React, { useState } from "react";
import ListPeople from "../../components/List/listPeople";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      firstname: "John",
      lastname: "Doe",
      message: "Hello, how are you ?",
      date: "2021-05-01",
    },
    {
      id: 2,
      firstname: "Jane",
      lastname: "Doe",
      message: "Hello, how are you ?",
      date: "2021-05-01",
    },
  ]);

  const [people, setPeople] = useState([
    {
      id: 1,
      firstname: "John",
      lastname: "Doe",
    },
    {
      id: 2,
      firstname: "Jane",
      lastname: "Doe",
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
            <p>pouet</p>
          </Col>
        </Grid>
      </Grid.Container>
    </div>
  );
};

export default Chat;
