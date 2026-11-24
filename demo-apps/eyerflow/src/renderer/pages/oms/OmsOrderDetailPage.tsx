/**
 * Order & Fulfillment Management — order detail command view.
 *
 * Reads the OMS-owned snapshot of the canonical IMS sales order, shows its
 * validation result, lines and holds, and exposes the context-sensitive
 * lifecycle actions: validate, confirm, hold, release hold, cancel. Every
 * action goes through a real RPC; the screen renders server answers verbatim.
 */

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { call, errorMessage } from "../../lib/api";
import { useApp } from "../../lib/app-context";
import { PageHeader, TableSkeleton } from "../../components/ui/Feedback";
import { Button } from "../../components/ui/Button";
import { Dialog } from "../../components/ui/Dialog";
import { Field, Input, Select } from "../../components/ui/Input";
import type { OmsHoldType, OmsOrderSnapshot, OmsValidationResult } from "../../../shared/oms";

export function OmsOrderDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const { can } = useApp();
  const client = useQueryClient();
  const navigate = useNavigate();
  const [validation, setValidation] = useState<OmsValidationResult | null>(null);
  const [holdOpen, setHoldOpen] = useState(false);
  const [holdType, setHoldType] = useState("manual");
  const [holdReason, setHoldReason] = useState("");

  const query = useQuery({
    queryKey: ["oms.orders", orderId],
    queryFn: () => call("oms.orders.get", { id: orderId }),
    enabled: can("oms", "view"),
  });

  const validate = useMutation({
    mutationFn: async () => {
      const result = await call("oms.orders.validate", { id: orderId });
      return result;
    },
    onSuccess: (result) => {
      setValidation(result);
      toast.success(result.blocked ? "Validation completed with blocking findings." : "Validation passed.");
    },
    onError: (e: unknown) => {
      console.error("OMS order validate failed", e);
      toast.error(errorMessage(e));
    },
  });

  const confirm = useMutation({
    mutationFn: async (input: { id: number; reason: string }) => {
      const order = await call("oms.orders.confirm", input);
      await client.invalidateQueries({ queryKey: ["oms.orders"] });
      return order;
    },
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["oms.orders"] });
      void client.invalidateQueries({ queryKey: ["wms"] });
      toast.success("Order confirmed. Stock is now reserved for allocation.");
    },
    onError: (e: unknown) => {
      console.error("OMS order confirm failed", e);
      toast.error(errorMessage(e));
    },
  });

  const hold = useMutation({
    mutationFn: async (input: { id: number; holdType: OmsHoldType; reason: string }) => {
      const created = await call("oms.orders.hold", input);
      await client.invalidateQueries({ queryKey: ["oms.orders"] });
      return created;
    },
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["oms.orders"] });
      toast.success("Order placed on hold.");
    },
    onError: (e: unknown) => {
      console.error("OMS order hold failed", e);
      toast.error(errorMessage(e));
    },
  });

  const releaseHold = useMutation({
    mutationFn: async (input: { id: number; holdId?: number; reason: string }) => {
      const payload: { id: number; reason: string; holdId?: number } = { id: input.id, reason: input.reason };
      if (input.holdId !== undefined) payload.holdId = input.holdId;
      await call("oms.orders.releaseHold", payload);
      await client.invalidateQueries({ queryKey: ["oms.orders"] });
      toast.success("Order hold released.");
    },
    onError: (e: unknown) => {
      console.error("OMS hold release failed", e);
      toast.error(errorMessage(e));
    },
  });

  const cancel = useMutation({
    mutationFn: async (input: { id: number; reason: string }) => {
      const order = await call("oms.orders.cancel", input);
      await client.invalidateQueries({ queryKey: ["oms.orders"] });
      return order;
    },
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["oms.orders"] });
      void client.invalidateQueries({ queryKey: ["wms"] });
      toast.success("Order cancelled.");
    },
    onError: (e: unknown) => {
      console.error("OMS order cancel failed", e);
      toast.error(errorMessage(e));
    },
  });

  if (query.isPending) return <TableSkeleton columns={2} />;
  if (query.isError) {
    return (
      <div className="card p-6" role="alert">
        <p className="text-danger">{errorMessage(query.error)}</p>
        <Button size="sm" variant="secondary" onClick={() => void query.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const order: OmsOrderSnapshot | null = query.data ?? null;
  if (order === null) {
    return (
      <div className="card p-6">
        <p className="text-danger">The order could not be loaded.</p>
        <Button size="sm" variant="secondary" onClick={() => void query.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const openHold = order.holds.find((hold) => hold.status === "open") ?? null;

  return (
    <div className="space-y-5">
      <PageHeader
        title={`${order.number} · ${order.status}`}
        description={`IMS status ${order.imsStatus} · customer ${order.customerName ?? "—"} · required ${order.requiredDate ?? "—"}`}
        breadcrumbs={[
          { label: "Orders", onClick: () => navigate("/oms/orders") },
          { label: order.number },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => void query.refetch()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate("/oms/orders")}>
              <ArrowLeft className="h-4 w-4" />
              Back to orders
            </Button>
          </div>
        }
      />

      {validation !== null ? (
        <div className="card p-5">
          <h2 className="font-semibold">Validation result</h2>
          <p className="mt-2 text-sm">Blocked: {String(validation.blocked)}</p>
          <ul className="mt-2 space-y-1 text-sm">
            {validation.checks.map((check) => (
              <li key={`${check.rule}-${check.field}`}>
                {check.rule}: {check.reason} {check.blocking ? "BLOCKING" : "advisory"}.
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="card p-5">
        <h2 className="font-semibold">Order</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-ink-secondary">IMS status</dt>
            <dd>{order.imsStatus}</dd>
          </div>
          <div>
            <dt className="text-ink-secondary">OMS status</dt>
            <dd>{order.status}</dd>
          </div>
          <div>
            <dt className="text-ink-secondary">Customer</dt>
            <dd>{order.customerName ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-ink-secondary">Issue date</dt>
            <dd>{order.issueDate}</dd>
          </div>
          <div>
            <dt className="text-ink-secondary">Required date</dt>
            <dd>{order.requiredDate ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-ink-secondary">Total</dt>
            <dd>{(order.totalFils / 1000).toLocaleString()}</dd>
          </div>
        </dl>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold">Lines</h2>
        <div className="mt-2 space-y-2 text-sm">
          {order.lines.map((line) => (
            <div key={line.lineId} className="flex justify-between border-b border-[var(--border)] pb-1">
              <span>
                {line.sku} · {line.name}
              </span>
              <span>
                {line.quantityMilli / 1000} @ {(line.unitPriceFils / 1000).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold">Holds</h2>
        {order.holds.length === 0 ? (
          <p className="mt-2 text-sm text-ink-secondary">No holds recorded.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {order.holds.map((hold) => (
              <li key={hold.id ?? `${hold.orderId}-${hold.createdAt}`}>
                {hold.holdType}: {hold.reason} ({hold.status})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {can("oms", "view") && (
          <Button variant="secondary" size="sm" disabled={validate.isPending} onClick={() => void validate.mutateAsync()}>
            Run validation
          </Button>
        )}
        {can("oms", "edit") && order.status === "draft" && (
          <Button size="sm" disabled={confirm.isPending} onClick={() => void confirm.mutateAsync({ id: order.orderId, reason: "" })}>
            Confirm order
          </Button>
        )}
        {can("oms", "create") && order.status !== "cancelled" && order.status !== "fulfilled" && (
          <Button variant="secondary" size="sm" onClick={() => setHoldOpen(true)}>
            Place hold
          </Button>
        )}
        {can("oms", "edit") && openHold !== null && (
          <Button
            variant="secondary"
            size="sm"
            disabled={releaseHold.isPending}
            onClick={() => {
              const releaseId = openHold.id;
              if (releaseId !== null) {
                void releaseHold.mutateAsync({ id: order.orderId, holdId: releaseId, reason: "Hold released" });
              }
            }}
          >
            Release hold
          </Button>
        )}
        {can("oms", "edit") && order.status !== "cancelled" && order.status !== "fulfilled" && (
          <Button variant="secondary" size="sm" disabled={cancel.isPending} onClick={() => void cancel.mutateAsync({ id: order.orderId, reason: "Order cancelled" })}>
            Cancel order
          </Button>
        )}
      </div>

      <Dialog
        open={holdOpen}
        onOpenChange={(open) => {
          if (!open) setHoldOpen(false);
        }}
        title="Place order hold"
        description="A hold blocks the downstream OMS lifecycle actions for this order."
        busy={hold.isPending}
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void hold.mutateAsync({ id: order.orderId, holdType: holdType as OmsHoldType, reason: holdReason });
          }}
        >
          <Field label="Hold type" required>
            {(id) => (
              <Select id={id} value={holdType} onChange={(value) => setHoldType(value)} options={HOLDS} />
            )}
          </Field>
          <Field label="Reason" required>
            {(id) => (
              <Input id={id} value={holdReason} onChange={(e) => setHoldReason(e.target.value)} placeholder="Why is this order held?" />
            )}
          </Field>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setHoldOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={hold.isPending}>
              Place hold
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

const HOLDS: readonly { value: string; label: string }[] = [
  { value: "validation", label: "Validation" },
  { value: "fulfillment", label: "Fulfillment" },
  { value: "allocation", label: "Allocation" },
  { value: "payment", label: "Payment" },
  { value: "credit", label: "Credit" },
  { value: "fraud", label: "Fraud" },
  { value: "customer", label: "Customer" },
  { value: "manual", label: "Manual" },
];
