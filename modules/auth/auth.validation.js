import { z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        surname: z.string().min(1, "Surname is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(4, "Password must be at least 4 characters"),
        role: z.enum(["admin", "shop", "user", "buyer"]).default("user"),
        address: z.object({
            street: z.string().min(1, "Street is required"),
            city: z.string().min(1, "City is required"),
            zip: z.string().min(1, "Zip code is required"),
            country: z.string().min(1, "Country is required"),
        }).optional(),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
    }),
});
