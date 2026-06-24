import { useState } from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import type { Post } from "../../store/postsSlice";
import { addCommentToPost } from "../../store/postsSlice";
import type { RootState } from "../../app/store";

const API_BASE = "https://lmbq-backend.onrender.com";

type PostCommentsProps = {
  post: Post;
  currentUserId: string | null;
};

export default function PostComments({
  post,
  currentUserId,
}: PostCommentsProps) {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.items);

  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUserId) {
      setError("Нужно войти, чтобы комментировать");
      return;
    }
    if (!text.trim()) return;

    const token = localStorage.getItem("lmbq_token");
    if (!token) {
      setError("Токен не найден, войдите заново");
      return;
    }

    try {
      setSending(true);
      const res = await fetch(
        `${API_BASE}/api/posts/${post.id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: text.trim() }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(
          err?.error || "Не удалось отправить комментарий"
        );
      }

      const createdComment = await res.json();
      dispatch(
        addCommentToPost({
          postId: post.id,
          comment: createdComment,
        })
      );
      setText("");
    } catch (err: any) {
      setError(err.message || "Ошибка отправки комментария");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ marginTop: 12 }}>
      {post.comments.length > 0 && (
        <div
          style={{
            marginBottom: 8,
            borderTop: "1px solid #1f2937",
            paddingTop: 8,
          }}
        >
          {post.comments.map((c) => {
            const author =
              users.find((u) => u.id === c.authorId) || null;

            return (
              <div
                key={c.id}
                style={{
                  fontSize: 13,
                  color: "#e5e7eb",
                  marginBottom: 4,
                }}
              >
                <div style={{ fontSize: 12, color: "#9ca3af" }}>
                  {author ? `@${author.username}` : "Неизвестный"} ·{" "}
                  {new Date(c.createdAt).toLocaleString()}
                </div>
                <div>{c.text}</div>
              </div>
            );
          })}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 6 }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Напишите комментарий…"
          style={{
            flex: 1,
            padding: "6px 10px",
            borderRadius: 999,
            border: "1px solid #374151",
            backgroundColor: "#020617",
            color: "#e5e7eb",
            fontSize: 13,
          }}
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            border: "none",
            background:
              "linear-gradient(135deg, #6366f1, #ec4899)",
            color: "white",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Отпр.
        </button>
      </form>

      {error && (
        <p style={{ color: "#ff6b6b", fontSize: 12, marginTop: 4 }}>
          {error}
        </p>
      )}
    </div>
  );
}