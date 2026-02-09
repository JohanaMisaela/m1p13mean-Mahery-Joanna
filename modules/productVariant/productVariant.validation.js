import { z } from "zod";

// Note: avoid z.record() as it crashes in this environment's Zod version
const attributesSchema = z.any().optional().transform((val) => {
    if (!val || typeof val !== "object") return val;
    // Ensure all values are strings for variants
    const result = {};
    for (const key in val) {
        result[key] = String(val[key]);
    }
    return result;
});

export const createVariantSchema = z.object({
    body: z.object({
        attributes: attributesSchema,
        price: z.number().positive("Price must be positive"),
        stock: z.number().int().nonnegative().optional(),
        sku: z.string().optional(),
        images: z.array(z.string()).optional(), // Removed .url() to be consistent with products
    }),
});

export const updateVariantSchema = z.object({
    body: z.object({
        attributes: attributesSchema,
        price: z.number().positive().optional(),
        stock: z.number().int().nonnegative().optional(),
        sku: z.string().optional(),
        images: z.array(z.string()).optional(),
        isActive: z.boolean().optional(),
    }),
});
