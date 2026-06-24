// src/components/feed/NewPostForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { postSchema } from "../../schemas/postSchema";
import type { PostFormValues } from "../../schemas/postSchema";
import { addPost } from "../../store/postsSlice";
import { useState } from "react";
import type { ChangeEvent } from "react";
import type { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";

export default function NewPostForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUserId = useSelector(
    (state: RootState) => state.users.currentUserId
  );
  const [fileImageUrl, setFileImageUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      authorId: currentUserId ?? "",
      imageUrl: "",
      caption: "",
      tags: "",
      likes: 0,
      createdAt: new Date().toISOString(),
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFileImageUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setFileImageUrl(url);
  };

  const onSubmit = (data: PostFormValues) => {
    if (!currentUserId) return;

    const tagsArray = data.tags
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);

    const finalImageUrl = fileImageUrl || data.imageUrl || "";

    dispatch(
      addPost({
        id: nanoid(),
        authorId: currentUserId,
        imageUrl: finalImageUrl,
        caption: data.caption,
        tags: tagsArray,
        likes: 0,
        createdAt: new Date().toISOString(),
      })
    );

    setFileImageUrl(null);

    reset({
      authorId: currentUserId,
      imageUrl: "",
      caption: "",
      tags: "",
      likes: 0,
      createdAt: new Date().toISOString(),
    });

    navigate("/feed");
  };

  return (
    <form className="new-post-form" onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        placeholder="Ссылка на картинку (можно пустым)"
        {...register("imageUrl")}
      />
      <p>{errors.imageUrl?.message}</p>

      <label className="file-input-label">
        {fileImageUrl ? "Файл выбран" : "Выбрать файл"}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>

      <textarea
        className="new-post-caption"
        placeholder="Подпись к посту"
        {...register("caption")}
      />
      <p>{errors.caption?.message}</p>

      <input
        type="text"
        placeholder="Теги через запятую (f1, racing)"
        {...register("tags")}
      />
      <p>{errors.tags?.message}</p>

      <button type="submit">Запостить</button>
    </form>
  );
}