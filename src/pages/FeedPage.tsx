// src/pages/FeedPage.tsx
import PostList from "../components/feed/PostList";
// если были фильтры/поиск — импортируй их тоже

export default function FeedPage() {
  return (
    <div className="page">
      <h1>Лента LMBQ</h1>
      <p
        style={{
          fontSize: 13,
          color: "#9ca3af",
          marginBottom: 12,
        }}
      >
        Здесь показываются посты всех пользователей LMBQ.
        Создавать новые посты можно на отдельной странице “Новый пост”.
      </p>

      {/* Если были фильтры/поисковые поля — оставь их здесь */}
      {/* <FeedFilters /> */}

      <PostList />
    </div>
  );
}