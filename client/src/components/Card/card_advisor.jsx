import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { Button, Card, Col, Loading, Row, Spacer, Text } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CardAdvisor = (props) => {
  const { nbAdvisorOnline } = props;

  const [canCreateRequest, setCanCreateRequest] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [chatRoomId, setChatRoomId] = useState("");

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("user")).token ?? null;
  const userId = JSON.parse(localStorage.getItem("user")).user.id ?? null;

  //fetch request only by me
  const { data: pendingRequest, refetch } = useQuery(["pendingRequest"], fetchPendingResquest, {
    onSuccess: (data) => {
      if (data.communication.length > 0) {
        setCanCreateRequest(false);
        setIsPending(true);
        setIsAccepted(false);
      }

      if (data.communication[0]?.status === "ACCEPTED") {
        setIsAccepted(true);
        setIsPending(false);
      } else if (data.communication[0]?.status === "REFUSED") {
        setIsAccepted(false);
        setIsPending(false);
      }
    },
  });

  async function fetchPendingResquest() {
    const response = await fetch(`http://localhost:3000/communication/request/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  }

  const mutation = useMutation(createCommunicationRequest, {
    onSuccess: () => {
      setCanCreateRequest(false);
      setIsPending(true);
      setIsAccepted(false);
      const socket = io("http://localhost:3000/user", {
        auth: {
          token,
        },
      });
      socket.emit("create-communication-request", userId);
      toast.success("Demande de communication envoyée !");
    },

    onError: () => {
      toast.error("Une erreur est survenue");
    },
  });

  async function createCommunicationRequest() {
    const res = await fetch(`http://localhost:3000/communication/request/create/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  function handleCreateCommunicationResquest() {
    mutation.mutate();
  }

  useEffect(() => {
    const socket = io("http://localhost:3000/user", {
      auth: {
        token,
      },
    });
    socket.on("accept-communication-request", (iduser, idRequest) => {
      if (userId == iduser) {
        queryClient.invalidateQueries(["pendingRequest"]);
      }
    });
    socket.on("refuse-communication-request", (iduser, idRequest) => {
      if (userId == iduser) {
        queryClient.invalidateQueries(["pendingRequest"]);
      }
    });
  }, []);

  useEffect(() => {
    if (nbAdvisorOnline > 0) {
      setCanCreateRequest(true);
      setIsPending(false);
    } else {
      setCanCreateRequest(true);
      setIsPending(true);
    }
  }, [nbAdvisorOnline]);

  function handleGoToChat() {
    navigate(`/chats/`);
  }

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
        }}>
        <Row>
          <Col>
            <Row justify="center">
              {canCreateRequest && !isPending && !isAccepted ? (
                <Button flat auto rounded color="secondary" onClick={handleCreateCommunicationResquest}>
                  <Text css={{ color: "inherit" }} size={12} weight="bold" transform="uppercase">
                    Create a request
                  </Text>
                </Button>
              ) : canCreateRequest && isPending && !isAccepted ? (
                <Button flat auto rounded color="secondary" disabled>
                  <Text css={{ color: "inherit" }} size={12} weight="bold" transform="uppercase">
                    No advisor available
                  </Text>
                </Button>
              ) : !canCreateRequest && isPending && !isAccepted ? (
                <Button flat auto rounded color="gradient" disabled>
                  <Loading size="sm" />
                  <Spacer x={0.5} />
                  <Text>In validation by advisor</Text>
                </Button>
              ) : !canCreateRequest && !isPending && isAccepted ? (
                <Button flat auto rounded color="success" onClick={handleGoToChat}>
                  <Text css={{ color: "inherit" }} size={12} weight="bold" transform="uppercase">
                    Accepted: Start a chat
                  </Text>
                </Button>
              ) : !canCreateRequest && !isPending && !isAccepted ? (
                <Button flat auto rounded color="warning">
                  <Text css={{ color: "inherit" }} size={12} weight="bold" transform="uppercase">
                    Refused: Create a new request
                  </Text>
                </Button>
              ) : (
                <Button flat auto rounded color="secondary" disabled>
                  <Text css={{ color: "inherit" }} size={12} weight="bold" transform="uppercase">
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
