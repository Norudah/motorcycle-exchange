import { Button, Modal, Table, Text } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TrashSimple } from "phosphor-react";
import { useEffect, useState } from "react";
const ModalSalon = (props) => {
  const { id, visible, closeHandler } = props;

  const [result, setResult] = useState([]);
  const queryClient = useQueryClient();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;

  useEffect(() => {
    getSalonUsers();
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
    setResult(data.salon.users);
  }

  const mutationDeleteUser = useMutation(deleteUserInSalon, {
    onSuccess: () => {
      getSalonUsers();
      queryClient.invalidateQueries("salons");
    },
  });

  async function deleteUserInSalon(userId) {
    console.log("target user id to mutation", userId);
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
    console.log("target user id to handler", userId);
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
