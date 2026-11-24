import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  superAdminApi,
  type SACompany,
  type SAUser,
  type SADevice,
  type SALicense,
} from "../../../lib/superAdminApi";
import Modal from "../../../components/Modal";
import {
  ArrowLeft,
  Users,
  Monitor,
  KeyRound,
  Plus,
  Search,
  RefreshCw,
  Pencil,
  AlertTriangle,
  Pause,
  Play,
} from "lucide-react";

type Tab = "users" | "devices" | "licenses";

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const companyId = Number(id);

  const [company, setCompany] = useState<SACompany | null>(null);
  const [tab, setTab] = useState<Tab>("users");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCompany = useCallback(() => {
    setLoading(true);
    superAdminApi
      .getCompany(companyId)
      .then(setCompany)
      .catch((e) => setError(e?.response?.data?.detail || "Failed to load company"))
      .finally(() => setLoading(false));
  }, [companyId]);

  useEffect(() => { loadCompany(); }, [loadCompany]);

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="sa-skeleton h-8 w-48" />
        <div className="sa-skeleton h-10 w-64" />
        <div className="sa-card p-5">
          <div className="sa-skeleton h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate("/superadmin/companies")} className="sa-btn-ghost flex items-center gap-1.5">
          <ArrowLeft size={14} /> Back to Companies
        </button>
        <div className="sa-error flex items-center gap-2">
          <AlertTriangle size={16} /> {error || "Company not found"}
        </div>
      </div>
    );
  }

  const tabs: { value: Tab; label: string; icon: typeof Users }[] = [
    { value: "users", label: "Desktop Users", icon: Users },
    { value: "devices", label: "Devices", icon: Monitor },
    { value: "licenses", label: "Licenses", icon: KeyRound },
  ];

  return (
    <div className="space-y-5 animate-slide-up">
      <button onClick={() => navigate("/superadmin/companies")} className="sa-btn-ghost flex items-center gap-1.5">
        <ArrowLeft size={14} /> Back to Companies
      </button>

      {/* Company header */}
      <div className="sa-card p-5 flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
          style={{
            background: "rgba(124,58,237,0.12)",
            color: "#a78bfa",
            border: "1px solid rgba(124,58,237,0.25)",
          }}
        >
          {company.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold sa-text-primary">{company.name}</h2>
          <p className="text-xs sa-text-muted">
            Code: <span className="sa-badge ml-1">{company.code}</span>
            <span className="ml-3">Contact: {company.contact_email}</span>
          </p>
        </div>
        <span
          className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
          style={{
            background:
              company.status === "active"
                ? "rgba(16,185,129,0.12)"
                : "rgba(239,68,68,0.12)",
            color:
              company.status === "active" ? "#34d399" : "#f87171",
          }}
        >
          {company.status === "active" ? <Play size={10} /> : <Pause size={10} />}
          {company.status}
        </span>
      </div>

      {/* Tabs */}
      <div className="sa-tab-bar">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`sa-tab flex items-center gap-1.5 ${tab === t.value ? "active" : ""}`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "users" && <UsersTab companyId={companyId} />}
      {tab === "devices" && <DevicesTab companyId={companyId} />}
      {tab === "licenses" && <LicensesTab companyId={companyId} />}
    </div>
  );
}

