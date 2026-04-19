import SideMenu from "@/components/molecules/side-menu/side-menu";
import * as React from "react";

import {
  AiOutlineHome,
  AiOutlineSchedule,
  AiOutlineFileText,
  AiOutlineUnorderedList,
  AiOutlineVideoCamera,
  AiOutlineVideoCameraAdd,
} from "react-icons/ai";
import { PiStudentFill } from "react-icons/pi";
import { useNavigate } from "react-router";

import { Outlet, useLocation } from "react-router";
import { isStudentApp } from "@/utils/helpers/core-helpers";
import { GrConfigure } from "react-icons/gr";
import { RiMenuUnfoldFill } from "react-icons/ri";

function ApplicationBody() {
  const [isMenuCollapsed, setIsMenuCollapsed] = React.useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Define menu data based on app type
  const sideMenuData = isStudentApp
    ? [
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
          value: "mock-tests",
          title: "Mock & Official Tests",
          icon: <AiOutlineFileText />,
        },
        // {
        //   value: "daily-tasks",
        //   title: "Daily Tasks",
        //   icon: <AiOutlineUnorderedList />,
        // },
        {
          value: "videos",
          title: "Learning Videos",
          icon: <AiOutlineVideoCamera />,
        },
      ]
    : [
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
          value: "labVideos",
          title: "Lab Videos",
          icon: <AiOutlineVideoCameraAdd />,
        },
        {
          value: "students",
          title: "Students",
          icon: <PiStudentFill />,
        },
        {
          value: "theory-videos-config",
          title: "Theory Video Config",
          icon: <GrConfigure />,
        },
      ];

  return (
    <div className="flex flex-col h-screen w-screen">
      <section className="flex flex-1 overflow-hidden relative">
        <aside
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuCollapsed ? "w-0" : "w-[250px]"
          }`}
        >
          <div className="w-[250px] h-full">
            <SideMenu
              data={sideMenuData}
              selected={pathname.split("/")[1]}
              onClick={(value) => navigate(value)}
              isMenuCollapsed={isMenuCollapsed}
              setIsMenuCollapsed={setIsMenuCollapsed}
            />
          </div>
        </aside>

        {/* Main */}
        <main
          className={`flex-1 overflow-y-auto bg-background transition-all duration-500 ease-in-out ${
            isMenuCollapsed ? "p-10" : "p-16"
          }`}
        >
          {/* ✅ Hamburger icon */}

          {isMenuCollapsed && (
            <RiMenuUnfoldFill
              className="cursor-pointer sticky top-4 left-4 z-50"
              color="black"
              onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
              style={{ fontSize: 30 }}
            />
          )}
          <div className={`${isMenuCollapsed ? "pl-20 ml-20" : ""}`}>
            <Outlet />
          </div>
        </main>
      </section>
    </div>
  );
}

export default ApplicationBody;
