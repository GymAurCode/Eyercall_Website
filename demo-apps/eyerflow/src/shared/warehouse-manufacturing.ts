import { z } from "zod";
export const materialRequestSchema = z.object({
  moId: z.number().int().positive(),
  warehouseId: z.number().int().positive(),
  commandKey: z.uuid(),
});
export type MaterialRequestInput = z.input<typeof materialRequestSchema>;
export interface WarehouseProductionSource {
  id: number;
  number: string;
  status: string;
  planning_location_id: number | null;
  components: {
    product_id: number;
    sku: string;
    required_milli: number;
    issued_milli: number;
    remaining_milli: number;
  }[];
}
