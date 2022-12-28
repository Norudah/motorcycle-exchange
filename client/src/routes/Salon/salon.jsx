import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { io } from "socket.io-client";

import { Grid, Spacer } from "@nextui-org/react";
import CardSalon from "../../components/Card/card_salon";

const Communication = () => {
  const token = JSON.parse(localStorage.getItem("user")).token ?? null;
  const [result, setResult] = useState([]);

  // Fetch Salon data from API
  const { data, refetch } = useQuery(["salon"], async () => {
    const response = await fetch("http://localhost:3000/salon");
    return response.json();
  });

  useEffect(() => {
    const socket = io("http://localhost:3000/user", {
      auth: {
        token,
      },
    });

    socket.on("delete-room", (room) => {
      refetch();
      console.log("delete-room", room, "REFETCH!");
    });
  }, []);

  useEffect(() => {
    setResult(data?.salon);
  }, [data]);

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
                nbPerson={salon?.nbUser}
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
