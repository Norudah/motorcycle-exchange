import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { io } from "socket.io-client";

import { Grid, Spacer } from "@nextui-org/react";
import CardAdvisor from "../../components/Card/card_advisor";

const Communication = () => {
  const advisor = [
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
    {
      id: 3,
      firstname: "Jean",
      lastname: "Didier",
    },
  ];

  const token = JSON.parse(localStorage.getItem("user")).token ?? null;
  const [result, setResult] = useState([]);

  // Fetch Salon data from API

  async function fetchAdvisor() {
    const response = await fetch(
      "http://localhost:3000/communication/advisor",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  }

  const { refetch } = useQuery(["salon"], fetchAdvisor, {
    onSuccess: (data) => {
      setResult(data?.users);
    },
  });

  return (
    <div className="main">
      <Spacer y={3} />
      <h1>Communication request</h1>
      <h4>Advisor online</h4>
      <Spacer y={1} />

      <Grid.Container gap={2} justify="center">
        {result.map(
          (advisor) => (
            console.table(advisor),
            (
              <Grid xs={4} sm={3} key={advisor.id}>
                <CardAdvisor
                  id={advisor.id}
                  firstname={advisor.firstName}
                  lastname={advisor.lastName}
                />
              </Grid>
            )
          )
        )}

        {result?.length === 0 && (
          <h4>There is no advisor online at the moment</h4>
        )}
      </Grid.Container>

      <Spacer y={3} />
    </div>
  );
};

export default Communication;
