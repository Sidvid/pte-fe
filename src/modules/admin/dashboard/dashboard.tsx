import Card from "@/components/molecules/card/card";
import * as React from "react";
import WelcomeImage from "@/assets/images/welcome.png";
import Input from "antd/es/input/Input";
import { Button } from "antd";
function Dashboard() {
  return (
    <div className="mt-24">
      <div className="w-[250px]">
        <Input />
        <Button>CLICK</Button>
        <Card>
          <div className="flex">
            <div className="flex flex-col justify-start">
              <p className="text-[1.4rem] text-gray-400">Welcome Admin</p>
            </div>
            <img
              src={WelcomeImage}
              alt="Welcome"
              className="h-[120px] w-auto object-contain"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
