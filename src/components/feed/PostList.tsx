// src/components/feed/PostList.tsx
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import PostCard from "./PostCard";
import PostModal from "./PostModal";
import { useState } from "react";

export default function PostList() {
  const { items, search, tagFilter, sortBy } = useSelector(
    (state: RootState) => state.posts
  );
  const [selectedPostId, setSelectedPostId] = useState<string | null>(
    null
  );

  const filtered = [...items]
    .filter((p) =>
      search
        ? p.caption.toLowerCase().includes(search.toLowerCase()) ||
          p.tags.some((t: string) =>
            t.toLowerCase().includes(search.toLowerCase())
          )
        : true
    )
    .filter((p) =>
      tagFilter === "all" ? true : p.tags.includes(tagFilter)
    )
    .sort((a, b) => {
      if (sortBy === "likes") return b.likes - a.likes;
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });

  const selectedPost =
    filtered.find((p) => p.id === selectedPostId) ?? null;

  return (
    <>
      <div className="post-list">
        {filtered.map((post) => (
          <div
            key={post.id}
            onClick={() => setSelectedPostId(post.id)}
            style={{ cursor: "pointer" }}
          >
            <PostCard post={post} />
          </div>
        ))}
      </div>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPostId(null)}
        />
      )}
    </>
  );
}