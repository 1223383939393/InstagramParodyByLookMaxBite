// src/components/layout/Sidebar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { logout } from "../../store/usersSlice";
import { DEFAULT_AVATAR } from "../../constants/avatar";

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const usersState = useSelector((state: RootState) => state.users);
  const currentUser =
    usersState.items.find((u) => u.id === usersState.currentUserId) ||
    null;

  const avatarSrc =
    currentUser?.avatarUrl &&
    currentUser.avatarUrl.trim().length > 0
      ? currentUser.avatarUrl
      : DEFAULT_AVATAR;

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("lmbq_token");
    navigate("/auth");
  };

  return (
    <aside className="sidebar">
      <h1 className="sidebar__logo">PIXLY</h1>

      <nav className="sidebar__nav">
        <NavLink to="/feed">Лента</NavLink>
        <NavLink to="/explore">Исследовать</NavLink>
        <NavLink to="/profile">Профиль</NavLink>
        <NavLink to="/new">Новый пост</NavLink>
      </nav>

      {currentUser && (
        <div className="sidebar__user">
          <div className="sidebar__user-info">
            <img
              src={avatarSrc}
              alt={currentUser.username}
              className="sidebar__user-avatar"
            />
            <div>
              <div className="sidebar__user-username">
                @{currentUser.username}
              </div>
              <div className="sidebar__user-fullname">
                {currentUser.fullName}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="sidebar__logout-btn"
          >
            Выйти
          </button>
        </div>
      )}
    </aside>
  );
}