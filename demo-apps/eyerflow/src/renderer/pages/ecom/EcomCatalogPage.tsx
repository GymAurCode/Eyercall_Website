/**
 * Channel catalogue: SKU mappings, listings and pricing.
 *
 * ECOM never owns a product master. A mapping connects an existing IMS product
 * to the provider's product/variant identity; a listing is what we intend to
 * publish; a price rule is the agreed channel price. Publishing is queued, so
 * the screen reports a queued job rather than pretending a remote write
 * happened synchronously.
 */

import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ClipboardCopy, Download, Plus, RefreshCw, Search } from "lucide-react";
import { call, errorMessage } from "../../lib/api";
import { useApp } from "../../lib/app-context";
import { useLookup } from "../../lib/lookups";
import { formatMoney, parseAmount } from "../../lib/format";
import { PageHeader } from "../../components/ui/Feedback";
import { Button } from "../../components/ui/Button";
import { Dialog } from "../../components/ui/Dialog";
import { Field, Input, MoneyInput, Select } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { MmsTable as Table } from "../mms/MmsTable";
import type { Column } from "../../components/ui/DataTable";
import type { EcomAuthority, EcomListing, EcomListingInput, EcomMapping, EcomPricePreview, EcomPriceRule } from "../../../shared/ecom";
import { channelOptions, downloadText, useEcomChannels } from "./EcomShared";

interface ProductDtoLite {
  readonly id: number;
  readonly sku: string;
  readonly name: string;
  readonly salePriceFils: number;
}

interface UnmappedProduct {
  readonly id: number;
  readonly sku: string;
  readonly name: string;
  readonly salePriceFils: number;
}

export type EcomCatalogView = "mappings" | "listings" | "pricing";

export function EcomCatalogPage({ view }: { readonly view: EcomCatalogView }): React.JSX.Element {
  if (view === "mappings") return <MappingsView />;
  if (view === "listings") return <ListingsView />;
  return <PricingView />;
}

/* -------------------------------------------------------------------------- */
/* mappings                                                                    */
/* -------------------------------------------------------------------------- */

