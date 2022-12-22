import { Modal, Button, Text, Input, Row, Checkbox } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
const ModalSalon = (props) => {
  const { id, visible, closeHandler, name, maxPerson } = props;

  const [salonName, setSalonName] = useState(name);
  const [salonMaxPerson, setSalonMaxPerson] = useState(maxPerson);

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
        <Button auto>Submit</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSalon;
