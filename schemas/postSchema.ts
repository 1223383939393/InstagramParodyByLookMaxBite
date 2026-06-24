import { z } from "zod";

export const postSchema = z.object({
  authorId: z.string(),
  imageUrl: z
    .string()
    .url("Должна быть ссылка на картинку")
    .or(z.literal("")), // разрешаем пустую строку
  caption: z
    .string()
    .min(3, "Минимум 3 символа"),
  tags: z
    .string()
    .min(1, "Нужен хотя бы один тег"),
  likes: z.number().min(0),
  createdAt: z.string(),
});

export type PostFormValues = z.infer<typeof postSchema>;