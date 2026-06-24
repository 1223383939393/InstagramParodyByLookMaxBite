// src/components/layout/ProtectedLayout.tsx
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function ProtectedLayout() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.users.isAuthenticated
  );
  const token = localStorage.getItem("lmbq_token");

  if (!isAuthenticated || !token) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page">
          <Outlet />
        </div>
      </main>
    </div>
  );
}