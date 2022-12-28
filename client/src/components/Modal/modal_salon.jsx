import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";

import { Modal, Button, Text, Input, Row, Checkbox } from "@nextui-org/react";
const ModalSalon = (props) => {
  const { id, visible, closeHandler, name, nbMaxUser, nbPerson } = props;

  const token = JSON.parse(localStorage.getItem("user")).token ?? null;
  const [salonName, setSalonName] = useState(name);
  const [salonMaxPerson, setSalonMaxPerson] = useState(nbMaxUser);
  const queryClient = useQueryClient();

  // si on essaye de mettre un nombre négatif, on met 0
  // si on essaye de mettre un nombre inférieur au nombre de personne , on renvoie une erreur et cancel la mutation

  const mutation = useMutation(updateSalon, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("salon");
      const socket = io("http://localhost:3000/admin", {
        auth: {
          token,
        },
      });
      console.log(data.salon.id);
      socket.emit("update-room", data.salon.id);
    },
    onError: (error) => {},
  });

  async function updateSalon() {
    const res = await fetch(`http://localhost:3000/salon/update/${id}`, {
      method: "PUT",
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
            Managed salon
          </Text>
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Input
          label="Salon Name"
          value={salonName}
          bordered
          clearable
          onChange={(e) => setSalonName(e.target.value)}
        />
        <Input
          label="Max person per salon"
          value={salonMaxPerson}
          onChange={(e) => setSalonMaxPerson(e.target.value)}
          bordered
          clearable
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
