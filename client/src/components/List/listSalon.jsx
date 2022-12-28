import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import { Avatar, Card, Row, Spacer, Text } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";

const ListSalon = (props) => {
  const { name, nbUser, nbMaxUser, id } = props;
  const token = JSON.parse(localStorage.getItem("user")).token ?? null;

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io("http://localhost:3000/user", {
      auth: {
        token,
      },
    });
    socket.on("delete-room", (room) => {
      if (room === id) {
        queryClient.invalidateQueries("salons");
      }
    });

    socket.on("join-room", (room) => {
      if (room === id) {
        queryClient.invalidateQueries("salons");
      }
    });

    socket.on("leave-room", (room) => {
      if (room === id) {
        queryClient.invalidateQueries("salons");
      }
    });

    socket.on("update-room", (room) => {
      if (room === id) {
        queryClient.invalidateQueries("salons");
      }
    });
  }, []);

  const handleClick = () => {
    navigate(`g/${id}`);
  };

  return (
    <div>
      <Spacer y={1} />
      <Card isPressable isHoverable onPress={handleClick}>
        <Card.Body>
          <Row className="alignItemsCenter">
            <Avatar squared text={name} />
            <Spacer x={1} />
            <Row>
              <Text>{name}</Text>
            </Row>
            <Row>
              <Text>
                {nbUser ? nbUser : 0} / {nbMaxUser}
              </Text>
            </Row>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ListSalon;
