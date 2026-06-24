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

  useEffect(() => {
    const token = localStorage.getItem("lmbq_token");
    if (!token) {
      setError("Вы не авторизованы");
      return;
    }

    setLoading(true);
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
        setLoading(false);
      });
  }, [dispatch]);

  return (
    <div className="page">
      <h1>Лента</h1>

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