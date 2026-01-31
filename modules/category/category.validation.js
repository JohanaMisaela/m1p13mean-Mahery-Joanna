import { z } from "zod";

export const createCategorySchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        type: z.enum(["product", "shop"]),
        icon: z.string().optional(),
    }),
});
