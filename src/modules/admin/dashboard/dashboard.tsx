import Card from "@/components/molecules/card/card";
import * as React from "react";
import WelcomeImage from "@/assets/images/welcome.png";
import Input from "antd/es/input/Input";
import { Button } from "antd";
import AdminDashboard from "@/hooks/AdminDashboard";
function Dashboard() {
  return (
    <div className="mt-24">
      <AdminDashboard />
    </div>
  );
}

export default Dashboard;
