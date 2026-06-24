import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import AuthPage from "../../pages/AuthPage";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function ProtectedLayout() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.users.isAuthenticated
  );

  // Если пользователь не залогинен, показываем дефолтную страницу входа/регистрации
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Авторизованный пользователь видит основной layout
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}