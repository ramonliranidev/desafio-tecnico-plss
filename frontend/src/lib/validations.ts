import { z } from 'zod';

// Schema para validação do login
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username é obrigatório')
    .min(3, 'Username deve ter pelo menos 3 caracteres'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

// Schema para validação do registro
export const registerSchema = z.object({
  username: z
    .string()
    .min(1, 'Username é obrigatório')
    .min(3, 'Username deve ter pelo menos 3 caracteres')
    .max(20, 'Username deve ter no máximo 20 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username pode conter apenas letras, números e underscore'),
  team_favorite: z
    .string()
    .min(1, 'Time favorito é obrigatório')
    .min(3, 'Time favorito deve ter pelo menos 3 caracteres')
    .max(20, 'Time favorito deve ter no máximo 20 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha muito longa'),
  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
