import { z } from "zod";

export const addAddressSchema = z.object({
    body: z.object({
        street: z.string().min(1, "Street is required"),
        city: z.string().min(1, "City is required"),
        zip: z.string().min(1, "Zip code is required"),
        country: z.string().min(1, "Country is required"),
        isDefault: z.boolean().optional(),
    }),
});

export const updateAddressSchema = z.object({
    body: z.object({
        street: z.string().min(1).optional(),
        city: z.string().min(1).optional(),
        zip: z.string().min(1).optional(),
        country: z.string().min(1).optional(),
        isDefault: z.boolean().optional(),
    }),
});

export const updateAddressStatusSchema = z.object({
    body: z.object({
        isActive: z.boolean(),
    }),
});
