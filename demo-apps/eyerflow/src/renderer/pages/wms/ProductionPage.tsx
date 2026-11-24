import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { call, errorMessage } from "../../lib/api";
import { useApp } from "../../lib/app-context";
import { PageHeader, TableSkeleton } from "../../components/ui/Feedback";
import { Button } from "../../components/ui/Button";
import { Dialog } from "../../components/ui/Dialog";
import { Field, Select } from "../../components/ui/Input";
import { MmsTable as Table } from "../mms/MmsTable";
import type { Dispatch } from "../../../shared/wms";
type Editor = {
  mode: "create" | "release";
  id: number;
  mo: string;
  warehouse: string;
  stage: string;
  key: string;
};
export function ProductionPage(): React.JSX.Element {
  const { can } = useApp(),
    client = useQueryClient();
  const snapshot = useQuery({ queryKey: ["wms"], queryFn: () => call("wms.snapshot", {}) }),
    sources = useQuery({
      queryKey: ["wms-production"],
      queryFn: () => call("wms.production.sources", {}),
    });
  const [edit, setEdit] = useState<Editor | null>(null),
    [error, setError] = useState("");
  const save = useMutation({
    mutationFn: (): Promise<number | void> => {
      if (!edit) throw Error("Select an operation.");
      return edit.mode === "create"
        ? call("wms.production.create", {
            moId: Number(edit.mo),
            warehouseId: Number(edit.warehouse),
            commandKey: edit.key,
          })
        : call("wms.dispatch.release", { id: edit.id, packingBinId: Number(edit.stage) });
    },
    onSuccess: () => {
      setEdit(null);
      toast.success("Manufacturing warehouse work saved.");
      void client.invalidateQueries({ queryKey: ["wms"] });
      void client.invalidateQueries({ queryKey: ["wms-production"] });
      void client.invalidateQueries({ queryKey: ["wms-handling"] });
    },
    onError: (e: unknown) => {
      console.error(e);
      setError(errorMessage(e));
    },
  });
  const handover = useMutation({
    mutationFn: (dispatchId: number) => call("wms.production.handover", { dispatchId }),
    onSuccess: () => {
      toast.success("Material issued into MMS WIP. No consumption was posted.");
      void client.invalidateQueries({ queryKey: ["wms"] });
      void client.invalidateQueries({ queryKey: ["wms-production"] });
      void client.invalidateQueries({ queryKey: ["wms-handling"] });
    },
    onError: (e: unknown) => {
      console.error(e);
      toast.error(errorMessage(e));
    },
  });
  const source = sources.data?.find((m) => m.id === Number(edit?.mo));
  return (
    <div className="space-y-5">
      <PageHeader
        title="Production Material Staging"
        description="Pick released manufacturing requirements, stage physically, then hand over through the MMS material-issue command. MMS owns subsequent consumption."
        actions={
          can("warehouse", "edit") ? (
            <Button
              onClick={() => {
                setError("");
                setEdit({
                  mode: "create",
                  id: 0,
                  mo: "",
                  warehouse: "",
                  stage: "",
                  key: crypto.randomUUID(),
                });
              }}
            >
              Create material picking request
            </Button>
          ) : undefined
        }
      />
      <p className="text-sm text-ink-secondary">
        Use a packing-type location dedicated to production staging.{" "}
        <Link to="/wms/picking" className="underline text-brand">
          Open scanner picking workstation
        </Link>
      </p>
      {snapshot.isPending || sources.isPending ? (
        <TableSkeleton />
      ) : snapshot.isError || sources.isError ? (
        <div role="alert" className="card p-5">
          <p className="text-danger">{errorMessage(snapshot.error ?? sources.error)}</p>
          <Button
            onClick={() => {
              void snapshot.refetch();
              void sources.refetch();
            }}
          >
            Retry
          </Button>
        </div>
      ) : (
        <Table<Dispatch>
          rows={snapshot.data.dispatches.filter((d) => d.manufacturing_order_id !== null)}
          rowKey={(d) => d.id}
          columns={[
            { id: "number", header: "Material request", cell: (d) => d.number },
            { id: "reference", header: "Manufacturing order", cell: (d) => d.reference },
            {
              id: "warehouse",
              header: "Warehouse",
              cell: (d) => snapshot.data.warehouses.find((w) => w.id === d.warehouse_id)?.code,
            },
            { id: "status", header: "Status", cell: (d) => d.status },
            {
              id: "lines",
              header: "Materials",
              cell: (d) =>
                d.lines
                  .map((l) => `${l.sku}: ${l.picked_milli / 1000}/${l.quantity_milli / 1000}`)
                  .join(", "),
            },
            {
              id: "actions",
              header: "Actions",
              cell: (d) =>
                can("warehouse", "edit") && (
                  <>
                    {d.status === "draft" && (
                      <Button
                        onClick={() => {
                          setError("");
                          setEdit({
                            mode: "release",
                            id: d.id,
                            warehouse: String(d.warehouse_id),
                            mo: String(d.manufacturing_order_id),
                            stage: "",
                            key: crypto.randomUUID(),
                          });
                        }}
                      >
                        Release material picks
                      </Button>
                    )}
                    {d.status === "picked" && (
                      <Button disabled={handover.isPending} onClick={() => handover.mutate(d.id)}>
                        Hand over to MMS WIP
                      </Button>
                    )}
                    {d.status === "handedOver" && (
                      <span className="text-sm text-ink-secondary">
                        Issued by MMS; consumption remains separate
                      </span>
                    )}
                  </>
                ),
            },
          ]}
        />
      )}
      <Dialog
        open={edit !== null}
        onOpenChange={(value) => {
          if (!value && !save.isPending) setEdit(null);
        }}
        title={
          edit?.mode === "create"
            ? "Manufacturing material picking request"
            : "Release to production staging"
        }
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
            {edit.mode === "create" ? (
              <>
                <Field label="Manufacturing order" required>
                  {(id) => (
                    <Select
                      id={id}
                      value={edit.mo}
                      onChange={(mo) => setEdit({ ...edit, mo })}
                      options={
                        sources.data
                          ?.filter((m) => m.components.some((c) => c.remaining_milli > 0))
                          .map((m) => ({ value: String(m.id), label: m.number })) ?? []
                      }
                    />
                  )}
                </Field>
                <Field label="Warehouse" required>
                  {(id) => (
                    <Select
                      id={id}
                      value={edit.warehouse}
                      onChange={(warehouse) => setEdit({ ...edit, warehouse })}
                      options={
                        snapshot.data?.warehouses
                          .filter((w) => w.active)
                          .map((w) => ({ value: String(w.id), label: w.code })) ?? []
                      }
                    />
                  )}
                </Field>
                {source?.components.map((line) => (
                  <p className="text-sm" key={line.product_id}>
                    {line.sku} · {line.remaining_milli / 1000} remaining to issue
                  </p>
                ))}
              </>
            ) : (
              <Field label="Production staging location" required>
                {(id) => (
                  <Select
                    id={id}
                    value={edit.stage}
                    onChange={(stage) => setEdit({ ...edit, stage })}
                    options={
                      snapshot.data?.bins
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
                {edit.mode === "create" ? "Create request" : "Release picks"}
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
