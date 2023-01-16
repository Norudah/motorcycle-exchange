import { Button, Grid, Spacer } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { Row } from "antd";
import { useEffect, useState } from "react";
import CardSalon from "../../../components/Card/card_admin_salon";
import ModalSalonAdd from "../../../components/Modal/modal_salon_add";

const Communication = () => {
  const [result, setResult] = useState([]);
  const [visible, setVisible] = useState(false);

  const handler = () => setVisible(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const userId = user?.user.id;

  const closeHandler = () => {
    setVisible(false);
  };

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
    if (data?.salon) {
      const result = data?.salon.filter((salon) => salon.type === "ROOM");
      setResult(result);
    }
  }, [data]);

  return (
    <div className="main">
      <Spacer y={3} />
      <h1>Chat room online</h1>
      <Spacer y={1} />
      <Row>
        <Button flat color="secondary" auto onPress={handler}>
          Add a new chat room
        </Button>
      </Row>
      <ModalSalonAdd visible={visible} closeHandler={closeHandler} refetch={refetch()} />
      <Spacer y={1} />

      {result?.length > 0 ? (
        <Grid.Container gap={2} justify="center">
          {result.map((salon) => (
            <Grid xs={4} sm={3}>
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
