import { Modal, Button, Text, Input, Row, Checkbox } from "@nextui-org/react";
const ModalSalon = (props) => {
  const { id, visible, closeHandler, name, maxPerson } = props;

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
        <Input label="Salon Name" value={name} bordered clearable />
        <Input
          label="Max person per salon"
          value={maxPerson}
          bordered
          clearable
        />
      </Modal.Body>
      <Modal.Footer>
        <Button auto onClick={closeHandler}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSalon;
