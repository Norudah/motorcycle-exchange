import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { Grid, Row, Spacer, Switch, Text } from "@nextui-org/react";
import { Bell, BellSlash } from "phosphor-react";
import { toast } from "react-hot-toast";
import CardAdminAdvisor from "../../../components/Card/card_admin_advisor";

const Communication = () => {
  const [isAvailable, setIsAvailable] = useState();
  const [pendingRequests, setPendingRequest] = useState();
  const queryClient = useQueryClient();

  const token = JSON.parse(localStorage.getItem("user")).token ?? null;
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user?.id;

  const { data } = useQuery(["advisor"], fetchAdvisor, {
    onSuccess: (data) => {
      setIsAvailable(data.user.availability);
    },
  });

  async function fetchAdvisor() {
    const response = await fetch(`http://localhost:3000/communication/advisor/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  }

  //fetch request
  const { data: request } = useQuery(["pendingRequest"], fetchPendingResquest, {
    onSuccess: (data) => {
      setPendingRequest(data.communication);
    },
  });

  async function fetchPendingResquest() {
    const response = await fetch(`http://localhost:3000/communication/pending-request`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  }

  const mutation = useMutation(updateAvailability, {
    onSuccess: (data) => {
      setIsAvailable(data.user.availability);
      const message = isAvailable ? "Vous êtes maintenant disponible" : "Vous êtes maintenant indisponible";
      toast.success(message);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Une erreur est survenue");
    },
  });

  async function updateAvailability() {
    const res = await fetch(`http://localhost:3000/communication/available/advisor/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        availability: !isAvailable,
      }),
    });
    return res.json();
  }

  useEffect(() => {
    const socket = io("http://localhost:3000/admin", {
      auth: {
        token: token,
      },
    });
    socket.emit("admin-update-availability", userId);

    socket.on("create-communication-request", (userId) => {
      queryClient.invalidateQueries(["pendingRequest"]);
    });
  }, [isAvailable]);

  const handleSwitch = () => {
    mutation.mutate();
  };

  return (
    <div className="main">
      <Spacer y={3} />

      <h1>Communication request</h1>

      <Spacer y={1} />

      <Row justify="center">
        <Text h3>Show me to User : </Text>
        <Spacer x={1} />
        <Switch color="success" size="xl" iconOff={<BellSlash />} iconOn={<Bell />} checked={isAvailable} onChange={handleSwitch} />
      </Row>
      <Spacer y={1} />
      <Grid.Container gap={2} justify="center">
        {pendingRequests?.map((advisor) => (
          <Grid xs={4} sm={3} key={advisor.id}>
            <CardAdminAdvisor id={advisor.id} userId={advisor.userId} status={advisor.status} />
          </Grid>
        ))}
      </Grid.Container>

      <Spacer y={3} />
    </div>
  );
};

export default Communication;
