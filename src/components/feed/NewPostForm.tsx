// src/components/feed/NewPostForm.tsx
import React from "react";

type NewPostFormProps = {
  caption: string;
  imageUrl: string;
  tagsText: string;
  error: string | null;
  loading: boolean;
  imagePreviewUrls: string[];
  onCaptionChange: (v: string) => void;
  onImageUrlChange: (v: string) => void;
  onTagsTextChange: (v: string) => void;
  onImageFilesChange: (files: File[]) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function NewPostForm({
  caption,
  imageUrl,
  tagsText,
  error,
  loading,
  imagePreviewUrls,
  onCaptionChange,
  onImageUrlChange,
  onTagsTextChange,
  onImageFilesChange,
  onSubmit,
}: NewPostFormProps) {
  const handleFilesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    onImageFilesChange(files);
  };

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

        <div style={{ margin: "8px 0" }}>
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px dashed #4b5563",
              backgroundColor: "#020617",
              color: "#e5e7eb",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <span>📎 Добавить файл(ы)</span>
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleFilesChange}
            />
          </label>
        </div>

        {imagePreviewUrls.length > 0 && (
          <div
            style={{
              marginBottom: 8,
              display: "grid",
              gridTemplateColumns:
                imagePreviewUrls.length === 1 ? "1fr" : "1fr 1fr",
              gap: 6,
            }}
          >
            {imagePreviewUrls.map((url, idx) => (
              <div
                key={idx}
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  maxHeight: 200,
                }}
              >
                <img
                  src={url}
                  alt={`Предпросмотр ${idx + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </div>
        )}

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