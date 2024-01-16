import { z } from 'zod';

// validations for user inputs
export const registerSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
})

export const loginSchema = z.object({
    email: z.string(),
    password: z.string().min(6)
})