/* ── Users Tab ──────────────────────────────────────────────────────────────── */
function UsersTab({ companyId }: { companyId: number }) {
  const [users, setUsers] = useState<SAUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    superAdminApi
      .listUsers(companyId)
      .then(setUsers)
      .catch((e) => setError(e?.response?.data?.detail || "Failed to load users"))
      .finally(() => setLoading(false));
  }, [companyId]);

  useEffect(() => { load(); }, [load]);

  const filtered = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 sa-text-muted" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sa-input pl-9 py-2 text-sm"
          />
        </div>
        <button onClick={() => setShowCreate(true)} className="sa-btn-primary px-3 py-2 text-sm flex items-center gap-1.5">
          <Plus size={14} /> Add User
        </button>
        <button onClick={load} className="sa-btn-ghost px-3 py-2 flex items-center gap-1.5">
          <RefreshCw size={14} />
        </button>
      </div>

      {error && <div className="sa-error">{error}</div>}

      <div className="sa-table-wrap overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="sa-table-head">
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="sa-table-row">
                  <td colSpan={5} className="px-4 py-4">
                    <div className="sa-skeleton h-4 w-40" />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center sa-text-muted">No users found</td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="sa-table-row">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium sa-text-primary">{u.full_name}</p>
                      <p className="text-xs sa-text-muted">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="sa-badge">{u.role_name || "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: u.is_active ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                        color: u.is_active ? "#34d399" : "#f87171",
                      }}
                    >
                      {u.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs sa-text-muted">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={async () => {
                        await superAdminApi.updateUser(companyId, u.id, { is_active: !u.is_active });
                        load();
                      }}
                      className="sa-topbar-icon-btn"
                      title={u.is_active ? "Deactivate" : "Activate"}
                    >
                      {u.is_active ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <UserForm
          companyId={companyId}
          onClose={() => setShowCreate(false)}
          onSaved={() => { setShowCreate(false); load(); }}
        />
      )}
    </div>
  );
}

