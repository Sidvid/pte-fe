import * as React from "react";
import { Badge } from "antd";
let linkForAvatar =
  "https://demos.pixinvent.com/vuexy-vuejs-admin-template/demo-3/images/avatars/avatar-1.png";
interface AvatarProps {
  link?: string;
}
function Avatar({ link }: AvatarProps) {
  return (
    <div className="border rounded-full w-[38px] h-[38px] overflow-hidden">
      <img src={link ?? linkForAvatar} alt="Avatar" />
      <div className="absolute z-1000000 top-[25px] right-[25px]">
        <Badge color="green" status="processing" />
      </div>
    </div>
  );
}

export default Avatar;
