import { useCallback, useEffect, useState } from "react";
import { superAdminApi, type SADevice } from "../../../lib/superAdminApi";
import {
  Monitor,
  Search,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

export default function DevicesPage() {
  const [devices, setDevices] = useState<SADevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    superAdminApi
      .listAllDevices()
      .then(setDevices)
      .catch((e) => setError(e?.response?.data?.detail || "Failed to load devices"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = devices.filter(
    (d) =>
      d.device_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.device_id.toLowerCase().includes(search.toLowerCase()) ||
      d.user_email?.toLowerCase().includes(search.toLowerCase()) ||
      d.company_name?.toLowerCase().includes(search.toLowerCase())
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
    <div className="space-y-5 animate-slide-up">
      <div>
        <h2 className="text-lg font-bold sa-text-primary">All Devices</h2>
        <p className="text-xs sa-text-muted mt-0.5">Manage devices across all companies</p>
      </div>

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
          <RefreshCw size={14} /> Refresh
        </button>
        <span className="text-xs sa-text-muted">{filtered.length} device(s)</span>
      </div>

      {error && <div className="sa-error flex items-center gap-2"><AlertTriangle size={16} />{error}</div>}

      <div className="sa-table-wrap overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="sa-table-head">
              <th className="px-4 py-3 text-left">Device</th>
              <th className="px-4 py-3 text-left">Platform</th>
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Last Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="sa-table-row">
                  <td colSpan={7} className="px-4 py-4">
                    <div className="sa-skeleton h-4 w-48" />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center sa-text-muted">
                  No devices found
                </td>
              </tr>
            ) : (
              filtered.map((d) => (
                <tr key={d.id} className="sa-table-row">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Monitor size={16} className="sa-text-muted" style={{ flexShrink: 0 }} />
                      <div>
                        <p className="font-medium sa-text-primary">{d.device_name || "Unknown"}</p>
                        <p className="text-xs sa-text-muted font-mono">{d.device_id.slice(0, 20)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs sa-text-secondary">{d.platform || "—"}</td>
                  <td className="px-4 py-3 text-xs sa-text-secondary">{d.company_name || `#${d.company_id}`}</td>
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
                      <button
                        onClick={() => handleRevoke(d)}
                        className="sa-btn-ghost text-xs"
                        style={{ color: "#f87171" }}
                      >
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
