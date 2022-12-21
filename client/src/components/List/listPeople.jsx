import { Avatar, Card, Row, Spacer, Text } from "@nextui-org/react";

const ListPeople = (props) => {
  const { firstname, lastname } = props;
  return (
    <div>
      <Spacer y={1} />
      <Card isPressable isHoverable>
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
