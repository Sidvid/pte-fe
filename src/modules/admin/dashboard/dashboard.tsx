import AdminDashboard from "@/hooks/AdminDashboard";
import StudentCreatePage from "@/modules/students/components/StudentCreatePage";
import AdminLabVideosPage from "../lab-videos/lab-videos";
function Dashboard() {
  return (
    <div className="mt-24">
      <AdminDashboard />
      {/* <AdminLabVideosPage /> */}
      {/* <StudentCreatePage /> */}
    </div>
  );
}

export default Dashboard;
