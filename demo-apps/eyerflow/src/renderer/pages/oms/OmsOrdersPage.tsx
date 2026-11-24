/**
 * Order & Fulfillment Management — customer order entry and lifecycle list.
 *
 * Reads the OMS-owned snapshot of the canonical IMS sales orders and exposes
 * the order-level lifecycle actions the OMS owns: create a draft, confirm (gated
 * by validation and holds server-side), hold and cancel. Allocation,
 * fulfillment and shipment orchestration are later OMS passes; this screen must
 * not pretend otherwise.
 */

import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, RefreshCw } from "lucide-react";
import { call, errorMessage } from "../../lib/api";
import { useApp } from "../../lib/app-context";
import { useLookup } from "../../lib/lookups";
import { PageHeader, TableSkeleton } from "../../components/ui/Feedback";
import { Button } from "../../components/ui/Button";
import { Dialog } from "../../components/ui/Dialog";
import { Field, Input, Select } from "../../components/ui/Input";
import { MmsTable as Table } from "../mms/MmsTable";
import type { Column } from "../../components/ui/DataTable";
import type { OmsHoldType, OmsOrderLineInput, OmsOrderSnapshot } from "../../../shared/oms";

interface DraftLine {
  productId: string;
  quantity: string;
  price: string;
}

interface PartyDtoLite {
  readonly id: number;
  readonly name: string;
  readonly kind: string;
}

interface ProductDtoLite {
  readonly id: number;
  readonly sku: string;
  readonly name: string;
  readonly quantityMilli: number;
  readonly salePriceFils: number;
  readonly vatTreatment: string;
}

interface CreateOrderInput {
  readonly partyId: number;
  readonly issueDate: string;
  readonly requiredDate: string | null;
  readonly lines: readonly OmsOrderLineInput[];
}

const HOLD_TYPES: readonly { value: string; label: string }[] = [
  { value: "validation", label: "Validation" },
  { value: "fulfillment", label: "Fulfillment" },
  { value: "allocation", label: "Allocation" },
  { value: "payment", label: "Payment" },
  { value: "credit", label: "Credit" },
  { value: "fraud", label: "Fraud" },
  { value: "customer", label: "Customer" },
  { value: "manual", label: "Manual" },
];

