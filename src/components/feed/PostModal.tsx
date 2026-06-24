// src/components/feed/PostModal.tsx
import type { Post } from "../../store/postsSlice";
import PostCard from "./PostCard";

type PostModalProps = {
  post: Post;
  onClose: () => void;
};

export default function PostModal({ post, onClose }: PostModalProps) {
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
          maxWidth: "min(900px, 95vw)",
          maxHeight: "90vh",
          width: "100%",
          backgroundColor: "#020617",
          borderRadius: 16,
          border: "1px solid #1f2937",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <PostCard post={post} />
      </div>
    </div>
  );
}