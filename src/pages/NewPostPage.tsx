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
  const [imageUrlText, setImageUrlText] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const handleImageFilesChange = (files: File[]) => {
    setImageFiles(files);

    if (!files.length) {
      setImagePreviewUrls([]);
      return;
    }

    const urls = files.map((f) => URL.createObjectURL(f));
    setImagePreviewUrls(urls);
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

    let finalImageUrl: string | null = null;

    try {
      setLoading(true);

      // 1) Если пользователь ввёл URL руками — используем его
      if (imageUrlText.trim()) {
        finalImageUrl = imageUrlText.trim();
      } else if (imageFiles.length) {
        // 2) Иначе грузим файлы на бэкенд
        const fd = new FormData();
        imageFiles.forEach((file) => {
          fd.append("files", file); // имя ключа "files" совпадает с upload.array("files")
        });

        const uploadRes = await fetch(`${API_BASE}/api/upload-images`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: fd,
        });

        if (!uploadRes.ok) {
          const err = await uploadRes.json().catch(() => null);
          throw new Error(
            err?.error || "Не удалось загрузить изображения"
          );
        }

        const uploadJson: { urls: string[] } = await uploadRes.json();

        if (!uploadJson.urls || !uploadJson.urls.length) {
          throw new Error("Сервер не вернул URL картинок");
        }

        // Склеиваем все урлы в одну строку — PostCard уже умеет сплитить по "|||"
        finalImageUrl = uploadJson.urls.join("|||");
      }

      const res = await fetch(`${API_BASE}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          caption: caption.trim(),
          imageUrl: finalImageUrl,
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
      setImageUrlText("");
      setTagsText("");
      setImageFiles([]);
      setImagePreviewUrls([]);

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
        imageUrl={imageUrlText}
        tagsText={tagsText}
        error={error}
        loading={loading}
        imagePreviewUrls={imagePreviewUrls}
        onCaptionChange={setCaption}
        onImageUrlChange={setImageUrlText}
        onTagsTextChange={setTagsText}
        onImageFilesChange={handleImageFilesChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}