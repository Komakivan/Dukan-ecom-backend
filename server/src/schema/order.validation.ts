import { z } from 'zod';


export const orderValidation = z.object({
    netAmount: z.number()
})