function UserForm({
  companyId,
  onClose,
  onSaved,
}: {
  companyId: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await superAdminApi.createUser(companyId, {
        full_name: fullName,
        email,
        password,
      });
      onSaved();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open
      title="Add Desktop User"
      onClose={onClose}
      size="sm"
      footer={
        <>
          <button onClick={onClose} className="sa-btn-ghost px-4 py-2">Cancel</button>
          <button onClick={handleSubmit} disabled={loading || !fullName || !email || !password} className="sa-btn-primary px-4 py-2">
            {loading ? "Creating..." : "Create User"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="sa-error">{error}</div>}
        <div>
          <label className="block text-xs font-medium sa-text-secondary mb-1">Full Name *</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="sa-input" required />
        </div>
        <div>
          <label className="block text-xs font-medium sa-text-secondary mb-1">Email *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="sa-input" required />
        </div>
        <div>
          <label className="block text-xs font-medium sa-text-secondary mb-1">Password *</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="sa-input" required minLength={8} />
        </div>
      </form>
    </Modal>
  );
}

/* ── Devices Tab ────────────────────────────────────────────────────────────── */
function DevicesTab({ companyId }: { companyId: number }) {
  const [allDevices, setAllDevices] = useState<SADevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    superAdminApi
      .listAllDevices()
      .then((d) => setAllDevices(d.filter((dev) => dev.company_id === companyId)))
      .catch((e) => setError(e?.response?.data?.detail || "Failed to load devices"))
      .finally(() => setLoading(false));
  }, [companyId]);

  useEffect(() => { load(); }, [load]);

  const filtered = allDevices.filter(
    (d) =>
      d.device_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.device_id.toLowerCase().includes(search.toLowerCase()) ||
      d.user_email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRevoke = async (d: SADevice) => {
    if (!confirm(`Revoke device "${d.device_name || d.device_id}"?`)) return;
    try {
      await superAdminApi.revokeDevice(d.id);
      load();
    } catch {
      setError("Revoke failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 sa-text-muted" />
          <input
            type="text"
            placeholder="Search devices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sa-input pl-9 py-2 text-sm"
          />
        </div>
        <button onClick={load} className="sa-btn-ghost px-3 py-2 flex items-center gap-1.5">
          <RefreshCw size={14} />
        </button>
      </div>

      {error && <div className="sa-error">{error}</div>}

      <div className="sa-table-wrap overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="sa-table-head">
              <th className="px-4 py-3 text-left">Device</th>
              <th className="px-4 py-3 text-left">Platform</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Last Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="sa-table-row">
                  <td colSpan={6} className="px-4 py-4">
                    <div className="sa-skeleton h-4 w-40" />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center sa-text-muted">No devices found</td>
              </tr>
            ) : (
              filtered.map((d) => (
                <tr key={d.id} className="sa-table-row">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium sa-text-primary">{d.device_name || "Unknown"}</p>
                      <p className="text-xs sa-text-muted font-mono">{d.device_id.slice(0, 16)}...</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs sa-text-secondary">{d.platform || "—"}</td>
                  <td className="px-4 py-3 text-xs sa-text-secondary">{d.user_email || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: d.status === "active" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                        color: d.status === "active" ? "#34d399" : "#f87171",
                      }}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs sa-text-muted">
                    {d.last_active ? new Date(d.last_active).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {d.status === "active" && (
                      <button onClick={() => handleRevoke(d)} className="sa-btn-ghost text-xs" style={{ color: "#f87171" }}>
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Licenses Tab ───────────────────────────────────────────────────────────── */
function LicensesTab({ companyId }: { companyId: number }) {
  const [licenses, setLicenses] = useState<SALicense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    superAdminApi
      .listLicenses(companyId)
      .then(setLicenses)
      .catch((e) => setError(e?.response?.data?.detail || "Failed to load licenses"))
      .finally(() => setLoading(false));
  }, [companyId]);

  useEffect(() => { load(); }, [load]);

  const filtered = licenses.filter(
    (l) =>
      l.key.toLowerCase().includes(search.toLowerCase()) ||
      l.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleRevoke = async (l: SALicense) => {
    if (!confirm(`Revoke license "${l.key}"?`)) return;
    try {
      await superAdminApi.revokeLicense(companyId, l.id);
      load();
    } catch {
      setError("Revoke failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 sa-text-muted" />
          <input
            type="text"
            placeholder="Search licenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sa-input pl-9 py-2 text-sm"
          />
        </div>
        <button onClick={() => setShowCreate(true)} className="sa-btn-primary px-3 py-2 text-sm flex items-center gap-1.5">
          <Plus size={14} /> New License
        </button>
        <button onClick={load} className="sa-btn-ghost px-3 py-2 flex items-center gap-1.5">
          <RefreshCw size={14} />
        </button>
      </div>

      {error && <div className="sa-error">{error}</div>}

      <div className="sa-table-wrap overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="sa-table-head">
              <th className="px-4 py-3 text-left">License Key</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Devices</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Expires</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="sa-table-row">
                  <td colSpan={6} className="px-4 py-4">
                    <div className="sa-skeleton h-4 w-48" />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center sa-text-muted">No licenses found</td>
              </tr>
            ) : (
              filtered.map((l) => (
                <tr key={l.id} className="sa-table-row">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs sa-text-primary">{l.key}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="sa-badge">{l.type}</span>
                  </td>
                  <td className="px-4 py-3 text-xs sa-text-secondary">
                    {l.used_devices}/{l.max_devices}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: l.status === "active" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                        color: l.status === "active" ? "#34d399" : "#f87171",
                      }}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs sa-text-muted">
                    {l.expires_at ? new Date(l.expires_at).toLocaleDateString() : "Never"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {l.status === "active" && (
                      <button onClick={() => handleRevoke(l)} className="sa-btn-ghost text-xs" style={{ color: "#f87171" }}>
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <LicenseForm
          companyId={companyId}
          onClose={() => setShowCreate(false)}
          onSaved={() => { setShowCreate(false); load(); }}
        />
      )}
    </div>
  );
}

function LicenseForm({
  companyId,
  onClose,
  onSaved,
}: {
  companyId: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [type, setType] = useState("standard");
  const [maxDevices, setMaxDevices] = useState(5);
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await superAdminApi.createLicense(companyId, {
        type,
        max_devices: maxDevices,
        expires_at: expiresAt || undefined,
      });
      onSaved();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create license");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open
      title="Create License"
      onClose={onClose}
      size="sm"
      footer={
        <>
          <button onClick={onClose} className="sa-btn-ghost px-4 py-2">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="sa-btn-primary px-4 py-2">
            {loading ? "Creating..." : "Create License"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="sa-error">{error}</div>}
        <div>
          <label className="block text-xs font-medium sa-text-secondary mb-1">License Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="sa-select w-full">
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium sa-text-secondary mb-1">Max Devices</label>
          <input
            type="number"
            min={1}
            value={maxDevices}
            onChange={(e) => setMaxDevices(Number(e.target.value))}
            className="sa-input"
          />
        </div>
        <div>
          <label className="block text-xs font-medium sa-text-secondary mb-1">Expiry Date (optional)</label>
          <input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="sa-input"
          />
        </div>
      </form>
    </Modal>
  );
}
