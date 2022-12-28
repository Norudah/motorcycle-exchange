import { Grid, Spacer } from "@nextui-org/react";
import CardSalon from "../../components/Card/card_salon";

import { useQuery } from "@tanstack/react-query";
import { io } from "socket.io-client";

const Communication = () => {
  const socket = io("http://localhost:3000");

  socket.on("connect", () => {
    console.log("User connected with socketId: ", socket.id);
  });

  socket.on("message", (message) => {
    console.log(`Received message from server: ${message}`);
  });

  socket.emit("message", "Hello server!");

  // Fetch Salon data from API
  const { data, refetch } = useQuery(["salon"], async () => {
    const response = await fetch("http://localhost:3000/salon");
    return response.json();
  });
  const result = data?.salon;

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user.id;

  return (
    <div className="main">
      <Spacer y={3} />
      <h1>Chat room online</h1>
      <Spacer y={1} />

      {result?.length > 0 ? (
        <Grid.Container gap={2} justify="center">
          {result.map((salon) => (
            <Grid xs={4} sm={3} key={salon.id}>
              <CardSalon
                key={salon?.id}
                id={salon?.id}
                userId={userId}
                name={salon?.name}
                nbPerson={salon?.nbPerson}
                nbMaxUser={salon?.nbMaxUser}
                users={salon?.users}
              />
            </Grid>
          ))}
        </Grid.Container>
      ) : (
        <h2>No chat room online</h2>
      )}

      <Spacer y={3} />
    </div>
  );
};

export default Communication;
