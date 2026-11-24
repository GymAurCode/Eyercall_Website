import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, RefreshCw, Download, ArrowUpRight, Landmark } from "lucide-react";
import { call, errorMessage } from "../../lib/api";
import { useApp } from "../../lib/app-context";
import { ERP_SECTIONS, type ErpPage, type ErpMethod } from "../../lib/erp-nav";
import { ERP_FORMS, ERP_ACTIONS, type ErpField } from "../../../shared/erp-forms";
import type { RpcRequestOf } from "../../../shared/ipc";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Field, Input, Select } from "../../components/ui/Input";
import { Dialog } from "../../components/ui/Dialog";
import { PageHeader } from "../../components/ui/Feedback";

type Values = Record<string, unknown>;
const scalar = (value: unknown): string =>
  typeof value === "string"
    ? value
    : typeof value === "number" || typeof value === "boolean"
      ? String(value)
      : "";
type Lookups = Readonly<Record<string, readonly { value: string; label: string }[]>>;
const today = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};
const isDate = (name: string) =>
  /Date$|^asOf$|^effectiveFrom$|^effectiveTo$|^issuedOn$|^closesOn$|^acquiredOn$|^dueOn$|^validUntil$|^expectedClose$|^periodStart$|^periodEnd$|^neededBy$/.test(
    name,
  );
const scaleFor = (name: string) =>
  /Fils$|_fils$/.test(name)
    ? 100
    : /Milli$|_milli$/.test(name)
      ? 1000
      : /Bp$/.test(name)
        ? 100
        : /^exchangeRate$|Micro$/.test(name)
          ? 1000000
          : 1;
