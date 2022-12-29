import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { Card, Col, Row, Button, Text } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";

const CardAdvisor = (props) => {
  const { firstname, lastname, id } = props;

  const token = JSON.parse(localStorage.getItem("user")).token ?? null;
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io("http://localhost:3000/user", {
      auth: {
        token: token,
      },
    });
    socket.on("admin-update-availability", (idAdmin) => {
      if (idAdmin === id) {
        queryClient.invalidateQueries("advisors");
      }
    });
  }, []);

  return (
    <Card css={{ w: "100%", h: "150px" }}>
      <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
        <Col>
          <Row justify="center">
            <Text h3 color="black" position="center">
              {firstname} {lastname}
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
            <Row justify="center">
              <Button flat auto rounded color="secondary">
                <Text
                  css={{ color: "inherit" }}
                  size={12}
                  weight="bold"
                  transform="uppercase"
                >
                  Chat with me
                </Text>
              </Button>
            </Row>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default CardAdvisor;
