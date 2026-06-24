// src/components/feed/PostCard.tsx
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { likePost } from "../../store/postsSlice";
import type { Post } from "../../store/postsSlice";
import type { RootState } from "../../app/store";

type Props = {
  post: Post;
};

export default function PostCard({ post }: Props) {
  const dispatch = useDispatch();
  const author = useSelector((state: RootState) =>
    state.users.items.find((u) => u.id === post.authorId)
  );
  const currentUserId = useSelector(
    (state: RootState) => state.users.currentUserId
  );
  const [imageError, setImageError] = useState(false);

  const hasImage = post.imageUrl && !imageError;
  const alreadyLiked =
    post.likedByUserIds?.includes(currentUserId) ?? false;

  const handleLike = () => {
    if (!currentUserId) return;
    dispatch(likePost({ postId: post.id, userId: currentUserId }));
  };

  return (
    <article className="post-card">
      <header className="post-card__header">
        <img
          src={author?.avatarUrl}
          alt={author?.username}
          className="post-card__avatar"
        />
        <div>
          <div className="post-card__username">{author?.username}</div>
          <div className="post-card__meta">{author?.fullName}</div>
        </div>
      </header>

      <div className="post-card__image-wrapper">
        {hasImage ? (
          <img
            src={post.imageUrl}
            alt={post.caption}
            className="post-card__image"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="post-card__image--placeholder">
            NO IMAGE
          </div>
        )}
      </div>

      <div className="post-card__body">
        <button
          className="post-card__like-button"
          onClick={handleLike}
          disabled={alreadyLiked}
        >
          {alreadyLiked ? "💜" : "❤️"} {post.likes}
        </button>
        <p className="post-card__caption">{post.caption}</p>
        <div className="post-card__tags">
          {post.tags.map((tag) => (
            <span key={tag} className="post-card__tag">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}