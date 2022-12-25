import { Avatar, Card, Row, Spacer, Text } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const ListSalon = (props) => {
  const { name, nbUser, nbMaxUser, id } = props;

  const navigate = useNavigate();

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
