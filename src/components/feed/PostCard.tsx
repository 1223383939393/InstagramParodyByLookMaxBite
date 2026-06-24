// src/components/feed/PostCard.tsx
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import type { Post } from "../../store/postsSlice";
import { DEFAULT_AVATAR } from "../../constants/avatar";
import PostComments from "./PostComments";
import { updatePostFromServer } from "../../store/postsSlice";

const API_BASE = "https://lmbq-backend.onrender.com";

type Props = {
  post: Post;
};

export default function PostCard({ post }: Props) {
  const dispatch = useDispatch();
  const usersState = useSelector((state: RootState) => state.users);
  const author =
    usersState.items.find((u) => u.id === post.authorId) || null;
  const currentUserId = usersState.currentUserId;

  const avatarSrc =
    author?.avatarUrl && author.avatarUrl.trim().length > 0
      ? author.avatarUrl
      : DEFAULT_AVATAR;

  const isLikedByCurrentUser =
    !!currentUserId && post.likedByUserIds.includes(currentUserId);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId) return;

    const token = localStorage.getItem("lmbq_token");
    if (!token) return;

    try {
      const res = await fetch(
        `${API_BASE}/api/posts/${post.id}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        return;
      }
      const updatedPost: Post = await res.json();
      dispatch(updatePostFromServer(updatedPost));
    } catch {
      // тихо игнорируем для учебного проекта
    }
  };

  // разбираем imageUrl на массив для коллажей
  const imageUrls: string[] = post.imageUrl
    ? post.imageUrl
        .split("|||")
        .map((u) => u.trim())
        .filter(Boolean)
    : [];

  const renderImages = () => {
    if (imageUrls.length === 0) return null;

    // одна картинка — почти без кропа
    if (imageUrls.length === 1) {
      return (
        <div
          className="post-card__image-wrapper"
          style={{
            marginTop: 8,
          }}
        >
          <img
            src={imageUrls[0]}
            alt={post.caption}
            className="post-card__image"
            style={{
              width: "100%",
              display: "block",
              borderRadius: 16,
              // если хочешь вообще без обрезки — оставляем contain
              objectFit: "contain",
              maxHeight: 500,
              backgroundColor: "#020617",
            }}
          />
        </div>
      );
    }

    // 2–4 картинки — аккуратный коллаж
    const urls = imageUrls.slice(0, 4);

    return (
      <div
        className="post-card__collage"
        style={{
          marginTop: 8,
          display: "grid",
          gridTemplateColumns:
            urls.length === 2 ? "1fr 1fr" : "1fr 1fr",
          gap: 4,
          borderRadius: 16,
          overflow: "hidden",
          // ограничение по высоте всего блока, чтобы не растягивался бесконечно
          maxHeight: 450,
        }}
      >
        {urls.map((url, idx) => (
          <div
            key={idx}
            style={{
              position: "relative",
              width: "100%",
              // для 2 фоток — прямоугольники 4:3, для 3–4 — квадраты
              aspectRatio: urls.length <= 2 ? "4 / 3" : "1 / 1",
              backgroundColor: "#020617",
            }}
          >
            <img
              src={url}
              alt={`${post.caption} #${idx + 1}`}
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                // мягкий кроп, одинаковый для всех
                objectFit: "cover",
              }}
            />
            {idx === 3 && imageUrls.length > 4 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(15,23,42,0.65)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  color: "#e5e7eb",
                  fontWeight: 600,
                }}
              >
                +{imageUrls.length - 4}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <article className="post-card">
      <header
        className="post-card__header"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <img
          src={avatarSrc}
          alt={author ? author.username : "Автор"}
          style={{
            width: 40,
            height: 40,
            borderRadius: "999px",
            objectFit: "cover",
            border: "1px solid #1f2937",
          }}
        />
        <div>
          <div style={{ fontSize: 14, color: "#e5e7eb" }}>
            {author ? `@${author.username}` : "Неизвестный автор"}
          </div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>
            {author?.fullName}
            {author?.fullName ? " · " : ""}
            {new Date(post.createdAt).toLocaleString()}
          </div>
        </div>
      </header>

      {renderImages()}

      <div
        className="post-card__body"
        style={{ marginTop: 8, fontSize: 14, color: "#e5e7eb" }}
      >
        <p>{post.caption}</p>

        {post.tags.length > 0 && (
          <div
            style={{
              marginTop: 6,
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              fontSize: 12,
              color: "#9ca3af",
            }}
          >
            {post.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}
      </div>

      <footer
        className="post-card__footer"
        style={{
          marginTop: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 12,
          color: "#9ca3af",
        }}
      >
        <button
          type="button"
          onClick={handleLikeClick}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "4px 10px",
            borderRadius: 999,
            border: "none",
            backgroundColor: isLikedByCurrentUser ? "#be123c" : "#111827",
            color: isLikedByCurrentUser ? "#fecaca" : "#e5e7eb",
            cursor: currentUserId ? "pointer" : "default",
            fontSize: 12,
          }}
        >
          <span>{isLikedByCurrentUser ? "❤️" : "🤍"}</span>
          <span>{post.likes}</span>
        </button>

        <span>💬 {post.comments.length}</span>
      </footer>

      <PostComments post={post} currentUserId={currentUserId} />
    </article>
  );
}