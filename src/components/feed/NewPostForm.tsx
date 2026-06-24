// src/components/feed/NewPostForm.tsx
import React from "react";

type NewPostFormProps = {
  caption: string;
  imageUrl: string;
  tagsText: string;
  error: string | null;
  loading: boolean;
  onCaptionChange: (v: string) => void;
  onImageUrlChange: (v: string) => void;
  onTagsTextChange: (v: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function NewPostForm({
  caption,
  imageUrl,
  tagsText,
  error,
  loading,
  onCaptionChange,
  onImageUrlChange,
  onTagsTextChange,
  onSubmit,
}: NewPostFormProps) {
  return (
    <div className="new-post-form">
      <h1>Новый пост</h1>

      {error && (
        <p style={{ color: "#ff6b6b", fontSize: 13, marginTop: 8 }}>
          {error}
        </p>
      )}

      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Ссылка на картинку (можно оставить пустой)"
          value={imageUrl}
          onChange={(e) => onImageUrlChange(e.target.value)}
        />

        <textarea
          className="new-post-caption"
          placeholder="Подпись к посту"
          value={caption}
          onChange={(e) => onCaptionChange(e.target.value)}
        />

        <input
          type="text"
          placeholder="Теги через запятую (например: travel, summer)"
          value={tagsText}
          onChange={(e) => onTagsTextChange(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Создаём..." : "Создать пост"}
        </button>
      </form>
    </div>
  );
}