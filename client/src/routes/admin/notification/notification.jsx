import { Button, Input, Spacer } from "@nextui-org/react";
import { BellSimpleRinging } from "phosphor-react";
import { useState } from "react";
import classes from "./notification.module.css";

const AdminNotification = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;

  const sendNotification = async () =>
    await fetch(`http://localhost:3000/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ title: "Promotion !", message: "Remise de 10% sur les échanges entre particuliers !" }),
    });

  const handleSubmit = async (e) => {
    try {
      await sendNotification();
    } catch (error) {
      console.error("error during send notification", error);
    }
  };

  return (
    <div className="main">
      <Spacer y={3} />
      <h1>Notify your users</h1>
      <Spacer y={1} />
      <form className={classes.formContainer}>
        <Input label="Title" placeholder="Promotion !" size="xl" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Spacer y={1} />
        <Input
          label="Message"
          placeholder="Remise de 10% sur les échanges entre particuliers !"
          size="xl"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Spacer y={1} />
        <Button icon={<BellSimpleRinging size={32} weight="fill" />} color="secondary" onPress={handleSubmit}>
          Notify !
        </Button>
      </form>
    </div>
  );
};

export default AdminNotification;
