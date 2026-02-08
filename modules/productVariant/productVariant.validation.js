import { z } from "zod";

export const createVariantSchema = z.object({
    body: z.object({
        attributes: z.record(z.string()).optional(),
        price: z.number().positive("Price must be positive"),
        stock: z.number().int().nonnegative().optional(),
        sku: z.string().optional(),
        images: z.array(z.string().url()).optional(),
    }),
});

export const updateVariantSchema = z.object({
    body: z.object({
        attributes: z.record(z.string()).optional(),
        price: z.number().positive().optional(),
        stock: z.number().int().nonnegative().optional(),
        sku: z.string().optional(),
        images: z.array(z.string().url()).optional(),
        isActive: z.boolean().optional(),
    }),
});
