export const SUITES = ["ims", "mms", "wms", "oms", "ecom", "erp"] as const;
export type Suite = (typeof SUITES)[number];
export interface SuiteLicense {
  suites: readonly Suite[];
  companyId?: string;
}
export interface AccessSnapshot extends SuiteLicense {
  allOwners?:boolean;
  companyId: string;
  allBranches: boolean;
  branches: string[];
}
export function suiteForModule(module: string): Suite | null {
  if (module === "warehouse") return "wms";
  if (module === "manufacturing") return "mms";
  if (module === "oms") return "oms";
  if (module === "ecommerce") return "ecom";
  if (module === "erp" || module === "hr") return "erp";
  if (
    [
      "products",
      "parties",
      "sales",
      "purchases",
      "inventory",
      "finance",
      "payments",
      "reports",
      "partners",
    ].includes(module)
  )
    return "ims";
  return null;
}
