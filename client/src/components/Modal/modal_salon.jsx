import { Button, Input, Modal, Text } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
const ModalSalon = (props) => {
  const { id, visible, closeHandler, name, nbMaxUser, nbPerson } = props;

  const [salonName, setSalonName] = useState(name);
  const [salonMaxPerson, setSalonMaxPerson] = useState(nbMaxUser);

  // si on essaye de mettre un nombre négatif, on met 0
  // si on essaye de mettre un nombre inférieur au nombre de personne , on renvoie une erreur et cancel la mutation

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;

  // update salon
  const mutation = useMutation((id) => {
    return fetch(`http://localhost:3000/salon/update/${id}`, {
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
  });

  const queryClient = useQueryClient();
  useEffect(() => {
    if (mutation.isSuccess) {
      queryClient.invalidateQueries("salon");
    }
  }, [mutation.isSuccess]);

  function submitHandler() {
    mutation.mutate(id);
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
        <Input label="Salon Name" value={salonName} bordered clearable onChange={(e) => setSalonName(e.target.value)} />
        <Input label="Max person per salon" value={salonMaxPerson} onChange={(e) => setSalonMaxPerson(e.target.value)} bordered clearable />
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
