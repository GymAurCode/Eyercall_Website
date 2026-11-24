import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  ChevronLeft,
  Eye,
  FileText,
  LayoutDashboard,
  Mail,
  MapPin,
  Menu,
  Moon,
  Search,
  Settings,
  Shield,
  SlidersHorizontal,
  Sun,
  Table2,
  UserCheck,
  Users,
  Wrench,
  X,
  Bot,
} from "lucide-react";

import { NAV, PAGE_TITLES, SECTION_ORDER, type NavModule } from "./data";
import { labelize } from "./ui";
import "./rems.css";

import DashboardModule from "./modules/DashboardModule";
import PropertyModule, { TownsModule } from "./modules/PropertyModule";
import CrmModule from "./modules/CrmModule";
import { MaintenanceModule, TenantsModule } from "./modules/OperationsModule";
import ConstructionModule from "./modules/ConstructionModule";
import HrModule from "./modules/HrModule";
import FinanceModule from "./modules/FinanceModule";
import ReportsModule from "./modules/ReportsModule";
import { AiModule, CommunicationModule, RemindersModule } from "./modules/ToolsModule";
import {
  AdminModule,
  HistoryModule,
  SettingsModule,
  SpreadsheetModule,
} from "./modules/SystemModule";

const BASE = "/software/eyerrems/demo";

const ICONS: Record<string, ReactNode> = {
  "layout-dashboard": <LayoutDashboard size={13} />,
  building: <Building2 size={13} />,
  "map-pin": <MapPin size={13} />,
  users: <Users size={13} />,
  "user-check": <UserCheck size={13} />,
  tool: <Wrench size={13} />,
  "building-skyscraper": <Building2 size={13} />,
  briefcase: <Briefcase size={13} />,
  "currency-dollar": (
    <span style={{ fontSize: 11, fontWeight: 700, width: 13, textAlign: "center" }}>$</span>
  ),
  file: <FileText size={13} />,
  table: <Table2 size={13} />,
  robot: <Bot size={13} />,
  mail: <Mail size={13} />,
  "bell-ringing": <Bell size={13} />,
  settings: <Settings size={13} />,
  shield: <Shield size={13} />,
};

function moduleForSegment(segment?: string): NavModule {
  if (!segment) return NAV[0]!;
  return NAV.find((m) => m.route === `/${segment}`) ?? NAV[0]!;
}

