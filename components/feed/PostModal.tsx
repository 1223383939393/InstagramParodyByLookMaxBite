// src/components/feed/PostModal.tsx
import type { Post } from "../../store/postsSlice";
import PostCard from "./PostCard";

type Props = {
  post: Post;
  onClose: () => void;
};

export default function PostModal({ post, onClose }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15,23,42,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxWidth: 800,
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <PostCard post={post} />
      </div>
    </div>
  );
}