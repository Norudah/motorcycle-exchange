import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

import { Avatar, Card, Row, Spacer, Text } from "@nextui-org/react";

const ListSalon = (props) => {
  const { name, nbUser, nbMaxUser, id } = props;
  const token = JSON.parse(localStorage.getItem("user")).token ?? null;
  const user = JSON.parse(localStorage.getItem("user")).user ?? null;

  const queryClient = useQueryClient();
  const params = useParams(id);
  const navigate = useNavigate();
  const location = useLocation();

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (location.pathname === `/chats/g/${id}`) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [location]);

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

    socket.on("add-room", (room) => {
      console.log("fetch add room");
      queryClient.invalidateQueries("salons");
    });
  }, []);

  const handleClick = () => {
    navigate(`g/${id}`);
  };

  return (
    <div>
      <Spacer y={1} />
      <Card
        css={isActive ? { background: "#cee5ff" } : null}
        isPressable
        isHoverable
        onPress={handleClick}
      >
        <Card.Body>
          <Row className="alignItemsCenter">
            <Avatar squared text={name} />
            <Spacer x={1} />
            <Row>
              <Text css={isActive ? { color: "#4372f5" } : null}>{name}</Text>
            </Row>
            <Row>
              <Text css={isActive ? { color: "#4372f5" } : null}>
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
