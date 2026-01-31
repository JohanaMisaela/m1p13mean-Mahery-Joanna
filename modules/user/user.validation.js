import { z } from "zod";

export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        surname: z.string().min(1).optional(),
        email: z.string().email().optional(),
    }),
});

export const updatePasswordSchema = z.object({
    body: z.object({
        oldPassword: z.string().min(1),
        newPassword: z.string().min(6),
    }),
});

export const changeRoleSchema = z.object({
    body: z.object({
        role: z.enum(["admin", "shop", "user", "buyer"]),
    }),
});

export const updateStatusSchema = z.object({
    body: z.object({
        isActive: z.boolean(),
    }),
});
