import { useState } from "react";
import { Button, Checkbox, Form, Input, Select } from "antd";
import { Spacer } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const Signup = () => {
  const [form] = Form.useForm();

  const mutation = useMutation(insertUser, {
    onSuccess: () => {
      console.log("success");
    },
  });

  async function insertUser() {
    const res = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: form.getFieldValue("firstname"),
        lastName: form.getFieldValue("lastname"),
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
      <h1>Sign up</h1>
      <Spacer y={1} />

      <Form
        {...formItemLayout}
        form={form}
        name="register"
        className="signup-form"
        onFinish={handleSubmit}
        scrollToFirstError
      >
        <Form.Item
          name="firstname"
          label="Firstname"
          rules={[
            {
              required: true,
              message: "Please input your firstname!",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lastname"
          label="Lastname"
          rules={[
            {
              required: true,
              message: "Please input your lastname!",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error("Should accept agreement")),
            },
          ]}
          {...tailFormItemLayout}
        >
          <Checkbox>
            I have read the <a href="">agreement</a>
          </Checkbox>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signup;
