/**
 * Channel stock.
 *
 * The quantity shown here is derived from the IMS ledger: available on hand
 * minus the store's safety buffer and policy bounds. There is no second stock
 * balance for ECOM, and a conflict is recorded as evidence rather than
 * overwriting either side silently.
 */

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RefreshCw, Send, TriangleAlert } from "lucide-react";
import { call, errorMessage } from "../../lib/api";
import { useApp } from "../../lib/app-context";
import { formatQuantity } from "../../lib/format";
import { PageHeader, TableSkeleton } from "../../components/ui/Feedback";
import { Button } from "../../components/ui/Button";
import { Dialog } from "../../components/ui/Dialog";
import { Field, Input, Select } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { MmsTable as Table } from "../mms/MmsTable";
import type { Column } from "../../components/ui/DataTable";
import type { EcomStockRow } from "../../../shared/ecom";
import { channelOptions, useEcomChannels } from "./EcomShared";

export function EcomInventoryPage(): React.JSX.Element {
  const { can } = useApp();
  const client = useQueryClient();
  const [channelId, setChannelId] = useState("");
  const [onlyConflicts, setOnlyConflicts] = useState(false);
  const [conflict, setConflict] = useState<EcomStockRow | null>(null);
  const channels = useEcomChannels();
  const list = channels.data ?? [];
  const editable = can("ecommerce", "edit");

  const query = useQuery({
    queryKey: ["ecom", "inventory", channelId, onlyConflicts],
    queryFn: () =>
      call("ecom.inventory.list", {
        ...(channelId === "" ? {} : { channelId: Number(channelId) }),
        onlyConflicts,
      }),
    enabled: can("ecommerce", "view"),
  });

  const history = useQuery({
    queryKey: ["ecom", "inventoryHistory", channelId],
    queryFn: () =>
      call("ecom.inventory.history", channelId === "" ? { limit: 200 } : { channelId: Number(channelId), limit: 200 }),
    enabled: can("ecommerce", "view"),
  });

  const syncChannel = useMutation({
    mutationFn: (id: number) => call("ecom.inventory.syncChannel", { id }),
    onSuccess: async (queued) => {
      await client.invalidateQueries({ queryKey: ["ecom", "inventory"] });
      toast.success(`${String(queued.length)} stock updates queued.`);
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const syncProduct = useMutation({
    mutationFn: (productId: number) =>
      call("ecom.inventory.syncProduct", {
        productId,
        ...(channelId === "" ? {} : { channelId: Number(channelId) }),
      }),
    onSuccess: async (queued) => {
      await client.invalidateQueries({ queryKey: ["ecom", "inventory"] });
      toast.success(`${String(queued.length)} stock updates queued.`);
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const rows = query.data ?? [];

  const columns: readonly Column<EcomStockRow>[] = [
    { id: "sku", header: "SKU", cell: (row) => row.sku },
    { id: "productName", header: "Product", cell: (row) => row.productName },
    { id: "channelName", header: "Store", cell: (row) => row.channelName },
    { id: "onHandMilli", header: "On hand", cell: (row) => formatQuantity(row.onHandMilli), align: "end" },
    { id: "reservedMilli", header: "Reserved", cell: (row) => formatQuantity(row.reservedMilli), align: "end" },
    { id: "availableMilli", header: "Available", cell: (row) => formatQuantity(row.availableMilli), align: "end" },
    {
      id: "safetyBufferMilli",
      header: "Buffer",
      cell: (row) => formatQuantity(row.safetyBufferMilli),
      align: "end",
    },
    {
      id: "eligibleMilli",
      header: "Exportable",
      cell: (row) => <strong>{formatQuantity(row.eligibleMilli)}</strong>,
      align: "end",
    },
    {
      id: "remoteQuantityMilli",
      header: "Store says",
      cell: (row) => (row.remoteQuantityMilli === null ? "never synced" : formatQuantity(row.remoteQuantityMilli)),
      align: "end",
    },
    { id: "status", header: "Status", cell: (row) => row.syncStatus },
    {
      id: "observedAt",
      header: "Observed",
      cell: (row) => row.observedAt?.slice(0, 19).replace("T", " ") ?? "—",
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          {editable && (
            <Button size="sm" variant="secondary" disabled={syncProduct.isPending} onClick={() => syncProduct.mutate(row.productId)}>
              <Send className="h-4 w-4" />
              Push
            </Button>
          )}
          {editable && (row.syncStatus === "conflict" || row.conflictNote !== null) && (
            <Button size="sm" variant="secondary" onClick={() => setConflict(row)}>
              Resolve
            </Button>
          )}
        </div>
      ),
    },
  ];

  const historyColumns: readonly Column<Readonly<Record<string, string | number | null>>>[] = [
    { id: "observed_at", header: "Observed", cell: (row) => String(row["observed_at"] ?? "") },
    { id: "channel_name", header: "Store", cell: (row) => String(row["channel_name"] ?? "") },
    { id: "sku", header: "SKU", cell: (row) => String(row["sku"] ?? "") },
    {
      id: "local_available_milli",
      header: "Local",
      cell: (row) => formatQuantity(Number(row["local_available_milli"] ?? 0)),
      align: "end",
    },
    {
      id: "remote_milli",
      header: "Remote",
      cell: (row) => (row["remote_milli"] === null ? "—" : formatQuantity(Number(row["remote_milli"]))),
      align: "end",
    },
    { id: "status", header: "Status", cell: (row) => String(row["status"] ?? "") },
    { id: "note", header: "Note", cell: (row) => String(row["note"] ?? "—") },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Channel stock"
        description="Available IMS quantity, policy buffer and the last quantity the store acknowledged"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => void query.refetch()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            {editable && channelId !== "" && (
              <Button
                size="sm"
                disabled={syncChannel.isPending}
                onClick={() => syncChannel.mutate(Number(channelId))}
              >
                Push whole store
              </Button>
            )}
          </div>
        }
      />

      <div className="flex flex-wrap items-end gap-3">
        <Field label="Store">
          {(id) => (
            <Select id={id} value={channelId} onChange={setChannelId} options={channelOptions(list)} className="w-[240px]" />
          )}
        </Field>
        <Field label="Conflict filter">
          {(id) => (
            <Select
              id={id}
              value={onlyConflicts ? "yes" : "no"}
              onChange={(value) => setOnlyConflicts(value === "yes")}
              className="w-[180px]"
              options={[
                { value: "no", label: "All rows" },
                { value: "yes", label: "Conflicts only" },
              ]}
            />
          )}
        </Field>
        <div className="pb-0.5">
          <Badge tone={rows.some((row) => row.syncStatus === "conflict") ? "danger" : "success"}>
            {String(rows.filter((row) => row.syncStatus === "conflict").length)} conflicts
          </Badge>
        </div>
      </div>

      <Table
        rows={rows}
        rowKey={(row) => row.mappingId}
        columns={columns}
        loading={query.isPending}
        error={query.error}
        onRetry={() => void query.refetch()}
        emptyState="No mapped product exists yet. A stock export needs an active SKU mapping."
      />

      <Card flush>
        <CardHeader
          title="Sync evidence"
          description="Every acknowledged export, conflict and resolution, newest first"
        />
        <CardBody>
          {history.isPending ? (
            <TableSkeleton columns={historyColumns.length} />
          ) : (
            <Table
              rows={history.data ?? []}
              rowKey={(row) => String(row["id"] ?? `${String(row["observed_at"])}-${String(row["sku"])}`)}
              columns={historyColumns}
              loading={false}
              error={history.error}
              onRetry={() => void history.refetch()}
              emptyState="No stock has been exported to a store yet."
            />
          )}
        </CardBody>
      </Card>

      <ResolveDialog conflict={conflict} onClose={() => setConflict(null)} />
    </div>
  );
}

function ResolveDialog({
  conflict,
  onClose,
}: {
  readonly conflict: EcomStockRow | null;
  readonly onClose: () => void;
}): React.JSX.Element {
  const client = useQueryClient();
  const [action, setAction] = useState<"push" | "accept_remote" | "ignore">("push");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const resolve = useMutation({
    mutationFn: () => {
      if (conflict === null) throw new Error("No conflict selected.");
      return call("ecom.inventory.resolveConflict", {
        snapshotId: conflict.snapshotId,
        action,
        note,
      });
    },
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "inventory"] });
      toast.success("Conflict resolution recorded.");
      setNote("");
      onClose();
    },
    onError: (e: unknown) => {
      setError(errorMessage(e));
      toast.error(errorMessage(e));
    },
  });

  return (
    <Dialog
      open={conflict !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Resolve stock conflict"
      description="The recorded evidence is kept. Choose which quantity the next export should carry."
      busy={resolve.isPending}
    >
      {conflict === null ? null : (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            resolve.mutate();
          }}
        >
          {error !== "" && <p className="text-sm text-[var(--danger)]">{error}</p>}
          <div className="rounded-lg border border-[var(--border)] p-3 text-sm">
            <p className="flex items-center gap-2 font-medium text-[var(--text)]">
              <TriangleAlert className="h-4 w-4 text-[var(--warning)]" />
              {conflict.productName} · {conflict.channelName}
            </p>
            <p className="mt-1 text-xs text-[var(--text-2)]">
              Local available {formatQuantity(conflict.availableMilli)} · exportable{" "}
              {formatQuantity(conflict.eligibleMilli)} · remote{" "}
              {conflict.remoteQuantityMilli === null ? "unknown" : formatQuantity(conflict.remoteQuantityMilli)}
            </p>
            {conflict.conflictNote !== null && (
              <p className="mt-1 text-xs text-[var(--danger)]">{conflict.conflictNote}</p>
            )}
          </div>
          <Field label="Resolution" required>
            {(id) => (
              <Select
                id={id}
                value={action}
                onChange={(value) => setAction(value as "push" | "accept_remote" | "ignore")}
                options={[
                  { value: "push", label: "Push the local available quantity" },
                  { value: "accept_remote", label: "Accept the store's quantity as evidence" },
                  { value: "ignore", label: "Ignore this conflict" },
                ]}
              />
            )}
          </Field>
          <Field label="Operator note">
            {(id) => <Input id={id} value={note} onChange={(event) => setNote(event.target.value)} />}
          </Field>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={resolve.isPending}>
              Record resolution
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
