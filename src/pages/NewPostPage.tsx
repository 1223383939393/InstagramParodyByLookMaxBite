// src/pages/NewPostPage.tsx
import NewPostForm from "../components/feed/NewPostForm";

export default function NewPostPage() {
  return (
    <div className="page">
      <h1>Создать новый пост</h1>
      <p
        style={{
          fontSize: 13,
          color: "#9ca3af",
          marginBottom: 12,
        }}
      >
        Заполни подпись, добавь картинку (по желанию) и теги. Пост увидят все пользователи LMBQ.
      </p>
      <NewPostForm />
    </div>
  );
}