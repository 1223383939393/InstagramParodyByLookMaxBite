// src/pages/ExplorePage.tsx
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import PostCard from "../components/feed/PostCard";

export default function ExplorePage() {
  const posts = useSelector((state: RootState) => state.posts.items);
  const users = useSelector((state: RootState) => state.users.items);

  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return posts.filter((post) => {
      const caption = post.caption.toLowerCase();
      const tagsText = post.tags.join(" ").toLowerCase();
      const author = users.find((u) => u.id === post.authorId) || null;
      const username = author?.username.toLowerCase() || "";
      const fullName = author?.fullName?.toLowerCase() || "";

      // если строка начинается с # — усиленно ищем по тегам
      if (q.startsWith("#")) {
        const tagQuery = q.slice(1);
        return post.tags.some((t) =>
          t.toLowerCase().includes(tagQuery)
        );
      }

      // если начинается с @ — по нику
      if (q.startsWith("@")) {
        const userQuery = q.slice(1);
        return username.includes(userQuery);
      }

      // иначе ищем в подписи, тегах, нике и имени
      return (
        caption.includes(q) ||
        tagsText.includes(q) ||
        username.includes(q) ||
        fullName.includes(q)
      );
    });
  }, [query, posts, users]);

  return (
    <div className="page explore-page">
      <h1>Поиск и рекомендации</h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 12 }}>
        Введите текст, #тег или @ник, чтобы найти посты.
      </p>

      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Например: закат, #travel, @alex"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "8px 12px",
            borderRadius: 999,
            border: "1px solid #1f2937",
            backgroundColor: "#020617",
            color: "#e5e7eb",
            fontSize: 14,
          }}
        />
      </div>

      {!query.trim() && (
        <p style={{ fontSize: 13, color: "#9ca3af" }}>
          Начните вводить, чтобы увидеть результаты поиска.
        </p>
      )}

      {query.trim() && results.length === 0 && (
        <p style={{ fontSize: 13, color: "#9ca3af" }}>
          Ничего не найдено по запросу «{query.trim()}».
        </p>
      )}

      {results.length > 0 && (
        <div className="post-list">
          {results.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}