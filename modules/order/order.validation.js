import { z } from "zod";

export const createOrderSchema = z.object({
    body: z.object({
        shopId: z.string().min(1, "Shop ID is required"),
        items: z.array(z.object({
            productId: z.string().min(1, "Product ID is required"),
            quantity: z.number().int().positive("Quantity must be at least 1"),
        })).min(1, "Order must contain at least one item"),
        addressId: z.string().min(1, "Address ID is required"),
    }),
});

export const updateOrderStatusSchema = z.object({
    body: z.object({
        status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "CANCELLED"]),
    }),
});
