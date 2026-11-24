import { z } from "zod";
const id = z.number().int().positive();
export const handlingSaveSchema = z.object({
  id: id.optional(),
  revision: z.number().int().nonnegative().default(0),
  binId: id,
  code: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[A-Za-z0-9_-]+$/),
  name: z.string().trim().min(1).max(160),
  type: z.enum(["pallet", "carton"]),
  parentId: id.nullable().default(null),
  ownerId: id.nullable().default(null),
  commandKey: z.uuid(),
});
export type HandlingSave = z.input<typeof handlingSaveSchema>;
export const handlingCommandSchema = z.object({
  id,
  action: z.enum(["pack", "unpack", "move", "split", "merge", "attachTask", "ownershipTransfer"]),
  productId: id.nullable().default(null),
  quantityMilli: z.number().int().positive().max(1e12).nullable().default(null),
  batchNo: z.string().trim().max(100).nullable().default(null),
  stockStatus: z.enum(["available", "quarantine", "damaged"]).default("available"),
  targetId: id.nullable().default(null),
  unitScan: z.string().min(1).max(80),
  sourceScan: z.string().min(1).max(100),
  destinationScan: z.string().max(100).default(""),
  productScan: z.string().max(160).default(""),
  reason: z.string().trim().min(1).max(500),
  commandKey: z.uuid(),
});
export type HandlingCommand = z.input<typeof handlingCommandSchema>;
export interface HandlingContent {
  product_id: number;
  sku: string;
  name: string;
  batch_no: string | null;
  stock_status: string;
  quantity_milli: number;
  reserved_milli: number;
}
export interface HandlingUnit {
  owner_id: number | null;
  id: number;
  warehouse_id: number;
  bin_id: number;
  bin: string;
  code: string;
  name: string;
  unit_type: "pallet" | "carton";
  parent_id: number | null;
  location_id: number;
  revision: number;
  quantity_milli: number;
  contents: HandlingContent[];
}
export interface HandlingDetail {
  unit: HandlingUnit;
  history: {
    id: number;
    action: string;
    details: string;
    actor_name: string;
    created_at: string;
  }[];
  children: HandlingUnit[];
}
