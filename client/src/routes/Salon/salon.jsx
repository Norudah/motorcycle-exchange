import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { Grid, Spacer } from "@nextui-org/react";
import CardSalon from "../../components/Card/card_salon";

const Communication = () => {
  const [result, setResult] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user.id;
  const token = user.token;

  console.log("POUET", token);

  // Fetch Salon data from API
  const { data, refetch } = useQuery(["salon"], async () => {
    const response = await fetch("http://localhost:3000/salon", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.json();
  });

  useEffect(() => {
    setResult(data?.salon);
  }, [data]);

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
