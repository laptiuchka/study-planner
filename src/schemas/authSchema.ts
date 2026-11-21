import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Ім'я користувача є обов'язковим"),
  password: z
    .string()
    .min(1, "Пароль є обов'язковим")
    .min(6, 'Пароль має містити щонайменше 6 символів'),
});

export type LoginFormData = z.infer<typeof loginSchema>;