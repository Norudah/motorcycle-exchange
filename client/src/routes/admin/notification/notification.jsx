import { Button, Input, Spacer } from "@nextui-org/react";
import { BellSimpleRinging } from "phosphor-react";
import classes from "./notification.module.css";

const AdminNotification = () => {
  return (
    <div className="main">
      <Spacer y={3} />
      <h1>Notify your users</h1>
      <Spacer y={1} />
      <div className={classes.formContainer}>
        <Input label="Title" placeholder="Guillermo Rauch" required size="xl" />
        <Spacer y={1} />
        <Input label="Message" placeholder="Guillermo Rauch" required size="xl" />
        <Spacer y={1} />
        <Button icon={<BellSimpleRinging size={32} weight="fill" />} color="secondary">
          Notify !
        </Button>
      </div>
    </div>
  );
};

export default AdminNotification;
