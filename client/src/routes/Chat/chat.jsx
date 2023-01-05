import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { Col, Grid, Spacer } from "@nextui-org/react";
import { useParams } from "react-router-dom";
import ListPeople from "../../components/List/listPeople";
import ListSalon from "../../components/List/listSalon";
import ChatBox from "../../components/Messages/chatBox";

const Chat = () => {
  const [result, setResult] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const userId = user?.user.id;

  const queryClient = useQueryClient();
  const params = useParams();
  const { roomId, contactId } = useParams();

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
              result.map((salon) =>
                salon.type === "ROOM" ? (
                  <ListSalon
                    key={salon.id}
                    id={salon.id}
                    name={salon.name}
                    nbMaxUser={salon.nbMaxUser}
                    nbUser={salon.nbUser}
                  />
                ) : null
              )
            ) : (
              <p>No chat room joined</p>
            )}

            <Spacer y={1} />
            <h4>People</h4>
            {result.map((person) =>
              person.type === "PRIVATE" ? (
                <ListPeople key={person.id} id={person.id} name={person.name} />
              ) : null
            )}
          </Col>
        </Grid>
        <Grid xs={9}>
          <Col>
            <ChatBox params={roomId ? roomId : contactId} />
          </Col>
        </Grid>
      </Grid.Container>
    </div>
  );
};

export default Chat;