export function erpLabel(name: string): string {
  const labels: Record<string, string> = {
    id: "Record",
    companyId: "Company",
    accountCode: "Account",
    glAccountCode: "Ledger Account",
    parentId: "Parent",
    isPostable: "Allow posting",
    erpSource: "Source",
    erpStatus: "Workflow Status",
    approve: "Approve",
    counterpartyId: "Counterparty",
    reqId: "Requisition",
    rfqId: "Request for Quotation",
    periodName: "Period (YYYY-MM)",
    ntn: "NTN",
    strn: "STRN",
    cnic: "CNIC",
    sourceKey: "External Reference",
    post: "Post Immediately",
  };
  if (labels[name]) return labels[name];
  return name
    .replace(/Fils$|_fils$/, " Amount")
    .replace(/Milli$|_milli$/, " Quantity")
    .replace(/Bp$/, " Percent")
    .replace(/Id$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
function actionLabel(method: string): string {
  const specific: Record<string, string> = {
    "erp.onboarding.bootstrap": "Initialize ERP",
    "erp.journals.create": "New Journal",
    "erp.journals.update": "Edit Draft",
    "erp.journals.integrityCheck": "Check Ledger Integrity",
    "erp.ar.creditNotes.create": "Credit Invoice in Full",
    "erp.ap.debitNotes.create": "Debit Bill in Full",
    "erp.ap.bills.match": "Match Order & Receipt",
    "erp.ap.bills.approveMatchVariance": "Approve Match Variance",
    "erp.payments.applyUnappliedCredit": "Allocate Unapplied Credit",
    "erp.bank.lines.autoReconcile": "Auto Reconcile",
    "erp.bank.lines.match": "Match Statement Line",
    "erp.bank.lines.book": "Book Statement Line",
    "erp.assets.depreciate": "Post Monthly Depreciation",
    "erp.assets.schedule": "Depreciation Schedule",
    "erp.procurement.quotes.add": "Add Supplier Quote",
    "erp.procurement.quotes.compare": "Compare Quotes",
    "erp.reports.postClosing": "Post Year-end Closing",
    "erp.crm.opportunities.pipeline": "View Pipeline",
    "erp.projects.costReport": "Project Cost Report",
    "erp.fbr.submissions.attempt": "Attempt Submission",
    "erp.fbr.credentials.save": "Store Integration Credential",
    "erp.consolidation.worksheet": "Consolidation Worksheet",
    "erp.hr.leaveBalance": "Check Leave Balance",
  };
  const suffix = method.split(".").at(-1) ?? "Run";
  return specific[method] ?? (suffix === "post" ? "Post to Ledger" : erpLabel(suffix));
}
async function invoke(method: ErpMethod, payload: Values): Promise<unknown> {
  return call(method, payload as RpcRequestOf<typeof method>);
}
function defaults(fields: readonly ErpField[], companyId?: number): Values {
  const values: Values = {};
  for (const f of fields) {
    const name = f.name!;
    if (name === "companyId" && companyId) values[name] = companyId;
    else if (name === "erpSource") values[name] = "manual";
    else if (name === "journalType") values[name] = "manual";
    else if (name === "isPostable") values[name] = true;
    else if (name === "fromDate") values[name] = `${today().slice(0, 4)}-01-01`;
    else if (name === "toDate" || (!f.optional && isDate(name))) values[name] = today();
    else if (!f.optional && f.type === "boolean") values[name] = name === "approve";
    else if (!f.optional && f.type === "select") values[name] = f.options?.[0];
    else if (!f.optional && f.type === "array") values[name] = [];
    else if (!f.optional && f.type === "object") values[name] = defaults(f.fields ?? [], companyId);
  }
  return values;
}
function clean(fields: readonly ErpField[], values: Values): Values {
  const result: Values = {};
  for (const f of fields) {
    const name = f.name!,
      value = values[name];
    if (value === undefined || value === "" || (value === null && f.optional && !f.nullable))
      continue;
    result[name] =
      f.type === "object"
        ? clean(f.fields ?? [], value as Values)
        : f.type === "array"
          ? (value as unknown[]).map((v) =>
              f.item?.type === "object" ? clean(f.item.fields ?? [], v as Values) : v,
            )
          : value;
  }
  return result;
}
function complete(fields: readonly ErpField[], values: Values): boolean {
  return fields.every(
    (f) => f.optional || (values[f.name!] !== undefined && values[f.name!] !== ""),
  );
}
function FormFields({
  fields,
  values,
  setValues,
  lookups,
  prefix = "",
  hideIdentity = false,
}: {
  fields: readonly ErpField[];
  values: Values;
  setValues: (values: Values) => void;
  lookups: Lookups;
  prefix?: string;
  hideIdentity?: boolean;
}): React.JSX.Element {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => {
        const name = f.name!,
          value = values[name],
          label = erpLabel(name),
          inputId = `erp-${prefix}-${name}`;
        if (
          (name === "companyId" && !prefix.includes("members")) ||
          (name === "id" && (f.optional || hideIdentity)) ||
          name === "post" ||
          name === "sourceKey"
        )
          return null;
        const update = (v: unknown) => setValues({ ...values, [name]: v });
        if (f.type === "array") {
          const rows: unknown[] = Array.isArray(value) ? (value as unknown[]) : [];
          return (
            <fieldset
              key={name}
              className="col-span-full rounded-xl border border-[var(--border)] p-4"
            >
              <legend className="px-2 font-medium">{label}</legend>
              <div className="space-y-4">
                {rows.map((row, index) => (
                  <div key={index} className="rounded-lg bg-[var(--surface-2)] p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium">
                        {label} {index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => update(rows.filter((_, i) => i !== index))}
                      >
                        Remove
                      </Button>
                    </div>
                    {f.item?.type === "object" ? (
                      <FormFields
                        fields={f.item.fields ?? []}
                        values={row as Values}
                        setValues={(v) => update(rows.map((r, i) => (i === index ? v : r)))}
                        lookups={lookups}
                        prefix={`${prefix}-${name}-${index}`}
                      />
                    ) : (
                      <Input
                        aria-label={`${label} ${index + 1}`}
                        type={f.item?.type === "number" ? "number" : "text"}
                        value={scalar(row)}
                        onChange={(e) =>
                          update(
                            rows.map((r, i) =>
                              i === index
                                ? f.item?.type === "number"
                                  ? Number(e.target.value)
                                  : e.target.value
                                : r,
                            ),
                          )
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="secondary"
                className="mt-3"
                onClick={() =>
                  update([...rows, f.item?.type === "object" ? defaults(f.item.fields ?? []) : ""])
                }
              >
                <Plus className="h-4 w-4" />
                Add {label.replace(/s$/, "")}
              </Button>
            </fieldset>
          );
        }
        if (f.type === "object")
          return (
            <fieldset
              key={name}
              className="col-span-full rounded-xl border border-[var(--border)] p-4"
            >
              <legend>{label}</legend>
              <FormFields
                fields={f.fields ?? []}
                values={(value as Values) ?? {}}
                setValues={update}
                lookups={lookups}
                prefix={`${prefix}-${name}`}
              />
            </fieldset>
          );
        if (f.type === "boolean")
          return (
            <label
              key={name}
              htmlFor={inputId}
              className="flex min-h-10 items-center gap-2 text-sm"
            >
              <input
                id={inputId}
                type="checkbox"
                checked={value === true}
                onChange={(e) => update(e.target.checked)}
              />
              {label}
            </label>
          );
        let lookupKey =
          name === "managerId"
            ? "employeeId"
            : name === "counterpartyId"
              ? "partyId"
              : name === "targetBankAccountId"
                ? "bankAccountId"
                : name === "counterAccountCode" || name === "glAccountCode"
                  ? "accountCode"
                  : name;
        if (["companyAId", "companyBId", "parentCompanyId"].includes(name)) lookupKey = "companyId";
        if (name === "documentId")
          lookupKey =
            values.documentKind === "supplier_bill" || values.documentKind === "debit_note"
              ? "billId"
              : "invoiceId";
        if (name === "dimensionId")
          lookupKey =
            values.scope === "project"
              ? "projectId"
              : values.scope === "department"
                ? "departmentId"
                : "dimensionId";
        const choices =
          f.type === "select"
            ? f.options?.map((o) => ({ value: o, label: erpLabel(o) }))
            : lookups[lookupKey];
        return (
          <Field
            key={name}
            label={label + (scaleFor(name) === 100 && !/Bp$/.test(name) ? " (PKR)" : "")}
            required={!f.optional}
          >
            {(id) =>
              choices ? (
                <Select
                  id={id}
                  value={scalar(value)}
                  onChange={(v) =>
                    update(f.type === "number" ? (v ? Number(v) : undefined) : v || undefined)
                  }
                  options={[{ value: "", label: f.optional ? "None" : "Select…" }, ...choices]}
                />
              ) : (
                <Input
                  id={id}
                  type={
                    f.type === "number"
                      ? "number"
                      : isDate(name)
                        ? "date"
                        : /Time$|^checkIn$|^checkOut$/.test(name)
                          ? "time"
                          : name === "accessToken"
                            ? "password"
                            : name === "email"
                              ? "email"
                              : "text"
                  }
                  required={!f.optional}
                  step={
                    f.type === "number"
                      ? scaleFor(name) > 1
                        ? 1 / scaleFor(name)
                        : ["days", "annualEntitlementDays", "rating"].includes(name)
                          ? "any"
                          : 1
                      : undefined
                  }
                  value={
                    value === undefined || value === null
                      ? ""
                      : f.type === "number"
                        ? Number(value) / scaleFor(name)
                        : scalar(value)
                  }
                  onChange={(e) =>
                    update(
                      e.target.value === ""
                        ? undefined
                        : f.type === "number"
                          ? scaleFor(name) > 1
                            ? Math.round(Number(e.target.value) * scaleFor(name))
                            : Number(e.target.value)
                          : e.target.value,
                    )
                  }
                />
              )
            }
          </Field>
        );
      })}
    </div>
  );
}
function display(name: string, value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number" && scaleFor(name) > 1)
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: scaleFor(name) === 1000 ? 3 : 2,
      minimumFractionDigits: /Fils$|_fils$/.test(name) ? 2 : 0,
    }).format(value / scaleFor(name));
  if (typeof value === "object") return "";
  return scalar(value).replace(/_/g, " ");
}
function records(value: unknown): Values[] {
  if (Array.isArray(value))
    return (value as unknown[]).map((v) =>
      v !== null && typeof v === "object" ? (v as Values) : { value: v },
    );
  return [];
}
function Results({
  value,
  onSelect,
}: {
  value: unknown;
  onSelect?: ((row: Values) => void) | undefined;
}): React.JSX.Element {
  if (Array.isArray(value)) {
    const rows = records(value);
    if (!rows.length)
      return <p className="py-8 text-center text-sm text-[var(--text-3)]">No records yet.</p>;
    const hidden = new Set([
      "companyId",
      "createdAt",
      "updatedAt",
      "payload",
      "credentialRef",
      "hasPostings",
    ]);
    const priority = (key: string) =>
      /No$|^(code|fullName|name|title)$/.test(key)
        ? 0
        : /Date$|^(description|workDate)$/.test(key)
          ? 1
          : /^(erpStatus|status)$/.test(key)
            ? 2
            : /Fils$/.test(key)
              ? 3
              : key === "id"
                ? 9
                : 5;
    const columns = [...new Set(rows.flatMap((r) => Object.keys(r)))]
      .filter(
        (k) =>
          !hidden.has(k) &&
          (k !== "status" || !rows.some((r) => "erpStatus" in r)) &&
          rows.some((r) => r[k] !== null && typeof r[k] !== "object"),
      )
      .sort((a, b) => priority(a) - priority(b))
      .slice(0, onSelect ? 8 : 14);
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {columns.map((k) => (
                <th
                  key={k}
                  className="whitespace-nowrap px-3 py-3 text-xs font-medium text-[var(--text-3)]"
                >
                  {erpLabel(k)}
                </th>
              ))}
              {onSelect && <th className="px-3">Details</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={scalar(r.id ?? i)}
                className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)]"
              >
                {columns.map((k) => (
                  <td key={k} className="max-w-xs px-3 py-3">
                    {display(k, r[k])}
                  </td>
                ))}
                {onSelect && (
                  <td className="px-3">
                    <Button variant="ghost" onClick={() => onSelect(r)}>
                      Open
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Values).filter(
      ([k]) =>
        !["payload", "credentialRef"].includes(k) && (k !== "status" || !("erpStatus" in value)),
    );
    return (
      <div className="space-y-5">
        <dl className="grid gap-4 sm:grid-cols-3">
          {entries
            .filter(([, v]) => typeof v !== "object" || v === null)
            .map(([k, v]) => (
              <div key={k} className="rounded-lg bg-[var(--surface-2)] p-3">
                <dt className="text-xs text-[var(--text-3)]">{erpLabel(k)}</dt>
                <dd className="mt-1 break-words text-sm font-semibold">{display(k, v)}</dd>
              </div>
            ))}
        </dl>
        {entries
          .filter(([, v]) => v !== null && typeof v === "object")
          .map(([k, v]) => (
            <section key={k}>
              <h3 className="mb-2 text-sm font-semibold">{erpLabel(k)}</h3>
              <Results value={v} />
            </section>
          ))}
      </div>
    );
  }
  return <p className="text-sm">{display("", value)}</p>;
}

function rowSeed(fields: readonly ErpField[], row: Values, companyId?: number): Values {
  const aliases: Record<string, string> = {
    acquiredOn: "purchaseDate",
    costFils: "acquisitionFils",
    categoryCode: "category",
    serviceDate: "acceptedOn",
    rateFils: "unitPriceFils",
  };
  const result = defaults(fields, companyId);
  for (const field of fields) {
    const name = field.name!,
      value = row[name] ?? row[aliases[name] ?? ""];
    if (value !== undefined && value !== null) result[name] = value;
  }
  const first = fields.find(
    (f) =>
      !f.optional &&
      /^(id|invoiceId|billId|assetId|leadId|rfqId|periodId|statementId|projectId|paymentId)$/.test(
        f.name ?? "",
      ),
  );
  if (first && row.id !== undefined) result[first.name!] = row.id;
  if (fields.some((f) => f.name === "input")) result.input = row;
  return result;
}
const workflow: Record<string, Record<string, readonly string[]>> = {
  journals: {
    draft: ["update", "submit", "delete"],
    pending_review: ["review", "returnToDraft"],
    pending_approval: ["approve", "returnToDraft"],
    approved: ["post", "returnToDraft"],
    rejected: ["returnToDraft"],
    posted: ["reverse"],
  },
  payroll: {
    draft: ["calculate", "cancel"],
    calculated: ["calculate", "review", "cancel"],
    reviewed: ["decide", "cancel"],
    approved: ["post", "cancel"],
    posted: ["pay"],
    paid: [],
    cancelled: [],
  },
};
export function ErpWorkspacePage({ page }: { page: ErpPage }): React.JSX.Element {
  const { can } = useApp(),
    client = useQueryClient();
  const module = page.module ?? "erp";
  const companies = useQuery({
    queryKey: ["erp", "companies"],
    queryFn: () => call("erp.companies.list", {}),
    enabled: can("erp", "view"),
  });
  const [companyId, setCompanyId] = useState<number | undefined>(() => {
    const stored = Number(sessionStorage.getItem("eyerstock.erp.company"));
    return stored > 0 ? stored : undefined;
  });
  const entity = companyId ?? companies.data?.find((c) => c.isDefault)?.id;
  const lookups = useQuery({
    queryKey: ["erp", "lookups", module, entity],
    queryFn: () =>
      call(module === "hr" ? "erp.hr.lookups" : "erp.lookups", entity ? { companyId: entity } : {}),
    enabled: can(module, "view"),
  });
  const fields = ERP_FORMS[page.query] ?? [];
  const [filters, setFilters] = useState<Values>(() => defaults(fields));
  const payload = {
    ...clean(fields, filters),
    ...(entity && fields.some((f) => f.name === "companyId") ? { companyId: entity } : {}),
  };
  const ready = complete(fields, payload);
  const data = useQuery({
    queryKey: ["erp", page.key, payload],
    queryFn: () => invoke(page.query, payload),
    enabled: ready && can(module, "view"),
  });
  const formLookups: Lookups = {
    ...lookups.data,
    parentId:
      lookups.data?.[
        page.key === "departments"
          ? "departmentId"
          : page.key === "dimensions"
            ? "dimensionId"
            : "parentId"
      ] ?? [],
    id: records(data.data)
      .filter((row) => typeof row.id === "number")
      .map((row) => ({
        value: scalar(row.id),
        label: scalar(
          row.entryNo ??
            row.invoiceNo ??
            row.billNo ??
            row.runNo ??
            row.name ??
            row.fullName ??
            row.id,
        ),
      })),
  };
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Values | null>(null);
  const [form, setForm] = useState<{ method: ErpMethod; values: Values } | null>(null);
  const [result, setResult] = useState<unknown>();
  const [formError, setFormError] = useState("");
  const openForm = (method: ErpMethod, row: Values = {}) => {
    setSelected(null);
    setFormError("");
    setForm({ method, values: rowSeed(ERP_FORMS[method] ?? [], row, entity) });
  };
  const execute = useMutation({
    mutationFn: async () => {
      if (!form) return;
      return invoke(form.method, clean(ERP_FORMS[form.method] ?? [], form.values));
    },
    onSuccess: async (value) => {
      const view = ERP_ACTIONS[form!.method] === "view";
      setForm(null);
      setFormError("");
      if (view) setResult(value);
      else {
        toast.success("Saved successfully.");
        await client.invalidateQueries({ queryKey: ["erp"] });
      }
    },
    onError: (error) => setFormError(errorMessage(error)),
  });
  const permitted = (method: ErpMethod) =>
    can(
      method.startsWith("erp.hr.") || method.startsWith("erp.payroll.") ? "hr" : "erp",
      ERP_ACTIONS[method] ?? "view",
    );
  const actions = (page.actions ?? []).filter(permitted);
  const visibleActions = (row: Values) =>
    actions.filter((method) => {
      const state = scalar(row.erpStatus ?? row.status);
      const allowed = workflow[page.key]?.[state];
      return !allowed || allowed.includes(method.split(".").at(-1)!);
    });
  const viewRow = async (row: Values) => {
    try {
      setSelected(
        page.detail
          ? ((await invoke(page.detail, {
              [page.detail === "erp.suppliers.profiles.get" ? "partyId" : "id"]:
                row.id ?? row.partyId,
            })) as Values)
          : row,
      );
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };
  const exportRows = () => {
    const rows = Array.isArray(data.data)
      ? records(data.data)
      : data.data && typeof data.data === "object"
        ? [data.data as Values]
        : [];
    const keys = [...new Set(rows.flatMap((r) => Object.keys(r)))].filter((k) =>
      rows.some((r) => typeof r[k] !== "object"),
    );
    const cell = (value: unknown) =>
      '"' +
      scalar(value)
        .replace(/^[=+@-]/, "'$&")
        .replace(/"/g, '""') +
      '"';
    const csv =
      "\ufeff" +
      [
        keys.map(erpLabel).map(cell).join(","),
        ...rows.map((row) => keys.map((k) => cell(display(k, row[k]))).join(",")),
      ].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `erp-${page.key}-${today()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const rows = Array.isArray(data.data)
    ? records(data.data).filter(
        (row) =>
          !search ||
          Object.values(row).some(
            (v) => typeof v !== "object" && scalar(v).toLowerCase().includes(search.toLowerCase()),
          ),
      )
    : null;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    execute.mutate();
  };
  return (
    <div className="space-y-5">
      <PageHeader title={page.label} description={`Enterprise Resource Planning · ${page.group}`} />
      <div className="flex flex-wrap items-center gap-3">
        {companies.data && companies.data.length > 0 && (
          <div className="min-w-56">
            <Select
              aria-label="ERP Company"
              value={String(entity ?? "")}
              onChange={(v) => {
                setCompanyId(Number(v));
                sessionStorage.setItem("eyerstock.erp.company", v);
                setFilters(defaults(fields, Number(v)));
                setSelected(null);
                setResult(undefined);
              }}
              options={companies.data.map((c) => ({ value: String(c.id), label: c.name }))}
            />
          </div>
        )}
        <Button
          variant="secondary"
          onClick={() => void data.refetch()}
          disabled={!ready || data.isFetching}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
        {can(module, "export") && data.data !== undefined && (
          <Button variant="secondary" onClick={exportRows}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        )}
        {page.create && permitted(page.create) && (
          <Button onClick={() => openForm(page.create!)}>
            <Plus className="h-4 w-4" />
            {page.key === "fbr"
              ? "Configure Connection"
              : page.key === "bank-statements"
                ? "Import Statement"
                : `New ${page.label.replace(/ies$/, "y").replace(/s$/, "")}`}
          </Button>
        )}
        {actions.length > 0 && (
          <div className="min-w-48">
            <Select
              aria-label="ERP Actions"
              value=""
              placeholder="Actions…"
              onChange={(v) => {
                if (v) openForm(v as ErpMethod);
              }}
              options={actions.map((m) => ({ value: m, label: actionLabel(m) }))}
            />
          </div>
        )}
      </div>
      {page.key === "overview" && (
        <>
          <Card className="p-5">
            <div className="flex gap-3">
              <Landmark className="h-6 w-6 text-[var(--brand)]" />
              <div>
                <h2 className="font-semibold">Your ERP workspace</h2>
                <p className="mt-1 text-sm text-[var(--text-3)]">
                  Initialize ERP once for each company to add its starter accounts and current
                  fiscal calendar. Draft documents stay outside the ledger until approved and
                  posted.
                </p>
                {can("erp", "create") && (
                  <Button
                    className="mt-3"
                    variant="secondary"
                    onClick={() => openForm("erp.onboarding.bootstrap")}
                  >
                    Initialize ERP
                  </Button>
                )}
              </div>
            </div>
          </Card>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {ERP_SECTIONS.slice(1).map((section) => {
              const first = section.items.find((i) => can(i.module, "view"));
              return first ? (
                <Link
                  key={section.id}
                  to={first.path}
                  className="glass-card rounded-xl border border-[var(--border)] p-4 transition-colors hover:bg-[var(--surface-2)]"
                >
                  <div className="flex justify-between">
                    <section.icon className="h-5 w-5 text-[var(--brand)]" />
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                  <h2 className="mt-3 font-semibold">{section.label}</h2>
                  <p className="mt-1 text-xs text-[var(--text-3)]">
                    {section.items.filter((i) => can(i.module, "view")).length} workspaces
                  </p>
                </Link>
              ) : null;
            })}
          </div>
        </>
      )}
      {page.key === "fbr" && (
        <Card className="p-4 text-sm">
          Prepare and validate invoices locally first. Attempt Submission sends the selected invoice
          to your configured provider in production mode. A stored credential and provider
          verification are required before using this with live invoices.
        </Card>
      )}
      <Card className="p-4">
        <details open={fields.some((f) => !f.optional && f.name !== "companyId")}>
          <summary className="cursor-pointer text-sm font-medium">Filters</summary>
          <div className="mt-4">
            <FormFields
              fields={fields.filter((f) => !["limit", "companyId"].includes(f.name!))}
              values={filters}
              setValues={setFilters}
              lookups={formLookups}
              prefix="filters"
            />
          </div>
        </details>
        {rows && (
          <Input
            className="mt-4"
            aria-label="Search ERP records"
            placeholder="Search records…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
      </Card>
      {lookups.isError && (
        <p role="alert" className="text-sm text-[var(--danger)]">
          {errorMessage(lookups.error)}
        </p>
      )}
      <Card className="p-4">
        {!ready ? (
          <p className="py-8 text-center text-sm text-[var(--text-3)]">
            Select the required filters to load this workspace.
          </p>
        ) : data.isError ? (
          <div role="alert" className="py-6 text-sm text-[var(--danger)]">
            {errorMessage(data.error)}
            <Button variant="ghost" onClick={() => void data.refetch()}>
              Retry
            </Button>
          </div>
        ) : data.isLoading ? (
          <p className="py-8 text-center text-sm text-[var(--text-3)]">
            Loading {page.label.toLowerCase()}…
          </p>
        ) : (
          <Results
            value={rows ?? data.data}
            onSelect={rows ? (row) => void viewRow(row) : undefined}
          />
        )}
      </Card>
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        title={`${page.label} · ${scalar(selected?.entryNo ?? selected?.invoiceNo ?? selected?.name ?? selected?.fullName ?? selected?.id ?? "Details")}`}
        size="xl"
      >
        <div className="space-y-5">
          {selected && (
            <>
              <div className="flex flex-wrap gap-2">
                {page.create &&
                  permitted(page.create) &&
                  ERP_FORMS[page.create]?.some((f) => f.name === "id") &&
                  (!selected.status ||
                    selected.status === "draft" ||
                    !["invoices", "bills"].includes(page.key)) && (
                    <Button variant="secondary" onClick={() => openForm(page.create!, selected)}>
                      Edit
                    </Button>
                  )}
                {visibleActions(selected).map((method) => (
                  <Button
                    key={method}
                    variant="secondary"
                    onClick={() => openForm(method, selected)}
                  >
                    {actionLabel(method)}
                  </Button>
                ))}
              </div>
              <Results value={selected} />
            </>
          )}
        </div>
      </Dialog>
      <Dialog
        open={form !== null}
        onOpenChange={(open) => {
          if (!open && !execute.isPending) setForm(null);
        }}
        title={form ? `${actionLabel(form.method)} · ${page.label}` : ""}
        size="xl"
        busy={execute.isPending}
      >
        {form && (
          <form onSubmit={submit} className="space-y-5">
            <p className="text-sm text-[var(--text-3)]">
              {["post", "approve", "delete", "cancel"].includes(ERP_ACTIONS[form.method] ?? "")
                ? "Review the selected record and confirm this action. Posted financial entries are corrected through reversals."
                : "Complete the fields below. Monetary amounts use PKR; quantities use whole units."}
            </p>
            <FormFields
              fields={ERP_FORMS[form.method] ?? []}
              values={form.values}
              setValues={(values) => setForm({ ...form, values })}
              lookups={formLookups}
              prefix="command"
              hideIdentity={typeof form.values.id === "number"}
            />
            {formError && (
              <p role="alert" className="text-sm text-[var(--danger)]">
                {formError}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setForm(null)}
                disabled={execute.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={execute.isPending}>
                {execute.isPending
                  ? "Saving…"
                  : ERP_ACTIONS[form.method] === "view"
                    ? "Run Report"
                    : "Confirm"}
              </Button>
            </div>
          </form>
        )}
      </Dialog>
      <Dialog
        open={result !== undefined}
        onOpenChange={(open) => {
          if (!open) setResult(undefined);
        }}
        title="Results"
        size="xl"
      >
        <Results value={result} />
      </Dialog>
    </div>
  );
}
