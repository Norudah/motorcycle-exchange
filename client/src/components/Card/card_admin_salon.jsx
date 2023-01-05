import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { Button, Card, Col, Row, Spacer, Text } from "@nextui-org/react";
import { Gear, TrashSimple, User } from "phosphor-react";
import ModalSalon from "../Modal/modal_salon";
import ModalSalonUsers from "../Modal/modal_salon_users";

const CardAdvisor = (props) => {
  const { name, nbPerson, nbMaxUser, id, users, userId } = props;

  const [isDisabled, setIsDisabled] = useState(false);
  const [isInSalon, setIsInSalon] = useState(false);
  const queryClient = useQueryClient();
  const userInSalon = users?.find((user) => user.id === userId);
  const [visibleButton, setVisibleButton] = useState(false);

  const [visible, setVisible] = useState(false);
  const [visibleModalUser, setVisibleModalUser] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;

  const handler = () => setVisible(true);
  const handlerModalUser = () => setVisibleModalUser(true);

  const closeHandler = () => {
    setVisible(false);
  };

  const closeHandlerModalUser = () => {
    setVisibleModalUser(false);
  };

  useEffect(() => {
    if (nbPerson > 0) {
      setVisibleButton(true);
    }
  }, [nbPerson]);

  // Join salon
  const mutation = useMutation(joinSalon, {
    onSuccess: () => {
      setIsInSalon(true);
      const socket = io("http://localhost:3000/admin", {
        auth: {
          token,
        },
      });
      socket.emit("join-room", id);
    },
  });

  async function joinSalon() {
    const res = await fetch(`http://localhost:3000/salon/join/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ userId: userId }),
    });
  }

  // Quit salon
  const mutationQuit = useMutation(quitSalon, {
    onSuccess: () => {
      setIsInSalon(false);
      const socket = io("http://localhost:3000/admin", {
        auth: {
          token,
        },
      });
      socket.emit("leave-room", id);
    },
  });

  async function quitSalon() {
    const res = await fetch(`http://localhost:3000/salon/leave/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ userId: userId }),
    });
  }

  const mutationDelete = useMutation(deleteSalon, {
    onSuccess: () => {
      queryClient.invalidateQueries("salon");
      const socket = io("http://localhost:3000/admin", {
        auth: {
          token,
        },
      });
      socket.emit("delete-room", id);
    },
  });

  async function deleteSalon() {
    const res = await fetch(`http://localhost:3000/salon/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
  }

  useEffect(() => {
    if (nbPerson === nbMaxUser) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [nbPerson, nbMaxUser]);

  useEffect(() => {
    if (userInSalon) {
      setIsInSalon(true);
    }
  }, [userInSalon]);

  useEffect(() => {
    if (mutation.isSuccess || mutationQuit.isSuccess) {
      queryClient.invalidateQueries("salon");
    }
  }, [mutation.isSuccess, mutationQuit.isSuccess]);

  useEffect(() => {
    const socket = io("http://localhost:3000/admin", {
      auth: {
        token,
      },
    });
    socket.on("user-joinded-room", (room) => {
      console.log("user-joinded-room");
      console.log(room, id);
      if (room === id) {
        queryClient.invalidateQueries("salon");
      }
    });
    socket.on("user-leave-room", (room) => {
      console.log("user-leaved-room");
      console.log(room, id);
      if (room === id) {
        queryClient.invalidateQueries("salon");
      }
    });
  }, []);

  function submitHandlerDelete() {
    mutationDelete.mutate();
  }

  function submitHandler() {
    mutation.mutate(id);
  }

  function submitHandlerQuit() {
    mutationQuit.mutate(id);
  }

  return (
    <Card css={{ w: "100%", h: "220px" }}>
      <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
        <Col>
          <Row justify="space-around">
            <Button
              flat
              auto
              rounded
              color="primary"
              icon={<User />}
              onClick={handlerModalUser}
            />

            <ModalSalonUsers key={id} id={id} visible={visibleModalUser} closeHandler={closeHandlerModalUser} />

            <Button flat auto rounded color="warning" icon={<Gear />} onClick={handler} />
            <ModalSalon key={id} id={id} visible={visible} closeHandler={closeHandler} name={name} nbPerson={nbPerson} nbMaxUser={nbMaxUser} />

            <Button flat auto rounded color="error" icon={<TrashSimple />} onPress={submitHandlerDelete} />
          </Row>
          <Row justify="center">
            <Text h3 color="black" position="center">
              {name}
            </Text>
          </Row>
          <Row justify="center">
            <Text>
              {nbPerson} / {nbMaxUser} people
            </Text>
          </Row>
        </Col>
      </Card.Header>

      <Card.Footer
        isBlurred
        css={{
          position: "absolute",
          bgBlur: "#ffffff66",
          borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
          bottom: 0,
          zIndex: 1,
        }}>
        <Row>
          <Col>
            <Spacer y={0.5} />
            <Row justify="center">
              {isDisabled && !isInSalon ? (
                <Button flat auto rounded color="error">
                  <Text css={{ color: "inherit" }} size={12} weight="bold" transform="uppercase">
                    Full
                  </Text>
                </Button>
              ) : !isInSalon ? (
                <Button flat auto rounded color="secondary" onPress={submitHandler}>
                  <Text css={{ color: "inherit" }} size={12} weight="bold" transform="uppercase">
                    Join the salon
                  </Text>
                </Button>
              ) : (
                <Button flat auto rounded color="error" onPress={submitHandlerQuit}>
                  <Text css={{ color: "inherit" }} size={12} weight="bold" transform="uppercase">
                    Quit salon
                  </Text>
                </Button>
              )}
            </Row>
            <Spacer y={0.5} />
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default CardAdvisor;
