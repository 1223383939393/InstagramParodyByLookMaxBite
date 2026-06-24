import { useDispatch } from "react-redux";
import type { Post } from "../../store/postsSlice";
import { updatePostFromServer } from "../../store/postsSlice";

const API_BASE = "https://lmbq-backend.onrender.com";

type PostCardProps = {
  post: Post;
  onOpen?: () => void; // если у тебя есть модалка/клик по посту
};

export default function PostCard({ post, onOpen }: PostCardProps) {
  const dispatch = useDispatch();

  const handleLikeClick = async () => {
    const token = localStorage.getItem("lmbq_token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/posts/${post.id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Не удалось обновить лайк");
      }

      const updatedPost: Post = await res.json();
      dispatch(updatePostFromServer(updatedPost));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <article
      className="post-card"
      style={{
        borderRadius: 16,
        border: "1px solid #1f2937",
        padding: 12,
        marginBottom: 12,
        backgroundColor: "#020617",
      }}
    >
      {/* Верх: автор и дата */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>
            {post.authorId}
          </span>
          <span
            style={{
              fontSize: 11,
              color: "#6b7280",
            }}
          >
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>

        {onOpen && (
          <button
            type="button"
            onClick={onOpen}
            style={{
              fontSize: 11,
              padding: "4px 8px",
              borderRadius: 999,
              border: "1px solid #374151",
              backgroundColor: "#020617",
              color: "#9ca3af",
              cursor: "pointer",
            }}
          >
            Открыть
          </button>
        )}
      </header>

      {/* Картинка */}
      {post.imageUrl && (
        <div
          style={{
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: 8,
          }}
        >
          <img
            src={post.imageUrl}
            alt={post.caption}
            style={{
              width: "100%",
              display: "block",
              objectFit: "cover",
              maxHeight: 360,
            }}
          />
        </div>
      )}

      {/* Подпись */}
      <p
        style={{
          marginBottom: 8,
          fontSize: 13,
          color: "#e5e7eb",
        }}
      >
        {post.caption}
      </p>

      {/* Теги */}
      {post.tags.length > 0 && (
        <div
          style={{
            marginBottom: 8,
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              style={{
                fontSize: 11,
                padding: "2px 8px",
                borderRadius: 999,
                border: "1px solid #374151",
                color: "#93c5fd",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Низ: лайки и комменты */}
      <footer
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 4,
        }}
      >
        <button
          type="button"
          onClick={handleLikeClick}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            padding: "4px 8px",
            borderRadius: 999,
            border: "none",
            background: "linear-gradient(135deg, #6366f1, #ec4899)",
            color: "white",
            cursor: "pointer",
          }}
        >
          ❤️ {post.likes}
        </button>

        {post.comments.length > 0 && (
          <span
            style={{
              fontSize: 11,
              color: "#9ca3af",
            }}
          >
            Комментариев: {post.comments.length}
          </span>
        )}
      </footer>
    </article>
  );
}