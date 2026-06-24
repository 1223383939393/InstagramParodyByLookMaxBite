// src/pages/FeedPage.tsx
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPostsFromServer } from "../store/postsSlice";
import type { Post } from "../store/postsSlice";
import PostList from "../components/feed/PostList";

const API_BASE = "https://lmbq-backend.onrender.com";

export default function FeedPage() {
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPosts = (showLoading = true) => {
    const token = localStorage.getItem("lmbq_token");
    if (!token) {
      setError("Вы не авторизованы");
      return;
    }

    if (showLoading) setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.error || "Не удалось загрузить посты");
        }
        return res.json();
      })
      .then((postsFromServer: Post[]) => {
        dispatch(setPostsFromServer(postsFromServer));
      })
      .catch((err: any) => {
        setError(err.message || "Ошибка загрузки ленты");
      })
      .finally(() => {
        if (showLoading) setLoading(false);
      });
  };

  useEffect(() => {
    // первый запрос
    fetchPosts(true);

    // автообновление каждые 15 секунд без спиннера
    const intervalId = setInterval(() => fetchPosts(false), 15000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <h1>Лента</h1>
        <button
          type="button"
          onClick={() => fetchPosts(true)}
          style={{
            padding: "4px 10px",
            borderRadius: 999,
            border: "1px solid #4b5563",
            backgroundColor: "#111827",
            color: "#e5e7eb",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Обновить
        </button>
      </div>

      {loading && (
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Загружаем посты...
        </p>
      )}

      {error && (
        <p style={{ fontSize: 13, color: "#ff6b6b" }}>{error}</p>
      )}

      <div className="post-list" style={{ marginTop: 16 }}>
        <PostList />
      </div>
    </div>
  );
}