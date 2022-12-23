import { Avatar, Card, Row, Spacer, Text } from "@nextui-org/react";

const ListSalon = (props) => {
  const { name, nbUser, nbMaxUser } = props;
  return (
    <div>
      <Spacer y={1} />
      <Card isPressable isHoverable>
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
