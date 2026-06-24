// src/components/layout/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../app/store";
import { logout } from "../../store/usersSlice";
import { DEFAULT_AVATAR } from "../../constants/avatar";
import { useState } from "react";

export default function Sidebar() {
  const dispatch = useDispatch();
  const usersState = useSelector((state: RootState) => state.users);
  const currentUser = usersState.items.find(
    (u) => u.id === usersState.currentUserId
  );

  const [avatarError, setAvatarError] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const avatarSrc =
    !avatarError && currentUser?.avatarUrl
      ? currentUser.avatarUrl
      : DEFAULT_AVATAR;

  return (
    <aside className="sidebar">
      <h2 className="sidebar__logo">LMBQ</h2>
      <nav className="sidebar__nav">
        <NavLink to="/feed">Лента</NavLink>
        <NavLink to="/explore">Поиск</NavLink>
        <NavLink to="/profile">Профиль</NavLink>
        <NavLink to="/new">Новый пост</NavLink>
      </nav>

      {currentUser && (
        <div style={{ marginTop: "auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 16,
            }}
          >
            <img
              src={avatarSrc}
              alt={currentUser.username}
              style={{
                width: 32,
                height: 32,
                borderRadius: "999px",
                objectFit: "cover",
                border: "1px solid #1f2937",
              }}
              onError={() => setAvatarError(true)}
            />
            <div style={{ fontSize: 13 }}>
              <div style={{ color: "#e5e7eb" }}>
                @{currentUser.username}
              </div>
              <div style={{ color: "#9ca3af" }}>
                {currentUser.fullName}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              marginTop: 10,
              width: "100%",
              padding: 6,
              borderRadius: 999,
              border: "none",
              background:
                "linear-gradient(135deg, #ef4444, #f97316)",
              color: "white",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Выйти
          </button>
        </div>
      )}
    </aside>
  );
}