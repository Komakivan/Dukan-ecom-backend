import { z } from 'zod';


export const productValidation = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    tags: z.array(z.string()),
})

export const cartValidation = z.object({
    quantity: z.number().optional(),
})