// src/pages/AuthPage.tsx
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { registerUser, loginUser } from "../store/usersSlice";
import { useState } from "react";
import type { FormEvent } from "react";

export default function AuthPage() {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.items);
  const [mode, setMode] = useState<"login" | "signup">("login");

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    dispatch(loginUser({ username, password }));
  };

  const handleSignup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const fullName = formData.get("fullName")?.toString() ?? username;
    const avatarUrl =
      formData.get("avatarUrl")?.toString() ??
      "https://images.unsplash.com/photo-1502767089025-6572583495b4";
    const bio = formData.get("bio")?.toString() ?? "";

    const newUser = {
      id: username,
      username,
      fullName,
      avatarUrl,
      bio,
      password,
    };

    dispatch(registerUser(newUser));
    dispatch(loginUser({ username, password }));
  };

  return (
    <div
      className="page"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#0b1220",
          padding: 24,
          borderRadius: 16,
          border: "1px solid #1f2937",
          width: 360,
        }}
      >
        <div style={{ display: "flex", marginBottom: 16 }}>
          <button
            type="button"
            onClick={() => setMode("login")}
            style={{
              flex: 1,
              padding: 8,
              borderRadius: 999,
              border: "none",
              background:
                mode === "login" ? "#6366f1" : "#020617",
              color: "white",
              cursor: "pointer",
            }}
          >
            Вход
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            style={{
              flex: 1,
              padding: 8,
              borderRadius: 999,
              border: "none",
              background:
                mode === "signup" ? "#6366f1" : "#020617",
              color: "white",
              cursor: "pointer",
            }}
          >
            Регистрация
          </button>
        </div>

        {mode === "login" ? (
          <form
            onSubmit={handleLogin}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <h1 style={{ margin: "0 0 8px 0" }}>Вход в LMBQ</h1>
            <input name="username" placeholder="Никнейм" />
            <input
              name="password"
              placeholder="Пароль"
              type="password"
            />
            <button type="submit">Войти</button>
            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>
              Уже есть пользователи LMBQ:{" "}
              {users.map((u) => u.username).join(", ") || "пока нет"}
            </p>
          </form>
        ) : (
          <form
            onSubmit={handleSignup}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <h1 style={{ margin: "0 0 8px 0" }}>Регистрация в LMBQ</h1>
            <input name="username" placeholder="Никнейм (уникальный id)" />
            <input name="fullName" placeholder="Полное имя" />
            <input
              name="avatarUrl"
              placeholder="Ссылка на аватар (можно пусто)"
            />
            <textarea
              name="bio"
              placeholder="О себе"
            />
            <input
              name="password"
              placeholder="Пароль"
              type="password"
            />
            <button type="submit">Создать аккаунт</button>
          </form>
        )}
      </div>
    </div>
  );
}