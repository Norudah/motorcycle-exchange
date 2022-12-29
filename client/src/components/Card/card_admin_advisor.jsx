import { Card, Col, Row, Button, Text, Spacer } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const CardAdvisor = (props) => {
  const { userId, status, id } = props;

  const token = JSON.parse(localStorage.getItem("user")).token ?? null;
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();

  //fetch User with id
  const { data: user } = useQuery(["user", id], fetchUser, {
    onSuccess: (data) => {
      setFirstName(data.user.firstName);
      setLastName(data.user.lastName);
    },
  });

  async function fetchUser() {
    const response = await fetch(
      `http://localhost:3000/communication/advisor/${userId}`,
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

  return (
    <Card css={{ w: "100%", h: "150px" }}>
      <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
        <Col>
          <Row justify="center">
            <Text h3 color="black" position="center">
              {firstName} {lastName}
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
              <Button flat auto rounded color="success">
                <Text
                  css={{ color: "inherit" }}
                  size={12}
                  weight="bold"
                  transform="uppercase"
                >
                  Accept
                </Text>
              </Button>
              <Spacer x={1} />
              <Button flat auto rounded color="error">
                <Text
                  css={{ color: "inherit" }}
                  size={12}
                  weight="bold"
                  transform="uppercase"
                >
                  Refuse
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
