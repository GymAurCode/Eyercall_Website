import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function EyerREMSLayout() {
  return (
    <div className="flex h-screen bg-[#001a1a]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
