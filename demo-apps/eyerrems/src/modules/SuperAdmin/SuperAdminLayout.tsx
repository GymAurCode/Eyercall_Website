import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import {
  LayoutDashboard,
  Building2,
  Monitor,
  KeyRound,
  LogOut,
  Shield,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { to: "/superadmin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/superadmin/companies", icon: Building2, label: "Companies" },
  { to: "/superadmin/devices", icon: Monitor, label: "Devices" },
  { to: "/superadmin/licenses", icon: KeyRound, label: "Licenses" },
];

function Topbar({ title, onMenuToggle }: { title: string; onMenuToggle?: () => void }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <div className="sa-topbar">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button onClick={onMenuToggle} className="sa-topbar-icon-btn md:hidden" title="Toggle menu">
            <Menu size={16} />
          </button>
        )}
        <button onClick={() => navigate("/")} className="sa-topbar-icon-btn" title="Back to app">
          <ChevronLeft size={16} />
        </button>
        <h1 className="text-sm font-semibold sa-text-primary">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="sa-badge hidden sm:inline-flex">Super Admin</span>
        <div className="sa-avatar">
          {user?.full_name?.charAt(0)?.toUpperCase() || "S"}
        </div>
        <button onClick={logout} className="sa-topbar-icon-btn" title="Logout">
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}

export default function SuperAdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const user = useAuthStore((s) => s.user);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/superadmin") return "System Overview";
    if (path.startsWith("/superadmin/companies")) {
      if (path.split("/").length > 3) return "Company Details";
      return "Companies";
    }
    if (path.startsWith("/superadmin/devices")) return "All Devices";
    if (path.startsWith("/superadmin/licenses")) return "All Licenses";
    return "Super Admin";
  };

  if (!user?.is_super_admin) {
    return (
      <div className="sa-shell items-center justify-center">
        <div className="text-center">
          <Shield size={48} className="mx-auto mb-4 sa-text-muted" />
          <p className="text-lg font-semibold sa-text-primary">Access Denied</p>
          <p className="text-sm sa-text-muted mt-1">Super admin privileges required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sa-shell">
      {mobileOpen && (
        <div className="sa-mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className="sa-sidebar hidden md:flex"
        style={{ width: collapsed ? "60px" : "220px" }}
      >
        <div className="sa-sidebar-header">
          {!collapsed && (
            <div>
              <div className="sa-sidebar-title">REMS Admin</div>
              <div className="sa-sidebar-subtitle">Control Panel</div>
            </div>
          )}
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sa-nav-link ${isActive ? "active" : ""} ${collapsed ? "justify-center px-2" : "px-3 py-2"}`
              }
            >
              <item.icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sa-sidebar-footer">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sa-topbar-icon-btn w-full flex items-center justify-center"
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <aside
          className="sa-sidebar fixed top-0 left-0 z-50 md:hidden"
          style={{ width: "260px" }}
        >
          <div className="sa-sidebar-header">
            <div>
              <div className="sa-sidebar-title">REMS Admin</div>
              <div className="sa-sidebar-subtitle">Control Panel</div>
            </div>
          </div>

          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `sa-nav-link ${isActive ? "active" : ""} px-3 py-2`
                }
              >
                <item.icon size={18} style={{ flexShrink: 0 }} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={getPageTitle()} onMenuToggle={() => setMobileOpen(!mobileOpen)} />
        <main className="sa-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