function MappingsView(): React.JSX.Element {
  const { can } = useApp();
  const client = useQueryClient();
  const [channelId, setChannelId] = useState("");
  const [dialog, setDialog] = useState<{ mode: "create" | "edit"; row?: EcomMapping } | null>(null);
  const channels = useEcomChannels();
  const list = channels.data ?? [];

  const query = useQuery({
    queryKey: ["ecom", "mappings", channelId],
    queryFn: () => call("ecom.mappings.list", channelId === "" ? {} : { channelId: Number(channelId) }),
    enabled: can("ecommerce", "view"),
  });

  const unmapped = useQuery({
    queryKey: ["ecom", "unmapped", channelId],
    queryFn: () =>
      call("ecom.mappings.unmapped", channelId === "" ? {} : { channelId: Number(channelId) }),
    enabled: can("ecommerce", "view") && channelId !== "",
  });

  const deactivate = useMutation({
    mutationFn: (id: number) => call("ecom.mappings.deactivate", { id }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "mappings"] });
      toast.success("Mapping deactivated.");
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const exportCsv = useMutation({
    mutationFn: () => call("ecom.mappings.export", channelId === "" ? {} : { channelId: Number(channelId) }),
    onSuccess: (csv) => {
      downloadText("ecom-sku-mappings.csv", csv);
      toast.success("Mapping export prepared.");
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const rows = query.data ?? [];
  const editable = can("ecommerce", "edit");

  const columns: readonly Column<EcomMapping>[] = [
    { id: "sku", header: "Local SKU", cell: (row) => row.sku },
    { id: "productName", header: "Product", cell: (row) => row.productName },
    { id: "channelName", header: "Store", cell: (row) => row.channelName },
    {
      id: "remote",
      header: "Remote identity",
      cell: (row) => (
        <div className="text-xs">
          <p className="text-[var(--text)]">{row.remoteProductId}</p>
          <p className="text-[var(--text-3)]">{row.remoteVariantId}</p>
        </div>
      ),
    },
    { id: "remoteSku", header: "Remote SKU", cell: (row) => row.remoteSku ?? "—" },
    { id: "status", header: "Status", cell: (row) => row.status },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          {editable && (
            <Button size="sm" variant="secondary" onClick={() => setDialog({ mode: "edit", row })}>
              Edit
            </Button>
          )}
          {editable && row.status === "active" && (
            <Button size="sm" variant="ghost" onClick={() => deactivate.mutate(row.id)}>
              Deactivate
            </Button>
          )}
        </div>
      ),
    },
  ];

  const unmappedColumns: readonly Column<UnmappedProduct>[] = [
    { id: "sku", header: "SKU", cell: (row) => row.sku },
    { id: "name", header: "Product", cell: (row) => row.name },
    {
      id: "salePriceFils",
      header: "Sale price",
      cell: (row) => formatMoney(row.salePriceFils),
      align: "end",
    },
    {
      id: "actions",
      header: "",
      cell: (row) => (
        <Button
          size="sm"
          variant="secondary"
          disabled={channelId === ""}
          onClick={() => setDialog({ mode: "create", row: { productId: row.id } as EcomMapping })}
        >
          Map
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="SKU mappings"
        description="Local products connected to provider product and variant identities"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => void query.refetch()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            {editable && (
              <Button
                size="sm"
                iconLeft={<Plus className="h-4 w-4" />}
                disabled={channelId === ""}
                onClick={() => setDialog({ mode: "create" })}
              >
                Add mapping
              </Button>
            )}
            {can("ecommerce", "export") && (
              <Button
                variant="secondary"
                size="sm"
                disabled={exportCsv.isPending}
                onClick={() => exportCsv.mutate()}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            )}
          </div>
        }
      />

      <div className="flex flex-wrap items-end gap-3">
        <Field label="Store">
          {(id) => (
            <Select
              id={id}
              value={channelId}
              onChange={setChannelId}
              options={channelOptions(list)}
              className="w-[260px]"
            />
          )}
        </Field>
        <p className="pb-2 text-xs text-[var(--text-3)]">
          {channelId === "" ? "Choose a store to see its unmapped products." : `${String(unmapped.data?.length ?? 0)} local products have no mapping in this store.`}
        </p>
      </div>

      <Table
        rows={rows}
        rowKey={(row) => row.id}
        columns={columns}
        loading={query.isPending}
        error={query.error}
        onRetry={() => void query.refetch()}
        emptyState="No mapping exists yet. Map a local SKU to a provider variant before publishing it."
      />

      {channelId !== "" && (
        <div>
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
            <Search className="h-4 w-4" />
            Unmapped products
          </h2>
          <Table
            rows={unmapped.data ?? []}
            rowKey={(row) => row.id}
            columns={unmappedColumns}
            loading={unmapped.isPending}
            error={unmapped.error}
            onRetry={() => void unmapped.refetch()}
            emptyState="Every local product already has a mapping in this store."
          />
        </div>
      )}

      <MappingDialog
        state={dialog}
        channels={list}
        defaultChannelId={channelId}
        onClose={() => setDialog(null)}
      />
    </div>
  );
}

function MappingDialog({
  state,
  channels,
  defaultChannelId,
  onClose,
}: {
  readonly state: { readonly mode: "create" | "edit"; readonly row?: EcomMapping } | null;
  readonly channels: readonly { readonly id: number; readonly name: string; readonly platform: string }[];
  readonly defaultChannelId: string;
  readonly onClose: () => void;
}): React.JSX.Element {
  const client = useQueryClient();
  const products = useLookup<ProductDtoLite>("product");
  const [channelId, setChannelId] = useState(defaultChannelId);
  const [productId, setProductId] = useState("");
  const [variantKey, setVariantKey] = useState("");
  const [remoteProductId, setRemoteProductId] = useState("");
  const [remoteVariantId, setRemoteVariantId] = useState("");
  const [remoteInventoryItemId, setRemoteInventoryItemId] = useState("");
  const [remoteSku, setRemoteSku] = useState("");
  const [status, setStatus] = useState("active");
  const [error, setError] = useState("");

  const row = state?.row;
  useEffect(() => {
    if (state === null) return;
    setChannelId(row !== undefined && "channelId" in row ? String(row.channelId) : defaultChannelId);
    setProductId(row?.productId === null || row?.productId === undefined ? "" : String(row.productId));
    setVariantKey(row?.variantKey ?? "");
    setRemoteProductId(row?.remoteProductId ?? "");
    setRemoteVariantId(row?.remoteVariantId ?? "");
    setRemoteInventoryItemId(row?.remoteInventoryItemId ?? "");
    setRemoteSku(row?.remoteSku ?? "");
    setStatus(row?.status ?? "active");
    setError("");
  }, [state, defaultChannelId, row]);

  const save = useMutation({
    mutationFn: () =>
      call("ecom.mappings.save", {
        ...(row?.id === undefined ? {} : { id: row.id }),
        channelId: Number(channelId),
        productId: Number(productId),
        variantKey: variantKey.trim() === "" ? null : variantKey.trim(),
        remoteProductId: remoteProductId.trim(),
        remoteVariantId: remoteVariantId.trim(),
        remoteInventoryItemId: remoteInventoryItemId.trim() === "" ? null : remoteInventoryItemId.trim(),
        remoteSku: remoteSku.trim() === "" ? null : remoteSku.trim(),
        status: status as "active" | "inactive",
      }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "mappings"] });
      await client.invalidateQueries({ queryKey: ["ecom", "unmapped"] });
      toast.success("Mapping saved.");
      onClose();
    },
    onError: (e: unknown) => {
      setError(errorMessage(e));
      toast.error(errorMessage(e));
    },
  });

  return (
    <Dialog
      open={state !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={state?.mode === "edit" ? "Edit mapping" : "Add mapping"}
      description="The provider ids are recorded exactly as the channel reports them, never guessed from the SKU."
      busy={save.isPending}
    >
      <form
        className="space-y-4"
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          save.mutate();
        }}
      >
        {error !== "" && <p className="text-sm text-[var(--danger)]">{error}</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Store" required>
            {(id) => (
              <Select
                id={id}
                value={channelId}
                onChange={setChannelId}
                options={channels.map((c) => ({ value: String(c.id), label: `${c.name} (${c.platform})` }))}
              />
            )}
          </Field>
          <Field label="Local product" required>
            {(id) => (
              <Select
                id={id}
                value={productId}
                onChange={setProductId}
                options={products.map((p) => ({ value: String(p.id), label: `${p.sku} · ${p.name}` }))}
              />
            )}
          </Field>
          <Field label="Remote product id" required>
            {(id) => (
              <Input id={id} value={remoteProductId} onChange={(e) => setRemoteProductId(e.target.value)} />
            )}
          </Field>
          <Field label="Remote variant id" required>
            {(id) => (
              <Input id={id} value={remoteVariantId} onChange={(e) => setRemoteVariantId(e.target.value)} />
            )}
          </Field>
          <Field label="Remote inventory item id">
            {(id) => (
              <Input
                id={id}
                value={remoteInventoryItemId}
                onChange={(e) => setRemoteInventoryItemId(e.target.value)}
              />
            )}
          </Field>
          <Field label="Remote SKU">
            {(id) => <Input id={id} value={remoteSku} onChange={(e) => setRemoteSku(e.target.value)} />}
          </Field>
          <Field label="Variant key" hint="Only for a local product with more than one sellable variant.">
            {(id) => <Input id={id} value={variantKey} onChange={(e) => setVariantKey(e.target.value)} />}
          </Field>
          <Field label="Status">
            {(id) => (
              <Select
                id={id}
                value={status}
                onChange={setStatus}
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
              />
            )}
          </Field>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={save.isPending}>
            Save mapping
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* listings                                                                    */
/* -------------------------------------------------------------------------- */

function ListingsView(): React.JSX.Element {
  const { can } = useApp();
  const client = useQueryClient();
  const [channelId, setChannelId] = useState("");
  const [status, setStatus] = useState("");
  const [dialog, setDialog] = useState<EcomListing | "new" | null>(null);
  const [selected, setSelected] = useState<readonly number[]>([]);
  const channels = useEcomChannels();
  const list = channels.data ?? [];

  const query = useQuery({
    queryKey: ["ecom", "listings", channelId, status],
    queryFn: () =>
      call("ecom.listings.list", {
        ...(channelId === "" ? {} : { channelId: Number(channelId) }),
        ...(status === "" ? {} : { status: status as EcomListing["publishStatus"] }),
      }),
    enabled: can("ecommerce", "view"),
  });

  const publish = useMutation({
    mutationFn: (input: { id: number; action: "publish" | "update" | "unpublish" | "archive" }) =>
      call("ecom.listings.publish", input),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "listings"] });
      toast.success("Listing change queued. The Sync Centre shows the provider result.");
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const bulk = useMutation({
    mutationFn: (action: "publish" | "update" | "unpublish" | "archive") =>
      call("ecom.listings.bulkPublish", { ids: selected, action }),
    onSuccess: async (result) => {
      setSelected([]);
      await client.invalidateQueries({ queryKey: ["ecom", "listings"] });
      toast.success(`${String(result.succeeded)} queued, ${String(result.skipped)} skipped, ${String(result.failed)} failed.`);
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const rows = query.data ?? [];
  const editable = can("ecommerce", "edit");

  const columns: readonly Column<EcomListing>[] = [
    {
      id: "select",
      header: "",
      cell: (row) => (
        <input
          type="checkbox"
          aria-label={`Select ${row.title}`}
          checked={selected.includes(row.id)}
          onChange={(event) =>
            setSelected((previous) =>
              event.target.checked ? [...previous, row.id] : previous.filter((id) => id !== row.id),
            )
          }
        />
      ),
    },
    { id: "title", header: "Listing", cell: (row) => row.title },
    { id: "sku", header: "SKU", cell: (row) => row.sku },
    { id: "channelName", header: "Store", cell: (row) => row.channelName },
    { id: "priceFils", header: "Price", cell: (row) => formatMoney(row.priceFils), align: "end" },
    { id: "status", header: "Status", cell: (row) => row.publishStatus },
    {
      id: "rejectionReason",
      header: "Provider answer",
      cell: (row) => row.rejectionReason ?? "—",
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          {editable && (
            <Button size="sm" variant="secondary" onClick={() => setDialog(row)}>
              Edit
            </Button>
          )}
          {editable && (
            <Button
              size="sm"
              disabled={publish.isPending}
              onClick={() =>
                publish.mutate({ id: row.id, action: row.publishStatus === "published" ? "unpublish" : "publish" })
              }
            >
              {row.publishStatus === "published" ? "Unpublish" : "Publish"}
            </Button>
          )}
          {row.remoteUrl !== null && (
            <a
              className="self-center text-xs text-[var(--brand)] underline"
              href={row.remoteUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open
            </a>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Listings"
        description="What we intend each store to show, and what the provider last answered"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => void query.refetch()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            {editable && (
              <Button size="sm" iconLeft={<Plus className="h-4 w-4" />} onClick={() => setDialog("new")}>
                New listing
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
        <Field label="Status">
          {(id) => (
            <Select
              id={id}
              value={status}
              onChange={setStatus}
              className="w-[180px]"
              options={[
                { value: "", label: "All statuses" },
                { value: "draft", label: "Draft" },
                { value: "pending", label: "Pending" },
                { value: "published", label: "Published" },
                { value: "rejected", label: "Rejected" },
                { value: "paused", label: "Paused" },
                { value: "archived", label: "Archived" },
              ]}
            />
          )}
        </Field>
        {editable && selected.length > 0 && (
          <div className="flex gap-2 pb-0.5">
            <Button size="sm" disabled={bulk.isPending} onClick={() => bulk.mutate("publish")}>
              Publish {String(selected.length)}
            </Button>
            <Button size="sm" variant="secondary" disabled={bulk.isPending} onClick={() => bulk.mutate("unpublish")}>
              Unpublish
            </Button>
          </div>
        )}
      </div>

      <Table
        rows={rows}
        rowKey={(row) => row.id}
        columns={columns}
        loading={query.isPending}
        error={query.error}
        onRetry={() => void query.refetch()}
        emptyState="No listing has been created yet. A listing needs an active mapping."
      />

      <ListingDialog
        state={dialog}
        channels={list}
        onClose={() => setDialog(null)}
      />
    </div>
  );
}

function ListingDialog({
  state,
  channels,
  onClose,
}: {
  readonly state: EcomListing | "new" | null;
  readonly channels: readonly { readonly id: number; readonly name: string; readonly platform: string }[];
  readonly onClose: () => void;
}): React.JSX.Element {
  const client = useQueryClient();
  const [channelId, setChannelId] = useState("");
  const [mappingId, setMappingId] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("0");
  const [compareAt, setCompareAt] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (state === null) return;
    if (state === "new") {
      setChannelId("");
      setMappingId("");
      setTitle("");
      setCategory("");
      setBrand("");
      setPrice("0");
      setCompareAt("");
    } else {
      setChannelId(String(state.channelId));
      setMappingId(String(state.mappingId));
      setTitle(state.title);
      setCategory(state.category);
      setBrand(state.brand);
      setPrice((state.priceFils / 100).toFixed(2));
      setCompareAt(state.compareAtFils === null ? "" : (state.compareAtFils / 100).toFixed(2));
    }
    setError("");
  }, [state]);

  const mappings = useQuery({
    queryKey: ["ecom", "mappings", channelId],
    queryFn: () => call("ecom.mappings.list", { channelId: Number(channelId), status: "active" }),
    enabled: channelId !== "",
  });

  const save = useMutation({
    mutationFn: () => {
      const priceFils = parseAmount(price) ?? 0;
      const compareFils = compareAt.trim() === "" ? null : parseAmount(compareAt);
      const input: EcomListingInput = {
        mappingId: Number(mappingId),
        title: title.trim(),
        category: category.trim(),
        brand: brand.trim(),
        priceFils,
        compareAtFils: compareFils,
      };
      return call("ecom.listings.save", input);
    },
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "listings"] });
      toast.success("Listing saved as a draft of the channel intent.");
      onClose();
    },
    onError: (e: unknown) => {
      setError(errorMessage(e));
      toast.error(errorMessage(e));
    },
  });

  return (
    <Dialog
      open={state !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={state === "new" ? "New listing" : "Edit listing"}
      description="Saving a listing does not publish it. Publishing is a queued provider call."
      busy={save.isPending}
    >
      <form
        className="space-y-4"
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          save.mutate();
        }}
      >
        {error !== "" && <p className="text-sm text-[var(--danger)]">{error}</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Store" required>
            {(id) => (
              <Select
                id={id}
                value={channelId}
                onChange={(value) => {
                  setChannelId(value);
                  setMappingId("");
                }}
                disabled={state !== "new"}
                options={channels.map((c) => ({ value: String(c.id), label: `${c.name} (${c.platform})` }))}
              />
            )}
          </Field>
          <Field label="SKU mapping" required>
            {(id) => (
              <Select
                id={id}
                value={mappingId}
                onChange={setMappingId}
                disabled={state !== "new"}
                options={(mappings.data ?? []).map((m) => ({
                  value: String(m.id),
                  label: `${m.sku} · ${m.productName}`,
                }))}
              />
            )}
          </Field>
          <Field label="Title" required className="sm:col-span-2">
            {(id) => <Input id={id} value={title} onChange={(e) => setTitle(e.target.value)} />}
          </Field>
          <Field label="Category">
            {(id) => <Input id={id} value={category} onChange={(e) => setCategory(e.target.value)} />}
          </Field>
          <Field label="Brand">
            {(id) => <Input id={id} value={brand} onChange={(e) => setBrand(e.target.value)} />}
          </Field>
          <Field label="Price" required>
            {(id) => <MoneyInput id={id} value={price} onChange={(e) => setPrice(e.target.value)} />}
          </Field>
          <Field label="Compare-at price" hint="Optional strike-through reference price.">
            {(id) => <MoneyInput id={id} value={compareAt} onChange={(e) => setCompareAt(e.target.value)} />}
          </Field>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={save.isPending || mappingId === "" || title.trim() === ""}>
            Save listing
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* pricing                                                                     */
/* -------------------------------------------------------------------------- */

function PricingView(): React.JSX.Element {
  const { can } = useApp();
  const client = useQueryClient();
  const [channelId, setChannelId] = useState("");
  const [dialog, setDialog] = useState<EcomPriceRule | "new" | null>(null);
  const [percent, setPercent] = useState("5");
  const channels = useEcomChannels();
  const list = channels.data ?? [];

  const rules = useQuery({
    queryKey: ["ecom", "priceRules", channelId],
    queryFn: () => call("ecom.pricing.rules", channelId === "" ? {} : { channelId: Number(channelId) }),
    enabled: can("ecommerce", "view"),
  });

  const preview = useQuery({
    queryKey: ["ecom", "pricePreview", channelId],
    queryFn: () => call("ecom.pricing.preview", { channelId: Number(channelId) }),
    enabled: can("ecommerce", "view") && channelId !== "",
  });

  const remove = useMutation({
    mutationFn: (id: number) => call("ecom.pricing.rule.delete", { id }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "priceRules"] });
      await client.invalidateQueries({ queryKey: ["ecom", "pricePreview"] });
      toast.success("Price rule deleted. Existing listings keep their current price until repriced.");
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const bulk = useMutation({
    mutationFn: () =>
      call("ecom.pricing.bulk", {
        channelId: Number(channelId),
        percent: Number(percent),
        roundTo: 100,
      }),
    onSuccess: async (result) => {
      await client.invalidateQueries({ queryKey: ["ecom", "pricePreview"] });
      await client.invalidateQueries({ queryKey: ["ecom", "listings"] });
      toast.success(`${String(result.succeeded)} listings repriced, ${String(result.failed)} failed, ${String(result.skipped)} skipped.`);
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const rows = rules.data ?? [];
  const editable = can("ecommerce", "edit");

  const columns: readonly Column<EcomPriceRule>[] = [
    { id: "channelName", header: "Store", cell: (row) => row.channelName },
    { id: "productName", header: "Scope", cell: (row) => row.productName ?? "Whole store" },
    { id: "ruleType", header: "Rule", cell: (row) => row.ruleType },
    {
      id: "value",
      header: "Value",
      align: "end",
      cell: (row) => (row.ruleType === "markup" ? `${String(row.value)}%` : formatMoney(row.value)),
    },
    { id: "rounding", header: "Rounding", cell: (row) => row.rounding },
    { id: "authority", header: "Authority", cell: (row) => row.authority },
    {
      id: "active",
      header: "Active",
      cell: (row) => <Badge tone={row.active ? "success" : "neutral"}>{row.active ? "active" : "inactive"}</Badge>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          {editable && (
            <Button size="sm" variant="secondary" onClick={() => setDialog(row)}>
              Edit
            </Button>
          )}
          {editable && (
            <Button size="sm" variant="ghost" onClick={() => remove.mutate(row.id)}>
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  const previewColumns: readonly Column<EcomPricePreview>[] = [
    { id: "sku", header: "SKU", cell: (row) => row.sku },
    { id: "productName", header: "Product", cell: (row) => row.productName },
    { id: "basePriceFils", header: "IMS price", cell: (row) => formatMoney(row.basePriceFils), align: "end" },
    {
      id: "calculatedPriceFils",
      header: "Channel price",
      cell: (row) => formatMoney(row.calculatedPriceFils),
      align: "end",
    },
    {
      id: "floorViolated",
      header: "Floor",
      cell: (row) => (row.floorViolated ? <Badge tone="danger">below floor</Badge> : <Badge tone="success">ok</Badge>),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Channel pricing"
        description="Price rules evaluated against the IMS sale price, with an explicit rounding and floor"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => void rules.refetch()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            {editable && (
              <Button
                size="sm"
                iconLeft={<Plus className="h-4 w-4" />}
                disabled={channelId === ""}
                onClick={() => setDialog("new")}
              >
                New rule
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
        {channelId !== "" && editable && (
          <>
            <Field label="Bulk change (%)" hint="Applied to every mapped listing in this store.">
              {(id) => (
                <Input id={id} type="number" value={percent} onChange={(e) => setPercent(e.target.value)} className="w-[140px]" />
              )}
            </Field>
            <div className="flex gap-2 pb-0.5">
              <Button size="sm" disabled={bulk.isPending} onClick={() => bulk.mutate()}>
                Reprice store
              </Button>
            </div>
          </>
        )}
      </div>

      <Table
        rows={rows}
        rowKey={(row) => row.id}
        columns={columns}
        loading={rules.isPending}
        error={rules.error}
        onRetry={() => void rules.refetch()}
        emptyState="No price rule exists. Listings use the IMS sale price until a rule says otherwise."
      />

      {channelId !== "" && (
        <div>
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
            <ClipboardCopy className="h-4 w-4" />
            Preview: what this store would charge
          </h2>
          <Table
            rows={preview.data ?? []}
            rowKey={(row) => row.productId}
            columns={previewColumns}
            loading={preview.isPending}
            error={preview.error}
            onRetry={() => void preview.refetch()}
            emptyState="No active mapping to preview in this store."
          />
        </div>
      )}

      <RuleDialog state={dialog} channels={list} defaultChannelId={channelId} onClose={() => setDialog(null)} />
    </div>
  );
}

function RuleDialog({
  state,
  channels,
  defaultChannelId,
  onClose,
}: {
  readonly state: EcomPriceRule | "new" | null;
  readonly channels: readonly { readonly id: number; readonly name: string; readonly platform: string }[];
  readonly defaultChannelId: string;
  readonly onClose: () => void;
}): React.JSX.Element {
  const client = useQueryClient();
  const products = useLookup<ProductDtoLite>("product");
  const [channelId, setChannelId] = useState(defaultChannelId);
  const [productId, setProductId] = useState("");
  const [ruleType, setRuleType] = useState("markup");
  const [value, setValue] = useState("0");
  const [floor, setFloor] = useState("");
  const [rounding, setRounding] = useState("none");
  const [authority, setAuthority] = useState<EcomAuthority>("eyerflow");
  const [active, setActive] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (state === null) return;
    if (state === "new") {
      setChannelId(defaultChannelId);
      setProductId("");
      setRuleType("markup");
      setValue("0");
      setFloor("");
      setRounding("none");
      setAuthority("eyerflow");
      setActive(true);
    } else {
      setChannelId(String(state.channelId));
      setProductId(state.productId === null ? "" : String(state.productId));
      setRuleType(state.ruleType);
      setValue(state.ruleType === "markup" ? String(state.value) : (state.value / 100).toFixed(2));
      setFloor(state.floorFils === null ? "" : (state.floorFils / 100).toFixed(2));
      setRounding(state.rounding);
      setAuthority(state.authority);
      setActive(state.active);
    }
    setError("");
  }, [state, defaultChannelId]);

  const save = useMutation({
    mutationFn: () =>
      call("ecom.pricing.rule.save", {
        ...(state !== null && state !== "new" ? { id: state.id } : {}),
        channelId: Number(channelId),
        productId: productId === "" ? null : Number(productId),
        ruleType: ruleType as "fixed" | "markup",
        value: ruleType === "markup" ? Number(value) : (parseAmount(value) ?? 0),
        currency: "PKR",
        floorFils: floor.trim() === "" ? null : parseAmount(floor),
        rounding: rounding as "none" | "nearest" | "up" | "down",
        authority,
        active,
      }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "priceRules"] });
      await client.invalidateQueries({ queryKey: ["ecom", "pricePreview"] });
      toast.success("Price rule saved.");
      onClose();
    },
    onError: (e: unknown) => {
      setError(errorMessage(e));
      toast.error(errorMessage(e));
    },
  });

  return (
    <Dialog
      open={state !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={state === "new" ? "New price rule" : "Edit price rule"}
      description="A store-wide rule and a product-specific rule can both exist; the more specific one wins."
      busy={save.isPending}
    >
      <form
        className="space-y-4"
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          save.mutate();
        }}
      >
        {error !== "" && <p className="text-sm text-[var(--danger)]">{error}</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Store" required>
            {(id) => (
              <Select
                id={id}
                value={channelId}
                onChange={setChannelId}
                options={channels.map((c) => ({ value: String(c.id), label: `${c.name} (${c.platform})` }))}
              />
            )}
          </Field>
          <Field label="Product" hint="Leave empty for a store-wide rule.">
            {(id) => (
              <Select
                id={id}
                value={productId}
                onChange={setProductId}
                options={[{ value: "", label: "Whole store" }, ...products.map((p) => ({ value: String(p.id), label: `${p.sku} · ${p.name}` }))]}
              />
            )}
          </Field>
          <Field label="Rule type" required>
            {(id) => (
              <Select
                id={id}
                value={ruleType}
                onChange={setRuleType}
                options={[
                  { value: "markup", label: "Markup percentage" },
                  { value: "fixed", label: "Fixed channel price" },
                ]}
              />
            )}
          </Field>
          <Field label={ruleType === "markup" ? "Markup (%)" : "Fixed price"} required>
            {(id) =>
              ruleType === "markup" ? (
                <Input id={id} type="number" value={value} onChange={(e) => setValue(e.target.value)} />
              ) : (
                <MoneyInput id={id} value={value} onChange={(e) => setValue(e.target.value)} />
              )
            }
          </Field>
          <Field label="Price floor" hint="The calculated price is never allowed below this.">
            {(id) => <MoneyInput id={id} value={floor} onChange={(e) => setFloor(e.target.value)} />}
          </Field>
          <Field label="Rounding">
            {(id) => (
              <Select
                id={id}
                value={rounding}
                onChange={setRounding}
                options={[
                  { value: "none", label: "No rounding" },
                  { value: "nearest", label: "Nearest rupee" },
                  { value: "up", label: "Up to rupee" },
                  { value: "down", label: "Down to rupee" },
                ]}
              />
            )}
          </Field>
          <Field label="Price authority">
            {(id) => (
              <Select
                id={id}
                value={authority}
                onChange={(next) => setAuthority(next as EcomAuthority)}
                options={[
                  { value: "eyerflow", label: "EyerFlow decides" },
                  { value: "channel", label: "Channel decides" },
                  { value: "manual", label: "Manual override" },
                ]}
              />
            )}
          </Field>
          <Field label="Active">
            {(id) => (
              <Select
                id={id}
                value={active ? "yes" : "no"}
                onChange={(next) => setActive(next === "yes")}
                options={[
                  { value: "yes", label: "Active" },
                  { value: "no", label: "Inactive" },
                ]}
              />
            )}
          </Field>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={save.isPending}>
            Save rule
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
