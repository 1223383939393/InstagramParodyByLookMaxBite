// src/components/layout/ProtectedLayout.tsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { upsertUser } from "../../store/usersSlice";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const API_BASE = "https://lmbq-backend.onrender.com";

export default function ProtectedLayout() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.users.isAuthenticated
  );
  const token = localStorage.getItem("lmbq_token");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users`, {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : undefined,
        });
        if (!res.ok) return;
        const users = await res.json();
        users.forEach((u: any) => {
          dispatch(
            upsertUser({
              id: u.id,
              username: u.username,
              fullName: u.fullName,
              avatarUrl: u.avatarUrl,
              bio: u.bio,
            })
          );
        });
      } catch {
        // можно игнорировать, просто не будет авторов
      }
    };

    if (isAuthenticated && token) {
      loadUsers();
    }
  }, [dispatch, isAuthenticated, token]);

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