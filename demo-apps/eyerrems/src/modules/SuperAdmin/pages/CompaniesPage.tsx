import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { superAdminApi, type SACompany } from "../../../lib/superAdminApi";
import Modal from "../../../components/Modal";
import {
  Building2,
  Plus,
  Search,
  RefreshCw,
  Eye,
  Trash2,
  Pause,
  Play,
  AlertTriangle,
  Pencil,
} from "lucide-react";

export default function CompaniesPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<SACompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingCompany, setEditingCompany] = useState<SACompany | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    superAdminApi
      .listCompanies()
      .then(setCompanies)
      .catch((e) => setError(e?.response?.data?.detail || "Failed to load companies"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.contact_email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSuspend = async (c: SACompany) => {
    setActionLoading(c.id);
    try {
      if (c.status === "active") {
        await superAdminApi.suspendCompany(c.id);
      } else {
        await superAdminApi.activateCompany(c.id);
      }
      load();
    } catch {
      setError("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (c: SACompany) => {
    if (!confirm(`Delete company "${c.name}"? This cannot be undone.`)) return;
    setActionLoading(c.id);
    try {
      await superAdminApi.deleteCompany(c.id);
      load();
    } catch {
      setError("Delete failed");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold sa-text-primary">Companies</h2>
          <p className="text-xs sa-text-muted mt-0.5">Manage all tenant companies</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="sa-btn-primary px-4 py-2">
          <Plus size={16} /> New Company
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 sa-text-muted" />
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sa-input pl-9 py-2 text-sm"
          />
        </div>
        <button onClick={load} className="sa-btn-ghost px-3 py-2 flex items-center gap-1.5">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && <div className="sa-error">{error}</div>}

      {/* Table */}
      <div className="sa-table-wrap overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="sa-table-head">
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="sa-table-row">
                  <td colSpan={5} className="px-4 py-4">
                    <div className="sa-skeleton h-4 w-32" />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center sa-text-muted">
                  No companies found
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="sa-table-row">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{
                          background: "rgba(124,58,237,0.12)",
                          color: "#a78bfa",
                          border: "1px solid rgba(124,58,237,0.25)",
                        }}
                      >
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium sa-text-primary">{c.name}</p>
                        <p className="text-xs sa-text-muted">{c.contact_email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="sa-badge">{c.code}</span>
                  </td>
                  <td className="px-4 py-3 sa-text-secondary text-xs">{c.contact_email}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background:
                          c.status === "active"
                            ? "rgba(16,185,129,0.12)"
                            : c.status === "suspended"
                            ? "rgba(239,68,68,0.12)"
                            : "rgba(245,158,11,0.12)",
                        color:
                          c.status === "active"
                            ? "#34d399"
                            : c.status === "suspended"
                            ? "#f87171"
                            : "#fbbf24",
                      }}
                    >
                      {c.status === "active" ? (
                        <CheckCircle size={10} />
                      ) : c.status === "suspended" ? (
                        <XCircle size={10} />
                      ) : (
                        <Clock size={10} />
                      )}
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/superadmin/companies/${c.id}`)}
                        className="sa-topbar-icon-btn"
                        title="View details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => setEditingCompany(c)}
                        className="sa-topbar-icon-btn"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleSuspend(c)}
                        disabled={actionLoading === c.id}
                        className="sa-topbar-icon-btn"
                        title={c.status === "active" ? "Suspend" : "Activate"}
                      >
                        {c.status === "active" ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                      <button
                        onClick={() => handleDelete(c)}
                        disabled={actionLoading === c.id}
                        className="sa-topbar-icon-btn"
                        title="Delete"
                        style={{ color: "#f87171" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {(showCreate || editingCompany) && (
        <CompanyForm
          company={editingCompany}
          onClose={() => { setShowCreate(false); setEditingCompany(null); }}
          onSaved={() => { setShowCreate(false); setEditingCompany(null); load(); }}
        />
      )}
    </div>
  );
}

function CheckCircle({ size = 14, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function XCircle({ size = 14, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function Clock({ size = 14, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CompanyForm({
  company,
  onClose,
  onSaved,
}: {
  company: SACompany | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(company?.name || "");
  const [code, setCode] = useState(company?.code || "");
  const [email, setEmail] = useState(company?.contact_email || "");
  const [phone, setPhone] = useState(company?.contact_phone || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = { name, code, contact_email: email, contact_phone: phone };
      if (company) {
        await superAdminApi.updateCompany(company.id, payload);
      } else {
        await superAdminApi.createCompany(payload);
      }
      onSaved();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open
      title={company ? "Edit Company" : "New Company"}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <button onClick={onClose} className="sa-btn-ghost px-4 py-2">Cancel</button>
          <button onClick={handleSubmit} disabled={loading || !name || !code || !email} className="sa-btn-primary px-4 py-2">
            {loading ? "Saving..." : company ? "Update" : "Create"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="sa-error">{error}</div>}
        <div>
          <label className="block text-xs font-medium sa-text-secondary mb-1">Company Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="sa-input" required />
        </div>
        <div>
          <label className="block text-xs font-medium sa-text-secondary mb-1">Company Code *</label>
          <input value={code} onChange={(e) => setCode(e.target.value)} className="sa-input" required disabled={!!company} />
        </div>
        <div>
          <label className="block text-xs font-medium sa-text-secondary mb-1">Contact Email *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="sa-input" required />
        </div>
        <div>
          <label className="block text-xs font-medium sa-text-secondary mb-1">Contact Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="sa-input" />
        </div>
      </form>
    </Modal>
  );
}
