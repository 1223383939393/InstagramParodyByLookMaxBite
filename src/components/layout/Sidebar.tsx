import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../app/store";
import { setCurrentUser } from "../../store/usersSlice";

export default function Sidebar() {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.items);
  const currentUserId = useSelector(
    (state: RootState) => state.users.currentUserId
  );

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setCurrentUser(e.target.value));
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar__logo">Pixly</h2>
      <nav className="sidebar__nav">
        <NavLink to="/feed">Лента</NavLink>
        <NavLink to="/explore">Поиск</NavLink>
        <NavLink to="/profile">Профиль</NavLink>
      </nav>

      <div style={{ marginTop: "auto" }}>
        <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>
          Активный пользователь
        </div>
        <select
          value={currentUserId}
          onChange={handleUserChange}
          style={{
            width: "100%",
            padding: 6,
            borderRadius: 999,
            border: "1px solid #1f2937",
            backgroundColor: "#020617",
            color: "#e5e7eb",
          }}
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}