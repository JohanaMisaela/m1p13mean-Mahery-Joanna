import { z } from "zod";

export const createShopSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        logo: z.string().optional(),
        slogan: z.string().optional(),
        description: z.string().optional(),
        mallBoxNumber: z.string().min(1, "Mall box number is required"),
        categories: z.array(z.string()).optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        socialLinks: z.object({
            facebook: z.string().optional(),
            instagram: z.string().optional(),
            tiktok: z.string().optional(),
        }).optional(),
        openingHours: z.string().optional(),
        isActive: z.boolean().optional(),
        tags: z.array(z.string()).optional(),
    }),
});

export const updateShopSchema = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        logo: z.string().optional(),
        slogan: z.string().optional(),
        description: z.string().optional(),
        mallBoxNumber: z.string().optional(),
        categories: z.array(z.string()).optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        socialLinks: z.object({
            facebook: z.string().optional(),
            instagram: z.string().optional(),
            tiktok: z.string().optional(),
        }).optional(),
        openingHours: z.string().optional(),
        isActive: z.boolean().optional(),
        tags: z.array(z.string()).optional(),
    }),
});
