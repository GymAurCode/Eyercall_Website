import { z } from "zod";
export const stockOwnerSchema = z.object({
  id: z.number().int().positive().optional(),
  revision: z.number().int().nonnegative().default(0),
  code: z
    .string()
    .trim()
    .min(1)
    .max(40)
    .regex(/^[A-Za-z0-9_-]+$/),
  name: z.string().trim().min(1).max(160),
  active: z.boolean().default(true),
});
export interface StockOwner {
  id: number;
  code: string;
  name: string;
  active: number;
  revision: number;
}
export type StockOwnerInput = z.input<typeof stockOwnerSchema>;
export const ownerReceiptSchema = z.object({
  handlingUnitId: z.number().int().positive(),
  reference: z.string().trim().min(1).max(160),
  productId: z.number().int().positive(),
  quantityMilli: z.number().int().positive().max(1e12),
  batchNo: z.string().trim().max(100).nullable().default(null),
  stockStatus: z.enum(["available", "quarantine", "damaged"]).default("available"),
  unitScan: z.string().min(1),
  sourceScan: z.string().optional(),
  productScan: z.string().min(1),
  commandKey: z.uuid(),
});
export type OwnerReceipt = z.input<typeof ownerReceiptSchema>;
