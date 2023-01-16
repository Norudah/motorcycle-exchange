import { Card, Col, Text } from "@nextui-org/react";

const Home = () => {
  return (
    <div className="main">
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">Welcom to Yamaha</h1>
          </div>
        </div>

        <Card>
          <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
            <Col>
              <Text size={12} weight="bold" transform="uppercase" color="#kkkkkk">
                What to watch
              </Text>
            </Col>
          </Card.Header>
          <Card.Image
            src="https://i.pinimg.com/736x/5c/bb/cf/5cbbcf3649a24deee4a9c707ee04fe28.jpg"
            objectFit="cover"
            width="100%"
            height={340}
            alt="Card image background"
          />
        </Card>
      </section>
    </div>
  );
};

export default Home;
