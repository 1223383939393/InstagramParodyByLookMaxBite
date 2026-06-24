// src/pages/FeedPage.tsx
import PostList from "../components/feed/PostList";

export default function FeedPage() {
  return (
    <div
      className="page"
      style={{
        paddingLeft: 82,   // было 32, добавили ~50 пикселей
        paddingRight: 24,
        paddingTop: 24,
      }}
    >
      <h1 style={{ marginBottom: 8 }}>Лента LMBQ</h1>
      <p
        style={{
          fontSize: 13,
          color: "#9ca3af",
          marginBottom: 16,
        }}
      >
        Здесь показываются посты всех пользователей LMBQ.
        Создавать новые посты можно на странице “Новый пост”.
      </p>

      <PostList />
    </div>
  );
}