// src/components/feed/NewPostForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { postSchema } from "../../schemas/postSchema";
import type { PostFormValues } from "../../schemas/postSchema";
import { addPost } from "../../store/postsSlice";
import { useState } from "react";
import type { ChangeEvent } from "react";

export default function NewPostForm() {
  const dispatch = useDispatch();
  const [fileImageUrl, setFileImageUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      authorId: "user1",
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
    const tagsArray = data.tags
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);

    const finalImageUrl = fileImageUrl || data.imageUrl || "";

    dispatch(
      addPost({
        id: nanoid(),
        authorId: data.authorId,
        imageUrl: finalImageUrl,
        caption: data.caption,
        tags: tagsArray,
        likes: 0,
        createdAt: new Date().toISOString(),
      })
    );

    setFileImageUrl(null);

    reset({
      authorId: "user1",
      imageUrl: "",
      caption: "",
      tags: "",
      likes: 0,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <form className="new-post-form" onSubmit={handleSubmit(onSubmit)}>
      <input
        placeholder="Ссылка на картинку (можно пустым)"
        {...register("imageUrl")}
      />
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <p>{errors.imageUrl?.message}</p>

      <textarea
        placeholder="Подпись к посту"
        {...register("caption")}
      />
      <p>{errors.caption?.message}</p>

      <input
        placeholder="Теги через запятую (f1, racing)"
        {...register("tags")}
      />
      <p>{errors.tags?.message}</p>

      <button type="submit">Запостить</button>
    </form>
  );
}