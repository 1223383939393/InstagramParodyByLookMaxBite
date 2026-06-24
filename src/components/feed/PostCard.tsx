// src/components/feed/PostCard.tsx
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
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
      // тихо игнорируем
    }
  };

  // массив ссылок на картинки
  const imageUrls: string[] = post.imageUrl
    ? post.imageUrl
        .split("|||")
        .map((u) => u.trim())
        .filter(Boolean)
    : [];

  // массив ссылок на аудио
  const audioUrls: string[] = post.audioUrl
    ? post.audioUrl
        .split("|||")
        .map((u) => u.trim())
        .filter(Boolean)
    : [];

  // индекс текущего фото для карусели (если их 3+)
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!imageUrls.length) return;
    setCurrentIndex((prev) =>
      prev === 0 ? imageUrls.length - 1 : prev - 1
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!imageUrls.length) return;
    setCurrentIndex((prev) =>
      prev === imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const renderImages = () => {
    if (imageUrls.length === 0) return null;

    // одна картинка — без кропа
    if (imageUrls.length === 1) {
      return (
        <div
          className="post-card__image-wrapper"
          style={{ marginTop: 8 }}
        >
          <img
            src={imageUrls[0]}
            alt={post.caption}
            style={{
              width: "100%",
              display: "block",
              borderRadius: 16,
              objectFit: "contain",
              maxHeight: 500,
              backgroundColor: "#020617",
            }}
          />
        </div>
      );
    }

    // две картинки — простой коллаж
    if (imageUrls.length === 2) {
      return (
        <div
          className="post-card__collage-two"
          style={{
            marginTop: 8,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 4,
            borderRadius: 16,
            overflow: "hidden",
            maxHeight: 450,
          }}
        >
          {imageUrls.map((url, idx) => (
            <div
              key={idx}
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "4 / 3",
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
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </div>
      );
    }

    // три и больше — карусель
    const currentUrl = imageUrls[currentIndex];

    return (
      <div
        className="post-card__carousel"
        style={{
          marginTop: 8,
          position: "relative",
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: "#020617",
        }}
      >
        <div
          style={{
            width: "100%",
            maxHeight: 500,
          }}
        >
          <img
            src={currentUrl}
            alt={`${post.caption} #${currentIndex + 1}`}
            style={{
              width: "100%",
              height: "100%",
              maxHeight: 500,
              display: "block",
              objectFit: "contain",
              backgroundColor: "#020617",
            }}
          />
        </div>

        {/* левая стрелка */}
        <button
          type="button"
          onClick={handlePrev}
          style={{
            position: "absolute",
            top: "50%",
            left: 8,
            transform: "translateY(-50%)",
            border: "none",
            borderRadius: "999px",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(15,23,42,0.7)",
            color: "#e5e7eb",
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          ‹
        </button>

        {/* правая стрелка */}
        <button
          type="button"
          onClick={handleNext}
          style={{
            position: "absolute",
            top: "50%",
            right: 8,
            transform: "translateY(-50%)",
            border: "none",
            borderRadius: "999px",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(15,23,42,0.7)",
            color: "#e5e7eb",
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          ›
        </button>

        {/* индикаторы снизу */}
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 8px",
            borderRadius: 999,
            backgroundColor: "rgba(15,23,42,0.7)",
          }}
        >
          {imageUrls.map((_, idx) => (
            <span
              key={idx}
              style={{
                width: 6,
                height: 6,
                borderRadius: "999px",
                backgroundColor:
                  idx === currentIndex ? "#e5e7eb" : "#4b5563",
              }}
            />
          ))}
          <span
            style={{
              fontSize: 11,
              color: "#e5e7eb",
              marginLeft: 6,
            }}
          >
            {currentIndex + 1}/{imageUrls.length}
          </span>
        </div>
      </div>
    );
  };

  const renderAudio = () => {
    if (!audioUrls.length) return null;

    return (
      <div
        className="post-card__audio"
        style={{
          marginTop: 10,
          padding: 8,
          borderRadius: 12,
          backgroundColor: "#020617",
          border: "1px solid #1f2937",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {/* основной плеер — первый трек */}
        <audio
          controls
          src={audioUrls[0]}
          style={{ width: "100%" }}
        >
          Ваш браузер не поддерживает аудио.
        </audio>

        {/* список треков, если их несколько */}
        {audioUrls.length > 1 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              fontSize: 12,
              color: "#9ca3af",
            }}
          >
            {audioUrls.map((url, idx) => (
              <div
                key={url}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>🎵</span>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#e5e7eb",
                    textDecoration: "underline",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "100%",
                  }}
                >
                  Трек {idx + 1}
                </a>
              </div>
            ))}
          </div>
        )}
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

      {renderAudio()}

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