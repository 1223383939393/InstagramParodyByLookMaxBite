// src/components/feed/PostList.tsx
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import PostCard from "./PostCard";

export default function PostList() {
  const { items, search, tagFilter, sortBy } = useSelector(
    (state: RootState) => state.posts
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

  return (
    <div className="post-list">
      {filtered.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}