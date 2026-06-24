// src/pages/AuthPage.tsx
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { upsertUser, setCurrentUser } from "../store/usersSlice";

const API_BASE = "https://lmbq-backend.onrender.com";

type ApiUser = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  bio: string | null;
};

type ApiAuthResponse = {
  token: string;
  user: ApiUser;
};

async function apiRegister(payload: {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
}): Promise<ApiAuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error || "Ошибка регистрации");
  }
  return res.json();
}

async function apiLogin(payload: {
  emailOrUsername: string;
  password: string;
}): Promise<ApiAuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error || "Ошибка входа");
  }
  return res.json();
}

const MIN_PASSWORD_LENGTH = 6;

const isValidEmail = (email: string) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");
  const [registerAvatarUrl, setRegisterAvatarUrl] = useState("");
  const [registerBio, setRegisterBio] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string) => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`;
    }
    return null;
  };

  const handleLoginSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setGlobalError(null);

    const passErr = validatePassword(loginPassword);
    setPasswordError(passErr);
    if (passErr) return;

    try {
      setLoading(true);
      const result = await apiLogin({
        emailOrUsername: loginUsername.trim(),
        password: loginPassword,
      });

      localStorage.setItem("lmbq_token", result.token);

      dispatch(
        upsertUser({
          id: result.user.id,
          username: result.user.username,
          fullName: result.user.fullName,
          avatarUrl: result.user.avatarUrl,
          bio: result.user.bio,
        })
      );
      dispatch(setCurrentUser(result.user.id));

      navigate("/feed");
    } catch (err: any) {
      setGlobalError(err.message || "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setGlobalError(null);

    const passErr = validatePassword(registerPassword);
    setPasswordError(passErr);
    if (passErr) return;

    const username = registerUsername.trim();
    if (!username) {
      setGlobalError("Логин не может быть пустым");
      return;
    }

    const emailToUse =
      registerEmail.trim() || `${username}@example.com`;

    if (!isValidEmail(emailToUse)) {
      setGlobalError("Введите корректный email");
      return;
    }

    try {
      setLoading(true);
      const result = await apiRegister({
        username,
        email: emailToUse,
        password: registerPassword,
        fullName:
          registerFullName.trim() || registerUsername.trim(),
        avatarUrl: registerAvatarUrl.trim() || undefined,
        bio: registerBio.trim() || undefined,
      });

      localStorage.setItem("lmbq_token", result.token);

      dispatch(
        upsertUser({
          id: result.user.id,
          username: result.user.username,
          fullName: result.user.fullName,
          avatarUrl: result.user.avatarUrl,
          bio: result.user.bio,
        })
      );
      dispatch(setCurrentUser(result.user.id));

      navigate("/feed");
    } catch (err: any) {
      setGlobalError(err.message || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__branding">
        <h1 className="auth-logo">PIXLY</h1>
        <p className="auth-tagline">
          Делись моментами. Открывай новое. Следи за друзьями.
        </p>
      </div>

      <div className="auth-page__card">
        <div className="auth-card-inner">
          <p className="auth-mode-toggle">
            {mode === "login"
              ? "Нет аккаунта?"
              : "Уже есть аккаунт?"}{" "}
            <button
              type="button"
              onClick={() =>
                setMode((prev) =>
                  prev === "login" ? "register" : "login"
                )
              }
            >
              {mode === "login" ? "Зарегистрироваться" : "Войти"}
            </button>
          </p>

          <h2 className="auth-title">
            {mode === "login"
              ? "Вход в Pixly"
              : "Регистрация в Pixly"}
          </h2>
          <p className="auth-subtitle">
            {mode === "login"
              ? "Добро пожаловать обратно! Войдите, чтобы посмотреть ленту."
              : "Создайте аккаунт и начинайте публиковать свои снимки."}
          </p>

          {globalError && (
            <p className="auth-error-global">{globalError}</p>
          )}
          {passwordError && (
            <p className="auth-error-password">{passwordError}</p>
          )}

          {mode === "login" ? (
            <form
              onSubmit={handleLoginSubmit}
              className="auth-form"
            >
              <input
                placeholder="Логин или email"
                value={loginUsername}
                onChange={(e) =>
                  setLoginUsername(e.target.value)
                }
              />
              <input
                type="password"
                placeholder="Пароль"
                value={loginPassword}
                onChange={(e) =>
                  setLoginPassword(e.target.value)
                }
              />
              <button type="submit" disabled={loading}>
                {loading ? "Входим..." : "Войти"}
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleRegisterSubmit}
              className="auth-form"
            >
              <input
                placeholder="Логин"
                value={registerUsername}
                onChange={(e) =>
                  setRegisterUsername(e.target.value)
                }
              />
              <input
                placeholder="Email"
                value={registerEmail}
                onChange={(e) =>
                  setRegisterEmail(e.target.value)
                }
              />
              <input
                placeholder="Полное имя"
                value={registerFullName}
                onChange={(e) =>
                  setRegisterFullName(e.target.value)
                }
              />
              <input
                placeholder="URL аватара"
                value={registerAvatarUrl}
                onChange={(e) =>
                  setRegisterAvatarUrl(e.target.value)
                }
              />
              <input
                placeholder="Био"
                value={registerBio}
                onChange={(e) =>
                  setRegisterBio(e.target.value)
                }
              />
              <input
                type="password"
                placeholder="Пароль"
                value={registerPassword}
                onChange={(e) =>
                  setRegisterPassword(e.target.value)
                }
              />
              <button type="submit" disabled={loading}>
                {loading ? "Создаём..." : "Зарегистрироваться"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}