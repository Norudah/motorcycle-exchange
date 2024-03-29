import { Button, Modal, Table, Text } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TrashSimple } from "phosphor-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const ModalSalon = (props) => {
  const { id, visible, closeHandler } = props;

  const [result, setResult] = useState([]);
  const queryClient = useQueryClient();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;

  useEffect(() => {
    getSalonUsers();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:3000/admin", {
      auth: {
        token,
      },
    });

    socket.on("user-joinded-room", (room) => {
      console.log("user-joinded-room");
      if (room === id) {
        getSalonUsers();
      }
    });

    socket.on("user-leave-room", (room) => {
      console.log("user-leave-room");
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

  const mutationDeleteUser = useMutation(deleteUserInSalon, {
    onSuccess: (data, variables, context) => {
      getSalonUsers();
      queryClient.invalidateQueries("salons");
      const socket = io("http://localhost:3000/admin", {
        auth: {
          token,
        },
      });

      socket.emit("delete-user", variables, id);
      toast.success("Utilisateur supprimé");
    },

    onError: (error, variables, context) => {
      toast.error("Une erreur est survenue");
    },
  });

  async function deleteUserInSalon(userId) {
    const userIdTest = 1;
    const res = await fetch(`http://localhost:3000/salon/user/delete/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        userId: userId,
      }),
    });
    const data = await res.json();
    setResult(data.salon.users);
  }

  function handleDeleteUser(userId) {
    mutationDeleteUser.mutate(userId);
  }

  return (
    <Modal closeButton aria-labelledby="modal-title" open={visible} onClose={closeHandler} width="700px">
      <Modal.Header>
        <Text id="modal-title" size={18}>
          <Text b size={18}>
            Managed Users on this room
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
                      <Button flat auto rounded color="error" icon={<TrashSimple />} onPress={() => handleDeleteUser(result?.id)} />
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
