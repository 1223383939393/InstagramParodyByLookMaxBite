import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import PostCard from "./PostCard";
import { useState } from "react";
import PostModal from "./PostModal";

export default function PostList() {
  const postsState = useSelector((state: RootState) => state.posts);
  const { items, search, tagFilter, sortBy } = postsState;

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  let filtered = items.filter((post) => {
    const matchesSearch =
      !search ||
      post.caption.toLowerCase().includes(search.toLowerCase()) ||
      post.tags.some((t) =>
        t.toLowerCase().includes(search.toLowerCase())
      );

    const matchesTag =
      tagFilter ? post.tags.includes(tagFilter) : true;

    return matchesSearch && matchesTag;
  });

  if (sortBy === "top") {
    filtered = [...filtered].sort((a, b) => b.likes - a.likes);
  } else {
    // "new" — сортировка по дате, новые сверху
    filtered = [...filtered].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
  }

  const selectedPost =
    selectedPostId != null
      ? filtered.find((p) => p.id === selectedPostId) ?? null
      : null;

  return (
    <>
      <div className="post-list">
        {filtered.map((post) => (
          <div
            key={post.id}
            onClick={() => setSelectedPostId(post.id)}
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