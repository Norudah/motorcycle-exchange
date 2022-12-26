import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Col, Grid } from "@nextui-org/react";
import ListPeople from "../../components/List/listPeople";
import ChatBox from "../../components/Messages/chatBox";
import ListSalon from "../../components/List/listSalon";
import { useParams } from "react-router-dom";
import { Chats } from "phosphor-react";

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

  const { contactId, roomId } = useParams();

  // fetch list of salon joined by user
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user.id;

  const { data } = useQuery(["salon"], async () => {
    const response = await fetch(`http://localhost:3000/salon/${userId}`);
    return response.json();
  });

  const result = data?.salon;

  return (
    <div>
      <Grid.Container>
        <Grid xs={3}>
          <Col className="sticky-main">
            <h4>Chat room</h4>
            {result?.length > 0 ? (
              result.map((salon) => (
                <ListSalon
                  key={salon.id}
                  id={salon.id}
                  name={salon.name}
                  nbMaxUser={salon.nbMaxUser}
                  nbUser={salon.nbUser}
                />
              ))
            ) : (
              <p>No chat room joined</p>
            )}
            <h4>People</h4>
            {people.map((person) => (
              <ListPeople
                key={person.id}
                id={person.id}
                firstname={person.firstname}
                lastname={person.lastname}
              />
            ))}
          </Col>
        </Grid>
        <Grid xs={9}>
          {/* <ChatBox messages={messages} id={contactId || roomId} /> */}
          <Col>
            {contactId || roomId ? (
              <ChatBox id={contactId || roomId} />
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Chats size={80} color="#091a12" weight="light" />
                <h2>Choose a contact or a chat room</h2>
              </div>
            )}
          </Col>
        </Grid>
      </Grid.Container>
    </div>
  );
};

export default Chat;
