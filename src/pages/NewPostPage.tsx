// src/pages/NewPostPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addPostFromServer } from "../store/postsSlice";
import type { Post } from "../store/postsSlice";

const API_BASE = "https://lmbq-backend.onrender.com";

export default function NewPostPage() {
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem("lmbq_token");
    if (!token) {
      setError("Вы не авторизованы");
      return;
    }

    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          caption: caption.trim(),
          imageUrl: imageUrl.trim() || null,
          tags,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Не удалось создать пост");
      }

      const createdPost: Post = await res.json();

      dispatch(addPostFromServer(createdPost));
      navigate("/feed");
    } catch (err: any) {
      setError(err.message || "Ошибка создания поста");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="new-post-form">
        <h1>Новый пост</h1>

        {error && (
          <p style={{ color: "#ff6b6b", fontSize: 13, marginTop: 8 }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ссылка на картинку (можно оставить пустой)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <textarea
            className="new-post-caption"
            placeholder="Подпись к посту"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <input
            type="text"
            placeholder="Теги через запятую (например: travel, summer)"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Создаём..." : "Создать пост"}
          </button>
        </form>
      </div>
    </div>
  );
}