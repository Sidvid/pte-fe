import { useState } from "react";
import * as React from "react";
import Logo from "@assets/logo/Logo.jpg";
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
}
function SideMenu({ data, selected, onClick }: SideMenuProps) {
  const [activeMenu, setActiveMenu] = useState<string>(
    selected ?? data[0].value
  );
  const itemClickHandle = (value: string) => {
    setActiveMenu(value);
    onClick?.(value);
  };
  return (
    <div className="bg-purple h-full px-8">
      <img className="w-[130px] h-[60px] mb-20 ml-6" src={Logo} alt="" />

      {data.map(({ title, value, icon }) => (
        <div
          key={value}
          className={`${
            activeMenu === value ? "bg-link" : ""
          } cursor-pointer py-10 px-10 rounded-xl flex flex-row items-center gap-10 mb-4 `}
          onClick={() => itemClickHandle(value)}
        >
          {icon &&
            React.isValidElement(icon) &&
            React.cloneElement(icon as React.ReactElement<any>, {
              className: `w-20 h-20 text-sidemenu-text`
            })}
          <p className="f12 w400 text-app-white">{title}</p>
        </div>
      ))}
    </div>
  );
}

export default SideMenu;
