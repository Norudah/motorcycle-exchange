import { Grid, Spacer } from "@nextui-org/react";
import CardAdminAdvisor from "../../../components/Card/card_admin_advisor";

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
      <h1>Communication request</h1>
      <Spacer y={1} />

      <Grid.Container gap={2} justify="center">
        {advisor.map((advisor) => (
          <Grid xs={4} sm={3} key={advisor.id}>
            <CardAdminAdvisor
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
