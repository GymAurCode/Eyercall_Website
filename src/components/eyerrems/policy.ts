export type DemoAction = "view" | "search" | "sort" | "filter" | "paginate" | "navigate" | "theme";
const allowed = new Set<string>([
  "view",
  "search",
  "sort",
  "filter",
  "paginate",
  "navigate",
  "theme",
]);
export function assertDemoAction(action: string): asserts action is DemoAction {
  if (!allowed.has(action)) throw new Error("Unavailable in read-only demo mode");
}
export function demoRead<T>(value: T): T {
  assertDemoAction("view");
  return structuredClone(value);
}
export const samplePortfolio = Object.freeze([
  { id: "DEMO-P001", name: "Cedar Court", units: 12, occupied: 9, rent: 180000 },
  { id: "DEMO-P002", name: "Willow Residences", units: 8, occupied: 6, rent: 120000 },
]);
