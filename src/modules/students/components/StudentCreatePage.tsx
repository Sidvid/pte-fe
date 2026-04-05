import React, { useState } from "react";
import {
  Alert,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Switch,
  Typography,
  Upload,
  message,
} from "antd";
import {
  UploadOutlined,
  UserAddOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import useHttp from "@/hooks/use-http";
import RibbonCard from "@/components/molecules/card/RibbonCard";

const { Title, Text } = Typography;
const { Password } = Input;

const StudentCreatePage = () => {
  const { sendRequest } = useHttp({ type: "auth" });
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const registerUserCall = useMutation({
    mutationFn: (payload: any) =>
      sendRequest({
        url: "registerUser",
        method: "POST",
        payload,
      }),
  });

  const activateStudentCall = useMutation({
    mutationFn: (payload: FormData) =>
      sendRequest({
        url: "activateStudentWithImage",
        method: "POST",
        payload,
      }),
  });

  const handleSubmit = async (values: any) => {
    try {
      // Step 1: register user
      const registerRes: any = await registerUserCall.mutateAsync({
        username: values.username,
        name: values.name,
        password: values.password,
        role: "student",
      });

      const registeredUser =
        registerRes?.response?.data || registerRes?.data || registerRes;

      const user_id = registeredUser?.id;

      if (!user_id) {
        message.error("User created but user id not received");
        return;
      }

      // Step 2: activate student
      const formData = new FormData();
      formData.append("user_id", user_id);
      formData.append("name", values.name);
      formData.append("address", values.address || "");
      formData.append("phone1", values.phone1 || "");
      formData.append("phone2", values.phone2 || "");
      formData.append("lab", String(values.lab ?? false));
      formData.append("online", String(values.online ?? false));
      formData.append("sub_start", values.sub_start?.toISOString());
      formData.append("sub_end", values.sub_end?.toISOString());

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      await activateStudentCall.mutateAsync(formData);

      message.success("Student created and activated successfully");
      form.resetFields();
      setSelectedFile(null);

      // Optional redirect
      navigate(-1);
    } catch (err: any) {
      console.error(err);
      message.error(err?.message || "Failed to create student");
    }
  };

  const loading = registerUserCall.isPending || activateStudentCall.isPending;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff,_#f8fafc_35%,_#f8fafc_100%)] p-4 md:p-6">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Hero header */}
        <div className="mb-6 overflow-hidden rounded-[30px] bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 px-6 py-8 text-white shadow-[0_18px_50px_rgba(15,23,42,0.10)] md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                <UserAddOutlined />
                Student Onboarding
              </div>
              <Title level={2} style={{ color: "#fff", margin: 0 }}>
                Create New Student
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.9)" }}>
                Register a user account and activate it as a student in one
                smooth flow.
              </Text>
            </div>

            <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur-md">
              <div className="text-xs uppercase tracking-wide text-white/75">
                Process
              </div>
              <div className="mt-1 text-sm font-semibold text-white">
                Register User → Activate Student
              </div>
            </div>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            lab: false,
            online: false,
          }}
        >
          <Row gutter={[20, 20]}>
            <Col xs={24} xl={10}>
              <RibbonCard
                title="User Account"
                color="blue"
                cardClassName="rounded-[24px] shadow-sm"
                bodyStyle={{ padding: 24 }}
              >
                <div className="space-y-2">
                  <Text type="secondary">
                    These details will create the login account for the student.
                  </Text>

                  <Form.Item
                    name="name"
                    label="Full Name"
                    rules={[
                      { required: true, message: "Please enter full name" },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Enter student full name"
                      className="rounded-xl"
                    />
                  </Form.Item>

                  <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                      { required: true, message: "Please enter username" },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Enter username"
                      className="rounded-xl"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      { required: true, message: "Please enter password" },
                    ]}
                  >
                    <Password
                      size="large"
                      placeholder="Enter password"
                      className="rounded-xl"
                    />
                  </Form.Item>
                </div>
              </RibbonCard>
            </Col>

            <Col xs={24} xl={14}>
              <RibbonCard
                title="Student Activation"
                color="purple"
                cardClassName="rounded-[24px] shadow-sm"
                bodyStyle={{ padding: 24 }}
              >
                <Row gutter={16}>
                  <Col xs={24}>
                    <Form.Item name="address" label="Address">
                      <Input
                        size="large"
                        placeholder="Enter address"
                        className="rounded-xl"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="phone1"
                      label="Phone 1"
                      rules={[
                        {
                          required: true,
                          message: "Please enter phone number",
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Primary phone"
                        className="rounded-xl"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item name="phone2" label="Phone 2">
                      <Input
                        size="large"
                        placeholder="Secondary phone"
                        className="rounded-xl"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="sub_start"
                      label="Subscription Start"
                      rules={[
                        { required: true, message: "Please select start date" },
                      ]}
                    >
                      <DatePicker size="large" className="w-full rounded-xl" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="sub_end"
                      label="Subscription End"
                      rules={[
                        { required: true, message: "Please select end date" },
                      ]}
                    >
                      <DatePicker size="large" className="w-full rounded-xl" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <RibbonCard
                      title="Lab"
                      color="geekblue"
                      cardClassName="rounded-[18px]"
                      bodyStyle={{ padding: 16 }}
                    >
                      <Form.Item
                        name="lab"
                        valuePropName="checked"
                        className="!mb-0 flex justify-center"
                      >
                        <Switch />
                      </Form.Item>
                    </RibbonCard>
                  </Col>

                  <Col xs={24} md={8}>
                    <RibbonCard
                      title="Online"
                      color="cyan"
                      cardClassName="rounded-[18px]"
                      bodyStyle={{ padding: 16 }}
                    >
                      <Form.Item
                        name="online"
                        valuePropName="checked"
                        className="!mb-0 flex justify-center"
                      >
                        <Switch />
                      </Form.Item>
                    </RibbonCard>
                  </Col>

                  <Col xs={24} md={8}>
                    <RibbonCard
                      title="Profile Image"
                      color="gold"
                      cardClassName="rounded-[18px]"
                      bodyStyle={{ padding: 16 }}
                    >
                      <Upload
                        beforeUpload={(file) => {
                          setSelectedFile(file);
                          return false;
                        }}
                        maxCount={1}
                        showUploadList={!!selectedFile}
                      >
                        <Button icon={<UploadOutlined />} size="middle">
                          Choose Image
                        </Button>
                      </Upload>
                    </RibbonCard>
                  </Col>
                </Row>
              </RibbonCard>
            </Col>
          </Row>

          <div className="mt-6 flex justify-end gap-3">
            <Button size="large" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<IdcardOutlined />}
              className="rounded-xl"
            >
              Create Student
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default StudentCreatePage;