export function OmsOrdersPage(): React.JSX.Element {
  const { can } = useApp();
  const client = useQueryClient();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [holdFor, setHoldFor] = useState<OmsOrderSnapshot | null>(null);
  const [error, setError] = useState("");
  const [holdType, setHoldType] = useState("manual");
  const [holdReason, setHoldReason] = useState("");

  const query = useQuery({
    queryKey: ["oms.orders"],
    queryFn: () => call("oms.orders.list", {}),
    enabled: can("oms", "view"),
  });

  const customers = useLookup<PartyDtoLite>("customer");
  const products = useLookup<ProductDtoLite>("product");

  const create = useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      const id = await call("oms.orders.create", input);
      return id;
    },
    onSuccess: async (id) => {
      setCreateOpen(false);
      await client.invalidateQueries({ queryKey: ["oms.orders"] });
      await client.invalidateQueries({ queryKey: ["wms"] });
      toast.success(`Order created as IMS sales order draft #${String(id)}.`);
      navigate(`/oms/orders/${String(id)}`);
    },
    onError: (e: unknown) => {
      console.error("OMS order create failed", e);
      setError(errorMessage(e));
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
      setHoldFor(null);
      setHoldReason("");
      void client.invalidateQueries({ queryKey: ["oms.orders"] });
      toast.success("Order placed on hold.");
    },
    onError: (e: unknown) => {
      console.error("OMS order hold failed", e);
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

  const orders = query.data ?? [];

  const columns: readonly Column<OmsOrderSnapshot>[] = [
    { id: "number", header: "Order", cell: (row) => row.number },
    { id: "customerName", header: "Customer", cell: (row) => row.customerName ?? "—" },
    { id: "status", header: "Status", cell: (row) => row.status },
    { id: "requiredDate", header: "Required", cell: (row) => row.requiredDate ?? "—" },
    { id: "totalFils", header: "Value", cell: (row) => `${(row.totalFils / 1000).toLocaleString()}`, align: "end" },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          {can("oms", "view") && (
            <Button variant="secondary" size="sm" onClick={() => navigate(`/oms/orders/${String(row.orderId)}`)}>
              Open
            </Button>
          )}
          {can("oms", "edit") && row.status === "draft" && (
            <Button size="sm" disabled={confirm.isPending} onClick={() => void confirm.mutateAsync({ id: row.orderId, reason: "" })}>
              Confirm
            </Button>
          )}
          {can("oms", "create") && (
            <Button size="sm" variant="secondary" disabled={hold.isPending} onClick={() => setHoldFor(row)}>
              Hold
            </Button>
          )}
          {can("oms", "edit") && row.status !== "cancelled" && row.status !== "fulfilled" && (
            <Button size="sm" variant="secondary" disabled={cancel.isPending} onClick={() => void cancel.mutateAsync({ id: row.orderId, reason: "Order cancelled" })}>
              Cancel
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Order & Fulfillment Management"
        description="Customer orders, validation, allocation intent and fulfillment orchestration"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => void query.refetch()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            {can("oms", "create") && (
              <Button size="sm" iconLeft={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
                Create order
              </Button>
            )}
          </div>
        }
      />
      {query.isPending ? (
        <TableSkeleton columns={columns.length} />
      ) : query.isError ? (
        <div className="card p-6" role="alert">
          <p className="text-danger">{errorMessage(query.error)}</p>
          <Button size="sm" variant="secondary" onClick={() => void query.refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <Table rows={orders} rowKey={(row) => row.orderId} columns={columns} />
      )}

      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          if (!open) setCreateOpen(false);
        }}
        title="Create customer order"
        description="Creates a draft IMS sales order. Nothing is deducted until the order is confirmed."
        busy={create.isPending}
      >
        <CreateOrderDialog
          open={createOpen}
          customers={customers}
          products={products}
          busy={create.isPending}
          error={error}
          onSubmit={async (input) => {
            await create.mutateAsync(input);
          }}
          onCancel={() => setCreateOpen(false)}
        />
      </Dialog>

      <Dialog
        open={holdFor !== null}
        onOpenChange={(open) => {
          if (!open) setHoldFor(null);
        }}
        title="Place order hold"
        description="A hold blocks the downstream OMS lifecycle actions for this order."
        busy={hold.isPending}
      >
        {holdFor === null ? null : (
          <form
            className="space-y-4"
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              void hold.mutateAsync({ id: holdFor.orderId, holdType: holdType as OmsHoldType, reason: holdReason });
            }}
          >
            <Field label="Hold type" required>
              {(id) => (
                <Select
                  id={id}
                  value={holdType}
                  onChange={(value) => setHoldType(value)}
                  options={HOLD_TYPES}
                />
              )}
            </Field>
            <Field label="Reason" required>
              {(id) => (
                <Input
                  id={id}
                  value={holdReason}
                  onChange={(e) => setHoldReason(e.target.value)}
                  placeholder="Why is this order held?"
                />
              )}
            </Field>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setHoldFor(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={hold.isPending}>
                Place hold
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Create order dialog                                                         */
/* -------------------------------------------------------------------------- */

function CreateOrderDialog({
  open,
  customers,
  products,
  busy,
  error,
  onSubmit,
  onCancel,
}: {
  readonly open: boolean;
  readonly customers: readonly PartyDtoLite[];
  readonly products: readonly ProductDtoLite[];
  readonly busy: boolean;
  readonly error?: string;
  readonly onSubmit: (input: CreateOrderInput) => Promise<void>;
  readonly onCancel: () => void;
}): React.JSX.Element {
  const [partyId, setPartyId] = useState("");
  const [requiredDate, setRequiredDate] = useState("");
  const [lines, setLines] = useState<DraftLine[]>([{ productId: "", quantity: "1", price: "0" }]);

  const submitCreate = async (e: FormEvent) => {
    e.preventDefault();
    const validLines: readonly OmsOrderLineInput[] = lines
      .map((line) => ({
        productId: Number(line.productId),
        quantityMilli: Number(line.quantity) * 1000,
        unitPriceFils: Number(line.price),
        vatTreatment: "standard" as const,
      }))
      .filter(
        (line) =>
          Number.isFinite(line.productId) &&
          line.productId > 0 &&
          Number.isFinite(line.quantityMilli) &&
          line.quantityMilli > 0 &&
          Number.isFinite(line.unitPriceFils) &&
          line.unitPriceFils >= 0,
      );
    if (validLines.length === 0) return;
    await onSubmit({
      partyId: Number(partyId),
      issueDate: new Date().toISOString().slice(0, 10),
      requiredDate: requiredDate === "" ? null : requiredDate,
      lines: validLines.map((line) => ({
        productId: line.productId,
        quantityMilli: line.quantityMilli,
        unitPriceFils: line.unitPriceFils,
        vatTreatment: "standard",
      })),
    });
  };

  if (!open) return <div />;
  return (
    <form className="space-y-4" onSubmit={submitCreate}>
      {error !== undefined ? <p className="text-danger text-sm" role="alert">{error}</p> : null}
      <Field label="Customer" required>
        {(id) => (
          <Select
            id={id}
            value={partyId}
            onChange={setPartyId}
            options={customers.map((party) => ({ value: String(party.id), label: `${party.name} (${party.kind})` }))}
          />
        )}
      </Field>
      <Field label="Required date">
        {(id) => <Input id={id} type="date" value={requiredDate} onChange={(e) => setRequiredDate(e.target.value)} />}
      </Field>
      {lines.map((line, index) => (
        <div key={index} className="space-y-2 rounded-lg border border-[var(--border)] p-3">
          <p className="text-sm font-medium">Line {String(index + 1)}</p>
          <div className="grid gap-2 sm:grid-cols-3">
            <Field label="Product" required>
              {(id) => (
                <Select
                  id={id}
                  value={line.productId}
                  onChange={(value) => setLines(lines.map((l, i) => (i === index ? { ...l, productId: value } : l)))}
                  options={products.map((product) => ({ value: String(product.id), label: `${product.sku} · ${product.name}` }))}
                />
              )}
            </Field>
            <Field label="Quantity" required>
              {(id) => (
                <Input
                  id={id}
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) => setLines(lines.map((l, i) => (i === index ? { ...l, quantity: e.target.value } : l)))}
                />
              )}
            </Field>
            <Field label="Unit price (fils)" required>
              {(id) => (
                <Input
                  id={id}
                  type="number"
                  min={0}
                  value={line.price}
                  onChange={(e) => setLines(lines.map((l, i) => (i === index ? { ...l, price: e.target.value } : l)))}
                />
              )}
            </Field>
          </div>
        </div>
      ))}
      <Button type="button" variant="secondary" size="sm" onClick={() => setLines([...lines, { productId: "", quantity: "1", price: "0" }])}>
        Add line
      </Button>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={busy}>
          Create order
        </Button>
      </div>
    </form>
  );
}
