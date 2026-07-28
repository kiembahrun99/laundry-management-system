import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, "Name required").max(100),
  phone: z.string().min(6, "Phone too short").max(20),
  address: z.string().max(300).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export const serviceSchema = z.object({
  name: z.string().min(1).max(100),
  pricePerKg: z.coerce.number().positive("Must be positive"),
  estimatedDays: z.coerce.number().int().min(1).max(30),
  description: z.string().max(500).optional().nullable(),
  isActive: z.coerce.boolean().optional().default(true),
});

export const orderSchema = z.object({
  customerId: z.coerce.number().int().positive(),
  serviceId: z.coerce.number().int().positive(),
  weight: z.coerce.number().positive(),
  discount: z.coerce.number().min(0).default(0),
  notes: z.string().max(500).optional().nullable(),
});

export const paymentSchema = z.object({
  orderId: z.coerce.number().int().positive(),
  amount: z.coerce.number().positive(),
  method: z.enum(["CASH", "TRANSFER", "QRIS"]),
  notes: z.string().max(500).optional().nullable(),
});

export const settingSchema = z.object({
  laundryName: z.string().min(1).max(100).optional(),
  address: z.string().max(300).optional(),
  phone: z.string().max(20).optional(),
  footer: z.string().max(500).optional(),
  receiptNote: z.string().max(500).optional(),
});

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
