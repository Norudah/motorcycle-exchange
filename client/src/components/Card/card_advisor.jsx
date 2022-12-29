import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";

import { Card, Col, Row, Button, Text } from "@nextui-org/react";

const CardAdvisor = (props) => {
  const { nbAdvisorOnline } = props;

  const [isPending, setIsPending] = useState(false);
  const [canCreateRequest, setCanCreateRequest] = useState();

  const queryClient = useQueryClient();

  const token = JSON.parse(localStorage.getItem("user")).token ?? null;
  const userId = JSON.parse(localStorage.getItem("user")).user.id ?? null;

  const mutation = useMutation(createCommunicationRequest, {
    onSuccess: () => {
      setIsPending(true);
      const socket = io("http://localhost:3000/user", {
        auth: {
          token,
        },
      });
      socket.emit("create-communication-request", userId);
    },
  });

  async function createCommunicationRequest() {
    const res = await fetch(
      `http://localhost:3000/communication/request/create}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: userId }),
      }
    );
  }

  function handleCreateCommunicationResquest() {
    mutation.mutate();
  }

  useEffect(() => {
    if (nbAdvisorOnline > 0) {
      setCanCreateRequest(true);
    } else {
      setCanCreateRequest(false);
    }
  }, [nbAdvisorOnline]);

  return (
    <Card css={{ w: "100%", h: "150px" }}>
      <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
        <Col>
          <Row justify="center">
            <Text h3 color="black" position="center">
              Chat with an advisor
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
        {/* {isPending ? (
                  <Row justify="center">
                    <Loading size="sm" />
                    <Spacer x={0.5} />
                    <Text>Waiting response</Text>
                  </Row>
                ) : ( */}
        <Row>
          <Col>
            <Row justify="center">
              {canCreateRequest ? (
                <Button
                  flat
                  auto
                  rounded
                  color="secondary"
                  onClick={handleCreateCommunicationResquest}
                >
                  <Text
                    css={{ color: "inherit" }}
                    size={12}
                    weight="bold"
                    transform="uppercase"
                  >
                    Create a request
                  </Text>
                </Button>
              ) : (
                <Button
                  flat
                  auto
                  rounded
                  disabled
                  color="secondary"
                  onClick={handleCreateCommunicationResquest}
                >
                  <Text
                    css={{ color: "inherit" }}
                    size={12}
                    weight="bold"
                    transform="uppercase"
                  >
                    No advisor available
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
