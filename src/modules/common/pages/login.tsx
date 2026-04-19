import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import useHttp from "@/hooks/use-http";
import { portalConfig, STORAGE_KEYS } from "@/utils/constants/app-constants";
import { PortalTypes } from "@/utils/model/common-enums";
import { SuccessResponse } from "@/utils/model/model";
import { useMutation } from "@tanstack/react-query";
import { Button, Card, Form, FormProps, Image, Input, message } from "antd";
import { useNavigate } from "react-router";
import logo from "@assets/logo/Logo.jpg";

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
// function Login({ portal }: LoginProps) {
//   const { sendRequest } = useHttp({ type: "raw" });
//   const navigate = useNavigate();
//   const loginCall = useMutation({
//     mutationFn: (payload: { username: string; password: string }) =>
//       sendRequest({ url: "adminLogin", payload, method: "POST" }) as Promise<
//         SuccessResponse<LoginAPIResponse>
//       >,
//     onSuccess: (data: SuccessResponse<LoginAPIResponse>) => {
//       const { response } = data;
//       if (response.isSuccess) {
//         navigate("/dashboard");
//         cookieStore.set(STORAGE_KEYS.ACCESS_TOKEN, response.data.token);
//       }
//     },
//     onError: () => {
//       console.log("oooo");
//     },
//   });
//   const onFinish: FormProps<FieldType>["onFinish"] = async (data) => {
//     try {
//       await loginCall.mutateAsync({
//         username: data.username!,
//         password: data.password!,
//       });

//       navigate("/dashboard");
//     } catch (error) {
//       console.log("oopss!!", error);
//     }
//   };
//   const onFinishFailed = () => {};

//   return (
//     <div className="flex items-center justify-center h-screen relative bg-gray-50 overflow-hidden">
//       {/* Dotted Background */}
//       <DottedGlowBackground
//         className="pointer-events-none mask-radial-to-90% mask-radial-at-center"
//         opacity={1}
//         gap={10}
//         radius={1.6}
//         colorLightVar="--color-neutral-500"
//         glowColorLightVar="--color-neutral-600"
//         colorDarkVar="--color-neutral-500"
//         glowColorDarkVar="--color-sky-800"
//         backgroundOpacity={0}
//         speedMin={0.3}
//         speedMax={1.6}
//         speedScale={1}
//       />

//       {/* Login Card */}
//       <Card
//         className="w-[400px] max-w-full p-8 rounded-3xl shadow-2xl relative z-10 !border-none"
//         style={{
//           background: "linear-gradient(135deg, #f3e8ff, #ede9fe, #e0e7ff)", // soft pastel gradient
//         }}
//       >
//         <h2 className="text-3xl font-bold text-purple-700 text-center mb-6">
//           {portalConfig[portal].heading}
//         </h2>
//         <Form
//           name="basic"
//           layout="vertical"
//           initialValues={{ remember: true }}
//           onFinish={onFinish}
//           onFinishFailed={onFinishFailed}
//           autoComplete="off"
//         >
//           <Form.Item<FieldType>
//             name="username"
//             label={<span className="text-sky-950 font-semibold">Username</span>}
//             rules={[{ required: true, message: "Please input your username!" }]}
//           >
//             <Input
//               placeholder="Enter your username..."
//               className="rounded-xl"
//             />
//           </Form.Item>

//           <Form.Item<FieldType>
//             name="password"
//             label={<span className="text-sky-950 font-semibold">Password</span>}
//             rules={[{ required: true, message: "Please input your password!" }]}
//           >
//             <Input.Password placeholder="Enter your password..." />
//           </Form.Item>

//           <Form.Item>
//             <Button
//               htmlType="submit"
//               color="cyan"
//               className="w-full"
//               variant="outlined"
//             >
//               Sign In
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>
//     </div>
//   );
// }

function Login({ portal }: LoginProps) {
  const { sendRequest } = useHttp({ type: "raw" });
  const navigate = useNavigate();

  const loginCall = useMutation({
    mutationFn: (payload: { username: string; password: string }) =>
      sendRequest({
        url: "adminLogin",
        payload,
        method: "POST",
      }),
    onSuccess: (data) => {
      const { response } = data;
      if (response.isSuccess) {
        cookieStore.set(STORAGE_KEYS.ACCESS_TOKEN, response.data.token);
        navigate("/dashboard");
      }
    },
    onError: (err: any) => {
      message.error(err?.message || "Invalid credentials");
    },
  });

  const onFinish = async (data: FieldType) => {
    await loginCall.mutateAsync({
      username: data.username!,
      password: data.password!,
    });
  };

  return (
    // <div className="min-h-screen flex bg-white">
    <div
      className="min-h-screen flex"
      style={{
        background:
          // "linear-gradient(90deg, hsla(176, 61%, 87%, 1) 0%, hsla(150, 54%, 86%, 1) 50%, hsla(301, 68%, 84%, 1) 100%)",
          "linear-gradient(90deg, hsla(197, 14%, 57%, 1) 0%, hsla(192, 17%, 94%, 1) 100%)",
      }}
    >
      {/* LEFT SIDE - LOGIN FORM */}
      <div className="w-full  flex items-center justify-center px-8 ">
        <div className="w-4xl max-w-6xl">
          <div className="rounded-[28px] shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-gray-200 p-10">
            {/* Logo */}
            <div className="flex justify-center mb-10">
              <img
                src={logo}
                alt="Institute Logo"
                className="max-w-[260px] w-full h-auto object-contain"
              />
            </div>

            {/* Heading */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-semibold text-gray-800">
                Welcome back
              </h1>
              <p className="text-gray-800 mt-2 text-2xl">
                Please enter your credentials to continue.
              </p>
            </div>

            {/* Form */}
            <Form layout="vertical" onFinish={onFinish} autoComplete="off">
              <Form.Item
                name="username"
                label={<b>Username</b>}
                rules={[{ required: true, message: "Enter username" }]}
              >
                <Input
                  size="large"
                  placeholder="Enter username"
                  className="rounded-xl"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<b>Password</b>}
                rules={[{ required: true, message: "Enter password" }]}
              >
                <Input.Password
                  size="large"
                  placeholder="Enter password"
                  className="rounded-xl"
                />
              </Form.Item>

              <Form.Item className="mt-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loginCall.isPending}
                  className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 border-none"
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            {/* Footer */}
            <div className="text-center  text-gray-950 text-xl mt-6">
              © {new Date().getFullYear()} Ridhima PTE Centre
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block w-px bg-gray-200"></div>
      {/* RIGHT SIDE - VISUAL PANEL */}
      {/* <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 text-white p-12"> */}
    </div>
  );
}

export default Login;
