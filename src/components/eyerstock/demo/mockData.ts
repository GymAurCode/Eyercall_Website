import type { PartyDto } from "../../../../../Eyerstock/src/shared/types";

const parties: PartyDto[] = [
  {
    id: 1,
    code: "CUST-001",
    name: "Test Customer",
    kind: "customer",
    phone: "123456789",
    email: "customer@test.com",
    trn: "123456789012345",
    addressLine: "123 Customer St",
    openingBalanceFils: 0,
    isActive: true,
    balanceFils: 0,
  },
  {
    id: 2,
    code: "SUP-001",
    name: "Test Supplier",
    kind: "supplier",
    phone: "987654321",
    email: "supplier@test.com",
    trn: "987654321098765",
    addressLine: "456 Supplier St",
    openingBalanceFils: 0,
    isActive: true,
    balanceFils: 0,
  },
];

export const mockDataProvider = {
  getProducts: async (): Promise<any[]> => [],
  getSales: async (): Promise<any[]> => [],
  getPurchases: async (): Promise<any[]> => [],
  getParties: async (kind: "customer" | "supplier"): Promise<PartyDto[]> =>
    parties.filter((p) => p.kind === kind || p.kind === "both"),
};
