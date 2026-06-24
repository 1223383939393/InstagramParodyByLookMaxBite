import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useState } from "react";
import PostCard from "./PostCard";
import PostModal from "./PostModal";

export default function PostList() {
  const { items, search, tagFilter, sortBy } = useSelector(
    (state: RootState) => state.posts
  );
  const [openedPostId, setOpenedPostId] = useState<string | null>(null);

  let posts = items;

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    posts = posts.filter((p) => {
      const text = p.caption.toLowerCase();
      const tagsText = p.tags.join(" ").toLowerCase();
      return text.includes(q) || tagsText.includes(q);
    });
  }

  if (tagFilter) {
    posts = posts.filter((p) => p.tags.includes(tagFilter));
  }

  if (sortBy === "new") {
    posts = [...posts].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
  } else {
    posts = [...posts].sort((a, b) => b.likes - a.likes);
  }

  const openedPost = openedPostId
    ? posts.find((p) => p.id === openedPostId) || null
    : null;

  if (!posts.length) {
    return (
      <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
        Посты по этим фильтрам не найдены.
      </p>
    );
  }

  return (
    <>
      <div className="post-list">
        {posts.map((p) => (
          <div
            key={p.id}
            onClick={() => setOpenedPostId(p.id)}
            style={{ cursor: "pointer" }}
          >
            <PostCard post={p} />
          </div>
        ))}
      </div>

      {openedPost && (
        <PostModal
          post={openedPost}
          onClose={() => setOpenedPostId(null)}
        />
      )}
    </>
  );
}