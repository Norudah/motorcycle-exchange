import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";

import { Modal, Button, Text, Input, Row, Checkbox } from "@nextui-org/react";

const ModalSalon = (props) => {
  const token = JSON.parse(localStorage.getItem("user")).token ?? null;
  const { id, visible, closeHandler, name, maxPerson } = props;

  const [salonName, setSalonName] = useState("");
  const [salonMaxPerson, setSalonMaxPerson] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation(addSalon, {
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries("salon");
      const socket = io("http://localhost:3000/admin", {
        auth: {
          token,
        },
      });
      socket.emit("add-room", data.salon.id);
      console.log("socket emit add-room", data.salon.id);
    },
    onError: (error) => {},
  });

  async function addSalon() {
    const res = await fetch("http://localhost:3000/salon/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: salonName,
        nbMaxUser: parseInt(salonMaxPerson),
      }),
    });
    return await res.json();
  }

  function submitHandler() {
    mutation.mutate();
    closeHandler();
  }

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={visible}
      onClose={closeHandler}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          <Text b size={18}>
            Add salon
          </Text>
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Input
          label="Salon Name"
          value={name}
          bordered
          clearable
          onChange={(e) => setSalonName(e.target.value)}
        />
        <Input
          label="Max person per salon"
          value={maxPerson}
          bordered
          clearable
          onChange={(e) => setSalonMaxPerson(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button auto onPress={submitHandler}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSalon;
