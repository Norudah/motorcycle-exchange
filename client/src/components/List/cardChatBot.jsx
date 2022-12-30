import { Avatar, Card, Row, Spacer, Text } from "@nextui-org/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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

  const handleClick = () => {
    navigate(`p/bot`);
  };

  useEffect(() => {
    if (location.pathname === `/chats/p/${id}`) {
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

    socket.emit("join-room-bot", (user.id));

    socket.on("welcome-bot", (userId, message) => {
      console.log("welcome-bot", userId, message);
    });
  }, []);

  return (
    <div>
      <Spacer y={1} />
      <Card  
        css={isActive ? { background: "#cee5ff" } : null}
        isPressable
        isHoverable
        onPress={handleClick}>
        <Card.Body>
          <Row className="alignItemsCenter">
            <Avatar squared text="Bot" color="primary" />
            <Spacer x={1} />
            <Text>
              { firstname }
            </Text>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CardChatBot;