import { z } from "zod";

export const createReportSchema = z.object({
    body: z.object({
        targetType: z.enum(["product", "shop"]),
        targetId: z.string().min(1, "Target ID is required"),
        reason: z.enum(["scam", "wrong_info", "prohibited", "other"]),
        description: z.string().optional(),
    }),
});

export const updateReportSchema = z.object({
    body: z.object({
        status: z.enum(["pending", "resolved", "dismissed"]),
    }),
});
