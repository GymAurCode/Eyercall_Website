import { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { useUIStore } from "../store/ui";
import { Settings, User, Palette, LogOut, Shield, Database, Trash2, Smartphone, Loader2 } from "lucide-react";

const BackupRestorePage = lazy(() => import("./BackupRestore"));
const RecycleBinPage = lazy(() => import("./RecycleBin"));
const SyncPage = lazy(() => import("../modules/Sync/SyncPage"));

type SettingsTab = "general" | "backup" | "recycle-bin" | "mobile-sync";

const TABS: { key: SettingsTab; label: string; icon: React.ElementType }[] = [
  { key: "general",      label: "General",          icon: Settings },
  { key: "backup",       label: "Backup & Restore",  icon: Database },
  { key: "recycle-bin",  label: "Recycle Bin",       icon: Trash2 },
  { key: "mobile-sync", label: "Mobile Sync",       icon: Smartphone },
];

function TabContentLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={20} className="animate-spin" style={{ color: "var(--text-muted, #6b7280)" }} />
      <span className="ml-2 text-sm" style={{ color: "var(--text-muted, #6b7280)" }}>Loading…</span>
    </div>
  );
}

function GeneralTab() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* User Profile */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <div className="px-5 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
            background: "rgba(59,130,246,0.12)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(59,130,246,0.25)",
            boxShadow: "0 0 12px rgba(59,130,246,0.1)",
          }}>
            <User size={15} style={{ color: "#3b82f6" }} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-primary">Profile</h2>
            <p className="text-[11px] text-muted mt-0.5">Your account information</p>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Full Name</label>
              <p className="text-sm font-semibold text-primary">{user?.full_name || "—"}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Email</label>
              <p className="text-sm text-secondary">{user?.email || "—"}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Role</label>
              <p className="text-sm text-secondary">{user?.role_name || user?.role || "—"}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Status</label>
              <p className="text-sm text-secondary">{user?.status || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <div className="px-5 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#8b5cf6,#a855f7)" }}>
            <Palette size={15} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-primary">Appearance</h2>
            <p className="text-[11px] text-muted mt-0.5">Customize the look of the app</p>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary">Dark Mode</p>
              <p className="text-[11px] text-muted mt-0.5">Switch between light and dark theme</p>
            </div>
            <button
              onClick={toggleTheme}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              style={{ background: theme === "dark" ? "#3b82f6" : "var(--border)" }}
            >
              <span
                className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                style={{ transform: theme === "dark" ? "translateX(24px)" : "translateX(2px)" }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <div className="px-5 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
            <Shield size={15} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-primary">Security</h2>
            <p className="text-[11px] text-muted mt-0.5">Manage your account security</p>
          </div>
        </div>
        <div className="p-5">
          <button
            onClick={() => navigate("/change-password")}
            className="text-sm font-medium text-primary hover:underline"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(239,68,68,0.3)" }}>
        <div className="px-5 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(239,68,68,0.3)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)" }}>
            <LogOut size={15} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-primary">Session</h2>
            <p className="text-[11px] text-muted mt-0.5">Sign out of your account</p>
          </div>
        </div>
        <div className="p-5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralTab />;
      case "backup":
        return (
          <Suspense fallback={<TabContentLoader />}>
            <BackupRestorePage />
          </Suspense>
        );
      case "recycle-bin":
        return (
          <Suspense fallback={<TabContentLoader />}>
            <RecycleBinPage />
          </Suspense>
        );
      case "mobile-sync":
        return (
          <Suspense fallback={<TabContentLoader />}>
            <SyncPage />
          </Suspense>
        );
      default:
        return <GeneralTab />;
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 animate-slide-up max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-primary">Settings</h1>
        <p className="text-xs text-muted mt-0.5">Manage your system configuration</p>
      </div>

      {/* Tabs */}
      <div className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex gap-0 overflow-x-auto -mb-px" style={{ scrollbarWidth: "none" }}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-150 shrink-0"
                style={{
                  color: isActive ? "var(--tab-active-color, #3b82f6)" : "var(--text-muted, #6b7280)",
                  borderBottom: isActive ? "2px solid var(--tab-active-color, #3b82f6)" : "2px solid transparent",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = "var(--text-primary, #e2e8f0)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = "var(--text-muted, #6b7280)";
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div>{renderTabContent()}</div>
    </div>
  );
}
