import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Spacer } from "@nextui-org/react";
import { Button, Form, Input } from "antd";
import { toast } from "react-hot-toast";

const login = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation(loginUser, {
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
      localStorage.setItem("user", JSON.stringify(data));

      if (data.user.role === "ADMIN") {
        navigate("/admin/communication");
      } else if (data.user.role === "USER") {
        navigate("/communication");
      }

      toast.success(`Content de vous revoir ${data.user.firstName} !`);
    },
    onError: () => {
      console.log("error");
      toast.error("Une erreur est survenue. Connexion impossible.");
    },
  });

  async function loginUser() {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.getFieldValue("email"),
        password: form.getFieldValue("password"),
      }),
    });

    return await res.json();
  }

  function handleSubmit(e: any) {
    mutation.mutate();
  }

  return (
    <div className="main">
      <Spacer y={3} />
      <h1>Login</h1>
      <Spacer y={1} />
      <Form name="normal_login" form={form} className="login-form" initialValues={{ remember: true }} onFinish={handleSubmit}>
        <Form.Item name="email" rules={[{ required: true, message: "Please input your Email!" }]}>
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: "Please input your Password!" }]}>
          <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or{" "}
          <a href="">
            <Link to="/signup">sign up now!</Link>
          </a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default login;
