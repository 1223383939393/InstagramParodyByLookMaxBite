// src/components/feed/PostCard.tsx
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { likePost } from "../../store/postsSlice";
import type { Post } from "../../store/postsSlice";
import type { RootState } from "../../app/store";
import { DEFAULT_AVATAR } from "../../constants/avatar";
import { useNavigate } from "react-router-dom";

type Props = {
  post: Post;
};

export default function PostCard({ post }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const author = useSelector((state: RootState) =>
    state.users.items.find((u) => u.id === post.authorId)
  );

  const currentUserId = useSelector(
    (state: RootState) => state.users.currentUserId
  );

  const [imageError, setImageError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const shouldShowImage = post.imageUrl && !imageError;
  const alreadyLiked =
    post.likedByUserIds?.includes(currentUserId ?? "") ?? false;

  const handleLike = () => {
    if (!currentUserId) return;
    const userId = currentUserId;
    dispatch(likePost({ postId: post.id, userId }));
  };

  const handleAvatarClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    if (author?.id) {
      navigate(`/profile/${author.id}`);
    }
  };

  const avatarSrc =
    !avatarError && author?.avatarUrl
      ? author.avatarUrl
      : DEFAULT_AVATAR;

  return (
    <article className="post-card">
      <header className="post-card__header">
        <img
          src={avatarSrc}
          alt={author?.username}
          className="post-card__avatar"
          onClick={handleAvatarClick}
          onError={() => setAvatarError(true)}
        />
        <div>
          <div className="post-card__username">{author?.username}</div>
          <div className="post-card__meta">{author?.fullName}</div>
        </div>
      </header>

      {shouldShowImage && (
        <div className="post-card__image-wrapper">
          <img
            src={post.imageUrl}
            alt={post.caption}
            className="post-card__image"
            onError={() => setImageError(true)}
          />
        </div>
      )}

      <div className="post-card__body">
        <button
          className="post-card__like-button"
          onClick={handleLike}
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