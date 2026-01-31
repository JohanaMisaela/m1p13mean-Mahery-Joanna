import { z } from "zod";

export const productRatingSchema = z.object({
    body: z.object({
        rating: z.number().int().min(1).max(5),
    }),
    params: z.object({
        productId: z.string().min(1, "Product ID is required"),
    }),
});
