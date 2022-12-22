import { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { Spacer } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const login = () => {
  const [test, setTest] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = useMutation(loginUser, {
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);

      console.log("success", data);
    },
    onError: () => {
      console.log("error");
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
      {test}
      <Form
        name="normal_login"
        form={form}
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your Email!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
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
