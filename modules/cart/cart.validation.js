import { z } from "zod";

export const addItemToCartSchema = z.object({
    body: z.object({
        productId: z.string().min(1, "Product ID is required"),
        variantId: z.string().optional(),
        quantity: z.number().int().positive("Quantity must be at least 1").default(1),
    }),
});

export const updateItemQuantitySchema = z.object({
    body: z.object({
        quantity: z.number().int().positive("Quantity must be at least 1"),
    }),
});
