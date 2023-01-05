import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { Grid, Spacer } from "@nextui-org/react";
import CardAdvisor from "../../components/Card/card_advisor";

const Communication = () => {
  const [nbAdvisorOnline, setNbAdvisorOnline] = useState(0);

  const queryClient = useQueryClient();
  const token = JSON.parse(localStorage.getItem("user")).token ?? null;
  const userId = JSON.parse(localStorage.getItem("user")).user.id ?? null;

  //fetch number of advisor online
  const { data: advisorOnline } = useQuery(
    ["advisorOnline"],
    fetchAdvisorOnline,
    {
      onSuccess: (data) => {
        setNbAdvisorOnline(data.users.length);
      },
    }
  );

  async function fetchAdvisorOnline() {
    const response = await fetch(
      "http://localhost:3000/communication/advisor",
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

  useEffect(() => {
    const socket = io("http://localhost:3000/user", {
      auth: {
        token,
      },
    });
    socket.on("admin-update-availability", (advisorId) => {
      queryClient.invalidateQueries(["advisorOnline"]);
    });
  }, []);

  return (
    <div className="main">
      <Spacer y={3} />
      <h1>Communication request</h1>
      <h4>Advisor available: {nbAdvisorOnline}</h4>
      <Spacer y={1} />

      <Grid.Container gap={2} justify="center">
        <Grid xs={4} sm={3}>
          <CardAdvisor nbAdvisorOnline={nbAdvisorOnline} />
        </Grid>
      </Grid.Container>

      <Spacer y={3} />
    </div>
  );
};

export default Communication;
