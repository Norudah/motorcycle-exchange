import { Avatar, Card, Row, Spacer, Text } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const ListPeople = (props) => {
  const { firstname, lastname, id } = props;

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
            <Avatar squared text={firstname} />
            <Spacer x={1} />
            <Text>
              {firstname} {lastname}
            </Text>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ListPeople;
