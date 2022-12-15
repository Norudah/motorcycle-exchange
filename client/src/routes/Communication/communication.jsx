import { Grid, Spacer } from "@nextui-org/react";
import { Card } from "antd";
import React, { useState } from "react";
import CardAdvisor from "../../components/Card/card_advisor";

const Communication = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="main">
      <Spacer y={3} />
      <h1>Conseiller de vente disponible</h1>
      <Spacer y={1} />

      <Grid.Container gap={2} justify="center">
        {advisor.map((advisor) => (
          <Grid sm={3}>
            <CardAdvisor
              firstname={advisor.firstname}
              lastname={advisor.lastname}
              id={advisor.id}
            />
          </Grid>
        ))}
      </Grid.Container>
    </div>
  );
};

export default Communication;