export default function EyerREMSDemo() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [light, setLight] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const segments = useMemo(() => {
    const rest = location.pathname.startsWith(BASE) ? location.pathname.slice(BASE.length) : "";
    return rest.split("/").filter(Boolean);
  }, [location.pathname]);

  const module = moduleForSegment(segments[0]);
  const tabs = module.tabs ?? [];
  const tabParam = segments[1];
  const tab = tabs.length
    ? tabs.some((t) => t.id === tabParam)
      ? tabParam!
      : (tabs[0]?.id ?? "")
    : module.id === "construction"
      ? (segments[1] ?? "")
      : "";
  const detailId =
    module.id === "towns" || module.id === "tenants"
      ? segments[1]
      : module.id === "construction"
        ? segments[2]
        : segments[2];
  const subTab = module.id === "towns" || module.id === "tenants" ? segments[2] : segments[3];
  const isReports = module.id === "reports";
  const reportModuleKey = isReports ? segments[1] : undefined;
  const reportTypeKey = isReports ? segments[2] : undefined;

  const go = (path: string) => navigate({ to: `${BASE}${path}` as never });
  const title =
    module.id === "dashboard" ? "Dashboard" : (PAGE_TITLES[module.route] ?? module.label);

  useEffect(() => {
    setSidebarOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const sections = SECTION_ORDER.map((section) => ({
    section,
    modules: NAV.filter((m) => m.section === section),
  })).filter((s) => s.modules.length > 0);

  return (
    <div className={`rms-root ${light ? "is-light" : ""}`}>
      {sidebarOpen && (
        <button
          type="button"
          className="rms-scrim"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`rms-sidebar ${sidebarOpen ? "is-open" : ""}`}
        aria-label="EyerREMS modules"
      >
        <div className="rms-brand">
          <span className="rms-brand-mark" aria-hidden>
            <Eye size={16} />
          </span>
          <div>
            <strong>EyerRems</strong>
            <small>Real Estate</small>
          </div>
        </div>

        <nav className="rms-nav">
          {sections.map(({ section, modules }) => (
            <div key={section} className="rms-nav-section">
              <p>{section}</p>
              <div className="rms-nav-list">
                {modules.map((item) => {
                  const active = item.id === module.id;
                  const target =
                    item.id === "dashboard"
                      ? "/"
                      : `${item.route}/${item.tabs?.[0]?.id ?? ""}`.replace(/\/$/, "");
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`rms-nav-link ${active ? "is-active" : ""}`}
                      aria-current={active ? "page" : undefined}
                      title={item.label}
                      onClick={() => go(target === "/" ? "" : target)}
                    >
                      {ICONS[item.icon] ?? <FileText size={13} />}
                      <span>{item.label}</span>
                      {active && <span className="rms-nav-dot" aria-hidden />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="rms-sidebar-footer">
          <div className="rms-user">
            <span className="rms-avatar" aria-hidden>
              D
            </span>
            <div>
              <strong>Demo Administrator</strong>
              <small>Read-only access</small>
            </div>
            <button
              type="button"
              className="rms-signout"
              title="Sign out is disabled in demo mode"
              aria-label="Sign out disabled"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </button>
          </div>
          <p className="rms-vendor">
            POWERED BY <b>EYERCALL</b>
          </p>
        </div>
      </aside>

      <div className="rms-frame">
        <header className="rms-topbar">
          <div className="rms-topbar-left">
            <button
              type="button"
              className="rms-icon-btn rms-mobile-toggle"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div className="rms-crumbs">
              <span>EyerREMS</span>
              <span aria-hidden>/</span>
              <strong>{title}</strong>
              {tab && module.id !== "dashboard" && !isReports && <span>· {labelize(tab)}</span>}
            </div>
          </div>

          <div className="rms-topbar-right">
            <label className="rms-top-search">
              <Search size={14} />
              <input
                type="search"
                placeholder="Search..."
                aria-label="Global search (decorative)"
              />
            </label>
            <button
              type="button"
              className="rms-icon-btn"
              title="Advance Options — unavailable in demo"
              aria-label="Advance options disabled"
              disabled
            >
              <SlidersHorizontal size={15} />
            </button>
            <button
              type="button"
              className="rms-icon-btn"
              title="Documentation — unavailable in demo"
              aria-label="Documentation disabled"
              disabled
            >
              <BookOpen size={15} />
            </button>
            <button
              type="button"
              className="rms-icon-btn"
              onClick={() => setLight((v) => !v)}
              title={`Switch to ${light ? "dark" : "light"} demo theme`}
              aria-label="Toggle demo theme"
            >
              {light ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="rms-icon-btn"
                onClick={() => setNotificationsOpen((v) => !v)}
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell size={15} />
              </button>
              {notificationsOpen && (
                <div
                  className="rms-card"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 34,
                    width: 270,
                    zIndex: 20,
                    boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <strong style={{ fontSize: 11 }}>Notifications</strong>
                    <button
                      type="button"
                      className="rms-icon-btn"
                      onClick={() => setNotificationsOpen(false)}
                      aria-label="Close notifications"
                    >
                      <X size={13} />
                    </button>
                  </div>
                  <ul className="rms-list">
                    <li>
                      <div className="rms-list-main">
                        <strong>Lease expiring soon</strong>
                        <span>Fictional Tenant C · 6 days</span>
                      </div>
                    </li>
                    <li>
                      <div className="rms-list-main">
                        <strong>Overdue installment</strong>
                        <span>Fictional Client B · PKR 450,000</span>
                      </div>
                    </li>
                    <li>
                      <div className="rms-list-main">
                        <strong>Work order assigned</strong>
                        <span>MNT-0014 · AC repair</span>
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <Link
              to="/software/$slug"
              params={{ slug: "eyerrems" }}
              className="rms-linked-pill"
              title="Back to the Eyercall software page"
            >
              <ChevronLeft size={12} /> Back to Eyercall
            </Link>
          </div>
        </header>

        <div
          className="rms-notice"
          style={{ borderRadius: 0, borderWidth: "0 0 1px", justifyContent: "center" }}
        >
          <AlertTriangle size={13} />
          <span>Demo Mode — Read Only</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span style={{ opacity: 0.75 }}>
            Write operations are restricted · all records are fictional
          </span>
        </div>

        <main className="rms-main">
          <div className="rms-main-inner">
            <ModuleRenderer
              module={module}
              tab={tab}
              detailId={detailId}
              subTab={subTab}
              reportModuleKey={reportModuleKey}
              reportTypeKey={reportTypeKey}
              onNavigate={go}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function ModuleRenderer({
  module,
  tab,
  detailId,
  subTab,
  reportModuleKey,
  reportTypeKey,
  onNavigate,
}: {
  module: NavModule;
  tab: string;
  detailId?: string | undefined;
  subTab?: string | undefined;
  reportModuleKey?: string | undefined;
  reportTypeKey?: string | undefined;
  onNavigate: (path: string) => void;
}) {
  switch (module.id) {
    case "dashboard":
      return <DashboardModule module={module} />;
    case "property":
      return (
        <PropertyModule module={module} tab={tab} detailId={detailId} onNavigate={onNavigate} />
      );
    case "towns":
      return (
        <TownsModule
          module={module}
          detailId={detailId}
          subTab={subTab}
          onNavigate={(path) => onNavigate(path)}
        />
      );
    case "crm":
      return <CrmModule module={module} tab={tab} detailId={detailId} onNavigate={onNavigate} />;
    case "tenants":
      return <TenantsModule module={module} detailId={detailId} onNavigate={onNavigate} />;
    case "maintenance":
      return <MaintenanceModule />;
    case "construction":
      return (
        <ConstructionModule
          module={module}
          tab={tab}
          detailId={detailId}
          subTab={subTab}
          onNavigate={onNavigate}
        />
      );
    case "hr":
      return <HrModule module={module} tab={tab} onNavigate={onNavigate} />;
    case "finance":
      return <FinanceModule module={module} tab={tab} onNavigate={onNavigate} />;
    case "reports":
      return (
        <ReportsModule
          module={module}
          tab={reportModuleKey ?? ""}
          detailId={reportTypeKey}
          onNavigate={onNavigate}
        />
      );
    case "ai":
      return <AiModule module={module} tab={tab} onNavigate={onNavigate} />;
    case "communication":
      return <CommunicationModule module={module} tab={tab} onNavigate={onNavigate} />;
    case "reminders":
      return <RemindersModule module={module} tab={tab} onNavigate={onNavigate} />;
    case "spreadsheet":
      return <SpreadsheetModule />;
    case "settings":
      return <SettingsModule module={module} tab={tab} onNavigate={onNavigate} />;
    case "admin":
      return <AdminModule module={module} tab={tab} onNavigate={onNavigate} />;
    default:
      return <HistoryModule />;
  }
}

export { HistoryModule };
