import { Button, Modal, Table, Text } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatCenteredDots } from "phosphor-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";

const ModalSalon = (props) => {
  const { id, visible, closeHandler } = props;

  const [result, setResult] = useState([]);
  const [resultSalon, setResultSalon] = useState([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const myId = JSON.parse(localStorage.getItem("user")).user.id;
  const token = user.token;

  const { data } = useQuery(["people"], fetchSalon, {
    onSuccess: (data) => {
      setResultSalon(data.salon.filter((salon) => salon.type === "PRIVATE"));
    },
  });

  async function fetchSalon() {
    const response = await fetch(`http://localhost:3000/salon/user/${myId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();
    return data;
  }

  //Create chatroom with me and the user
  const mutationChatroom = useMutation(createChatroom, {
    onSuccess: (data) => {
      navigate(`/chats/p/${data.salon.id}`);
      queryClient.invalidateQueries("salons");
      const socket = io("http://localhost:3000/user", {
        auth: {
          token,
        },
      });
      socket.emit("add-room", data.salon.id);
      toast.success("Communication établie");
    },

    onError: (error) => {
      toast.error("Erreur de communication");
    },
  });

  async function createChatroom(userId) {
    const response = await fetch(`http://localhost:3000/salon/create/private`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId1: userId,
        userId2: myId,
      }),
    });
    return response.json();
  }

  useEffect(() => {
    getSalonUsers();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:3000/user", {
      auth: {
        token,
      },
    });

    socket.on("join-room", (room) => {
      if (room === id) {
        getSalonUsers();
      }
    });

    socket.on("leave-room", (room) => {
      if (room === id) {
        getSalonUsers();
      }
    });
  }, []);

  async function getSalonUsers() {
    const res = await fetch(`http://localhost:3000/salon/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = await res.json();
    setResult(data?.salon?.users);
  }

  function handleChatWithUser(userId) {
    const salon = resultSalon.find((salon) => salon.users.find((user) => user.id === userId) && salon.users.find((user) => user.id === myId));
    if (!salon) {
      mutationChatroom.mutate(userId);
      closeHandler();
      navigate(`/chats/p/${salon.id}`);
    } else {
      closeHandler();
      navigate(`/chats/p/${salon.id}`);
    }
  }

  return (
    <Modal closeButton aria-labelledby="modal-title" open={visible} onClose={closeHandler} width="700px">
      <Modal.Header>
        <Text id="modal-title" size={18}>
          <Text b size={18}>
            Users in the room
          </Text>
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Table
          aria-label="Example table with static content"
          css={{
            height: "auto",
            minWidth: "100%",
          }}>
          <Table.Header>
            <Table.Column>NAME</Table.Column>
            <Table.Column>ROLE</Table.Column>
            <Table.Column>ACTION</Table.Column>
          </Table.Header>
          <Table.Body>
            {result &&
              result.map((result) => (
                <Table.Row key={result?.id}>
                  <Table.Cell>
                    {result?.firstName} {result?.lastName}
                  </Table.Cell>
                  <Table.Cell>{result?.role}</Table.Cell>
                  <Table.Cell>
                    {result?.role === "USER" && (
                      <Button flat auto rounded color="primary" icon={<ChatCenteredDots />} onClick={() => handleChatWithUser(result?.id)} />
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </Modal.Body>
    </Modal>
  );
};

export default ModalSalon;
