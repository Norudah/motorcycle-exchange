import { Grid, Spacer } from "@nextui-org/react";
import CardSalon from "../../components/Card/card_salon";

import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

const Communication = () => {
  const salon = [
    {
      id: 1,
      name: "Patapatapon",
      nbPerson: "2",
      maxPerson: "4",
    },
    {
      id: 2,
      name: "PonPon",
      nbPerson: "10",
      maxPerson: "250",
    },
  ];

  socket.on("connect", () => {
    console.log("User connected with socketId: ", socket.id);
  });

  socket.on("message", (message) => {
    console.log(`Received message from server: ${message}`);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  socket.emit("message", "Hello server!");

  return (
    <div className="main">
      <Spacer y={3} />
      <h1>Chat room online</h1>
      <Spacer y={1} />

      <Grid.Container gap={2} justify="center">
        {salon.map((salon) => (
          <Grid xs={4} sm={3} key={salon.id}>
            <CardSalon
              key={salon.id}
              id={salon.id}
              name={salon.name}
              nbPerson={salon.nbPerson}
              maxPerson={salon.maxPerson}
            />
          </Grid>
        ))}
      </Grid.Container>

      <Spacer y={3} />
    </div>
  );
};

export default Communication;
