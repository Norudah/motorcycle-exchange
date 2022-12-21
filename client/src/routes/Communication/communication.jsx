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

  return (
    <div className="main">
      <Spacer y={3} />
      <h1>Conseiller de vente disponible</h1>
      <Spacer y={1} />

      <Grid.Container gap={2} justify="center">
        {advisor.map((advisor) => (
          <Grid xs={4} sm={3} key={advisor.id}>
            <CardAdvisor
              id={advisor.id}
              firstname={advisor.firstname}
              lastname={advisor.lastname}
            />
          </Grid>
        ))}
      </Grid.Container>

      <Spacer y={3} />
    </div>
  );
};

export default Communication;
