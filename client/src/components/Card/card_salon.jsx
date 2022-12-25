import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, Col, Row, Button, Text, Spacer } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const CardAdvisor = (props) => {
  const { name, nbPerson, nbMaxUser, id, userId, users } = props;

  const [isInSalon, setIsInSalon] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userInSalon = users?.find((user) => user.id === userId);

  // join salon
  const mutation = useMutation(joinSalon, {
    onSuccess: () => {
      setIsInSalon(true);
    },
  });

  async function joinSalon() {
    const res = await fetch(`http://localhost:3000/salon/join/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userId }),
    });
  }

  // quit salon
  const mutationQuit = useMutation(quitSalon, {
    onSuccess: () => {
      setIsInSalon(false);
    },
  });

  async function quitSalon() {
    const res = await fetch(`http://localhost:3000/salon/leave/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userId }),
    });
  }

  useEffect(() => {
    if (userInSalon) {
      setIsInSalon(true);
    }
  }, [userInSalon]);

  function submitHandler() {
    mutation.mutate(id);
  }

  function submitHandlerQuit() {
    mutationQuit.mutate(id);
  }

  return (
    <Card css={{ w: "100%", h: "150px" }}>
      <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
        <Col>
          <Row justify="center">
            <Text h3 color="black" position="center">
              {name}
            </Text>
          </Row>
          <Row justify="center">
            <Text>
              {nbPerson ? nbPerson : 0} / {nbMaxUser} people
            </Text>
          </Row>
        </Col>
      </Card.Header>

      <Spacer y={1} />

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
              {!isInSalon ? (
                <Button
                  flat
                  auto
                  rounded
                  color="secondary"
                  onPress={submitHandler}
                >
                  <Text
                    css={{ color: "inherit" }}
                    size={12}
                    weight="bold"
                    transform="uppercase"
                  >
                    Join the salon
                  </Text>
                </Button>
              ) : (
                <Button
                  flat
                  auto
                  rounded
                  color="error"
                  onPress={submitHandlerQuit}
                >
                  <Text
                    css={{ color: "inherit" }}
                    size={12}
                    weight="bold"
                    transform="uppercase"
                  >
                    Quit salon
                  </Text>
                </Button>
              )}
            </Row>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default CardAdvisor;
