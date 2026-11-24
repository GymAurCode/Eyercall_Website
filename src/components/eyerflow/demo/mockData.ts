
export const mockData = {
  ims: {
    items: [
      { id: 1, name: "Raw Material A", sku: "RM-001", stock: 100, unit: "kg" },
      { id: 2, name: "Component B", sku: "CP-002", stock: 50, unit: "pcs" },
    ],
  },
  mms: {
    productionOrders: [
      { id: 1, orderNo: "PO-2026-001", status: "In Progress", product: "Finished Good X" },
    ],
  },
  wms: {
    locations: [
      { id: 1, name: "Warehouse A - Zone 1", capacity: "1000m³" },
      { id: 2, name: "Warehouse A - Zone 2", capacity: "1200m³" },
    ],
  },
  oms: {
    orders: [
      { id: 1, orderNo: "ORD-2026-001", customer: "Client A", status: "Shipped" },
      { id: 2, orderNo: "ORD-2026-002", customer: "Client B", status: "Pending" },
    ],
  },
};
