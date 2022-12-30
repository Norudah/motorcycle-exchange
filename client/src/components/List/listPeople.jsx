import { Avatar, Card, Row, Spacer, Text } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ListPeople = (props) => {
  const { id } = props;

  const [otherUser, setOtherUser] = useState({
    id: null,
    firstname: null,
    lastname: null,
    role: null,
  });
  const [data, setData] = useState([]);

  const token = JSON.parse(localStorage.getItem("user")).token ?? null;
  const myId = JSON.parse(localStorage.getItem("user")).user.id;

  // fetch the user join the room
  const { data: user } = useQuery(["user", id], fetchUser, {
    onSuccess: (data) => {
      setData(data.salon.users);
    },
  });

  useEffect(() => {
    if (data.length > 0) {
      data.forEach((user) => {
        if (user.id !== myId) {
          setOtherUser({
            id: user.id,
            firstname: user.firstName,
            lastname: user.lastName,
            role: user.role,
          });
        }
      });
    }
    console.log(otherUser);
  }, [data]);

  async function fetchUser() {
    const response = await fetch(`http://localhost:3000/salon/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    return response.json();
  }

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`p/${id}`);
  };

  return (
    <div>
      <Spacer y={1} />
      <Card isPressable isHoverable onPress={handleClick}>
        <Card.Body>
          <Row className="alignItemsCenter">
            <Avatar squared text={otherUser.firstname} />
            <Spacer x={1} />
            <Text>
              {otherUser.firstname} {otherUser.lastname}
            </Text>
          </Row>
          <Row justify="center">
            <Text small color="success">
              {otherUser.role}
            </Text>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ListPeople;
