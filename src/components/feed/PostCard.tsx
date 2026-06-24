import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../app/store";
import type { Post } from "../../store/postsSlice";
import { DEFAULT_AVATAR } from "../../constants/avatar";
import PostComments from "./PostComments";
import { toggleLike } from "../../store/postsSlice";

type Props = {
  post: Post;
};

export default function PostCard({ post }: Props) {
  const dispatch = useDispatch();
  const usersState = useSelector((state: RootState) => state.users);
  const author = usersState.items.find((u) => u.id === post.authorId) || null;
  const currentUserId = usersState.currentUserId;

  const avatarSrc =
    author?.avatarUrl && author.avatarUrl.trim().length > 0
      ? author.avatarUrl
      : DEFAULT_AVATAR;

  const isLikedByCurrentUser =
    !!currentUserId && post.likedByUserIds.includes(currentUserId);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId) return;
    dispatch(
      toggleLike({
        postId: post.id,
        userId: currentUserId,
      })
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

      {post.imageUrl && (
        <div className="post-card__image-wrapper">
          <img
            src={post.imageUrl}
            alt={post.caption}
            className="post-card__image"
            style={{
              width: "100%",
              borderRadius: 16,
              objectFit: "cover",
              maxHeight: 400,
            }}
          />
        </div>
      )}

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