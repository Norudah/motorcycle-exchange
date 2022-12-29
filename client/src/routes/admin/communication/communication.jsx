import { Grid, Spacer, Switch, Text } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { Row } from "antd";
import { BellSlash, Bell } from "phosphor-react";
import { useState } from "react";
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

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user?.id;

  const [isActive, setIsActive] = useState(false);

  const mutation = useMutation(updateAvailability, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  async function updateAvailability() {
    console.log(userId, !isActive);
    const res = await fetch(
      `http://localhost:3000/communication/available/advisor/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          available: !isActive,
        }),
      }
    );
    return res.json();
  }

  const handleSwitch = () => {
    setIsActive(!isActive);
    mutation.mutate();
  };

  return (
    <div className="main">
      <Spacer y={3} />

      <h1>Communication request</h1>

      <Spacer y={1} />

      <Row>
        <Text h3>Show me to User : </Text>
        <Spacer x={1} />
        <Switch
          color="error"
          size="xl"
          iconOn={<BellSlash />}
          iconOff={<Bell />}
          checked={!isActive}
          onChange={handleSwitch}
        />
      </Row>

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
