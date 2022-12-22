import React, { useEffect, useState } from "react";
import { Card, Col, Row, Button, Text, Spacer } from "@nextui-org/react";
import { Gear, TrashSimple } from "phosphor-react";
import ModalSalon from "../Modal/modal_salon";

const CardAdvisor = (props) => {
  const { name, nbPerson, maxPerson, id } = props;

  const [visible, setVisible] = useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
  };

  return (
    <Card css={{ w: "100%", h: "220px" }}>
      <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
        <Col>
          <Row justify="end">
            <Button
              flat
              auto
              rounded
              color="warning"
              icon={<Gear />}
              onClick={handler}
            />
            <ModalSalon
              key={id}
              id={id}
              visible={visible}
              closeHandler={closeHandler}
              name={name}
              maxPerson={maxPerson}
            />
            <Spacer x={0.5} />
            <Button flat auto rounded color="error" icon={<TrashSimple />} />
          </Row>
          <Row justify="center">
            <Text h3 color="black" position="center">
              {name}
            </Text>
          </Row>
          <Row justify="center">
            <Text>
              {nbPerson} / {maxPerson} people
            </Text>
          </Row>
        </Col>
      </Card.Header>

      <Card.Footer
        isBlurred
        css={{
          position: "absolute",
          bgBlur: "#ffffff66",
          borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
          bottom: 0,
          zIndex: 1,
        }}
      >
        <Row>
          <Col>
            <Spacer y={0.5} />
            <Row justify="center">
              <Button flat auto rounded color="secondary">
                <Text
                  css={{ color: "inherit" }}
                  size={12}
                  weight="bold"
                  transform="uppercase"
                >
                  Join the salon
                </Text>
              </Button>
            </Row>
            <Spacer y={0.5} />
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default CardAdvisor;
