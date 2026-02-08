import { z } from "zod";

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().optional(),
        price: z.number().positive("Price must be positive"),
        stock: z.number().int().nonnegative().optional(),
        images: z.array(z.string()).optional(),
        categories: z.array(z.string()).min(1, "At least one category is required"),
        tags: z.array(z.string()).optional(),
        attributeConfig: z.record(z.union([z.string(), z.array(z.string())]))
            .optional()
            .transform((val) => {
                if (!val) return val;
                const transformed = {};
                for (const [k, v] of Object.entries(val)) {
                    transformed[k] = typeof v === "string"
                        ? v.split(",").map(s => s.trim()).filter(s => s !== "")
                        : v;
                }
                return transformed;
            }),
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
        attributeConfig: z.record(z.union([z.string(), z.array(z.string())]))
            .optional()
            .transform((val) => {
                if (!val) return val;
                const transformed = {};
                for (const [k, v] of Object.entries(val)) {
                    transformed[k] = typeof v === "string"
                        ? v.split(",").map(s => s.trim()).filter(s => s !== "")
                        : v;
                }
                return transformed;
            }),
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
