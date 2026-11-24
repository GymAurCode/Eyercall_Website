import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import JsBarcode from "jsbarcode";
import { toast } from "sonner";
import { call, errorMessage } from "../../lib/api";
import { printHtml } from "../../lib/print";
import { useApp } from "../../lib/app-context";
import { PageHeader, TableSkeleton } from "../../components/ui/Feedback";
import { Button } from "../../components/ui/Button";
import { Dialog } from "../../components/ui/Dialog";
import { Field, Input, Select } from "../../components/ui/Input";
import { MmsTable as Table } from "../mms/MmsTable";
import {RowActions,type MenuItem} from '../../components/ui/Dropdown';
import type { HandlingUnit, HandlingCommand } from "../../../shared/handling";
type Editor = {
  mode: "save" | "view" | "receive" | HandlingCommand["action"];
  id: number;
  revision: number;
  values: Record<string, string>;
  key: string;
};
function milli(value: string) {
  if (!/^\d+(\.\d{1,3})?$/.test(value))
    throw Error("Enter a positive quantity with up to three decimal places.");
  const [whole, fraction = ""] = value.split(".");
  return Number(whole) * 1000 + Number(fraction.padEnd(3, "0"));
}
function Barcode({ code }: { code: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (ref.current)
      JsBarcode(ref.current, code, { format: "CODE128", width: 2, height: 60, displayValue: true });
  }, [code]);
  return (
    <svg
      ref={ref}
      role="img"
      aria-label={`Internal handling unit barcode ${code}`}
      className="max-w-full bg-white"
    />
  );
}
export function HandlingPage(): React.JSX.Element {
  const { can } = useApp(),
    client = useQueryClient();
  const list = useQuery({
      queryKey: ["wms-handling"],
      queryFn: () => call("wms.handling.list", {}),
    }),
    snapshot = useQuery({ queryKey: ["wms"], queryFn: () => call("wms.snapshot", {}) });
  const owners = useQuery({ queryKey: ["wms-owners"], queryFn: () => call("wms.owners.list", {}) });
  const [edit, setEdit] = useState<Editor | null>(null),
    [error, setError] = useState("");
  const detail = useQuery({
    queryKey: ["wms-handling", edit?.id],
    queryFn: () => call("wms.handling.get", { id: edit!.id }),
    enabled: edit?.mode === "view" && edit.id > 0,
  });
  function open(mode: Editor["mode"], unit?: HandlingUnit) {
    setError("");
    setEdit({
      mode,
      id: unit?.id ?? 0,
      revision: unit?.revision ?? 0,
      values: {
        code: unit?.code ?? `HU-${crypto.randomUUID().replaceAll('-','').toUpperCase()}`,
        name: unit?.name ?? "",
        bin: unit ? String(unit.bin_id) : "",
        type: unit?.unit_type ?? "pallet",
        parent: unit?.parent_id ? String(unit.parent_id) : "none",
        owner: unit?.owner_id ? String(unit.owner_id) : "operator",
        status: "available",
      },
      key: crypto.randomUUID(),
    });
  }
  function field(
    key: string,
    label: string,
    options?: { value: string; label: string }[],
    required = true,
  ) {
    return (
      edit && (
        <Field label={label} required={required}>
          {(id) =>
            options ? (
              <Select
                id={id}
                value={edit.values[key] ?? ""}
                options={options}
                onChange={(value) => setEdit({ ...edit, values: { ...edit.values, [key]: value } })}
              />
            ) : (
              <Input
                id={id}
                required={required}
                autoComplete="off"
                value={edit.values[key] ?? ""}
                onChange={(e) =>
                  setEdit({ ...edit, values: { ...edit.values, [key]: e.target.value } })
                }
              />
            )
          }
        </Field>
      )
    );
  }
  const save = useMutation({
    mutationFn: async () => {
      if (!edit) throw Error("No unit selected.");
      const v = edit.values;
      if (edit.mode === "save")
        return call("wms.handling.save", {
          ...(edit.id ? { id: edit.id } : {}),
          revision: edit.revision,
          binId: Number(v["bin"]),
          code: v["code"] ?? "",
          name: v["name"] ?? "",
          type: v["type"] as "pallet" | "carton",
          parentId: v["parent"] && v["parent"] !== "none" ? Number(v["parent"]) : null,
          ownerId: v["owner"] && v["owner"] !== "operator" ? Number(v["owner"]) : null,
          commandKey: edit.key,
        });
      if (edit.mode === "view") throw Error("Choose an operation.");
      if (edit.mode === "receive")
        return call("wms.handling.receive", {
          handlingUnitId: edit.id,
          reference: v["reason"] ?? "",
          productId: Number(v["product"]),
          quantityMilli: milli(v["quantity"] ?? ""),
          batchNo: v["batch"] || null,
          stockStatus: (v["status"] ?? "available") as "available" | "quarantine" | "damaged",
          unitScan: v["unitScan"] ?? "",
          sourceScan: v["sourceScan"] ?? "",
          productScan: v["productScan"] ?? "",
          commandKey: edit.key,
        });
      return call("wms.handling.execute", {
        id: edit.id,
        action: edit.mode,
        productId: v["product"] ? Number(v["product"]) : null,
        quantityMilli: v["quantity"] ? milli(v["quantity"]) : null,
        batchNo: v["batch"] || null,
        stockStatus: (v["status"] ?? "available") as "available" | "quarantine" | "damaged",
        targetId: v["target"] ? Number(v["target"]) : null,
        unitScan: v["unitScan"] ?? "",
        sourceScan: v["sourceScan"] ?? "",
        destinationScan: v["destinationScan"] ?? "",
        productScan: v["productScan"] ?? "",
        reason: v["reason"] ?? "",
        commandKey: edit.key,
      });
    },
    onSuccess: () => {
      setEdit(null);
      toast.success("Handling unit operation committed.");
      void client.invalidateQueries({ queryKey: ["wms"] });
      void client.invalidateQueries({ queryKey: ["wms-handling"] });
    },
    onError: (e: unknown) => {
      console.error("Handling unit operation failed", e);
      setError(errorMessage(e));
    },
  });
  const printing = useMutation({
    mutationFn: async () => {
      const svg = document.querySelector('[aria-label^="Internal handling unit barcode"]');
      if (!svg) throw Error("Open a handling-unit label first.");
      const result = await printHtml(
        `<html><body><h2>Internal handling-unit label</h2>${svg.outerHTML}<p>Internal identifier; not a GS1 SSCC.</p></body></html>`,
      );
      if (!result.ok) throw Error(result.message);
    },
    onError: (e: unknown) => {
      console.error(e);
      toast.error(errorMessage(e));
    },
  });
  const current = list.data?.find((u) => u.id === edit?.id);
  function actions(u:HandlingUnit):MenuItem[]{
    const items:MenuItem[]=[{id:'edit',label:'Edit',onSelect:()=>open('save',u)}];
    if(u.quantity_milli===0)items.push({id:'receive',label:'Receive stock',onSelect:()=>open('receive',u)});
    if(can('users','edit')&&u.quantity_milli>0)items.push({id:'ownership',label:'Transfer ownership',onSelect:()=>open('ownershipTransfer',u)});
    if(u.owner_id===null)items.push({id:'pack',label:'Add contents',onSelect:()=>open('pack',u)});
    if(u.owner_id===null&&u.quantity_milli>0)items.push({id:'unpack',label:'Remove contents',onSelect:()=>open('unpack',u)});
    if(u.parent_id===null)items.push({id:'move',label:'Move',onSelect:()=>open('move',u)});
    if(u.quantity_milli>0)items.push({id:'split',label:'Split',onSelect:()=>open('split',u)},{id:'merge',label:'Merge',onSelect:()=>open('merge',u)});
    if(u.quantity_milli===0&&u.owner_id===null)items.push({id:'attach',label:'Attach putaway',onSelect:()=>open('attachTask',u)});
    return items;
  }
  function historyText(details:string):string{
    try{const d=JSON.parse(details) as Record<string,unknown>;return [d['name'],d['reference'],d['reason'],typeof d['quantityMilli']==='number'?`${d['quantityMilli']/1000} units`:null,d['batchNo'],typeof d['fromBinId']==='number'?`From ${snapshot.data?.bins.find(b=>b.id===d['fromBinId'])?.code??d['fromBinId']}`:null,typeof d['toBinId']==='number'?`To ${snapshot.data?.bins.find(b=>b.id===d['toBinId'])?.code??d['toBinId']}`:null].filter((value):value is string=>typeof value==='string'&&value.length>0).join(' · ');}catch{return 'History details could not be read.';}
  }
  return (
    <div className="space-y-5">
      <PageHeader
        title="Pallets & Handling Units"
        description="Ledger-backed contents, scanned bin movements and traceable packaging. Internal IDs use Code 128; they are not GS1 SSCCs."
        actions={
          can("warehouse", "edit") ? (
            <Button onClick={() => open("save")}>Create handling unit</Button>
          ) : undefined
        }
      />
      {owners.isError && (
        <div role="alert" className="card p-4">
          <p className="text-danger">Stock owners could not load: {errorMessage(owners.error)}</p>
          <Button
            onClick={() => {
              void owners.refetch();
            }}
          >
            Retry owners
          </Button>
        </div>
      )}
      {list.isPending || snapshot.isPending ? (
        <TableSkeleton />
      ) : list.isError || snapshot.isError ? (
        <div role="alert" className="card p-5">
          <p className="text-danger">{errorMessage(list.error ?? snapshot.error)}</p>
          <Button
            onClick={() => {
              void list.refetch();
              void snapshot.refetch();
            }}
          >
            Retry
          </Button>
        </div>
      ) : (
        <Table<HandlingUnit>
          rows={list.data ?? []}
          rowKey={(u) => u.id}
          columns={[
            { id: "code", header: "Handling unit", cell: (u) => u.code },
            { id: "name", header: "Name", cell: (u) => u.name },
            { id: "type", header: "Type", cell: (u) => u.unit_type },
            { id: "bin", header: "Bin", cell: (u) => u.bin },
            {
              id: "owner",
              header: "Stock owner",
              cell: (u) =>
                owners.data?.find((o) => o.id === u.owner_id)?.name ?? "Warehouse operator",
            },
            {
              id: "parent",
              header: "Parent pallet",
              cell: (u) => list.data?.find((parent) => parent.id === u.parent_id)?.code ?? "—",
            },
            { id: "quantity", header: "Own units", cell: (u) => u.quantity_milli / 1000 },
            {
              id: "actions",
              header: "Actions",
              cell: (u) => (
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={() => open("view", u)}>
                    View / label
                  </Button>
                  {can('warehouse','edit')&&<RowActions items={actions(u)}/>}
                </div>
              ),
            },
          ]}
        />
      )}
      <Dialog
        open={edit !== null}
        onOpenChange={(v) => {
          if (!v && !save.isPending) setEdit(null);
        }}
        title={
          edit?.mode === "view"
            ? `Handling unit ${current?.code ?? ""}`
            : edit?.mode === "save"
              ? "Save handling unit"
              : `Scan and ${edit?.mode ?? ""} handling unit`
        }
        size="lg"
        busy={save.isPending}
      >
        {edit?.mode === "view" ? (
          detail.isPending ? (
            <TableSkeleton />
          ) : detail.isError ? (
            <p role="alert" className="text-danger">
              {errorMessage(detail.error)}
            </p>
          ) : (
            detail.data && (
              <div className="space-y-4">
                <Barcode code={detail.data.unit.code} />
                <Button disabled={printing.isPending} onClick={() => printing.mutate()}>
                  Print internal label
                </Button>
                <p>
                  {detail.data.unit.bin} · {detail.data.unit.unit_type} ·{" "}
                  {detail.data.unit.quantity_milli / 1000} own units
                </p>
                <h3 className="font-semibold">Contents</h3>
                {detail.data.unit.contents.length === 0 ? (
                  <p className="text-sm">No contents in this unit.</p>
                ) : (
                  detail.data.unit.contents.map((x, i) => (
                    <p key={i}>
                      {x.sku} · {x.batch_no ?? "No lot"} · {x.stock_status} ·{" "}
                      {x.quantity_milli / 1000} units · {x.reserved_milli / 1000} reserved
                    </p>
                  ))
                )}
                <h3 className="font-semibold">Child cartons</h3>
                {detail.data.children.map((child) => (
                  <p key={child.id}>
                    {child.code} · {child.quantity_milli / 1000} units
                  </p>
                ))}
                <h3 className="font-semibold">History</h3>
                {detail.data.history.map((event) => (
                  <div className="border-b py-2 text-sm" key={event.id}>
                    <p>
                      {new Date(event.created_at).toLocaleString()} · {event.actor_name} ·{" "}
                      {event.action}
                    </p>
                    <p className="text-sm text-ink-secondary">{historyText(event.details)}</p>
                  </div>
                ))}
              </div>
            )
          )
        ) : (
          edit && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!save.isPending) save.mutate();
              }}
            >
              {edit.mode === "save" ? (
                <>
                  {field("code", "Internal ID")}
                  {field("name", "Name")}
                  {field("owner", "Stock owner", [
                    { value: "operator", label: "Warehouse operator" },
                    ...(owners.data
                      ?.filter((o) => o.active)
                      .map((o) => ({ value: String(o.id), label: `${o.code} · ${o.name}` })) ?? []),
                  ])}
                  {field("type", "Handling unit type", [
                    { value: "pallet", label: "Pallet" },
                    { value: "carton", label: "Carton" },
                  ])}
                  {field(
                    "bin",
                    "Bin",
                    snapshot.data?.bins
                      .filter((b) => b.active && !b.blocked)
                      .map((b) => ({ value: String(b.id), label: b.code })) ?? [],
                  )}
                  {field(
                    "parent",
                    "Parent pallet",
                    [
                      { value: "none", label: "None" },
                      ...(list.data
                        ?.filter(
                          (u) =>
                            u.unit_type === "pallet" &&
                            u.owner_id ===
                              (edit.values["owner"] && edit.values["owner"] !== "operator"
                                ? Number(edit.values["owner"])
                                : null) &&
                            u.bin_id === Number(edit.values["bin"]) &&
                            u.id !== edit.id &&
                            u.parent_id === null,
                        )
                        .map((u) => ({ value: String(u.id), label: u.code })) ?? []),
                    ],
                    false,
                  )}
                  <p className="text-xs text-ink-secondary">
                    IDs, type and bin cannot be edited after creation. Use scanned Move to change
                    placement.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-ink-secondary">
                    Current source: {current?.code} in {current?.bin}. All barcode checks run in the
                    main process.
                  </p>
                  {field("unitScan", "Scan handling unit")}
                  {field("sourceScan", "Scan source bin")}
                  {[
                    "pack",
                    "unpack",
                    "split",
                    "attachTask",
                    "ownershipTransfer",
                    "receive",
                  ].includes(edit.mode) && (
                    <>
                      {field(
                        "product",
                        "Product",
                        snapshot.data?.products.map((p) => ({
                          value: String(p.id),
                          label: `${p.sku} · ${p.name}`,
                        })) ?? [],
                      )}
                      {field("productScan", "Scan SKU / barcode")}
                      {field("quantity", "Quantity")}
                      {field("batch", "Lot / batch (optional)", undefined, false)}
                      {field(
                        "status",
                        "Stock status",
                        ["available", "quarantine", "damaged"].map((value) => ({
                          value,
                          label: value,
                        })),
                      )}
                    </>
                  )}
                  {edit.mode === "move" &&
                    field(
                      "target",
                      "Destination bin",
                      snapshot.data?.bins
                        .filter(
                          (b) =>
                            b.warehouse_id === current?.warehouse_id &&
                            b.id !== current?.bin_id &&
                            b.active &&
                            !b.blocked,
                        )
                        .map((b) => ({ value: String(b.id), label: b.code })) ?? [],
                    )}
                  {["split", "merge", "ownershipTransfer"].includes(edit.mode) &&
                    field(
                      "target",
                      "Target handling unit",
                      list.data
                        ?.filter((u) => u.id !== edit.id && u.bin_id === current?.bin_id)
                        .map((u) => ({ value: String(u.id), label: u.code })) ?? [],
                    )}
                  {edit.mode === "attachTask" &&
                    field(
                      "target",
                      "Receipt putaway task",
                      snapshot.data?.tasks
                        .filter(
                          (t) =>
                            t.type === "putaway" &&
                            t.source_bin_id === current?.bin_id &&
                            !t.handling_unit_id &&
                            ["created", "assigned", "started"].includes(t.status),
                        )
                        .map((t) => ({
                          value: String(t.id),
                          label: `#${t.id} · ${t.sku} · ${t.quantity_milli / 1000}`,
                        })) ?? [],
                    )}
                  {!["pack", "attachTask", "receive"].includes(edit.mode) &&
                    field(
                      "destinationScan",
                      edit.mode === "move" || edit.mode === "unpack"
                        ? "Scan destination bin"
                        : "Scan target handling unit",
                    )}
                  {field(
                    "reason",
                    edit.mode === "receive" ? "Inbound reference" : "Operation reason",
                  )}
                </>
              )}
              {error && (
                <p role="alert" className="text-danger">
                  {error}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  disabled={save.isPending}
                  onClick={() => setEdit(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={save.isPending}>
                  {save.isPending ? "Saving…" : edit.mode === "save" ? "Save" : "Confirm"}
                </Button>
              </div>
            </form>
          )
        )}
      </Dialog>
    </div>
  );
}
