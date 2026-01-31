import { z } from "zod";

export const createPromotionSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().optional(),
        discountPercentage: z.number().min(1).max(100),
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
        products: z.array(z.string()).optional(),
    }).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
        message: "End date must be after start date",
        path: ["endDate"],
    }),
});

export const updatePromotionSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        discountPercentage: z.number().min(1).max(100).optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        isActive: z.boolean().optional(),
    }),
});

export const updatePromotionProductsSchema = z.object({
    body: z.object({
        productIds: z.array(z.string()).min(1, "At least one product ID is required"),
    }),
});
