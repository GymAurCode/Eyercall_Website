import { useState, type FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { call, errorMessage } from "../../lib/api";
import { useApp } from "../../lib/app-context";
import { PageHeader, TableSkeleton } from "../../components/ui/Feedback";
import { Button } from "../../components/ui/Button";
import { Dialog } from "../../components/ui/Dialog";
import { Field, Input, Select } from "../../components/ui/Input";
import { MmsTable as Table } from "../mms/MmsTable";
import type { PickingWave } from "../../../shared/wms";
type Editor = {
  kind: "save" | "release" | "cancel" | "history";
  id: number | null;
  revision: number;
  number: string;
  warehouse: string;
  method: "single" | "batch" | "wave";
  ids: number[];
  packing: string;
  worker: string;
  reason: string;
  key: string;
};
export function WavesPage(): React.JSX.Element {
  const { can } = useApp(),
    client = useQueryClient();
  const query = useQuery({ queryKey: ["wms"], queryFn: () => call("wms.snapshot", {}) }),
    s = query.data;
  const [edit, setEdit] = useState<Editor | null>(null),
    [error, setError] = useState(""),
    [priority, setPriority] = useState(""),
    [cutoff, setCutoff] = useState("");
  const history = useQuery({
    queryKey: ["wms-wave", edit?.id],
    queryFn: () => call("wms.waves.get", { id: edit!.id! }),
    enabled: edit?.kind === "history" && edit.id !== null,
  });
  function open(kind: Editor["kind"], wave?: PickingWave) {
    setError("");
    setEdit({
      kind,
      id: wave?.id ?? null,
      revision: wave?.revision ?? 0,
      number: wave?.number ?? "",
      warehouse: wave ? String(wave.warehouse_id) : "",
      method: wave?.method ?? "wave",
      ids: wave?.dispatch_ids ?? [],
      packing: wave?.packing_bin_id ? String(wave.packing_bin_id) : "",
      worker: wave?.assigned_to ? String(wave.assigned_to) : "",
      reason: "",
      key: crypto.randomUUID(),
    });
  }
  const mutate = useMutation({
    mutationFn: async () => {
      if (!edit) throw Error("No wave selected.");
      if (edit.kind === "save")
        return call("wms.waves.save", {
          ...(edit.id ? { id: edit.id } : {}),
          revision: edit.revision,
          warehouseId: Number(edit.warehouse),
          number: edit.number,
          method: edit.method,
          dispatchIds: edit.ids,
          commandKey: edit.key,
        });
      if (edit.kind === "release")
        return call("wms.waves.release", {
          id: edit.id!,
          packingBinId: Number(edit.packing),
          workerId: edit.worker ? Number(edit.worker) : null,
        });
      if (edit.kind === "cancel")
        return call("wms.waves.cancel", { id: edit.id!, reason: edit.reason });
    },
    onSuccess: () => {
      toast.success("Picking wave saved.");
      setEdit(null);
      void client.invalidateQueries({ queryKey: ["wms"] });
      void client.invalidateQueries({queryKey:['wms-handling']});
    },
    onError: (e: unknown) => {
      console.error(e);
      setError(errorMessage(e));
    },
  });
  const finish = useMutation({
    mutationFn: (id: number) => call("wms.waves.complete", { id }),
    onSuccess: () => {
      toast.success("Wave completed.");
      void client.invalidateQueries({ queryKey: ["wms"] });
    },
    onError: (e: unknown) => {
      console.error(e);
      toast.error(errorMessage(e));
    },
  });
  const requests =
    s?.dispatches.filter(
      (d) =>
        d.status === "draft" &&
        d.warehouse_id === Number(edit?.warehouse) &&
        (!priority || d.priority === priority) &&
        (!cutoff || d.required_date <= cutoff) &&
        !s.waves.some(
          (w) => w.id !== edit?.id && w.status !== "cancelled" && w.dispatch_ids.includes(d.id),
        ),
    ) ?? [];
  return (
    <div className="space-y-5">
      <PageHeader
        title="Picking Waves"
        description="Group eligible requests, allocate stock atomically, assign pickers and review execution history."
        actions={
          can("warehouse", "edit") ? (
            <Button onClick={() => open("save")}>Create picking wave</Button>
          ) : undefined
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
        s && (
          <Table<PickingWave>
            rows={s.waves}
            rowKey={(w) => w.id}
            columns={[
              { id: "number", header: "Wave", cell: (w) => w.number },
              {
                id: "warehouse",
                header: "Warehouse",
                cell: (w) => s.warehouses.find((x) => x.id === w.warehouse_id)?.code,
              },
              { id: "method", header: "Picking method", cell: (w) => w.method },
              { id: "requests", header: "Requests", cell: (w) => w.dispatch_ids.length },
              {
                id: "progress",
                header: "Task progress",
                cell: (w) => `${w.completed_tasks} / ${w.task_count}`,
              },
              { id: "quantity", header: "Picked units", cell: (w) => w.picked_milli / 1000 },
              { id: "status", header: "Status", cell: (w) => w.status },
              {
                id: "actions",
                header: "Actions",
                cell: (w) => (
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => open("history", w)}>
                      View history
                    </Button>
                    {can("warehouse", "edit") && w.status === "draft" && (
                      <>
                        <Button variant="secondary" onClick={() => open("save", w)}>
                          Edit
                        </Button>
                        <Button onClick={() => open("release", w)}>Release wave</Button>
                      </>
                    )}
                    {can("warehouse", "edit") && w.status === "released" && (
                      <Button disabled={finish.isPending} onClick={() => finish.mutate(w.id)}>
                        Complete wave
                      </Button>
                    )}
                    {can("warehouse", "cancel") && ["draft", "released"].includes(w.status) && (
                      <Button variant="secondary" onClick={() => open("cancel", w)}>
                        Cancel wave
                      </Button>
                    )}
                  </div>
                ),
              },
            ]}
          />
        )
      )}
      <Dialog
        open={edit !== null}
        onOpenChange={(v) => {
          if (!v && !mutate.isPending) setEdit(null);
        }}
        title={
          edit?.kind === "history"
            ? `Wave ${edit.number} history`
            : edit?.kind === "release"
              ? "Release picking wave"
              : edit?.kind === "cancel"
                ? "Cancel picking wave"
                : "Plan picking wave"
        }
        size="lg"
        busy={mutate.isPending}
      >
        {edit?.kind === "history" ? (
          history.isPending ? (
            <TableSkeleton />
          ) : history.isError ? (
            <p role="alert" className="text-danger">
              {errorMessage(history.error)}
            </p>
          ) : (
            history.data && (
              <div className="space-y-4">
                <p>
                  {history.data.wave.status} · {history.data.wave.picked_milli / 1000} units picked
                </p>
                <h3 className="font-semibold">Picking work</h3>
                {history.data.tasks.map((t) => (
                  <p key={t.id} className="text-sm">
                    #{t.id} · {t.sku} · {t.source} → {t.destination} · {t.actual_milli / 1000}/
                    {t.quantity_milli / 1000} · {t.on_hold ? "Held for supervisor" : t.status}
                  </p>
                ))}
                <h3 className="font-semibold">Audit timeline</h3>
                {history.data.events.map((e) => (
                  <div className="border-b border-[var(--border)] py-2 text-sm" key={e.id}>
                    <p>
                      {new Date(e.created_at).toLocaleString()} · {e.actor_name} · {e.action}
                    </p>
                    {e.reason && <p className="text-ink-secondary">{e.reason}</p>}
                  </div>
                ))}
              </div>
            )
          )
        ) : (
          edit && (
            <form
              className="space-y-4"
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                if (!mutate.isPending) mutate.mutate();
              }}
            >
              {edit.kind === "save" && (
                <>
                  <Field label="Wave number" required>
                    {(id) => (
                      <Input
                        id={id}
                        required
                        value={edit.number}
                        onChange={(e) => setEdit({ ...edit, number: e.target.value })}
                      />
                    )}
                  </Field>
                  <Field label="Warehouse" required>
                    {(id) => (
                      <Select
                        id={id}
                        value={edit.warehouse}
                        onChange={(warehouse) => setEdit({ ...edit, warehouse, ids: [] })}
                        options={
                          s?.warehouses
                            .filter((w) => w.active)
                            .map((w) => ({ value: String(w.id), label: w.code })) ?? []
                        }
                      />
                    )}
                  </Field>
                  <Field label="Picking method">
                    {(id) => (
                      <Select
                        id={id}
                        value={edit.method}
                        onChange={(method) =>
                          setEdit({ ...edit, method: method as Editor["method"] })
                        }
                        options={[
                          { value: "single", label: "Single order" },
                          { value: "batch", label: "Batch picking" },
                          { value: "wave", label: "Wave picking" },
                        ]}
                      />
                    )}
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Request priority">
                      {(id) => (
                        <Select
                          id={id}
                          placeholder="All priorities"
                          value={priority}
                          onChange={setPriority}
                          options={["normal", "high", "urgent"].map((value) => ({
                            value,
                            label: value,
                          }))}
                        />
                      )}
                    </Field>
                    <Field label="Dispatch cutoff">
                      {(id) => (
                        <Input
                          id={id}
                          type="date"
                          value={cutoff}
                          onChange={(e) => setCutoff(e.target.value)}
                        />
                      )}
                    </Field>
                  </div>
                  <fieldset className="space-y-3 rounded-lg border border-[var(--border)] p-4">
                    <legend className="px-1 text-sm">Eligible draft requests</legend>
                    {requests.length === 0 ? (
                      <p className="text-sm text-ink-secondary">
                        Select a warehouse or create eligible dispatch requests.
                      </p>
                    ) : (
                      requests.map((d) => (
                        <label className="flex items-center gap-3 text-sm" key={d.id}>
                          <input
                            type="checkbox"
                            checked={edit.ids.includes(d.id)}
                            onChange={(e) =>
                              setEdit({
                                ...edit,
                                ids: e.target.checked
                                  ? [...edit.ids, d.id]
                                  : edit.ids.filter((id) => id !== d.id),
                              })
                            }
                          />
                          {d.number} · {d.recipient} · {d.priority} · {d.required_date}
                        </label>
                      ))
                    )}
                  </fieldset>
                  <p className="text-xs text-ink-secondary">
                    {edit.ids.length} selected. Release rechecks stock and reserves every request in
                    one transaction; a shortage commits no allocations.
                  </p>
                </>
              )}
              {edit.kind === "release" && (
                <>
                  <Field label="Packing destination" required>
                    {(id) => (
                      <Select
                        id={id}
                        value={edit.packing}
                        onChange={(packing) => setEdit({ ...edit, packing })}
                        options={
                          s?.bins
                            .filter(
                              (b) =>
                                b.warehouse_id === Number(edit.warehouse) &&
                                b.type === "packing" &&
                                b.active &&
                                !b.blocked,
                            )
                            .map((b) => ({ value: String(b.id), label: b.code })) ?? []
                        }
                      />
                    )}
                  </Field>
                  <Field label="Assign picker">
                    {(id) => (
                      <Select
                        id={id}
                        placeholder="Unassigned"
                        value={edit.worker}
                        onChange={(worker) => setEdit({ ...edit, worker })}
                        options={
                          s?.workers.map((w) => ({ value: String(w.id), label: w.display_name })) ??
                          []
                        }
                      />
                    )}
                  </Field>
                </>
              )}
              {edit.kind === "cancel" && (
                <Field label="Cancellation reason" required>
                  {(id) => (
                    <Input
                      id={id}
                      required
                      value={edit.reason}
                      onChange={(e) => setEdit({ ...edit, reason: e.target.value })}
                    />
                  )}
                </Field>
              )}
              {error && (
                <p role="alert" className="text-danger text-sm">
                  {error}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEdit(null)}
                  disabled={mutate.isPending}
                >
                  Close
                </Button>
                <Button type="submit" disabled={mutate.isPending}>
                  {mutate.isPending
                    ? "Saving…"
                    : edit.kind === "release"
                      ? "Allocate and release"
                      : "Save"}
                </Button>
              </div>
            </form>
          )
        )}
      </Dialog>
    </div>
  );
}
