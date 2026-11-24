import { FormEvent, useEffect, useId, useState, useMemo, useRef } from "react";
import AppDialog from "../ui/AppDialog";
import { FormField, ReadOnlyField } from "./FormField";
import { crmApi, Dealer } from "../../lib/crmApi";
import AttachmentsButton from "../attachments/AttachmentsButton";
import { useLookup } from "../../hooks/useLookup";
import { formatCNIC } from "../../lib/cnic";
import { Search, ChevronDown, X } from "lucide-react";

const CNIC_RE  = /^\d{5}-\d{7}-\d$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: (d: Dealer) => void;
  initial?: Dealer | null;
};

function Divider({ label }: { label: string }) {
  return (
    <div className="col-span-full flex items-center gap-3 pt-1">
      <span className="text-[10px] font-bold uppercase tracking-widest shrink-0"
        style={{ color: "var(--text-muted)" }}>{label}</span>
      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
    </div>
  );
}

/* ── Searchable Dealer Select ────────────────────────────────────────────── */

type DealerOption = { id: number; dealer_id: string; name: string; level: number | null; children: DealerOption[] };

function buildTree(dealers: Dealer[], excludeId?: number): DealerOption[] {
  const map = new Map<number, DealerOption>();
  for (const d of dealers) {
    if (d.id === excludeId) continue;
    map.set(d.id, { id: d.id, dealer_id: d.dealer_id, name: d.name, level: d.level ?? null, children: [] });
  }
  const roots: DealerOption[] = [];
  for (const d of dealers) {
    if (d.id === excludeId) continue;
    const node = map.get(d.id)!;
    if (d.parent_dealer_id && map.has(d.parent_dealer_id)) {
      map.get(d.parent_dealer_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

function getSubDealers(tree: DealerOption[], parentId: number): DealerOption[] {
  for (const node of tree) {
    if (node.id === parentId) return node.children;
    const found = getSubDealers(node.children, parentId);
    if (found.length > 0) return found;
  }
  return [];
}

function getAncestorNames(tree: DealerOption[], dealerId: number): string[] {
  for (const node of tree) {
    if (node.id === dealerId) return [node.name];
    const path = getAncestorNames(node.children, dealerId);
    if (path.length > 0) return [node.name, ...path];
  }
  return [];
}

function SearchableDealerSelect({
  dealers,
  tree,
  value,
  onChange,
  excludeId,
  placeholder,
  disabled,
}: {
  dealers: Dealer[];
  tree: DealerOption[];
  value: string;
  onChange: (id: string) => void;
  excludeId?: number;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = value ? dealers.find(d => d.id === Number(value)) : null;
  const filtered = useMemo(() => {
    if (!query.trim()) return tree;
    const q = query.toLowerCase();
    const match = (nodes: DealerOption[]): DealerOption[] =>
      nodes.filter(n => n.name.toLowerCase().includes(q) || n.dealer_id.toLowerCase().includes(q))
        .map(n => ({ ...n, children: match(n.children) }));
    return match(tree);
  }, [tree, query]);

  return (
    <div ref={ref} className="relative">
      <div
        className="select-dark w-full px-3 py-2 text-sm flex items-center gap-2 cursor-pointer"
        style={{ minHeight: "38px" }}
        onClick={() => !disabled && setOpen(o => !o)}
      >
        <Search size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
        <span className="flex-1 truncate" style={{ color: selected ? "var(--text-primary)" : "var(--text-muted)" }}>
          {selected ? `${selected.name} (${selected.dealer_id})` : (placeholder ?? "None (Main Dealer)")}
        </span>
        {selected && !disabled && (
          <X size={13} style={{ color: "var(--text-muted)", flexShrink: 0, cursor: "pointer" }}
            onClick={(e) => { e.stopPropagation(); onChange(""); setQuery(""); }} />
        )}
        <ChevronDown size={13} style={{ color: "var(--text-muted)", flexShrink: 0, transform: open ? "rotate(180deg)" : undefined }} />
      </div>
      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full rounded-lg shadow-xl max-h-56 overflow-auto"
          style={{ background: "var(--bg-surface2)", border: "1px solid var(--border)" }}>
          <div className="sticky top-0 p-1.5" style={{ background: "var(--bg-surface2)" }}>
            <input
              className="w-full px-2.5 py-1.5 text-xs rounded-md outline-none"
              style={{ background: "var(--bg-base)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
              placeholder="Search dealers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          <div className="px-1.5 pb-1.5">
            <div
              className="px-2.5 py-1.5 text-xs rounded-md cursor-pointer mb-0.5"
              style={{ color: !value ? "#10b981" : "var(--text-secondary)", background: !value ? "rgba(16,185,129,0.08)" : undefined }}
              onClick={() => { onChange(""); setOpen(false); setQuery(""); }}
            >
              None (Main Dealer)
            </div>
            {filtered.map(node => (
              <DealerTreeNodeComponent
                key={node.id}
                node={node}
                depth={0}
                selectedId={value ? Number(value) : null}
                onSelect={(id) => { onChange(id); setOpen(false); setQuery(""); }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DealerTreeNodeComponent({
  node, depth, selectedId, onSelect,
}: {
  node: DealerOption; depth: number; selectedId: number | null; onSelect: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 1);
  const hasChildren = node.children.length > 0;
  const isSelected = node.id === selectedId;

  return (
    <div>
      <div
        className="px-2 py-1.5 text-xs rounded-md cursor-pointer flex items-center gap-1.5"
        style={{
          paddingLeft: `${depth * 14 + 8}px`,
          color: isSelected ? "#10b981" : "var(--text-primary)",
          background: isSelected ? "rgba(16,185,129,0.08)" : undefined,
          fontWeight: isSelected ? 600 : undefined,
        }}
        onClick={() => onSelect(String(node.id))}
      >
        {hasChildren ? (
          <span className="w-4 h-4 flex items-center justify-center shrink-0"
            onClick={(e) => { e.stopPropagation(); setExpanded(o => !o); }}>
            <ChevronDown size={10} style={{ transform: expanded ? undefined : "rotate(-90deg)", color: "var(--text-muted)" }} />
          </span>
        ) : (
          <span className="w-4 shrink-0" />
        )}
        <span className="truncate">{node.name}</span>
        <span className="font-mono text-[10px] ml-auto shrink-0" style={{ color: "var(--text-muted)" }}>
          {node.dealer_id}
        </span>
      </div>
      {expanded && hasChildren && (
        <div>
          {node.children.map(child => (
            <DealerTreeNodeComponent
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── DealerForm ───────────────────────────────────────────────────────────── */

export default function DealerForm({ open, onClose, onSaved, initial }: Props) {
  const formId  = useId();
  const editing = !!initial;
  const { options: COMMISSION_TYPE_OPTS } = useLookup('commission_type');
  const commissionTypeOptions = COMMISSION_TYPE_OPTS.length > 0 ? COMMISSION_TYPE_OPTS
    : [{ value: "percentage", label: "Percentage (%)" }, { value: "fixed", label: "Fixed Amount" }];

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [company, setCompany]   = useState("");
  const [commType, setCommType] = useState("percentage");
  const [commRate, setCommRate] = useState("");
  const [cnic, setCnic]         = useState("");
  const [address, setAddress]   = useState("");
  const [costPerLead, setCostPerLead] = useState("");
  const [notes, setNotes]       = useState("");
  const [parentDealerId, setParentDealerId] = useState<string>("");
  const [subDealerIds, setSubDealerIds] = useState<string[]>([]); // drill-down chain
  const [allDealers, setAllDealers] = useState<Dealer[]>([]);
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    if (!open) return;
    crmApi.getDealers().then(d => {
      const list = Array.isArray(d) ? d : (d as any).items ?? [];
      setAllDealers(list);
    }).catch(() => setAllDealers([]));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      const i = initial as any;
      setName(i.name); setEmail(i.email ?? ""); setPhone(i.phone ?? "");
      setCompany(i.company ?? ""); setCommType(i.commission_type);
      setCommRate(i.commission_rate ?? ""); setCnic(i.cnic ?? "");
      setCostPerLead(i.cost_per_lead ?? ""); setAddress(i.address ?? ""); setNotes(i.notes ?? "");
      // For editing, reconstruct the parent chain
      setParentDealerId(i.parent_dealer_id ? String(i.parent_dealer_id) : "");
      setSubDealerIds([]);
    } else {
      setName(""); setEmail(""); setPhone(""); setCompany("");
      setCommType("percentage"); setCommRate(""); setCostPerLead(""); setCnic(""); setAddress(""); setNotes("");
      setParentDealerId("");
      setSubDealerIds([]);
    }
    setErrors({});
  }, [open, initial]);

  const tree = useMemo(() => buildTree(allDealers, initial?.id), [allDealers, initial?.id]);

  // The actual parent is the last selected in the drill-down chain, or the top-level parent
  const effectiveParentId = useMemo(() => {
    if (subDealerIds.length > 0) {
      return subDealerIds[subDealerIds.length - 1];
    }
    return parentDealerId;
  }, [parentDealerId, subDealerIds]);

  // Calculate the level for display
  const calculatedLevel = useMemo(() => {
    if (!effectiveParentId) return 1;
    const parent = allDealers.find(d => d.id === Number(effectiveParentId));
    if (parent && parent.level != null) return parent.level + 1;
    // Fallback: count ancestors
    const ancestors = getAncestorNames(tree, Number(effectiveParentId));
    return ancestors.length + 1;
  }, [effectiveParentId, allDealers, tree]);

  // Build breadcrumb path for display
  const parentPath = useMemo(() => {
    if (!effectiveParentId) return [];
    return getAncestorNames(tree, Number(effectiveParentId));
  }, [effectiveParentId, tree]);

  // Get sub-dealers for drill-down dropdowns
  const drillDownLevels = useMemo(() => {
    const levels: { parentId: number; parentName: string; options: DealerOption[] }[] = [];
    // First level: sub-dealers of the selected parent
    if (parentDealerId) {
      const parent = allDealers.find(d => d.id === Number(parentDealerId));
      if (parent) {
        const subs = getSubDealers(tree, Number(parentDealerId));
        if (subs.length > 0) {
          levels.push({ parentId: Number(parentDealerId), parentName: parent.name, options: subs });
        }
      }
    }
    // Subsequent levels from drill-down
    for (let i = 0; i < subDealerIds.length; i++) {
      const subId = Number(subDealerIds[i]);
      const sub = allDealers.find(d => d.id === subId);
      if (sub) {
        const subs = getSubDealers(tree, subId);
        if (subs.length > 0) {
          levels.push({ parentId: subId, parentName: sub.name, options: subs });
        }
      }
    }
    return levels;
  }, [parentDealerId, subDealerIds, allDealers, tree]);

  const handleParentChange = (id: string) => {
    setParentDealerId(id);
    setSubDealerIds([]); // reset drill-down chain
  };

  const handleSubDealerChange = (levelIndex: number, id: string) => {
    setSubDealerIds(prev => {
      const next = [...prev];
      if (id) {
        // Set this level and clear deeper levels
        next[levelIndex] = id;
        next.length = levelIndex + 1;
      } else {
        // Cleared: remove this level and deeper
        next.length = levelIndex;
      }
      return next;
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())  e.name  = "Required";
    if (!phone.trim()) e.phone = "Required";
    if (email && !EMAIL_RE.test(email)) e.email = "Invalid email";
    if (cnic  && !CNIC_RE.test(cnic))   e.cnic  = "Format: XXXXX-XXXXXXX-X";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: Record<string, any> = {
        name: name.trim(), email: email || null, phone: phone.trim(),
        company: company || null, commission_type: commType,
        commission_rate: commRate ? Number(commRate) : null,
        cost_per_lead: costPerLead ? Number(costPerLead) : null,
        cnic: cnic || null, address: address || null, notes: notes || null,
        parent_dealer_id: effectiveParentId ? Number(effectiveParentId) : null,
      };
      const res = editing
        ? await crmApi.updateDealer(initial!.id, payload as any).then(() => initial as Dealer)
        : await crmApi.createDealer(payload as any);
      onSaved(res);
      onClose();
    } catch (err: any) {
      const d = err?.response?.data?.detail;
      if (Array.isArray(d)) {
        const m: Record<string, string> = {};
        d.forEach((x: any) => { m[x.loc?.at(-1) ?? "form"] = x.msg; });
        setErrors(m);
      } else { setErrors({ form: d ?? "Save failed" }); }
    } finally { setSaving(false); }
  };

  const levelNames: Record<number, string> = { 1: "Main Dealer", 2: "Sub-Dealer", 3: "Sub-Dealer (L3)" };

  const footer = (
    <>
      <AttachmentsButton module="dealer" recordId={initial?.id} />
      <button type="button" onClick={onClose}
        className="px-5 py-2 text-sm rounded-lg transition-colors"
        style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
        Cancel
      </button>
      <button type="submit" form={formId} disabled={saving}
        className="btn-primary px-6 py-2 text-sm disabled:opacity-50">
        {saving ? "Saving…" : editing ? "Update Dealer" : "Create Dealer"}
      </button>
    </>
  );

  return (
    <AppDialog isOpen={open} onClose={onClose} title={editing ? "Edit Dealer" : "New Dealer"}
      size="xl" footer={footer}>
      <form id={formId} onSubmit={submit}>
        {errors.form && (
          <div className="mb-3 px-3 py-2 rounded-lg text-xs text-red-400"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
            {errors.form}
          </div>
        )}

        {/* Dealer ID banner */}
        {initial && (
          <div className="mb-4">
            <ReadOnlyField label="Dealer ID" value={initial.dealer_id} />
          </div>
        )}

        <div className="grid grid-cols-3 gap-x-4 gap-y-3">

          <Divider label="Basic Info" />

          <FormField label="Full Name" required error={errors.name} span="2">
            <input className="input-dark w-full px-3 py-2 text-sm" value={name}
              onChange={(e) => setName(e.target.value)} placeholder="Dealer full name" />
          </FormField>

          <FormField label="Company">
            <input className="input-dark w-full px-3 py-2 text-sm" value={company}
              onChange={(e) => setCompany(e.target.value)} placeholder="Company name" />
          </FormField>

          {/* ── Parent Dealer (searchable) ── */}
          <FormField label="Parent Dealer">
            <SearchableDealerSelect
              dealers={allDealers}
              tree={tree}
              value={parentDealerId}
              onChange={handleParentChange}
              excludeId={initial?.id}
              placeholder="None (Main Dealer)"
            />
          </FormField>

          {/* ── Drill-down sub-dealer dropdowns ── */}
          {drillDownLevels.map((level, idx) => (
            <FormField key={level.parentId} label={`Sub-Dealer under ${level.parentName}`}>
              <SearchableDealerSelect
                dealers={allDealers}
                tree={level.options}
                value={subDealerIds[idx] ?? ""}
                onChange={(id) => handleSubDealerChange(idx, id)}
                excludeId={initial?.id}
                placeholder="None (keep this as parent)"
              />
            </FormField>
          ))}

          {/* ── Level preview ── */}
          <FormField label="Hierarchy Level" span="full">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{
                background: "var(--bg-base)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                minHeight: "38px",
              }}>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold"
                style={{
                  background: calculatedLevel === 1 ? "rgba(59,130,246,0.12)" : calculatedLevel === 2 ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
                  color: calculatedLevel === 1 ? "#3b82f6" : calculatedLevel === 2 ? "#10b981" : "#f59e0b",
                }}>
                L{calculatedLevel}
              </span>
              <span className="flex-1">
                {effectiveParentId ? (
                  <span className="text-xs">
                    Will be created as <span className="font-semibold">Level {calculatedLevel}</span> — Sub-Dealer under{" "}
                    <span className="font-semibold">{parentPath.join(" → ")}</span>
                  </span>
                ) : (
                  <span className="text-xs">
                    Will be created as <span className="font-semibold">Level 1</span> — <span className="font-semibold">Main Dealer</span> (top of hierarchy)
                  </span>
                )}
              </span>
            </div>
          </FormField>

          <Divider label="Contact" />

          <FormField label="Phone" required error={errors.phone}>
            <input className="input-dark w-full px-3 py-2 text-sm" value={phone}
              onChange={(e) => setPhone(e.target.value)} placeholder="+92 300 0000000" />
          </FormField>

          <FormField label="Email" error={errors.email}>
            <input className="input-dark w-full px-3 py-2 text-sm" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
          </FormField>

          <FormField label="CNIC" error={errors.cnic}>
            <input className="input-dark w-full px-3 py-2 text-sm" value={cnic}
              onChange={(e) => setCnic(formatCNIC(e.target.value))} placeholder="XXXXX-XXXXXXX-X" />
          </FormField>

          <FormField label="Address" span="full">
            <input className="input-dark w-full px-3 py-2 text-sm" value={address}
              onChange={(e) => setAddress(e.target.value)} placeholder="Full address" />
          </FormField>

          <Divider label="Commission" />

          <FormField label="Type">
            <select className="select-dark w-full px-3 py-2 text-sm" value={commType}
              onChange={(e) => setCommType(e.target.value)}>
              {commissionTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </FormField>

          <FormField label={commType === "percentage" ? "Rate (%)" : "Fixed Amount"}
            error={errors.commission_rate}>
            <input className="input-dark w-full px-3 py-2 text-sm" type="number"
              min="0" step="0.01" value={commRate}
              onChange={(e) => setCommRate(e.target.value)}
              placeholder={commType === "percentage" ? "e.g. 2.5" : "e.g. 50000"} />
          </FormField>

          <FormField label="Cost per Lead (PKR)">
            <input className="input-dark w-full px-3 py-2 text-sm" type="number" min="0" step="0.01"
              value={costPerLead} onChange={(e) => setCostPerLead(e.target.value)}
              placeholder="e.g. 500" />
          </FormField>

          {/* Live preview chip */}
          <div className="flex items-end">
            <div className="w-full px-3 py-2 rounded-lg text-sm font-semibold text-center"
              style={{
                background: commRate ? "rgba(16,185,129,0.08)" : "var(--bg-base)",
                border: `1px solid ${commRate ? "rgba(16,185,129,0.25)" : "var(--border)"}`,
                color: commRate ? "#10b981" : "var(--text-muted)",
                minHeight: "38px", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
              {commRate
                ? commType === "percentage"
                  ? `${commRate}% commission`
                  : `PKR ${Number(commRate).toLocaleString()} fixed`
                : "Preview"}
            </div>
          </div>

          <Divider label="Notes" />

          <FormField label="Internal Notes" span="full">
            <textarea className="input-dark w-full px-3 py-2 text-sm resize-none" rows={2}
              value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes…" />
          </FormField>
        </div>
      </form>
    </AppDialog>
  );
}
