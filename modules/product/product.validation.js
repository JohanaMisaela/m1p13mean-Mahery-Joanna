import { z } from "zod";

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().optional(),
        price: z.number().positive("Price must be positive"),
        stock: z.number().int().nonnegative().optional(),
        images: z.array(z.string()).optional(),
        category: z.string().min(1, "Category is required"),
        shop: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid shop ID"),
        tags: z.array(z.string()).optional(),
        attributeConfig: z.record(z.array(z.string())).optional(),
    }),
});

export const updateProductSchema = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        price: z.number().positive().optional(),
        stock: z.number().int().nonnegative().optional(),
        images: z.array(z.string()).optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        attributeConfig: z.record(z.array(z.string())).optional(),
        isActive: z.boolean().optional(),
    }),
});

export const setProductActiveSchema = z.object({
    body: z.object({
        isActive: z.boolean(),
    }),
});

export const favoriteProductSchema = z.object({
    body: z.object({
        favorite: z.boolean(),
    }),
});
