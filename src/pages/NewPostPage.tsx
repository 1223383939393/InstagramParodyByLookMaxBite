// src/pages/NewPostPage.tsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { useNavigate } from "react-router-dom";
import { addPostFromServer } from "../store/postsSlice";
import NewPostForm from "../components/feed/NewPostForm";

const API_BASE = "https://lmbq-backend.onrender.com";

export default function NewPostPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUserId = useSelector(
    (state: RootState) => state.users.currentUserId
  );

  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleImageFileChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    } else {
      setImagePreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!currentUserId) {
      setError("Сначала войдите в аккаунт");
      return;
    }
    if (!caption.trim()) {
      setError("Нужно написать хотя бы подпись к посту");
      return;
    }

    const token = localStorage.getItem("lmbq_token");
    if (!token) {
      setError("Токен не найден, войдите заново");
      return;
    }

    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      setLoading(true);

      // Пока отправляем только imageUrl (файлы — только для превью на фронте)
      const res = await fetch(`${API_BASE}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          caption: caption.trim(),
          imageUrl: imageUrl.trim() || null,
          tags,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Ошибка создания поста");
      }

      const createdPost = await res.json();
      dispatch(addPostFromServer(createdPost));

      setCaption("");
      setImageUrl("");
      setTagsText("");
      setImageFile(null);
      setImagePreviewUrl(null);

      navigate("/feed");
    } catch (err: any) {
      setError(err.message || "Ошибка создания поста");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <NewPostForm
        caption={caption}
        imageUrl={imageUrl}
        tagsText={tagsText}
        error={error}
        loading={loading}
        imagePreviewUrl={imagePreviewUrl}
        onCaptionChange={setCaption}
        onImageUrlChange={setImageUrl}
        onTagsTextChange={setTagsText}
        onImageFileChange={handleImageFileChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}