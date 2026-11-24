import { describe, expect, it } from "vitest";
import { assertDemoAction } from "./policy";
import { leads } from "./rems/data";

describe("read-only demo boundary", () => {
  it("rejects business mutations", () => {
    for (const action of [
      "create",
      "edit",
      "delete",
      "save",
      "upload",
      "submit",
      "configure",
      "import",
      "approve",
    ])
      expect(() => assertDemoAction(action)).toThrow();
  });
  it("allows exploration", () => {
    for (const action of ["view", "search", "sort", "filter", "paginate", "navigate"])
      expect(() => assertDemoAction(action)).not.toThrow();
  });
  it("has unique immutable fictional lead records", () => {
    expect(leads.length).toBe(24);
    expect(new Set(leads.map((r) => r.lead_id)).size).toBe(24);
    expect(Object.isFrozen(leads)).toBe(true);
    expect(leads.every((r) => Object.isFrozen(r) && r.name.startsWith("Fictional"))).toBe(true);
  });
});
