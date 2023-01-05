import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";

import { Card, Col, Row, Button, Text, Spacer } from "@nextui-org/react";

const CardAdvisor = (props) => {
  const { userId, status, id } = props;

  const token = JSON.parse(localStorage.getItem("user")).token ?? null;
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();

  const queryClient = useQueryClient();

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

  const mutation = useMutation(acceptRequest, {
    onSuccess: () => {
      const socket = io("http://localhost:3000/admin", {
        auth: {
          token,
        },
      });
      socket.emit("accept-communication-request", userId, id);
    },
  });

  async function acceptRequest() {
    const response = await fetch(
      `http://localhost:3000/communication/request/update/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "ACCEPTED",
        }),
      }
    );
    return response.json();
  }

  const mutationRefuse = useMutation(refuseRequest, {
    onSuccess: () => {
      const socket = io("http://localhost:3000/admin", {
        auth: {
          token,
        },
      });
      socket.emit("refuse-communication-request", userId, id);
    },
  });

  async function refuseRequest() {
    const response = await fetch(
      `http://localhost:3000/communication/request/update/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "REFUSED",
        }),
      }
    );
    return response.json();
  }

  function handleAccept() {
    mutation.mutate();
    queryClient.invalidateQueries("requests");
  }

  function handleRefuse() {
    mutationRefuse.mutate();
    queryClient.invalidateQueries("requests");
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
              <Button flat auto rounded color="success" onClick={handleAccept}>
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
              <Button flat auto rounded color="error" onClick={handleRefuse}>
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
