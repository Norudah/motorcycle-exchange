import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

import { Col, Grid } from "@nextui-org/react";
import { Chats } from "phosphor-react";
import ListPeople from "../../components/List/listPeople";
import CardChatBot from "../../components/List/cardChatBot";
import ChatBox from "../../components/Messages/chatBox";
import ListSalon from "../../components/List/listSalon";

const Chat = () => {
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

  const [result, setResult] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const userId = user?.user.id;

  const queryClient = useQueryClient();

  const { refetch } = useQuery(["salon"], fetchSalon, {
    onSuccess: (data) => {
      setResult(data.salon);
    },
  });

  async function fetchSalon() {
    const response = await fetch(`http://localhost:3000/salon/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    const socket = io("http://localhost:3000/user", {
      auth: {
        token,
      },
    });

    socket.on("delete-user", (idOfUser) => {
      console.table({
        idRecu: idOfUser,
        userId: userId,
      });
      if (idOfUser === userId) {
        refetch();
        queryClient.invalidateQueries("salons");
      }
    });
  }, []);

  return (
    <div>
      <Grid.Container>
        <Grid xs={3}>
          <Col className="sticky-main">
            <h4>Chat room</h4>
            {result?.length > 0 ? (
              result.map((salon) => <ListSalon key={salon.id} id={salon.id} name={salon.name} nbMaxUser={salon.nbMaxUser} nbUser={salon.nbUser} />)
            ) : (
              <p>No chat room joined</p>
            )}
            <h4>People</h4>
            {people.map((person) => (
              <ListPeople key={person.id} id={person.id} firstname={person.firstname} lastname={person.lastname} />
            ))}
            <CardChatBot 
              id="bot"
              firstname="chatBot"
            />
          </Col>
        </Grid>
        <Grid xs={9}>
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
                }}>
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
