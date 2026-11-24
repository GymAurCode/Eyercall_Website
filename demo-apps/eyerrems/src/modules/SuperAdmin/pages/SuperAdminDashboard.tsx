import { useEffect, useState } from "react";
import { superAdminApi, type SAStats } from "../../../lib/superAdminApi";
import {
  Building2,
  Users,
  Monitor,
  KeyRound,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<SAStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    superAdminApi
      .getStats()
      .then(setStats)
      .catch((e) => setError(e?.response?.data?.detail || "Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="sa-card p-5">
              <div className="sa-skeleton h-4 w-24 mb-3" />
              <div className="sa-skeleton h-8 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sa-error flex items-center gap-2">
        <AlertTriangle size={16} />
        {error}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    { label: "Total Companies", value: stats.total_companies, icon: Building2, color: "#7c3aed" },
    { label: "Active Companies", value: stats.active_companies, icon: CheckCircle, color: "#10b981" },
    { label: "Suspended Companies", value: stats.suspended_companies, icon: XCircle, color: "#ef4444" },
    { label: "Total Users", value: stats.total_users, icon: Users, color: "#6366f1" },
    { label: "Active Users", value: stats.active_users, icon: CheckCircle, color: "#10b981" },
    { label: "Pending Users", value: stats.pending_users, icon: Clock, color: "#f59e0b" },
    { label: "Total Devices", value: stats.total_devices, icon: Monitor, color: "#06b6d4" },
    { label: "Active Devices", value: stats.active_devices, icon: Monitor, color: "#10b981" },
    { label: "Total Licenses", value: stats.total_licenses, icon: KeyRound, color: "#8b5cf6" },
    { label: "Active Licenses", value: stats.active_licenses, icon: KeyRound, color: "#10b981" },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-lg font-bold sa-text-primary">System Overview</h2>
        <p className="text-xs sa-text-muted mt-0.5">Real-time statistics across all companies</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="sa-stat-card"
            style={{
              background: `color-mix(in srgb, ${card.color} 8%, var(--sa-bg-surface))`,
              borderColor: `color-mix(in srgb, ${card.color} 25%, transparent)`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium sa-text-muted">{card.label}</span>
              <card.icon size={18} style={{ color: card.color }} />
            </div>
            <p className="text-2xl font-bold sa-text-primary">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
