import { z } from "zod";

export const productCommentSchema = z.object({
    body: z.object({
        comment: z.string().min(1, "Comment cannot be empty"),
        images: z.array(z.string()).optional(),
    }),
    params: z.object({
        productId: z.string().min(1, "Product ID is required"),
    }),
});

export const updateCommentSchema = z.object({
    body: z.object({
        comment: z.string().min(1, "Comment cannot be empty").optional(),
        images: z.array(z.string()).optional(),
    }),
    params: z.object({
        commentId: z.string().min(1, "Comment ID is required"),
    }),
});

export const deleteCommentSchema = z.object({
    params: z.object({
        commentId: z.string().min(1, "Comment ID is required"),
    }),
});
