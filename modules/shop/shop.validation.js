import { z } from "zod";

export const createShopSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        mallBoxNumber: z.string().min(1, "Mall Box Number is required"),
        logo: z.string().optional(),
        slogan: z.string().optional(),
        description: z.string().optional(),
        categories: z.array(z.string()).optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        socialLinks: z.object({
            facebook: z.string().optional(),
            instagram: z.string().optional(),
            tiktok: z.string().optional(),
        }).optional(),
        openingHours: z.string().optional(),
        tags: z.array(z.string()).optional(),
        gallery: z.array(z.string()).optional(),
    }),
});

export const updateShopSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        logo: z.string().optional(),
        slogan: z.string().optional(),
        description: z.string().optional(),
        categories: z.array(z.string()).optional(),
        phone: z.string().optional(),
        email: z.string().email().optional().or(z.literal("")),
        socialLinks: z.object({
            facebook: z.string().optional(),
            instagram: z.string().optional(),
            tiktok: z.string().optional(),
        }).optional(),
        openingHours: z.string().optional(),
        tags: z.array(z.string()).optional(),
        gallery: z.array(z.string()).optional(),
        mallBoxNumber: z.string().optional(), // Restricted to admin in controller
        owner: z.string().optional(), // Restricted to admin in controller
        isActive: z.boolean().optional(), // Restricted to admin in controller
    }),
});
