import { z } from 'zod';


export const addressvalidation  = z.object({
    lineOne: z.string(),
    lineTwo: z.string(),
    city: z.string(),
    country: z.string(),
    pincode: z.string().max(6),
})