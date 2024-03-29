import { Button, Input, Modal, Text } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const ModalSalon = (props) => {
  const { id, visible, closeHandler, name, nbMaxUser, nbPerson } = props;

  const token = JSON.parse(localStorage.getItem("user")).token ?? null;
  const [salonName, setSalonName] = useState(name);
  const [salonMaxPerson, setSalonMaxPerson] = useState(nbMaxUser);
  const queryClient = useQueryClient();

  const mutation = useMutation(updateSalon, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("salon");
      const socket = io("http://localhost:3000/admin", {
        auth: {
          token,
        },
      });
      socket.emit("update-room", data.salon.id);
      toast.success("Le salon a été modifié avec succès");
    },
    onError: (error) => {
      toast.error("Une erreur est survenue");
    },
  });

  async function updateSalon() {
    const res = await fetch(`http://localhost:3000/salon/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        name: salonName,
        nbMaxUser: parseInt(salonMaxPerson),
      }),
    });
    return await res.json();
  }

  function submitUpdatehandler() {
    mutation.mutate();
    closeHandler();
  }

  return (
    <Modal closeButton aria-labelledby="modal-title" open={visible} onClose={closeHandler}>
      <Modal.Header>
        <Text id="modal-title" size={18}>
          <Text b size={18}>
            Managed salon
          </Text>
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Input autoFocus label="Salon Name" value={salonName} bordered clearable onChange={(e) => setSalonName(e.target.value)} />
        <Input label="Max person per salon" value={salonMaxPerson} onChange={(e) => setSalonMaxPerson(e.target.value)} bordered clearable />
      </Modal.Body>
      <Modal.Footer>
        <Button auto onPress={submitUpdatehandler}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSalon;
