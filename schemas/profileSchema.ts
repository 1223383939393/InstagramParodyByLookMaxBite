import { z } from "zod";

export const profileSchema = z.object({
  id: z.string(),
  username: z.string().min(3, "Минимум 3 символа"),
  fullName: z.string().min(3, "Минимум 3 символа"),
  avatarUrl: z.string().url("Должна быть ссылка на картинку"),
  bio: z.string().max(160, "Максимум 160 символов"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;