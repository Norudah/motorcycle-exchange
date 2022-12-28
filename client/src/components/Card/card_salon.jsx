import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";

import { Card, Col, Row, Button, Text, Spacer } from "@nextui-org/react";

const CardAdvisor = (props) => {
  const { name, nbPerson, nbMaxUser, id, userId, users } = props;

  const token = JSON.parse(localStorage.getItem("user")).token ?? null;
  const [isDisabled, setIsDisabled] = useState(false);
  const [isInSalon, setIsInSalon] = useState(false);
  const queryClient = useQueryClient();
  const userInSalon = users?.find((user) => user.id === userId);

  // join salon
  const mutation = useMutation(joinSalon, {
    onSuccess: () => {
      setIsInSalon(true);
      const socket = io("http://localhost:3000/user", {
        auth: {
          token,
        },
      });
      socket.emit("join-room", id);
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
      const socket = io("http://localhost:3000/user", {
        auth: {
          token,
        },
      });
      socket.emit("leave-room", id);
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
    const socket = io("http://localhost:3000/user", {
      auth: {
        token,
      },
    });

    socket.on("delete-user", (idUser, idRoom) => {
      if (idRoom === id && idUser === userId) {
        queryClient.invalidateQueries("salon");
        setIsInSalon(false);
      }
    });

    socket.on("update-room", (idRoom) => {
      if (idRoom === id) {
        queryClient.invalidateQueries("salon");
      }
    });

    socket.on("join-room", (idRoom) => {
      if (idRoom === id) {
        queryClient.invalidateQueries("salon");
      }
    });

    socket.on("leave-room", (idRoom) => {
      if (idRoom === id) {
        queryClient.invalidateQueries("salon");
      }
    });
  }, []);

  useEffect(() => {
    if (nbPerson === nbMaxUser) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [nbPerson, nbMaxUser]);

  useEffect(() => {
    if (userInSalon) {
      setIsInSalon(true);
    }
  }, [userInSalon]);

  useEffect(() => {
    if (mutation.isSuccess || mutationQuit.isSuccess) {
      queryClient.invalidateQueries("salon");
    }
  }, [mutation.isSuccess, mutationQuit.isSuccess]);

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
              {isDisabled && !isInSalon ? (
                <Button flat auto rounded color="error">
                  <Text
                    css={{ color: "inherit" }}
                    size={12}
                    weight="bold"
                    transform="uppercase"
                  >
                    Full
                  </Text>
                </Button>
              ) : !isInSalon ? (
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
