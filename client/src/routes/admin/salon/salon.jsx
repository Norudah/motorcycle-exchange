import { Grid, Spacer, Modal, Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import CardSalon from "../../../components/Card/card_admin_salon";
import { useQuery } from "@tanstack/react-query";

import ModalSalonAdd from "../../../components/Modal/modal_salon_add";
import { Row } from "antd";

const Communication = () => {
  const [visible, setVisible] = useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
  };

  // Fetch Salon data from API
  const { data, refetch } = useQuery(["salon"], async () => {
    const response = await fetch("http://localhost:3000/salon");
    return response.json();
  });
  const result = data?.salon;

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
      <ModalSalonAdd
        visible={visible}
        closeHandler={closeHandler}
        refetch={refetch()}
      />
      <Spacer y={1} />

      {result?.length > 0 ? (
        <Grid.Container gap={2} justify="center">
          {result.map((salon) => (
            <Grid xs={4} sm={3} key={salon.id}>
              <CardSalon
                key={salon?.id}
                id={salon?.id}
                name={salon?.name}
                nbPerson={salon?.nbPerson}
                maxPerson={salon?.nbMaxUser}
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
