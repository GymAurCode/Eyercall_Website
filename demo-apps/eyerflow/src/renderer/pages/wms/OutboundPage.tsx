import { useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { call, errorMessage } from "../../lib/api";
import { useApp } from "../../lib/app-context";
import { PageHeader, TableSkeleton } from "../../components/ui/Feedback";
import { Dialog } from "../../components/ui/Dialog";
import { Button } from "../../components/ui/Button";
import { Field, Input, Select } from "../../components/ui/Input";
import { MmsTable as Table } from "../mms/MmsTable";
import type { Dispatch, WarehouseTask, Carton } from "../../../shared/wms";

type Mode = "create" | "dispatchFromSo" | "release" | "pick" | "pack" | "stage" | "load" | "handover" | "manage";
type Edit = { mode: Mode; id: number; values: Record<string, string>; key: string };
const units = (m: number) => (m / 1000).toLocaleString(undefined, { maximumFractionDigits: 3 });
function quantity(s: string | undefined) {
  if (!s || !/^\d+(\.\d{1,3})?$/.test(s))
    throw Error("Enter a quantity with at most three decimal places.");
  const [a, b = ""] = s.split(".");
  return Number(a) * 1000 + Number(b.padEnd(3, "0"));
}
export function OutboundPage(): React.JSX.Element {
  const page = useLocation().pathname.split("/").at(-1) ?? "dispatch-requests";
  const { can } = useApp(),
    client = useQueryClient();
  const query = useQuery({ queryKey: ["wms"], queryFn: () => call("wms.snapshot", {}) });
  const data = query.data;
  const soSources = useQuery({
    queryKey: ["wms-sales-order-sources"],
    queryFn: () => call("wms.integration.salesOrders", {}),
    enabled: can("warehouse", "view") && page === "dispatch-requests",
  });
  const owners = useQuery({ queryKey: ["wms-owners"], queryFn: () => call("wms.owners.list", {}) });
  const [edit, setEdit] = useState<Edit | null>(null),
    [error, setError] = useState("");
  const open = (mode: Mode, id = 0, values: Record<string, string> = {}) => {
    setError("");
    setEdit({ mode, id, values, key: crypto.randomUUID() });
  };
  const mutation = useMutation({
    mutationFn: async () => {
      if (!edit) throw Error("No operation selected.");
      const v = edit.values;
      switch (edit.mode) {
        case "create":
          return call("wms.dispatch.create", {
            warehouseId: Number(v["warehouse"]),
            ownerId: v["owner"] && v["owner"] !== "operator" ? Number(v["owner"]) : null,
            recipient: v["recipient"] ?? "",
            reference: v["reference"] ?? "",
            requiredDate: v["date"] ?? "",
            priority: (v["priority"] ?? "normal") as "normal" | "high" | "urgent",
            commandKey: edit.key,
            lines: [{ productId: Number(v["product"]), quantityMilli: quantity(v["quantity"]) }],
          });
        case "dispatchFromSo":
          return call("wms.dispatch.fromSalesOrder", {
            salesOrderId: Number(v["salesOrderId"]),
            warehouseId: Number(v["warehouseId"]),
          });
        case "release":
          return call("wms.dispatch.release", { id: edit.id, packingBinId: Number(v["packing"]) });
        case "manage":
          return call("wms.picks.manage", {
            commandKey: edit.key,
            id: edit.id,
            action: (v["action"] ?? "reassign") as "split" | "reassign" | "hold" | "shortClose",
            quantityMilli: v["quantity"] ? quantity(v["quantity"]) : null,
            workerId: v["worker"] && v["worker"] !== "none" ? Number(v["worker"]) : null,
            sourceBinId: v["source"] ? Number(v["source"]) : null,
            reason: v["reason"] ?? "",
          });
        case "pick":
          return call("wms.picks.confirm", {
            id: edit.id,
            handlingScan: v["handlingScan"],
            destinationBinId: Number(v["destination"]),
            sourceScan: v["sourceScan"] ?? "",
            destinationScan: v["destinationScan"] ?? "",
            productScan: v["productScan"] ?? "",
            quantityMilli: quantity(v["quantity"]),
            commandKey: edit.key,
          });
        case "pack":
          return call("wms.cartons.pack", {
            dispatchId: edit.id,
            code: v["code"] ?? "",
            weightGrams: Number(v["weight"]),
            commandKey: edit.key,
            lines: [
              {
                lineId: Number(v["line"]),
                quantityMilli: quantity(v["quantity"]),
                productScan: v["productScan"] ?? "",
              },
            ],
          });
        case "stage":
        case "load":
          return call("wms.cartons.scan", {
            dispatchId: edit.id,
            scan: v["scan"] ?? "",
            action: edit.mode,
          });
        case "handover":
          return call("wms.dispatch.handover", {
            id: edit.id,
            carrier: v["carrier"] ?? "",
            vehicle: v["vehicle"] ?? "",
            acknowledgement: v["acknowledgement"] ?? "",
          });
      }
    },
    onSuccess: () => {
      toast.success("Warehouse operation committed.");
      setEdit(null);
      void client.invalidateQueries({ queryKey: ["wms"] });
      void client.invalidateQueries({ queryKey: ['wms-handling'] });
    },
    onError: (e: unknown) => {
      console.error("WMS outbound operation failed", e);
      setError(errorMessage(e));
    },
  });
  function field(
    key: string,
    label: string,
    options?: { value: string; label: string }[],
    type = "text",
  ) {
    if (!edit) return null;
    return (
      <Field key={key} label={label} required>
        {(id) =>
          options ? (
            <Select
              id={id}
              value={edit.values[key] ?? ""}
              onChange={(value) => setEdit({ ...edit, values: { ...edit.values, [key]: value } })}
              options={options}
            />
          ) : (
            <Input
              id={id}
              required
              type={type}
              autoComplete="off"
              value={edit.values[key] ?? ""}
              onChange={(e) =>
                setEdit({ ...edit, values: { ...edit.values, [key]: e.target.value } })
              }
            />
          )
        }
      </Field>
    );
  }
  const current = data?.dispatches.find((d) => d.id === edit?.id);
  const titles: Record<string, string> = {
    "dispatch-requests": "Dispatch Requests",
    picking: "Picking Tasks",
    packing: "Packing & Cartons",
    staging: "Shipment Staging",
    dispatch: "Loading & Dispatch",
  };
  const canEdit = can("warehouse", "edit");
  function documentActions(d: Dispatch) {
    return (
      <div className="flex flex-wrap gap-2">
        {canEdit && d.status === "draft" && (
          <Button onClick={() => open("release", d.id)}>Release to picking</Button>
        )}
        {canEdit && d.status === "picked" && (
          <Button onClick={() => open("pack", d.id)}>Pack carton</Button>
        )}
        {canEdit && d.status === "packed" && (
          <Button onClick={() => open("stage", d.id)}>Scan to staging</Button>
        )}
        {canEdit && d.status === "staged" && (
          <Button onClick={() => open("load", d.id)}>Scan onto vehicle</Button>
        )}
        {canEdit && d.status === "loaded" && (
          <Button onClick={() => open("handover", d.id)}>Confirm handover</Button>
        )}
      </div>
    );
  }
  return (
    <div className="space-y-5">
      <PageHeader
        title={titles[page] ?? "Outbound Operations"}
        description="Allocate → scan pick → verify cartons → stage → load → hand over"
        actions={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                void query.refetch();
              }}
            >
              Refresh
            </Button>
            {can("warehouse", "create") && page === "dispatch-requests" && (
              <>
                <Button onClick={() => open("create")}>Create dispatch request</Button>
                {soSources.data?.length && (
                  <Button variant="secondary" onClick={() => open("dispatchFromSo")}>
                    Create dispatch from SO
                  </Button>
                )}
              </>
            )}
          </div>
        }
      />
      {query.isPending ? (
        <TableSkeleton />
      ) : query.isError ? (
        <div role="alert" className="card p-5">
          <p className="text-danger">{errorMessage(query.error)}</p>
          <Button
            onClick={() => {
              void query.refetch();
            }}
          >
            Retry
          </Button>
        </div>
      ) : (
        data && (
          <>
            {page === "picking" ? (
              <Table<WarehouseTask>
                rows={data.tasks.filter((t) => t.type === "pick")}
                rowKey={(r) => r.id}
                columns={[
                  { id: "id", header: "Task", cell: (r) => `PICK-${r.id}` },
                  { id: "sku", header: "SKU", cell: (r) => r.sku },
                  { id: "source", header: "Source bin", cell: (r) => r.source },
                  { id: "destination", header: "Packing bin", cell: (r) => r.destination },
                  { id: "quantity", header: "Quantity", cell: (r) => units(r.quantity_milli) },
                  { id: "status", header: "Status", cell: (r) => (r.on_hold ? "held" : r.status) },
                  {
                    id: "actions",
                    header: "Actions",
                    cell: (r) => (
                      <div className="flex gap-2">
                        {canEdit &&
                          !r.on_hold &&
                          !["completed", "cancelled"].includes(r.status) && (
                            <Button
                              onClick={() =>
                                open("pick", r.id, {
                                  destination: String(r.destination_bin_id),
                                  quantity: String(r.quantity_milli / 1000),
                                })
                              }
                            >
                              Scan pick
                            </Button>
                          )}
                        {can("users", "edit") && !["completed", "cancelled"].includes(r.status) && (
                          <Button
                            variant="secondary"
                            onClick={() =>
                              open("manage", r.id, { action: r.on_hold ? "reassign" : "split" })
                            }
                          >
                            Resolve / split
                          </Button>
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            ) : (
              <Table<Dispatch>
                rows={data.dispatches.filter(d=>d.manufacturing_order_id===null).filter((d) =>
                  page === "packing"
                    ? ["picked", "packed"].includes(d.status)
                    : page === "staging"
                      ? ["packed", "staged"].includes(d.status)
                      : page === "dispatch"
                        ? ["staged", "loaded", "handedOver"].includes(d.status)
                        : true,
                )}
                rowKey={(r) => r.id}
                columns={[
                  { id: "number", header: "Request", cell: (r) => r.number },
                  { id: "recipient", header: "Recipient", cell: (r) => r.recipient },
                  { id: "reference", header: "Reference", cell: (r) => r.reference },
                  { id: "date", header: "Required date", cell: (r) => r.required_date },
                  {
                    id: "lines",
                    header: "SKU · Requested / Picked / Packed",
                    cell: (r) => (
                      <div className="space-y-2">
                        {r.lines.map((l) => (
                          <p key={l.id}>
                            {l.sku} · {units(l.quantity_milli)} / {units(l.picked_milli)} /{" "}
                            {units(l.packed_milli)}
                          </p>
                        ))}
                      </div>
                    ),
                  },
                  { id: "status", header: "Status", cell: (r) => r.status },
                  { id: "actions", header: "Actions", cell: documentActions },
                ]}
              />
            )}
            {["packing", "staging", "dispatch"].includes(page) && (
              <>
                <h2 className="text-lg font-semibold">Verified cartons</h2>
                <Table<Carton>
                  rows={data.cartons}
                  rowKey={(r) => r.id}
                  columns={[
                    { id: "code", header: "Carton ID", cell: (r) => r.code },
                    {
                      id: "dispatch",
                      header: "Dispatch",
                      cell: (r) => data.dispatches.find((d) => d.id === r.dispatch_id)?.number,
                    },
                    { id: "weight", header: "Weight", cell: (r) => `${r.weight_grams} g` },
                    {
                      id: "quantity",
                      header: "Packed units",
                      cell: (r) => units(r.quantity_milli),
                    },
                    { id: "status", header: "Status", cell: (r) => r.status },
                  ]}
                />
              </>
            )}
            <p className="text-xs text-ink-secondary">
              Data cutoff: {new Date(data.generatedAt).toLocaleString()}
            </p>
          </>
        )
      )}
      <Dialog
        open={edit !== null}
        onOpenChange={(v) => {
          if (!v && !mutation.isPending) setEdit(null);
        }}
        title={
          edit
            ? {
                create: "Create dispatch request",
                dispatchFromSo: "Create dispatch from sales order",
                release: "Allocate and release picking",
                pick: "Scan and confirm pick",
                pack: "Verify and close carton",
                stage: "Scan carton to staging",
                load: "Scan carton onto vehicle",
                handover: "Confirm physical handover",
                manage: "Supervisor pick controls",
              }[edit.mode]
            : ""
        }
        busy={mutation.isPending}
      >
        <form
          className="space-y-4"
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            if (mutation.isPending) return;
            setError("");
            mutation.mutate();
          }}
        >
          {edit?.mode === "create" && (
            <>
              <p className="text-sm text-ink-secondary">
                Use a new standalone dispatch reference for stock that has not already been issued
                by IMS. Commercial sales integrations are separate.
              </p>
              {field(
                "warehouse",
                "Warehouse",
                data?.warehouses
                  .filter((w) => w.active)
                  .map((w) => ({ value: String(w.id), label: w.code })) ?? [],
              )}
              {field("recipient", "Recipient")}
              {field("owner", "Stock owner", [
                { value: "operator", label: "Warehouse operator" },
                ...(owners.data
                  ?.filter((o) => o.active)
                  .map((o) => ({ value: String(o.id), label: `${o.code} · ${o.name}` })) ?? []),
              ])}
              {field("reference", "Source reference")}
              {field("date", "Required date", undefined, "date")}
              {field(
                "priority",
                "Priority",
                ["normal", "high", "urgent"].map((value) => ({ value, label: value })),
              )}
              {field(
                "product",
                "Product",
                data?.products.map((p) => ({
                  value: String(p.id),
                  label: `${p.sku} · ${p.name}`,
                })) ?? [],
              )}
              {field("quantity", "Requested quantity")}
            </>
          )}
          {edit?.mode === "dispatchFromSo" && (
            <>
              <p className="text-sm text-ink-secondary">
                Creates a WMS dispatch request linked to an IMS sales order. Dispatch release
                reserves stock and handover posts the shared stock issue once.
              </p>
              {field(
                "salesOrderId",
                "Sales order",
                (soSources.data ?? []).map((o) => ({
                  value: String(o.id),
                  label: `${o.number} · ${o.partyName ?? "—"} · ${o.kind.toUpperCase()}`,
                })) ?? [],
              )}
              {field(
                "warehouseId",
                "Warehouse",
                data?.warehouses
                  .filter((w) => w.active)
                  .map((w) => ({ value: String(w.id), label: w.code })) ?? [],
              )}
              <div className="space-y-1 pt-3">
                {soSources.data?.find((o) => o.id === Number(edit?.values["salesOrderId"]))?.lines.map(
                  (l) => (
                    <p key={l.lineId} className="text-xs text-ink-secondary ml-4">
                      {l.sku} · {units(l.quantityMilli)} ordered · {units(l.outstandingMilli)} outstanding
                    </p>
                  ),
                )}
              </div>
            </>
          )}
          {edit?.mode === "release" && (
            <>
              <p className="text-sm text-ink-secondary">
                Stock is reserved atomically from eligible storage and pick-face bins. A shortage
                leaves the whole request unallocated.
              </p>
              {field(
                "packing",
                "Packing destination",
                data?.bins
                  .filter(
                    (b) =>
                      b.warehouse_id === current?.warehouse_id &&
                      b.type === "packing" &&
                      b.active &&
                      !b.blocked,
                  )
                  .map((b) => ({ value: String(b.id), label: b.code })) ?? [],
              )}
            </>
          )}
          {edit?.mode === "manage" && (
            <>
              {field("action", "Action", [
                { value: "split", label: "Split remaining work" },
                { value: "reassign", label: "Reallocate / reassign" },
                { value: "hold", label: "Hold task" },
                { value: "shortClose", label: "Approve short shipment" },
              ])}
              {edit.values["action"] === "split" && field("quantity", "Quantity for split task")}
              {edit.values["action"] === "reassign" && (
                <>
                  {field(
                    "source",
                    "Source bin",
                    data?.bins
                      .filter(
                        (b) =>
                          b.warehouse_id ===
                            data.bins.find(
                              (source) =>
                                source.id ===
                                data.tasks.find((t) => t.id === edit.id)?.source_bin_id,
                            )?.warehouse_id &&
                          ["storage", "pickFace"].includes(b.type) &&
                          b.active &&
                          !b.blocked,
                      )
                      .map((b) => ({ value: String(b.id), label: b.code })) ?? [],
                  )}
                  {field("worker", "Worker (optional)", [
                    { value: "none", label: "Unassigned" },
                    ...(data?.workers.map((w) => ({
                      value: String(w.id),
                      label: w.display_name,
                    })) ?? []),
                  ])}
                </>
              )}
              {field("reason", "Supervisor reason")}
            </>
          )}
          {edit?.mode === "pick" && (
            <>
              {field("sourceScan", "Scan source bin")}
              {data?.tasks.find((t) => t.id === edit.id)?.source_hu_id != null &&
                field("handlingScan", "Scan assigned pallet")}
              {field("productScan", "Scan SKU / barcode")}
              {field("destinationScan", "Scan packing bin")}
              {field("quantity", "Picked quantity")}
            </>
          )}
          {edit?.mode === "pack" && (
            <>
              {field("code", "Unique carton ID")}
              {field("weight", "Weight (grams)", undefined, "number")}
              {field(
                "line",
                "Request line",
                current?.lines
                  .filter((l) => l.packed_milli < l.quantity_milli)
                  .map((l) => ({
                    value: String(l.id),
                    label: `${l.sku} · ${units(l.quantity_milli - l.packed_milli)} remaining`,
                  })) ?? [],
              )}
              {field("productScan", "Scan SKU / barcode")}
              {field("quantity", "Carton quantity")}
            </>
          )}
          {edit && ["stage", "load"].includes(edit.mode) && field("scan", "Scan carton ID")}
          {edit?.mode === "handover" && (
            <>
              <p className="text-sm text-ink-secondary">
                Confirm that the carrier has physically received every loaded carton. This posts the
                shared stock issue once.
              </p>
              {field("carrier", "Carrier")}
              {field("vehicle", "Vehicle reference")}
              {field("acknowledgement", "Carrier acknowledgement")}
            </>
          )}
          {error && (
            <p className="text-danger text-sm" role="alert">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={mutation.isPending}
              onClick={() => setEdit(null)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving…" : "Confirm"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
