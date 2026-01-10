import SideMenu from "@/components/molecules/side-menu/side-menu";
import { BrowserRouter, Routes, Route } from "react-router";
import * as React from "react";

import Avatar from "@/components/molecules/avatar/avatar";
import useTheme from "@/hooks/use-theme";

import {
  AiOutlineHome,
  AiOutlineSchedule,
  AiOutlineFileText,
  AiOutlineUnorderedList,
  AiOutlineVideoCamera,
  AiOutlineVideoCameraAdd,
  AiOutlineSun,
  AiOutlineMoon,
} from "react-icons/ai";
import { useNavigate } from "react-router";

import { Outlet, useParams, useLocation } from "react-router";

const sideMenuData = [
  {
    value: "dashboard",
    title: "Dashboard",
    icon: <AiOutlineHome />,
  },
  {
    value: "schedule",
    title: "Schedule",
    icon: <AiOutlineSchedule />,
  },
  {
    value: "mocktest",
    title: "Mock Test",
    icon: <AiOutlineFileText />,
  },
  {
    value: "dailyTasks",
    title: "Daily Tasks",
    icon: <AiOutlineUnorderedList />,
  },
  {
    value: "theoryVideos",
    title: "Theory Videos",
    icon: <AiOutlineVideoCamera />,
  },
  {
    value: "labVideos",
    title: "Lab Videos",
    icon: <AiOutlineVideoCameraAdd />,
  },
];

function ApplicationBody() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col h-screen w-screen">
      <section className="flex flex-1 overflow-hidden">
        <aside className="w-[250px]  overflow-y-auto">
          <SideMenu
            data={sideMenuData}
            selected={pathname.split("/")[1]}
            onClick={(value) => navigate(value)}
          />
        </aside>

        <main className="flex-1 overflow-y-auto bg-background p-16">
          {/* <section className="shadow-card sticky top-10 z-[100] bg-foreground flex flex-row justify-end items-center gap-10 px-24 py-6 mb-4 rounded-[12px]">
            <div onClick={toggleTheme} className="cursor-pointer relative">
              {theme === "light" ? (
                <AiOutlineMoon className="text-lg w-24 h-24 text-text-primary" />
              ) : (
                <AiOutlineSun className="text-lg w-24 h-24 text-text-primary" />
              )}
            </div>
            <Avatar />
          </section> */}
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </section>
    </div>
  );
}

export default ApplicationBody;
