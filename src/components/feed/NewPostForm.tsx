import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { addPost } from "../../store/postsSlice";
import type { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";

export default function NewPostForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUserId = useSelector(
    (state: RootState) => state.users.currentUserId
  );

  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  if (!currentUserId) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFileUrl(url);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const tags =
      tagsInput
        .split("#")
        .map((t) => t.trim())
        .filter(Boolean) ?? [];

    const trimmedImageUrl = imageUrl.trim();
    const finalImageUrl =
      fileUrl ?? (trimmedImageUrl.length > 0 ? trimmedImageUrl : undefined);

    dispatch(
      addPost({
        id: crypto.randomUUID(),
        authorId: currentUserId,
        caption: caption.trim(),
        imageUrl: finalImageUrl,
        tags,
      })
    );

    setCaption("");
    setImageUrl("");
    setTagsInput("");
    setFileUrl(null);

    navigate("/feed");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <h2 style={{ marginBottom: 4 }}>Новый пост</h2>

      <label style={{ fontSize: 13 }}>
        Описание
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Напишите текст поста"
          style={{
            marginTop: 4,
            width: "100%",
            padding: "8px 10px",
            borderRadius: 16,
            border: "1px solid #374151",
            backgroundColor: "#020617",
            color: "#e5e7eb",
            fontSize: 13,
            minHeight: 60,
            resize: "vertical",
          }}
          required
        />
      </label>

      <label style={{ fontSize: 13 }}>
        Ссылка на изображение (опционально)
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://…"
          style={{
            marginTop: 4,
            width: "100%",
            padding: "8px 10px",
            borderRadius: 999,
            border: "1px solid #374151",
            backgroundColor: "#020617",
            color: "#e5e7eb",
            fontSize: 13,
          }}
        />
      </label>

      <label style={{ fontSize: 13 }}>
        Загрузить файл (опционально)
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{
            marginTop: 4,
            width: "100%",
            padding: "6px 10px",
            borderRadius: 999,
            border: "1px solid #374151",
            backgroundColor: "#020617",
            color: "#e5e7eb",
            fontSize: 13,
          }}
        />
      </label>

      <label style={{ fontSize: 13 }}>
        Теги (например: #music #travel)
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="#tag1 #tag2"
          style={{
            marginTop: 4,
            width: "100%",
            padding: "8px 10px",
            borderRadius: 999,
            border: "1px solid #374151",
            backgroundColor: "#020617",
            color: "#e5e7eb",
            fontSize: 13,
          }}
        />
      </label>

      <button
        type="submit"
        style={{
          marginTop: 4,
          padding: 8,
          borderRadius: 999,
          border: "none",
          background:
            "linear-gradient(135deg, #6366f1, #ec4899)",
          color: "white",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        Опубликовать пост
      </button>
    </form>
  );
}