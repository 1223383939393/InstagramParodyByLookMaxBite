// src/pages/AuthPage.tsx
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../store/usersSlice";
import { useState } from "react";

export default function AuthPage() {
  const dispatch = useDispatch();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");
  const [registerAvatarUrl, setRegisterAvatarUrl] = useState("");
  const [registerBio, setRegisterBio] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const MIN_PASSWORD_LENGTH = 6;

  const validatePassword = (password: string) => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`;
    }
    return null;
  };

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = validatePassword(loginPassword);
    setPasswordError(error);
    if (error) return;

    dispatch(
      loginUser({ username: loginUsername.trim(), password: loginPassword })
    );
  };

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = validatePassword(registerPassword);
    setPasswordError(error);
    if (error) return;

    const newUser = {
      id: crypto.randomUUID(),
      username: registerUsername.trim(),
      fullName: registerFullName.trim(),
      avatarUrl: registerAvatarUrl.trim() || null,
      bio: registerBio.trim() || null,
      password: registerPassword,
    };

    dispatch(registerUser(newUser));
    dispatch(
      loginUser({ username: newUser.username, password: newUser.password })
    );
  };

  return (
    <div
      className="page"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          padding: 24,
          borderRadius: 16,
          border: "1px solid #1f2937",
          background:
            "radial-gradient(circle at top, rgba(96,165,250,0.3), transparent 60%)",
        }}
      >
        <h1 style={{ marginBottom: 8 }}>LMBQ</h1>
        <p
          style={{
            marginBottom: 16,
            fontSize: 13,
            color: "#9ca3af",
          }}
        >
          Авторизуйся, чтобы пользоваться социальной сетью LMBQ.
        </p>

        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setPasswordError(null);
            }}
            style={{
              flex: 1,
              padding: 8,
              borderRadius: 999,
              border: "none",
              background:
                mode === "login"
                  ? "linear-gradient(135deg, #6366f1, #ec4899)"
                  : "#111827",
              color: "white",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Вход
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setPasswordError(null);
            }}
            style={{
              flex: 1,
              padding: 8,
              borderRadius: 999,
              border: "none",
              background:
                mode === "register"
                  ? "linear-gradient(135deg, #6366f1, #ec4899)"
                  : "#111827",
              color: "white",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Регистрация
          </button>
        </div>

        {mode === "login" ? (
          <form
            onSubmit={handleLoginSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            <label style={{ fontSize: 13 }}>
              Логин
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Введите логин"
                style={{
                  marginTop: 4,
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 999,
                  border: "1px solid #374151",
                  backgroundColor: "#020617",
                  color: "#e5e7eb",
                  fontSize: 13,
                }}
                required
              />
            </label>

            <label style={{ fontSize: 13 }}>
              Пароль
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder={`Мин. ${MIN_PASSWORD_LENGTH} символов`}
                style={{
                  marginTop: 4,
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 999,
                  border: "1px solid #374151",
                  backgroundColor: "#020617",
                  color: "#e5e7eb",
                  fontSize: 13,
                }}
                required
              />
            </label>

            {passwordError && (
              <p
                style={{
                  fontSize: 12,
                  color: "#f97316",
                  marginTop: -2,
                }}
              >
                {passwordError}
              </p>
            )}

            <button
              type="submit"
              style={{
                marginTop: 4,
                padding: 8,
                borderRadius: 999,
                border: "none",
                background:
                  "linear-gradient(135deg, #6366f1, #ec4899)",
                color: "white",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Войти
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleRegisterSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            <label style={{ fontSize: 13 }}>
              Логин
              <input
                type="text"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                placeholder="Придумайте логин"
                style={{
                  marginTop: 4,
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 999,
                  border: "1px solid #374151",
                  backgroundColor: "#020617",
                  color: "#e5e7eb",
                  fontSize: 13,
                }}
                required
              />
            </label>

            <label style={{ fontSize: 13 }}>
              Полное имя
              <input
                type="text"
                value={registerFullName}
                onChange={(e) => setRegisterFullName(e.target.value)}
                placeholder="Как вас зовут"
                style={{
                  marginTop: 4,
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 999,
                  border: "1px solid #374151",
                  backgroundColor: "#020617",
                  color: "#e5e7eb",
                  fontSize: 13,
                }}
                required
              />
            </label>

            <label style={{ fontSize: 13 }}>
              Ссылка на аватар (опционально)
              <input
                type="url"
                value={registerAvatarUrl}
                onChange={(e) => setRegisterAvatarUrl(e.target.value)}
                placeholder="https://…"
                style={{
                  marginTop: 4,
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 999,
                  border: "1px solid #374151",
                  backgroundColor: "#020617",
                  color: "#e5e7eb",
                  fontSize: 13,
                }}
              />
            </label>

            <label style={{ fontSize: 13 }}>
              О себе (опционально)
              <textarea
                value={registerBio}
                onChange={(e) => setRegisterBio(e.target.value)}
                placeholder="Расскажите о себе"
                style={{
                  marginTop: 4,
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 16,
                  border: "1px solid #374151",
                  backgroundColor: "#020617",
                  color: "#e5e7eb",
                  fontSize: 13,
                  minHeight: 60,
                  resize: "vertical",
                }}
              />
            </label>

            <label style={{ fontSize: 13 }}>
              Пароль
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder={`Мин. ${MIN_PASSWORD_LENGTH} символов`}
                style={{
                  marginTop: 4,
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 999,
                  border: "1px solid #374151",
                  backgroundColor: "#020617",
                  color: "#e5e7eb",
                  fontSize: 13,
                }}
                required
              />
            </label>

            {passwordError && (
              <p
                style={{
                  fontSize: 12,
                  color: "#f97316",
                  marginTop: -2,
                }}
              >
                {passwordError}
              </p>
            )}

            <button
              type="submit"
              style={{
                marginTop: 4,
                padding: 8,
                borderRadius: 999,
                border: "none",
                background:
                  "linear-gradient(135deg, #6366f1, #ec4899)",
                color: "white",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Зарегистрироваться
            </button>
          </form>
        )}
      </div>
    </div>
  );
}