import { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { useUIStore } from "../store/ui";
import { usePermissions } from "../hooks/usePermissions";

const YELLOW = "#f6ce3a";
const SIDEBAR_BG = "var(--bg-sidebar)";

type NavItem = { path: string; label: string; icon: string; requiredPermission: string };
type NavSection = { label: string; items: NavItem[] };

const ALL_NAV_ITEMS: NavItem[] = [
  { path: "/",             label: "Dashboard",    icon: "ti-layout-dashboard",   requiredPermission: "dashboard.view" },
  { path: "/property",     label: "Properties",   icon: "ti-building",           requiredPermission: "properties.view" },
  { path: "/towns",        label: "Towns",        icon: "ti-map-pin",            requiredPermission: "towns.view" },
  { path: "/crm",          label: "CRM",          icon: "ti-users",              requiredPermission: "crm.view" },
  { path: "/tenants",      label: "Tenants",      icon: "ti-user-check",         requiredPermission: "tenants.view" },
  { path: "/maintenance",  label: "Maintenance",  icon: "ti-tool",               requiredPermission: "maintenance.view" },
  { path: "/construction", label: "Construction", icon: "ti-building-skyscraper", requiredPermission: "construction.view" },
  { path: "/hr",           label: "HR",           icon: "ti-briefcase",          requiredPermission: "hr.view" },
  { path: "/finance",      label: "Finance",      icon: "ti-currency-dollar",    requiredPermission: "finance.view" },
  { path: "/reports",      label: "Reports",      icon: "ti-file",               requiredPermission: "reports.view" },
  { path: "/spreadsheet",  label: "Spreadsheet",  icon: "ti-table",              requiredPermission: "spreadsheet.view" },
  { path: "/ai",           label: "AI Intel",     icon: "ti-robot",              requiredPermission: "ai.view" },
  { path: "/communication",label: "Communication",icon: "ti-mail",               requiredPermission: "communication.view" },
  { path: "/reminders",    label: "Reminders",    icon: "ti-bell-ringing",       requiredPermission: "reminders.view" },
  { path: "/settings",     label: "Settings",     icon: "ti-settings",            requiredPermission: "dashboard.view" },
  { path: "/admin",        label: "Admin",         icon: "ti-shield",              requiredPermission: "admin.view" },
];

function NavItemComponent({ path, label, icon, badge, onClick }: { path: string; label: string; icon?: string; badge?: boolean; onClick?: () => void }) {
  const location = useLocation();
  const isActive = path === "/"
    ? location.pathname === "/"
    : location.pathname.startsWith(path);

  return (
    <Link
      to={path}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-[3px] rounded-lg no-underline transition-all duration-150 group"
      style={{
        background: isActive ? "transparent" : "transparent",
        color: isActive ? YELLOW : "var(--sidebar-text)",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = "rgba(246,206,58,0.1)";
          (e.currentTarget as HTMLElement).style.color = "#c0efef";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "var(--sidebar-text)";
        }
      }}
    >
      <i
        className={`ti ${icon} text-sm`}
        style={{
          color: isActive ? YELLOW : "var(--sidebar-icon)",
          fontSize: "12px",
          width: "16px",
          textAlign: "center",
          flexShrink: 0,
        }}
      />
      <span
        className="text-[10px] font-medium flex-1"
        style={{
          color: "inherit",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </span>
      {badge && (
        <span
          className="text-[10px] font-semibold px-[6px] py-[1px] rounded-full"
          style={{
            background: "rgba(246,206,58,0.25)",
            color: "#8ababa",
          }}
        >
          248
        </span>
      )}
      {isActive && (
        <span
          className="w-[6px] h-[6px] rounded-full shrink-0"
          style={{
            background: YELLOW,
            boxShadow: `0 0 6px ${YELLOW}`,
          }}
        />
      )}
    </Link>
  );
}

function MiniSidebar({ user, onSignOut, navSections }: { user: { full_name?: string } | null; onSignOut: () => void; navSections: NavSection[] }) {
  const location = useLocation();
  return (
    <aside
      className="flex flex-col shrink-0 overflow-y-auto rounded-xl my-4 ml-4"
      style={{
        width: "56px",
        height: "calc(100vh - 2rem)",
        background: SIDEBAR_BG,
        border: "1px solid var(--border)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <div
        className="flex items-center justify-center h-12 border-b shrink-0"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{ background: YELLOW }}
        >
          <i className="ti ti-eye text-sm" style={{ color: "#001a1a" }} />
        </div>
      </div>
      <nav className="flex flex-col items-center gap-1 py-3 px-2">
        {navSections.flatMap((s: NavSection) => s.items).map((item: NavItem) => {
          const active = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center justify-center w-8 h-8 rounded-lg no-underline transition-colors"
              style={{
                color: active ? YELLOW : "var(--sidebar-icon)",
                background: active ? "rgba(246,206,58,0.08)" : "transparent",
              }}
              title={item.label}
            >
              <i className={`ti ${item.icon} text-base`} style={{ fontSize: "15px" }} />
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col items-center gap-1 py-2 border-t shrink-0" style={{ borderColor: "var(--border)" }}>
        <button
          type="button"
          onClick={onSignOut}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors"
          style={{ color: "#ef4444" }}
          title="Sign Out"
        >
          <i className="ti ti-logout text-sm" />
        </button>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
          style={{
            background: "rgba(246,206,58,0.12)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(246,206,58,0.25)",
            color: YELLOW,
            boxShadow: "0 0 12px rgba(246,206,58,0.1)",
          }}
        >
          {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </div>
      <div className="text-center pb-2 shrink-0">
        <p className="text-[8px] tracking-wider" style={{ color: "#3a7070" }}>
          POWERED BY <span style={{ color: "#14B8A6" }}>EYERCALL</span>
        </p>
      </div>
    </aside>
  );
}

function MobileDrawer({ user, onSignOut, navSections, onClose }: {
  user: { full_name?: string; role_name?: string; role?: string } | null;
  onSignOut: () => void;
  navSections: NavSection[];
  onClose: () => void;
}) {
  const handleNavClick = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      />
      <aside
        className="mobile-drawer-enter"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "260px",
          maxWidth: "80vw",
          zIndex: 100,
          background: SIDEBAR_BG,
          border: "none",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "4px 0 24px rgba(0,0,0,0.4)",
          overflowY: "auto",
        }}
      >
        <div
          className="flex items-center gap-2 px-4 py-3 border-b shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: YELLOW }}
          >
            <i className="ti ti-eye text-sm" style={{ color: "#001a1a" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold leading-none" style={{ color: "#e0f0f0" }}>
              EyerRems
            </p>
            <p className="text-[9px] font-medium uppercase tracking-wider mt-[2px]" style={{ color: "#5a9999" }}>
              Real Estate
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ color: "var(--text-secondary)" }}
          >
            <i className="ti ti-x text-base" />
          </button>
        </div>

        <nav className="flex-1 py-2 px-2 space-y-1 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.label}>
              <p
                className="text-[9px] font-semibold uppercase tracking-[0.12em] px-3 pb-[2px] pt-2"
                style={{ color: "rgba(90,153,153,0.4)" }}
              >
                {section.label}
              </p>
              <div className="space-y-[1px]">
                {section.items.map((item) => (
                  <NavItemComponent key={item.path} {...item} onClick={handleNavClick} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div
          className="flex items-center gap-2 px-3 py-2 border-t shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
            style={{
              background: "rgba(246,206,58,0.12)",
              border: "1px solid rgba(246,206,58,0.25)",
              color: YELLOW,
            }}
          >
            {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium truncate" style={{ color: "#c0efef" }}>
              {user?.full_name || "User"}
            </p>
            <p className="text-[9px] truncate" style={{ color: "#5a9999" }}>
              {user?.role_name || user?.role || "User"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => { onClose(); onSignOut(); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0"
            style={{ color: "#ef4444" }}
            title="Sign Out"
          >
            <i className="ti ti-logout" style={{ fontSize: "14px" }} />
          </button>
        </div>
        <div className="text-center pb-2 shrink-0">
          <p className="text-[8px] tracking-wider" style={{ color: "#3a7070" }}>
            POWERED BY <span style={{ color: "#14B8A6" }}>EYERCALL</span>
          </p>
        </div>
      </aside>
    </>
  );
}

function useFilteredNavSections() {
  const { can, isSuperAdmin } = usePermissions();

  return useMemo(() => {
    const filterItem = (item: NavItem) => {
      if (isSuperAdmin) return true;
      return can(item.requiredPermission);
    };

    const sections: NavSection[] = [
      {
        label: "Main",
        items: ALL_NAV_ITEMS.filter((i) =>
          ["dashboard","properties","towns","crm","tenants","maintenance","construction"].includes(i.requiredPermission.split(".")[0]) && filterItem(i) && i.path !== "/settings"
        ),
      },
      {
        label: "Manage",
        items: ALL_NAV_ITEMS.filter((i) =>
          ["hr","finance","reports"].includes(i.requiredPermission.split(".")[0]) && filterItem(i)
        ),
      },
      {
        label: "Stock Ops",
        items: ALL_NAV_ITEMS.filter((i) =>
          ["spreadsheet"].includes(i.requiredPermission.split(".")[0]) && filterItem(i)
        ),
      },
      {
        label: "Tools",
        items: ALL_NAV_ITEMS.filter((i) =>
          ["ai","communication","reminders"].includes(i.requiredPermission.split(".")[0]) && filterItem(i)
        ),
      },
      {
        label: "System",
        items: ALL_NAV_ITEMS.filter((i) =>
          ["admin","dashboard"].includes(i.requiredPermission.split(".")[0]) && filterItem(i) && ["/settings","/admin"].includes(i.path)
        ),
      },
    ];

    return sections.filter((s) => s.items.length > 0);
  }, [isSuperAdmin, can]);
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

function SignOutModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onCancel}
    >
      <div
        className="rounded-xl p-6 w-[320px] max-w-[90vw] shadow-2xl"
        style={{
          background: "#041515",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(239,68,68,0.15)" }}
          >
            <i className="ti ti-alert-triangle text-2xl" style={{ color: "#ef4444" }} />
          </div>
          <h3 className="text-base font-semibold mb-2" style={{ color: "#f1f5f9" }}>
            Sign Out
          </h3>
          <p className="text-sm mb-6" style={{ color: "#94a3b8" }}>
            Are you sure you want to sign out?
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "#94a3b8",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ background: "#ef4444", color: "#fff" }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const open = useUIStore((s) => s.sidebarOpen);
  const mobileDrawerOpen = useUIStore((s) => s.mobileDrawerOpen);
  const closeMobileDrawer = useUIStore((s) => s.closeMobileDrawer);
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [showSignOut, setShowSignOut] = useState(false);
  const NAV_SECTIONS = useFilteredNavSections();
  const isMobile = useIsMobile();

  const confirmSignOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const location = useLocation();
  useEffect(() => {
    if (isMobile && mobileDrawerOpen) {
      closeMobileDrawer();
    }
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!mobileDrawerOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileDrawer();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [mobileDrawerOpen, closeMobileDrawer]);

  if (isMobile) {
    return (
      <>
        {mobileDrawerOpen && (
          <MobileDrawer
            user={user}
            onSignOut={() => setShowSignOut(true)}
            navSections={NAV_SECTIONS}
            onClose={closeMobileDrawer}
          />
        )}
        {showSignOut && (
          <SignOutModal
            onConfirm={confirmSignOut}
            onCancel={() => setShowSignOut(false)}
          />
        )}
      </>
    );
  }

  const sidebar = open ? (
    <aside
      className="flex flex-col shrink-0 rounded-xl my-4 ml-4"
      style={{
        width: "185px",
        height: "calc(100vh - 2rem)",
        background: SIDEBAR_BG,
        border: "1px solid var(--border)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <div
          className="flex items-center gap-2 px-4 py-1.5 border-b shrink-0"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: YELLOW }}
        >
          <i className="ti ti-eye text-sm" style={{ color: "#001a1a" }} />
        </div>
        <div className="overflow-hidden">
          <p
            className="text-[11px] font-semibold leading-none"
            style={{ color: "#e0f0f0" }}
          >
            EyerRems
          </p>
          <p
            className="text-[8px] font-medium uppercase tracking-wider mt-[1px]"
            style={{ color: "#5a9999" }}
          >
            Real Estate
          </p>
        </div>
      </div>

      <nav className="flex-1 py-1 px-2 space-y-1">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p
              className="text-[8px] font-semibold uppercase tracking-[0.12em] px-3 pb-[2px]"
              style={{ color: "rgba(90,153,153,0.4)" }}
            >
              {section.label}
            </p>
            <div className="space-y-[1px]">
              {section.items.map((item) => (
                <NavItemComponent key={item.path} {...item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div
        className="flex items-center gap-2 px-3 py-1.5 border-t shrink-0"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
          style={{
            background: "rgba(246,206,58,0.12)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(246,206,58,0.25)",
            color: YELLOW,
            boxShadow: "0 0 12px rgba(246,206,58,0.1)",
          }}
        >
          {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-[9px] font-medium truncate"
            style={{ color: "#c0efef" }}
          >
            {user?.full_name || "User"}
          </p>
          <p
            className="text-[8px] truncate"
            style={{ color: "#5a9999" }}
          >
            {user?.role_name || user?.role || "User"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowSignOut(true)}
          className="w-[26px] h-[26px] rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors shrink-0"
          style={{ color: "#ef4444" }}
          title="Sign Out"
        >
          <i className="ti ti-logout" style={{ fontSize: "13px" }} />
        </button>
      </div>
      <div className="text-center pb-2 shrink-0">
        <p className="text-[8px] tracking-wider" style={{ color: "#3a7070" }}>
          POWERED BY <span style={{ color: "#14B8A6" }}>EYERCALL</span>
        </p>
      </div>
    </aside>
  ) : (
    <MiniSidebar user={user} onSignOut={() => setShowSignOut(true)} navSections={NAV_SECTIONS} />
  );

  return (
    <>
      {sidebar}
      {showSignOut && (
        <SignOutModal
          onConfirm={confirmSignOut}
          onCancel={() => setShowSignOut(false)}
        />
      )}
    </>
  );
}