import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import useHttp from "@/hooks/use-http";
import { portalConfig, STORAGE_KEYS } from "@/utils/constants/app-constants";
import { PortalTypes } from "@/utils/model/common-enums";
import { SuccessResponse } from "@/utils/model/model";
import { useMutation } from "@tanstack/react-query";
import { Button, Card, Form, FormProps, Input } from "antd";
import React from "react";
import { useNavigate } from "react-router";

type FieldType = {
  username?: string;
  password?: string;
};
interface LoginProps {
  portal: PortalTypes;
}
interface LoginAPIResponse {
  token: string;
  user: {
    id: string;
    role: PortalTypes;
    username: string;
  };
}
function Login({ portal }: LoginProps) {
  const { sendRequest } = useHttp({ type: "raw" });
  const navigate = useNavigate();
  const loginCall = useMutation({
    mutationFn: (payload: { username: string; password: string }) =>
      sendRequest({ url: "adminLogin", payload, method: "POST" }) as Promise<
        SuccessResponse<LoginAPIResponse>
      >,
    onSuccess: (data: SuccessResponse<LoginAPIResponse>) => {
      const { response } = data;
      if (response.isSuccess) {
        navigate("/dashboard");
        cookieStore.set(STORAGE_KEYS.ACCESS_TOKEN, response.data.token);
      }
    },
    onError: () => {
      console.log("oooo");
    },
  });
  const onFinish: FormProps<FieldType>["onFinish"] = (data) => {
    console.log("this is data of form", data);

    try {
      loginCall.mutateAsync({
        username: data.username!,
        password: data.password!,
      });
    } catch (error) {
      console.log("oopss!!", error);
    }
  };
  const onFinishFailed = () => {};

  return (
    <div className="flex items-center justify-center h-screen relative bg-gray-50 overflow-hidden">
      {/* Dotted Background */}
      <DottedGlowBackground
        className="pointer-events-none mask-radial-to-90% mask-radial-at-center"
        opacity={1}
        gap={10}
        radius={1.6}
        colorLightVar="--color-neutral-500"
        glowColorLightVar="--color-neutral-600"
        colorDarkVar="--color-neutral-500"
        glowColorDarkVar="--color-sky-800"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.6}
        speedScale={1}
      />

      {/* Login Card */}
      <Card
        className="w-[400px] max-w-full p-8 rounded-3xl shadow-2xl relative z-10 !border-none"
        style={{
          background: "linear-gradient(135deg, #f3e8ff, #ede9fe, #e0e7ff)", // soft pastel gradient
        }}
      >
        <h2 className="text-3xl font-bold text-purple-700 text-center mb-6">
          {portalConfig[portal].heading}
        </h2>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            name="username"
            label={<span className="text-white font-semibold">Username</span>}
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              placeholder="Enter your username..."
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            label={<span className="text-white font-semibold">Password</span>}
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Enter your password..."
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              color="cyan"
              className="w-full"
              variant="outlined"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
