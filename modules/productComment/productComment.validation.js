import { z } from "zod";

export const productCommentSchema = z.object({
    body: z.object({
        comment: z.string().min(1, "Comment cannot be empty"),
        images: z.array(z.string().url()).optional(),
    }),
    params: z.object({
        productId: z.string().min(1, "Product ID is required"),
    }),
});
