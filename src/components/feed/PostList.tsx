// src/components/feed/PostList.tsx
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import PostCard from "./PostCard";

export default function PostList() {
  const posts = useSelector((state: RootState) => state.posts.items);

  if (!posts.length) {
    return (
      <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
        Пока нет ни одного поста.
      </p>
    );
  }

  return (
    <div className="post-list">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}