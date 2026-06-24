// src/components/feed/PostComments.tsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import type { Post } from "../../store/postsSlice";
import { addCommentToPost } from "../../store/postsSlice";

type PostCommentsProps = {
  post: Post;
  currentUserId: string | null;
};

export default function PostComments({
  post,
  currentUserId,
}: PostCommentsProps) {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUserId) {
      setError("Нужно войти, чтобы комментировать");
      return;
    }
    if (!text.trim()) return;

    const comment = {
      id: crypto.randomUUID(),
      authorId: currentUserId,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    setSending(true);
    dispatch(
      addCommentToPost({
        postId: post.id,
        comment,
      })
    );
    setText("");
    setSending(false);
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
          {post.comments.map((c) => (
            <div
              key={c.id}
              style={{
                fontSize: 13,
                color: "#e5e7eb",
                marginBottom: 4,
              }}
            >
              <span style={{ color: "#9ca3af", fontSize: 11 }}>
                {new Date(c.createdAt).toLocaleString()}
              </span>
              <div>{c.text}</div>
            </div>
          ))}
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