import { useState } from "react";
import * as React from "react";
import Cookies from "js-cookie";
import Logo from "@assets/logo/Logo.jpg";
import { FaPowerOff, FaEdit } from "react-icons/fa";
import useHttp from "@/hooks/use-http";
import { useNavigate } from "react-router";
import { Button, Form, Input, message, Modal } from "antd";
import { useMutation } from "@tanstack/react-query";
import { RiMenuUnfold4Fill } from "react-icons/ri";
export interface SideMenuData {
  value: string;
  title: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface SideMenuProps {
  data: SideMenuData[];
  selected: SideMenuData["value"];
  onClick?: (value: SideMenuData["value"]) => void;
  isMenuCollapsed: boolean;
  setIsMenuCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

function SideMenu({
  data,
  selected,
  onClick,
  isMenuCollapsed,
  setIsMenuCollapsed,
}: SideMenuProps) {
  const [activeMenu, setActiveMenu] = useState<string>(
    selected ?? data[0].value,
  );
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const { sendRequest } = useHttp({ type: "auth" });
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const itemClickHandle = (value: string) => {
    setActiveMenu(value);
    onClick?.(value);
  };

  const changePasswordCall = useMutation({
    mutationFn: (payload: any) =>
      sendRequest({
        url: "changePassword",
        method: "POST",
        payload,
      }),
    onSuccess: () => {
      message.success("Password changed successfully");
      setIsChangePasswordOpen(false);
      form.resetFields();
    },
    onError: (err: any) => {
      console.error(err);
      message.error(err?.message || "Failed to change password");
    },
  });

  const handleChangePasswordSubmit = (values: any) => {
    changePasswordCall.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  const handleLogout = async () => {
    try {
      // Remove token cookie
      // await cookieStore.delete("access_token");
      // await cookieStore.delete("ACCESS_TOKEN");
      await Cookies.remove("access_token");
      await Cookies.remove("ACCESS_TOKEN");
      await localStorage.clear(); // Clear localStorage as well, if you store any user data there
      // if your app uses a specific constant-based cookie key,
      // keep the exact one here too

      message.success("Logged out successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      message.error("Failed to logout properly");
    }
  };

  return (
    <>
      {/* {isMenuCollapsed && (
        <RiMenuUnfoldFill
          color="black"
          onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
          style={{ fontSize: 20 }}
        />
      )} */}
      {!isMenuCollapsed && (
        <div className="bg-purple h-full px-8 py-6 flex flex-col">
          <div className="flex justify-between">
            <img className="w-[130px] h-[60px] mb-20 ml-6" src={Logo} alt="" />
            {!isMenuCollapsed && (
              <RiMenuUnfold4Fill
                className="cursor-pointer"
                onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
                style={{ fontSize: 30 }}
              />
            )}
          </div>
          <>
            {
              <div>
                {data.map(({ title, value, icon }) => (
                  <div
                    key={value}
                    className={`${
                      activeMenu === value ? "bg-link" : ""
                    } cursor-pointer py-10 px-10 rounded-xl flex flex-row items-center gap-10 mb-4`}
                    onClick={() => itemClickHandle(value)}
                  >
                    {icon &&
                      React.isValidElement(icon) &&
                      React.cloneElement(icon as React.ReactElement<any>, {
                        className: `w-20 h-20 text-sidemenu-text`,
                      })}
                    <p className="f12 w400 text-app-white">{title}</p>
                  </div>
                ))}
              </div>
            }

            {/* Bottom actions */}
            <div className="mt-auto pt-8 space-y-3">
              <div
                className="cursor-pointer py-6 px-10 rounded-xl flex flex-row items-center gap-10 hover:bg-link transition-all"
                onClick={() => setIsChangePasswordOpen(true)}
              >
                <p className="flex gap-5 f12 w400 text-app-white">
                  <div>
                    <FaEdit />
                  </div>
                  <div> Change Password</div>
                </p>
              </div>
            </div>
          </>

          <div
            className="cursor-pointer py-6 px-10 rounded-xl flex flex-row items-center gap-10 hover:bg-red-500/20 transition-all"
            onClick={handleLogout}
          >
            <p className="flex gap-5 items-center f12 w400 text-app-white">
              <div>
                <FaPowerOff />
              </div>
              <div> Logout</div>
            </p>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      <Modal
        open={isChangePasswordOpen}
        onCancel={() => {
          setIsChangePasswordOpen(false);
          form.resetFields();
        }}
        footer={null}
        centered
        title={
          <span className="text-lg font-semibold text-slate-800">
            Change Password
          </span>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleChangePasswordSubmit}
          className="mt-4"
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[
              { required: true, message: "Please enter current password" },
            ]}
          >
            <Input.Password
              placeholder="Enter current password"
              className="rounded-xl h-11"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter new password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              placeholder="Enter new password"
              className="rounded-xl h-11"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("New password and confirm password do not match"),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm new password"
              className="rounded-xl h-11"
            />
          </Form.Item>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              onClick={() => {
                setIsChangePasswordOpen(false);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={changePasswordCall.isPending}
            >
              Update Password
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default SideMenu;
