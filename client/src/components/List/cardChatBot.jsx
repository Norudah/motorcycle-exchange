import { Avatar, Card, Row, Spacer, Text } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

const CardChatBot = (props) => {
  const { firstname, id } = props;
  const token = JSON.parse(localStorage.getItem("user")).token ?? null;
  const user = JSON.parse(localStorage.getItem("user")).user ?? null;

  const queryClient = useQueryClient();
  const params = useParams(id);
  const navigate = useNavigate();
  const location = useLocation();

  const [isActive, setIsActive] = useState(false);

  const [botResume, setBotResume] = useState([
    {
      userId: null,
      step: null,
      lastMessageUser: null,
    },
  ]);
  const handleClick = () => {
    const socket = io("http://localhost:3000/user", {
      auth: {
        token,
      },
    });

    setBotResume({
      userId: user.id,
      step: null,
      lastMessageUser: null,
    });

    socket.emit("join-room-bot", botResume);
    navigate(`p/bot`);
  };

  useEffect(() => {
    if (location.pathname === `/chats/p/${id}`) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [location]);

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
            <Avatar squared text="Bot" color="primary" />
            <Spacer x={1} />
            <Text>{firstname} / click 2 times</Text>
            
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CardChatBot;
