import { z } from "zod";

export const shopRatingSchema = z.object({
    body: z.object({
        rating: z.number().int().min(1).max(5),
    }),
    params: z.object({
        shopId: z.string().min(1, "Shop ID is required"),
    }),
});
