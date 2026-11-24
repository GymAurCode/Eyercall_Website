import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { call, errorMessage } from "../../lib/api";
import { useApp } from "../../lib/app-context";
import { PageHeader, TableSkeleton } from "../../components/ui/Feedback";
import { Button } from "../../components/ui/Button";
import { Dialog } from "../../components/ui/Dialog";
import { Field, Input, Select } from "../../components/ui/Input";
import { MmsTable as Table } from "../mms/MmsTable";
import type { StockOwner } from "../../../shared/owners";
type Editor = {
  mode: "save" | "grant";
  id: number;
  revision: number;
  code: string;
  name: string;
  active: boolean;
  user: string;
  allowed: boolean;
};
export function OwnersPage(): React.JSX.Element {
  const { can } = useApp(),
    client = useQueryClient();
  const owners = useQuery({ queryKey: ["wms-owners"], queryFn: () => call("wms.owners.list", {}) }),
    stock = useQuery({ queryKey: ["wms-handling"], queryFn: () => call("wms.handling.list", {}) });
  const users = useQuery({
      queryKey: ["users"],
      queryFn: () => call("users.list", {}),
      enabled: can("users", "edit"),
    }),
    grants = useQuery({
      queryKey: ["wms-owner-grants"],
      queryFn: () => call("wms.owners.grants", {}),
      enabled: can("users", "edit"),
    });
  const [edit, setEdit] = useState<Editor | null>(null),
    [error, setError] = useState(""),
    [exportPath, setExportPath] = useState("");
  function open(mode: Editor["mode"], owner?: StockOwner) {
    setError("");
    setEdit({
      mode,
      id: owner?.id ?? 0,
      revision: owner?.revision ?? 0,
      code: owner?.code ?? "",
      name: owner?.name ?? "",
      active: owner ? !!owner.active : true,
      user: "",
      allowed: true,
    });
  }
  const save = useMutation({
    mutationFn: (): Promise<number | void> => {
      if (!edit) throw Error("Select a stock owner.");
      return edit.mode === "save"
        ? call("wms.owners.save", {
            ...(edit.id ? { id: edit.id } : {}),
            revision: edit.revision,
            code: edit.code,
            name: edit.name,
            active: edit.active,
          })
        : call("wms.owners.grant", {
            ownerId: edit.id,
            userId: Number(edit.user),
            allowed: edit.allowed,
          });
    },
    onSuccess: () => {
      setEdit(null);
      toast.success("Stock owner changes saved.");
      void client.invalidateQueries({ queryKey: ["wms-owners"] });
      void client.invalidateQueries({ queryKey: ["wms-owner-grants"] });
      void client.invalidateQueries({ queryKey: ["wms-handling"] });
      void client.invalidateQueries({ queryKey: ["wms"] });
    },
    onError: (e: unknown) => {
      console.error(e);
      setError(errorMessage(e));
    },
  });
  const exporting = useMutation({
    mutationFn: () => call("wms.owners.export", {}),
    onSuccess: (r) => setExportPath(r.path),
    onError: (e: unknown) => {
      console.error(e);
      toast.error(errorMessage(e));
    },
  });
  const rows = (stock.data ?? []).flatMap((u) =>
    u.contents.map((content, index) => ({
      ...content,
      key: `${u.id}:${index}`,
      owner: owners.data?.find((o) => o.id === u.owner_id)?.name ?? "Warehouse operator",
      unit: u.code,
      bin: u.bin,
    })),
  );
  return (
    <div className="space-y-5">
      <PageHeader
        title="Stock Owners & Owner Inventory"
        description="Legal ownership is distinct from the company operating this warehouse. Inventory remains in the shared IMS ledger."
        actions={
          <div className="flex gap-2">
            {can("warehouse", "export") && (
              <Button
                variant="secondary"
                disabled={exporting.isPending}
                onClick={() => exporting.mutate()}
              >
                Export owner stock
              </Button>
            )}
            {can("users", "edit") && (
              <Button onClick={() => open("save")}>Register stock owner</Button>
            )}
          </div>
        }
      />
      {exportPath && <p className="text-sm">CSV saved: {exportPath}</p>}
      {(users.isError || grants.isError) && (
        <div role="alert" className="card p-4">
          <p className="text-danger">
            Owner access assignments could not load: {errorMessage(users.error ?? grants.error)}
          </p>
          <Button
            onClick={() => {
              void users.refetch();
              void grants.refetch();
            }}
          >
            Retry access assignments
          </Button>
        </div>
      )}
      {owners.isPending ? (
        <TableSkeleton />
      ) : owners.isError ? (
        <div role="alert">
          <p className="text-danger">{errorMessage(owners.error)}</p>
          <Button
            onClick={() => {
              void owners.refetch();
            }}
          >
            Retry
          </Button>
        </div>
      ) : (
        <Table<StockOwner>
          rows={owners.data}
          rowKey={(o) => o.id}
          columns={[
            { id: "code", header: "Code", cell: (o) => o.code },
            { id: "name", header: "Stock owner", cell: (o) => o.name },
            { id: "status", header: "Status", cell: (o) => (o.active ? "Active" : "Inactive") },
            {
              id: "grants",
              header: "Authorized users",
              cell: (o) =>
                can("users", "edit")
                  ? grants.data
                      ?.filter((g) => g.owner_id === o.id)
                      .map(
                        (g) =>
                          users.data?.find((u) => u.id === g.user_id)?.displayName ??
                          `User #${g.user_id}`,
                      )
                      .join(", ") || "Administrators only"
                  : "Assigned owner access",
            },
            {
              id: "actions",
              header: "Actions",
              cell: (o) =>
                can("users", "edit") && (
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => open("save", o)}>
                      Edit
                    </Button>
                    <Button variant="secondary" onClick={() => open("grant", o)}>
                      Manage access
                    </Button>
                  </div>
                ),
            },
          ]}
        />
      )}
      <h2 className="font-semibold">Owner inventory by handling unit and lot</h2>
      {stock.isPending ? (
        <TableSkeleton />
      ) : stock.isError ? (
        <div role="alert">
          <p className="text-danger">{errorMessage(stock.error)}</p>
          <Button
            onClick={() => {
              void stock.refetch();
            }}
          >
            Retry stock
          </Button>
        </div>
      ) : (
        <Table
          rows={rows}
          rowKey={(r) => r.key}
          columns={[
            { id: "owner", header: "Owner", cell: (r) => r.owner },
            { id: "unit", header: "Handling unit", cell: (r) => r.unit },
            { id: "bin", header: "Bin", cell: (r) => r.bin },
            { id: "sku", header: "SKU", cell: (r) => r.sku },
            { id: "batch_no", header: "Lot", cell: (r) => r.batch_no ?? "—" },
            { id: "status", header: "Status", cell: (r) => r.stock_status },
            { id: "quantity", header: "Physical units", cell: (r) => r.quantity_milli / 1000 },
            {
              id: "reserved",
              header: "Reserved units (product/unit)",
              cell: (r) => r.reserved_milli / 1000,
            },
          ]}
        />
      )}
      <Dialog
        open={edit !== null}
        onOpenChange={(v) => {
          if (!v && !save.isPending) setEdit(null);
        }}
        title={edit?.mode === "grant" ? `Owner access: ${edit.name}` : "Save stock owner"}
        busy={save.isPending}
      >
        {edit && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!save.isPending) save.mutate();
            }}
          >
            {edit.mode === "save" ? (
              <>
                <Field label="Owner code" required>
                  {(id) => (
                    <Input
                      id={id}
                      required
                      value={edit.code}
                      onChange={(e) => setEdit({ ...edit, code: e.target.value })}
                    />
                  )}
                </Field>
                <Field label="Legal stock owner name" required>
                  {(id) => (
                    <Input
                      id={id}
                      required
                      value={edit.name}
                      onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                    />
                  )}
                </Field>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={edit.active}
                    onChange={(e) => setEdit({ ...edit, active: e.target.checked })}
                  />
                  Active
                </label>
              </>
            ) : (
              <>
                <Field label="User" required>
                  {(id) => (
                    <Select
                      id={id}
                      value={edit.user}
                      options={
                        users.data
                          ?.filter((u) => u.isActive)
                          .map((u) => ({ value: String(u.id), label: u.displayName })) ?? []
                      }
                      onChange={(user) => setEdit({ ...edit, user })}
                    />
                  )}
                </Field>
                <Field label="Owner access">
                  {(id) => (
                    <Select
                      id={id}
                      value={edit.allowed ? "allow" : "deny"}
                      options={[
                        { value: "allow", label: "Grant access" },
                        { value: "deny", label: "Revoke access" },
                      ]}
                      onChange={(value) => setEdit({ ...edit, allowed: value === "allow" })}
                    />
                  )}
                </Field>
                <p className="text-xs text-ink-secondary">
                  User role and branch permission are also required. Administrators retain
                  company-wide owner administration.
                </p>
              </>
            )}
            {error && (
              <p role="alert" className="text-danger">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                disabled={save.isPending}
                onClick={() => setEdit(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={save.isPending}>
                Save
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
