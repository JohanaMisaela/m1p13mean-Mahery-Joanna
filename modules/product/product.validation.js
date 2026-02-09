import { z } from "zod";

// Note: avoid z.record() as it crashes in this environment's Zod version
const attributeConfigSchema = z.any().optional().transform((val) => {
    if (!val || typeof val !== "object") return val;
    const result = {};
    for (const key in val) {
        const v = val[key];
        result[key] = Array.isArray(v)
            ? v
            : (typeof v === "string" ? v.split(",").map(s => s.trim()).filter(Boolean) : []);
    }
    return result;
});

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().optional(),
        price: z.number().positive("Price must be positive"),
        stock: z.number().int().nonnegative().optional(),
        images: z.array(z.string()).optional(),
        categories: z.array(z.string()).min(1, "At least one category is required"),
        shop: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid shop ID"),
        tags: z.array(z.string()).optional(),
        attributeConfig: attributeConfigSchema,
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
        categories: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        attributeConfig: attributeConfigSchema,
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
