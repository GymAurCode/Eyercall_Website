/**
 * Deterministic fictional data for the read-only EyerREMS replica.
 *
 * Field names mirror the real frontend interfaces found in
 * Eyerrems-desktop/frontend/src (crmApi.ts, propertyApi.ts, financeApi.ts,
 * hrApi.ts, constructionApi.ts, ...). No production data is used.
 */

export type StatusTone = "blue" | "green" | "amber" | "red" | "violet" | "slate" | "teal";

export type NavModule = {
  id: string;
  label: string;
  icon: string;
  route: string;
  section: "Main" | "Manage" | "Stock Ops" | "Tools" | "System";
  tabs?: { id: string; label: string }[];
};

export const NAV: NavModule[] = [
  { id: "dashboard", label: "Dashboard", icon: "layout-dashboard", route: "/", section: "Main" },
  {
    id: "property",
    label: "Properties",
    icon: "building",
    route: "/property",
    section: "Main",
    tabs: [
      { id: "properties", label: "Properties" },
      { id: "units", label: "Units" },
      { id: "lease", label: "Lease" },
      { id: "sales", label: "Sales" },
      { id: "buyers", label: "Buyers" },
      { id: "sellers", label: "Sellers" },
    ],
  },
  { id: "towns", label: "Towns", icon: "map-pin", route: "/towns", section: "Main" },
  {
    id: "crm",
    label: "CRM",
    icon: "users",
    route: "/crm",
    section: "Main",
    tabs: [
      { id: "dashboard", label: "Dashboard" },
      { id: "leads", label: "Leads" },
      { id: "clients", label: "Clients" },
      { id: "dealers", label: "Dealers" },
      { id: "deals", label: "Deals" },
      { id: "bookings", label: "Bookings" },
      { id: "follow-ups", label: "Follow Ups" },
      { id: "site-visits", label: "Site Visits" },
      { id: "payments", label: "Payments" },
    ],
  },
  { id: "tenants", label: "Tenants", icon: "user-check", route: "/tenants", section: "Main" },
  { id: "maintenance", label: "Maintenance", icon: "tool", route: "/maintenance", section: "Main" },
  {
    id: "construction",
    label: "Construction",
    icon: "building-skyscraper",
    route: "/construction",
    section: "Main",
  },
  {
    id: "hr",
    label: "HR",
    icon: "briefcase",
    route: "/hr",
    section: "Manage",
    tabs: [
      { id: "dashboard", label: "Dashboard" },
      { id: "employees", label: "Employees" },
      { id: "attendance", label: "Attendance" },
      { id: "leaves", label: "Leaves" },
      { id: "payroll", label: "Payroll" },
      { id: "performance", label: "Performance" },
      { id: "setup", label: "Setup" },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    icon: "currency-dollar",
    route: "/finance",
    section: "Manage",
    tabs: [
      { id: "dashboard", label: "Dashboard" },
      { id: "accounts", label: "Accounts" },
      { id: "journals", label: "Journals" },
      { id: "invoices", label: "Invoices" },
      { id: "payments", label: "Payments" },
      { id: "bank", label: "Bank" },
      { id: "cash", label: "Cash" },
      { id: "commissions", label: "Commissions" },
      { id: "expenses", label: "Expenses" },
      { id: "ledger", label: "Ledger" },
      { id: "reports", label: "Reports" },
      { id: "operations", label: "Operations" },
    ],
  },
  { id: "reports", label: "Reports", icon: "file", route: "/reports", section: "Manage" },
  {
    id: "spreadsheet",
    label: "Spreadsheet",
    icon: "table",
    route: "/spreadsheet",
    section: "Stock Ops",
  },
  {
    id: "ai",
    label: "AI Intel",
    icon: "robot",
    route: "/ai",
    section: "Tools",
    tabs: [
      { id: "dashboard", label: "Dashboard" },
      { id: "anomalies", label: "Anomalies" },
      { id: "alerts", label: "Alerts" },
      { id: "risk", label: "Risk Scores" },
      { id: "duplicates", label: "Duplicates" },
      { id: "audit", label: "Audit Monitor" },
      { id: "query", label: "AI Query" },
      { id: "insights", label: "Insights" },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    icon: "mail",
    route: "/communication",
    section: "Tools",
    tabs: [
      { id: "email", label: "Email" },
      { id: "whatsapp", label: "WhatsApp" },
      { id: "calls", label: "Calls" },
      { id: "chat", label: "Chat" },
    ],
  },
  {
    id: "reminders",
    label: "Reminders",
    icon: "bell-ringing",
    route: "/reminders",
    section: "Tools",
    tabs: [
      { id: "dashboard", label: "Dashboard" },
      { id: "my", label: "My Reminders" },
      { id: "calendar", label: "Calendar" },
      { id: "stats", label: "Stats" },
      { id: "templates", label: "Templates" },
      { id: "logs", label: "Logs" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: "settings",
    route: "/settings",
    section: "System",
    tabs: [
      { id: "general", label: "General" },
      { id: "backup", label: "Backup & Restore" },
      { id: "recycle-bin", label: "Recycle Bin" },
      { id: "mobile-sync", label: "Mobile Sync" },
    ],
  },
  {
    id: "admin",
    label: "Admin",
    icon: "shield",
    route: "/admin",
    section: "System",
    tabs: [
      { id: "detail", label: "Detail" },
      { id: "roles", label: "Roles" },
      { id: "users", label: "Users" },
      { id: "audit-logs", label: "Audit Logs" },
    ],
  },
];

export const SECTION_ORDER: NavModule["section"][] = [
  "Main",
  "Manage",
  "Stock Ops",
  "Tools",
  "System",
];

/* ── row shapes for the derived demo datasets ── */

export type ProjectTask = {
  id: number;
  task_number: string;
  name: string;
  phase_name: string;
  priority: string;
  status: string;
  estimated_cost: number;
  start_date: string;
  end_date: string;
  progress_pct: number;
};
export type ProjectBudgetRow = { key: string; label: string; budgeted: number; spent: number };
export type ProjectResource = {
  id: number;
  name: string;
  category: string;
  availability: string;
  unit_cost: number;
  current_stock: number;
};
export type ProjectProcurement = {
  id: number;
  pr_number: string;
  po_number: string;
  title: string;
  vendor_name: string;
  status: string;
  total_amount: number;
  received_date: string;
};
export type ProjectQuality = {
  id: number;
  inspection_type: string;
  inspection_date: string;
  inspector_name: string;
  result: string;
  status: string;
};
export type ProjectSafety = {
  id: number;
  incident_type: string;
  title: string;
  incident_date: string;
  severity: string;
  status: string;
  corrective_action: string;
};
export type ProjectDocument = {
  id: number;
  name: string;
  folder: string;
  tags: string;
  created_at: string;
};
export type ProjectTimelineEntry = {
  id: number;
  type: string;
  title: string;
  detail: string;
  date: string;
};

export type AttendanceRow = {
  id: number;
  employee_name: string;
  department: string;
  date: string;
  check_in: string;
  check_out: string;
  status: string;
};
export type LeaveRow = {
  id: number;
  leave_id: string;
  employee_name: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  days: number;
  status: string;
};
export type PayrollRow = {
  id: number;
  payroll_id: string;
  employee_name: string;
  department: string;
  basic_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  month: string;
  status: string;
};
export type PerformanceRow = {
  id: number;
  employee_name: string;
  department: string;
  review_period: string;
  rating: number;
  goals_met: number;
  reviewer: string;
  status: string;
};

export type Account = {
  id: number;
  code: string;
  account_name: string;
  account_type: string;
  balance: number;
  is_active: boolean;
};
export type Journal = {
  id: number;
  journal_id: string;
  date: string;
  reference: string;
  description: string;
  debit_account: string;
  credit_account: string;
  amount: number;
  status: string;
};
export type Invoice = {
  id: number;
  invoice_no: string;
  client_name: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  paid_amount: number;
  status: string;
};
export type FinancePayment = {
  id: number;
  payment_id: string;
  date: string;
  payer: string;
  invoice_no: string;
  amount: number;
  method: string;
  status: string;
};
export type BankAccount = {
  id: number;
  bank_name: string;
  account_title: string;
  account_number: string;
  branch: string;
  balance: number;
  status: string;
};
export type CashAccount = {
  id: number;
  name: string;
  custodian: string;
  balance: number;
  last_reconciled: string;
  status: string;
};
export type Commission = {
  id: number;
  dealer_name: string;
  deal_code: string;
  property_name: string;
  sale_amount: number;
  commission_rate: number;
  amount: number;
  payment_status: string;
  date: string;
};
export type Expense = {
  id: number;
  account_code: string;
  account_name: string;
  description: string;
  amount: number;
  date: string;
  payment_method: string;
  status: string;
};
export type LedgerRow = {
  id: number;
  entry_id: string;
  date: string;
  account: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  reference: string;
};

export type Reminder = {
  id: number;
  reminder_id: string;
  title: string;
  category: string;
  due_date: string;
  due_time: string;
  priority: string;
  status: string;
  assigned_to: string;
};
export type ReminderTemplate = {
  id: number;
  name: string;
  channel: string;
  trigger: string;
  active: boolean;
};
export type ReminderLog = {
  id: number;
  sent_at: string;
  template: string;
  recipient: string;
  channel: string;
  status: string;
};

export type Anomaly = {
  id: number;
  anomaly_type: string;
  severity: string;
  module: string;
  description: string;
  risk_score: number;
  user_id: number | null;
  created_at: string;
};
export type RiskScore = {
  id: number;
  subject_id: number;
  subject_type: string;
  risk_level: string;
  score: number;
  last_computed: string;
};
export type DuplicateRow = {
  id: number;
  entity: string;
  primary_record: string;
  duplicate_record: string;
  match_score: number;
  status: string;
};
export type AiInsight = { id: number; title: string; detail: string; tone: string };

export type InboxMessage = {
  id: number;
  from: string;
  subject: string;
  preview: string;
  date: string;
  unread: boolean;
  channel: string;
};
export type WhatsappThread = {
  id: number;
  contact: string;
  phone: string;
  last_message: string;
  time: string;
  unread: boolean;
};
export type CallLog = {
  id: number;
  direction: string;
  contact: string;
  number: string;
  duration: string;
  date: string;
  status: string;
};
export type ChatThread = {
  id: number;
  team: string;
  last_message: string;
  time: string;
  unread: boolean;
};

export type Role = {
  id: number;
  name: string;
  description: string;
  users: number;
  permissions: number;
};
export type User = {
  id: number;
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  last_login: string;
};
export type AuditLog = {
  id: number;
  created_at: string;
  user: string;
  role: string;
  module: string;
  action: string;
  entity: string;
  description: string;
  status: string;
  ip: string;
};
export type Sheet = {
  id: number;
  sheet_id: string;
  sheet: string;
  owner: string;
  rows: number;
  columns: number;
  updated: string;
  status: string;
};
export type RecycleBinRow = {
  id: number;
  record: string;
  module: string;
  deleted_by: string;
  deleted_at: string;
  size: string;
};

export const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/property": "Properties",
  "/towns": "Town Management",
  "/crm": "CRM",
  "/tenants": "Tenants",
  "/maintenance": "Maintenance",
  "/construction": "Construction",
  "/hr": "Human Resources",
  "/finance": "Finance",
  "/reports": "Reports",
  "/spreadsheet": "Spreadsheet",
  "/ai": "AI Intelligence",
  "/communication": "Communication",
  "/reminders": "Reminders & Notifications",
  "/settings": "Settings",
  "/admin": "Administration",
};

/* ────────────────────────── helpers ────────────────────────── */

const pad = (n: number, size = 4) => String(n).padStart(size, "0");
const day = (offset: number) => {
  const base = new Date(Date.UTC(2026, 10, 22));
  base.setUTCDate(base.getUTCDate() - offset);
  return base.toISOString().slice(0, 10);
};

export const fmtMoney = (n: number) =>
  `PKR ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n)}`;
export const fmtShortMoney = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `PKR ${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `PKR ${(n / 1_000).toFixed(0)}K`;
  return fmtMoney(n);
};
export const fmtDate = (d: string) => {
  const date = new Date(d);
  return Number.isNaN(date.getTime())
    ? d
    : date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
};

const pick = <T>(arr: T[], i: number): T => arr[i % arr.length]!;

/* ────────────────────────── properties ────────────────────────── */

const TOWNS = [
  "Bahria Town",
  "DHA Phase 6",
  "Gulberg",
  "Model Town",
  "Johar Town",
  "Askari 11",
  "Faisal Town",
  "Wapda Town",
];
const AREAS = ["Block A", "Block B", "Block C", "Sector 1", "Sector 2", "Phase 1", "Phase 2"];
const PROPERTY_NAMES = [
  "Cedar Court Residency",
  "Emerald Heights",
  "Palm Grove Apartments",
  "Silver Oak Villas",
  "Marina View Plaza",
  "Golden Sand Enclave",
  "Orchid Garden Homes",
  "Blue Bell Towers",
  "Sunset Boulevard",
  "Maple Leaf Residency",
  "Harmony Square",
  "Lake View Estate",
];

export type Property = {
  id: number;
  property_id: string;
  name: string;
  town: string;
  area: string;
  type: string;
  status: string;
  units: number;
  occupied_units: number;
  vacant_units: number;
  monthly_rent: number;
  purchase_price: number;
  owner_name: string;
  address: string;
  created_at: string;
};

export const properties: Property[] = PROPERTY_NAMES.map((name, i) => {
  const units = 6 + (i % 5) * 4;
  const occupied = Math.max(2, units - ((i % 4) + 1));
  return {
    id: i + 1,
    property_id: `PRP-${pad(i + 1)}`,
    name,
    town: pick(TOWNS, i),
    area: pick(AREAS, i + 2),
    type: pick(["Apartment", "House", "Commercial", "Plot", "Villa"], i),
    status: i % 7 === 0 ? "Under Construction" : "Active",
    units,
    occupied_units: occupied,
    vacant_units: units - occupied,
    monthly_rent: 180_000 + i * 35_000,
    purchase_price: 12_000_000 + i * 2_500_000,
    owner_name: pick(
      ["Ahmed Raza", "Sana Malik", "Bilal Hussain", "Nadia Iqbal", "Usman Tariq"],
      i,
    ),
    address: `${pick(TOWNS, i)}, ${pick(AREAS, i)}`,
    created_at: day(40 + i * 9),
  };
});

export type Unit = {
  id: number;
  unit_id: string;
  property_name: string;
  unit_number: string;
  floor: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  rent: number;
  status: string;
  tenant_name: string | null;
};

export const units: Unit[] = properties.flatMap((p, pi) =>
  Array.from({ length: 4 }, (_, ui) => {
    const occupied = ui < Math.min(4, Math.max(1, Math.round(p.occupied_units / 2)));
    return {
      id: pi * 10 + ui + 1,
      unit_id: `UNT-${pad(pi * 10 + ui + 1)}`,
      property_name: p.name,
      unit_number: `${String.fromCharCode(65 + (ui % 3))}-${ui + 1}0${pi + 1}`,
      floor: (ui % 4) + 1,
      type: pick(["2 Bed Apartment", "3 Bed Apartment", "Studio", "Penthouse"], ui),
      bedrooms: 2 + (ui % 2),
      bathrooms: 2 + (ui % 3 === 0 ? 0 : 1),
      area_sqft: 900 + ui * 260,
      rent: 65_000 + ui * 22_000 + pi * 4_000,
      status: occupied ? "Occupied" : "Vacant",
      tenant_name: occupied
        ? pick(
            [
              "Fictional Tenant A",
              "Fictional Tenant B",
              "Fictional Tenant C",
              "Fictional Tenant D",
            ],
            pi + ui,
          )
        : null,
    };
  }),
);

export type Lease = {
  id: number;
  lease_id: string;
  tenant_name: string;
  unit_number: string;
  property_name: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  security_deposit: number;
  status: string;
};

export const leases: Lease[] = units
  .filter((u) => u.status === "Occupied")
  .slice(0, 18)
  .map((u, i) => ({
    id: i + 1,
    lease_id: `LSE-${pad(i + 1)}`,
    tenant_name: u.tenant_name ?? "Fictional Tenant",
    unit_number: u.unit_number,
    property_name: u.property_name,
    start_date: day(120 + i * 15),
    end_date: day(-(60 + i * 15)),
    monthly_rent: u.rent,
    security_deposit: u.rent * 2,
    status: i % 9 === 0 ? "Expiring" : "Active",
  }));

export type Sale = {
  id: number;
  sale_id: string;
  property_name: string;
  unit_number: string;
  buyer_name: string;
  sale_price: number;
  paid_amount: number;
  sale_date: string;
  status: string;
};

export const sales: Sale[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  sale_id: `SAL-${pad(i + 1)}`,
  property_name: pick(PROPERTY_NAMES, i + 1),
  unit_number: `${String.fromCharCode(65 + (i % 3))}-20${i + 1}`,
  buyer_name: pick(
    ["Fictional Buyer A", "Fictional Buyer B", "Fictional Buyer C", "Fictional Buyer D"],
    i,
  ),
  sale_price: 8_500_000 + i * 1_250_000,
  paid_amount: 3_000_000 + i * 600_000,
  sale_date: day(30 + i * 17),
  status: pick(["Completed", "In Progress", "Pending", "Completed"], i),
}));

export type Party = {
  id: number;
  party_id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  interest: string;
  budget: number;
  status: string;
};

const PARTY_NAMES = [
  "Fictional Buyer A",
  "Fictional Buyer B",
  "Fictional Seller C",
  "Fictional Buyer D",
  "Fictional Seller E",
  "Fictional Buyer F",
  "Fictional Seller G",
  "Fictional Buyer H",
];

export const buyers: Party[] = PARTY_NAMES.slice(0, 6).map((name, i) => ({
  id: i + 1,
  party_id: `BUY-${pad(i + 1)}`,
  name,
  phone: `+92 300 1000${pad(i + 1, 3)}`,
  email: `buyer${i + 1}@demo.example`,
  city: pick(TOWNS, i),
  interest: pick(["2 Bed Apartment", "Villa", "Commercial", "Plot"], i),
  budget: 6_000_000 + i * 1_400_000,
  status: pick(["Active", "Negotiating", "Closed", "Active"], i),
}));

export const sellers: Party[] = PARTY_NAMES.slice(2).map((name, i) => ({
  id: i + 1,
  party_id: `SEL-${pad(i + 1)}`,
  name,
  phone: `+92 301 2000${pad(i + 1, 3)}`,
  email: `seller${i + 1}@demo.example`,
  city: pick(TOWNS, i + 3),
  interest: pick(PROPERTY_NAMES, i),
  budget: 9_000_000 + i * 1_900_000,
  status: pick(["Active", "Under Offer", "Closed", "Active"], i),
}));

/* ────────────────────────── towns ────────────────────────── */

export type Town = {
  id: number;
  tid: string;
  name: string;
  location: string;
  block_count: number;
  plot_count: number;
  property_count: number;
  units: number;
  status: string;
};

export const towns: Town[] = TOWNS.map((name, i) => ({
  id: i + 1,
  tid: `TWN-${pad(i + 1)}`,
  name,
  location: `${name}, Lahore`,
  block_count: 4 + i,
  plot_count: 120 + i * 36,
  property_count: 3 + (i % 5),
  units: 24 + i * 9,
  status: "Active",
}));

export const townBlocks = (town: Town) =>
  Array.from({ length: town.block_count }, (_, i) => ({
    id: i + 1,
    block: `Block ${String.fromCharCode(65 + i)}`,
    plots: 24 + i * 6,
    sold: 14 + i * 3,
    available: 10 + i * 3,
    status: i === 1 ? "Under Development" : "Active",
  }));

/* ────────────────────────── CRM ────────────────────────── */

const LEAD_SOURCES = ["Walk-in", "Facebook", "Website", "Referral", "WhatsApp", "Property Portal"];
const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "site_visit",
  "negotiation",
  "converted",
  "lost",
];

export type Lead = {
  id: number;
  lead_id: string;
  tracking_id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  status: string;
  priority: string;
  assigned_to: string;
  interest: string;
  budget: number;
  created_at: string;
};

export const leads: Lead[] = Object.freeze(
  Array.from({ length: 24 }, (_, i) =>
    Object.freeze({
      id: i + 1,
      lead_id: `LD-${pad(i + 1)}`,
      tracking_id: `TRK-${pad(9200 + i)}`,
      name: `Fictional Lead ${String.fromCharCode(65 + (i % 26))}${i + 1}`,
      phone: `+92 321 4000${pad(i + 1, 3)}`,
      email: `lead${i + 1}@demo.example`,
      source: pick(LEAD_SOURCES, i),
      status: pick(LEAD_STATUSES, i),
      priority: pick(["High", "Medium", "Low"], i),
      assigned_to: pick(["Sara Khan", "Ali Raza", "Hina Shah", "Bilal Ahmed"], i),
      interest: pick(["2 Bed Apartment", "3 Bed Apartment", "Villa", "Commercial Unit", "Plot"], i),
      budget: 5_000_000 + i * 320_000,
      created_at: day(i * 3),
    }),
  ),
) as Lead[];

export type Client = {
  id: number;
  client_id: string;
  tracking_id: string;
  name: string;
  phone: string;
  email: string;
  type: string;
  city: string;
  status: string;
  total_deals: number;
  created_at: string;
};

export const clients: Client[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  client_id: `CL-${pad(i + 1)}`,
  tracking_id: `TRK-${pad(8100 + i)}`,
  name: `Fictional Client ${String.fromCharCode(65 + i)}`,
  phone: `+92 322 5000${pad(i + 1, 3)}`,
  email: `client${i + 1}@demo.example`,
  type: pick(["Buyer", "Seller", "Investor", "Tenant"], i),
  city: pick(TOWNS, i),
  status: pick(["active", "active", "inactive", "active"], i),
  total_deals: 1 + (i % 4),
  created_at: day(80 + i * 7),
}));

export type Dealer = {
  id: number;
  dealer_id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  city: string;
  commission_rate: number;
  commission_type: string;
  status: string;
  total_deals: number;
};

export const dealers: Dealer[] = Array.from({ length: 7 }, (_, i) => ({
  id: i + 1,
  dealer_id: `DL-${pad(i + 1)}`,
  name: `Fictional Dealer ${String.fromCharCode(65 + i)}`,
  company: pick(
    ["Skyline Estates", "Prime Realtors", "Metro Property Hub", "Landmark Associates"],
    i,
  ),
  phone: `+92 333 6000${pad(i + 1, 3)}`,
  email: `dealer${i + 1}@demo.example`,
  city: pick(TOWNS, i),
  commission_rate: 1 + (i % 3),
  commission_type: "percentage",
  status: i === 6 ? "inactive" : "active",
  total_deals: i + 2,
}));

export type Deal = {
  id: number;
  deal_id: string;
  tracking_id: string;
  deal_title: string;
  client_name: string;
  dealer_name: string | null;
  property_name: string;
  deal_value: number;
  paid_amount: number;
  status: string;
  stage: string;
  created_at: string;
};

export const deals: Deal[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  deal_id: `D-${pad(i + 1)}`,
  tracking_id: `TRK-${pad(7100 + i)}`,
  deal_title: `${pick(["2 Bed", "3 Bed", "Penthouse", "Commercial"], i)} unit at ${pick(PROPERTY_NAMES, i)}`,
  client_name: pick(clients, i).name,
  dealer_name: i % 3 === 0 ? pick(dealers, i).name : null,
  property_name: pick(PROPERTY_NAMES, i),
  deal_value: 7_500_000 + i * 980_000,
  paid_amount: 2_000_000 + i * 420_000,
  status: pick(["open", "won", "open", "lost", "won", "open"], i),
  stage: pick(["Qualification", "Proposal", "Negotiation", "Closed Won", "Closed Lost"], i),
  created_at: day(20 + i * 8),
}));

export type Booking = {
  id: number;
  booking_id: string;
  client_name: string;
  property_name: string;
  unit_number: string;
  booking_amount: number;
  booking_date: string;
  expiry_date: string;
  status: string;
  is_expired: boolean;
};

export const bookings: Booking[] = Array.from({ length: 12 }, (_, i) => {
  const status = pick(
    ["pending", "reserved", "confirmed", "cancelled", "expired", "converted_to_sale"],
    i,
  );
  return {
    id: i + 1,
    booking_id: `BK-${pad(i + 1)}`,
    client_name: pick(clients, i).name,
    property_name: pick(PROPERTY_NAMES, i),
    unit_number: `${String.fromCharCode(65 + (i % 3))}-10${i + 1}`,
    booking_amount: 250_000 + i * 40_000,
    booking_date: day(15 + i * 4),
    expiry_date: day(-(5 + i * 2)),
    status,
    is_expired: status === "expired",
  };
});

export type FollowUp = {
  id: number;
  followup_id: string;
  contact_name: string;
  subject: string;
  channel: string;
  owner: string;
  due_date: string;
  priority: string;
  status: string;
};

export const followUps: FollowUp[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  followup_id: `FU-${pad(i + 1)}`,
  contact_name: pick(leads, i).name,
  subject: pick(
    [
      "Call about site visit",
      "Send payment plan",
      "Confirm booking",
      "Share floor plans",
      "Discuss price",
    ],
    i,
  ),
  channel: pick(["Phone", "WhatsApp", "Email", "Meeting"], i),
  owner: pick(["Sara Khan", "Ali Raza", "Hina Shah"], i),
  due_date: day(-(i - 3)),
  priority: pick(["High", "Medium", "Low"], i),
  status: pick(["pending", "completed", "overdue"], i),
}));

export type SiteVisit = {
  id: number;
  visit_id: string;
  client_name: string;
  property_name: string;
  agent: string;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
};

export const siteVisits: SiteVisit[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  visit_id: `SV-${pad(i + 1)}`,
  client_name: pick(clients, i).name,
  property_name: pick(PROPERTY_NAMES, i),
  agent: pick(["Sara Khan", "Ali Raza", "Hina Shah"], i),
  scheduled_date: day(-(i - 2)),
  scheduled_time: pick(["10:00 AM", "12:30 PM", "03:00 PM", "05:15 PM"], i),
  status: pick(["scheduled", "completed", "cancelled", "scheduled"], i),
}));

export type CrmPayment = {
  id: number;
  payment_id: string;
  payer: string;
  deal_id: string;
  amount: number;
  method: string;
  payment_date: string;
  status: string;
};

export const crmPayments: CrmPayment[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  payment_id: `PAY-${pad(i + 1)}`,
  payer: pick(clients, i).name,
  deal_id: pick(deals, i).deal_id,
  amount: 450_000 + i * 90_000,
  method: pick(["Bank Transfer", "Cash", "Cheque", "Online"], i),
  payment_date: day(6 + i * 5),
  status: pick(["verified", "pending", "verified", "rejected"], i),
}));

export const crmDashboard = {
  stats: {
    total_leads: 248,
    new_leads: 37,
    active_clients: 96,
    total_deals: 64,
    won_deals: 28,
    lost_deals: 11,
    total_bookings: 42,
    revenue: 148_600_000,
    pending_revenue: 36_250_000,
    overdue_installments: 14,
    avg_lead_age: 12,
  },
  conversion_funnel: [
    { stage: "New", count: 248 },
    { stage: "Contacted", count: 186 },
    { stage: "Qualified", count: 112 },
    { stage: "Site Visit", count: 74 },
    { stage: "Negotiation", count: 43 },
    { stage: "Converted", count: 28 },
  ],
  lead_source_distribution: LEAD_SOURCES.map((source, i) => ({
    source,
    count: [62, 48, 39, 31, 42, 26][i]!,
  })),
  recent_activities: [
    {
      action: "payment_received",
      description: "Payment received for Deal D-0004",
      created_at: "2026-11-22T09:12:00Z",
    },
    {
      action: "lead_created",
      description: "New lead created from Website",
      created_at: "2026-11-22T08:41:00Z",
    },
    {
      action: "visit_scheduled",
      description: "Site visit scheduled for Fictional Client B",
      created_at: "2026-11-21T15:20:00Z",
    },
    {
      action: "deal_won",
      description: "Deal won at Emerald Heights",
      created_at: "2026-11-21T11:05:00Z",
    },
    {
      action: "followup_completed",
      description: "Call follow-up completed",
      created_at: "2026-11-20T13:34:00Z",
    },
    {
      action: "booking_created",
      description: "New booking created for Unit B-102",
      created_at: "2026-11-20T10:02:00Z",
    },
  ],
};

/* ────────────────────────── tenants & maintenance ────────────────────────── */

export type Tenant = {
  id: number;
  tenant_id: string;
  name: string;
  phone: string;
  email: string;
  property_name: string;
  unit_number: string;
  lease_start: string;
  lease_end: string;
  monthly_rent: number;
  is_active: boolean;
  created_at: string;
};

export const tenants: Tenant[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  tenant_id: `TN-${pad(i + 1)}`,
  name: `Fictional Tenant ${String.fromCharCode(65 + i)}`,
  phone: `+92 345 7000${pad(i + 1, 3)}`,
  email: `tenant${i + 1}@demo.example`,
  property_name: pick(PROPERTY_NAMES, i),
  unit_number: `${String.fromCharCode(65 + (i % 3))}-10${i + 1}`,
  lease_start: day(240 - i * 10),
  lease_end: day(-(120 - i * 8)),
  monthly_rent: 70_000 + i * 9_000,
  is_active: i % 6 !== 0,
  created_at: day(250 + i * 6),
}));

export type Maintenance = {
  id: number;
  request_id: string;
  date: string;
  property_name: string;
  unit_number: string | null;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  assigned_name: string | null;
  estimated_cost: number;
  actual_cost: number;
  tenant_name: string | null;
};

export const maintenance: Maintenance[] = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  request_id: `MNT-${pad(i + 1)}`,
  date: day(i * 2),
  property_name: pick(PROPERTY_NAMES, i),
  unit_number: i % 4 === 0 ? null : `${String.fromCharCode(65 + (i % 3))}-10${i + 1}`,
  title: pick(
    [
      "Leaking kitchen pipe",
      "Air conditioner not cooling",
      "Electrical socket replacement",
      "Water tank cleaning",
      "Lobby light repair",
      "Broken window pane",
      "Lift maintenance",
      "Garden irrigation repair",
    ],
    i,
  ),
  description:
    "Reported by the tenant through the maintenance portal and verified by the facilities supervisor.",
  category: pick(
    ["plumbing", "hvac", "electrical", "cleaning", "repair", "security", "preventive"],
    i,
  ),
  priority: pick(["normal", "high", "low", "urgent"], i),
  status: pick(["pending", "assigned", "in_progress", "completed", "cancelled"], i),
  assigned_name: i % 5 === 0 ? null : pick(["Imran Aslam", "Faisal Mehmood", "Zubair Ali"], i),
  estimated_cost: 8_000 + i * 2_500,
  actual_cost: i % 3 === 0 ? 0 : 7_500 + i * 2_200,
  tenant_name: i % 4 === 0 ? null : pick(tenants, i).name,
}));

/* ────────────────────────── construction ────────────────────────── */

export type Project = {
  id: number;
  project_id: string;
  code: string;
  name: string;
  location: string;
  client_name: string;
  manager: string;
  status: string;
  current_phase: string;
  total_budget: number;
  actual_cost: number;
  progress_percentage: number;
  start_date: string;
  end_date: string;
  description: string;
};

export const projects: Project[] = Array.from({ length: 7 }, (_, i) => ({
  id: i + 1,
  project_id: `CNS-${pad(i + 1)}`,
  code: `PRJ-${2026}${pad(i + 1, 2)}`,
  name: `${pick(["Emerald Heights", "Cedar Court", "Palm Grove", "Blue Bell", "Harmony Square", "Lake View", "Sunset Boulevard"], i)} Extension`,
  location: `${pick(TOWNS, i)}, Lahore`,
  client_name: pick(["Meridian Developers", "Eyercall Holdings", "North Star Estates"], i),
  manager: pick(["Engr. Kamran", "Engr. Adnan", "Engr. Farhan"], i),
  status: pick(["active", "planning", "active", "on_hold", "completed", "active", "planning"], i),
  current_phase: pick(
    [
      "execution",
      "planning",
      "procurement",
      "quality_inspection",
      "completion",
      "execution",
      "budget_approval",
    ],
    i,
  ),
  total_budget: 45_000_000 + i * 12_500_000,
  actual_cost: 18_000_000 + i * 7_200_000,
  progress_percentage: 22 + i * 11 > 100 ? 96 : 22 + i * 11,
  start_date: day(220 - i * 20),
  end_date: day(-(120 + i * 30)),
  description:
    "Mixed-use residential and commercial development with basement parking, retail podium, and rooftop amenity deck.",
}));

export const projectTasks: ProjectTask[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  task_number: `T-${pad(i + 1, 3)}`,
  name: pick(
    [
      "Site excavation and levelling",
      "Foundation and raft concreting",
      "Ground floor columns",
      "First floor slab",
      "Brickwork — typical floors",
      "Electrical conduits",
      "Plumbing rough-in",
      "Facade glazing installation",
      "Lift shaft construction",
      "Landscaping",
    ],
    i,
  ),
  phase_name: pick(["Planning", "Execution", "Procurement", "Execution"], i),
  priority: pick(["critical", "high", "medium", "low"], i),
  status: pick(["completed", "in_progress", "pending", "blocked"], i),
  estimated_cost: 1_200_000 + i * 260_000,
  start_date: day(90 - i * 5),
  end_date: day(-(40 - i * 2)),
  progress_pct: Math.min(100, 15 + i * 6),
}));

export const projectBudget: ProjectBudgetRow[] = [
  { key: "material_cost", label: "Material Budget" },
  { key: "labor_cost", label: "Labor Budget" },
  { key: "equipment_cost", label: "Equipment Budget" },
  { key: "machinery_cost", label: "Machinery Budget" },
  { key: "contractor_cost", label: "Contractor Budget" },
  { key: "utility_cost", label: "Utility Budget" },
  { key: "transport_cost", label: "Transportation Budget" },
  { key: "permit_fees", label: "Permit Fees" },
  { key: "govt_charges", label: "Government Charges" },
  { key: "misc_cost", label: "Miscellaneous" },
].map((row, i) => ({
  ...row,
  budgeted: 2_500_000 + i * 780_000,
  spent: 1_100_000 + i * 420_000,
}));

export const projectResources: ProjectResource[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: pick(
    [
      "Concrete Mixer",
      "Tower Crane",
      "Site Engineer",
      "Steel Fixers",
      "Cement",
      "Steel Bars",
      "Excavator",
      "Scaffolding",
      "Electrician",
      "Paint",
    ],
    i,
  ),
  category: pick(["equipment", "human", "material"], i),
  availability: pick(["available", "assigned", "available", "low_stock"], i),
  unit_cost: 12_000 + i * 3_500,
  current_stock: 120 - i * 8,
}));

export const projectProcurement: ProjectProcurement[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  pr_number: `PR-${pad(i + 1, 3)}`,
  po_number: `PO-${pad(i + 21, 3)}`,
  title: pick(
    [
      "Cement supply",
      "Steel reinforcement",
      "Electrical fittings",
      "Sanitary ware",
      "Facade aluminium",
      "Elevator package",
    ],
    i,
  ),
  vendor_name: pick(["Fictional Vendor A", "Fictional Vendor B", "Fictional Vendor C"], i),
  status: pick(["approved", "pending", "delivered", "rejected"], i),
  total_amount: 850_000 + i * 320_000,
  received_date: day(12 + i * 3),
}));

export const projectQuality: ProjectQuality[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  inspection_type: pick(
    ["Concrete strength", "Steel fixing", "Electrical", "Plumbing", "Finishing"],
    i,
  ),
  inspection_date: day(10 + i * 4),
  inspector_name: pick(["Engr. Sajid", "Engr. Naveed", "QA Consultant"], i),
  result: pick(["pass", "pass", "fail", "pass"], i),
  status: pick(["closed", "open", "closed"], i),
}));

export const projectSafety: ProjectSafety[] = Array.from({ length: 7 }, (_, i) => ({
  id: i + 1,
  incident_type: pick(["near_miss", "minor_injury", "hazard", "toolbox_talk"], i),
  title: pick(
    [
      "Loose scaffolding plank",
      "PPE compliance check",
      "Open excavation edge",
      "Fire extinguisher inspection",
    ],
    i,
  ),
  incident_date: day(8 + i * 5),
  severity: pick(["low", "medium", "high"], i),
  status: pick(["open", "closed", "closed"], i),
  corrective_action: "Corrective action recorded and verified by the site safety officer.",
}));

export const projectDocuments: ProjectDocument[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: pick(
    [
      "Approved architectural drawings.pdf",
      "Structural calculations.pdf",
      "BOQ — revised.xlsx",
      "Site handover report.pdf",
      "NOC — LDA.pdf",
    ],
    i,
  ),
  folder: pick(["Drawings", "Approvals", "Finance", "Contracts"], i),
  tags: pick(["drawing,revised", "approval", "boq", "contract"], i),
  created_at: day(20 + i * 6),
}));

export const projectTimeline: ProjectTimelineEntry[] = [
  {
    id: 1,
    type: "planning",
    title: "Planning approved",
    detail: "Project planning and baseline schedule approved.",
    date: day(120),
  },
  {
    id: 2,
    type: "budget",
    title: "Budget released",
    detail: "Phase 1 budget released to site team.",
    date: day(95),
  },
  {
    id: 3,
    type: "procurement",
    title: "Major procurement closed",
    detail: "Cement and steel purchase orders issued.",
    date: day(70),
  },
  {
    id: 4,
    type: "execution",
    title: "Structure completed to level 4",
    detail: "Concrete pour milestone signed off.",
    date: day(35),
  },
  {
    id: 5,
    type: "inspection",
    title: "Quality inspection",
    detail: "Third-party inspection passed with minor observations.",
    date: day(12),
  },
];

/* ────────────────────────── HR ────────────────────────── */

const DEPARTMENTS = ["Sales", "Accounts", "Operations", "HR", "Construction", "Marketing", "IT"];

export type Employee = {
  id: number;
  employee_id: string;
  full_name: string;
  department: string;
  position: string;
  employment_type: string;
  employment_status: string;
  joining_date: string;
  salary: number;
  email: string;
};

export const employees: Employee[] = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  employee_id: `EMP-${pad(i + 1, 3)}`,
  full_name: pick(
    [
      "Fictional Employee A",
      "Fictional Employee B",
      "Fictional Employee C",
      "Fictional Employee D",
      "Fictional Employee E",
      "Fictional Employee F",
    ],
    i,
  ),
  department: pick(DEPARTMENTS, i),
  position: pick(
    [
      "Sales Executive",
      "Accountant",
      "Operations Officer",
      "HR Officer",
      "Site Engineer",
      "Marketing Executive",
      "Developer",
    ],
    i,
  ),
  employment_type: pick(["Full-time", "Contract", "Full-time", "Intern"], i),
  employment_status: i % 9 === 0 ? "Inactive" : i % 7 === 0 ? "Probation" : "Active",
  joining_date: day(400 - i * 15),
  salary: 85_000 + i * 12_000,
  email: `employee${i + 1}@demo.example`,
}));

export const attendance: AttendanceRow[] = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  employee_name: pick(employees, i).full_name,
  department: pick(employees, i).department,
  date: day(i % 5),
  check_in: pick(["08:55", "09:02", "09:15", "08:45"], i),
  check_out: pick(["17:30", "18:05", "17:45", "18:20"], i),
  status: pick(["present", "present", "late", "present", "absent"], i),
}));

export const leaves: LeaveRow[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  leave_id: `LV-${pad(i + 1, 3)}`,
  employee_name: pick(employees, i).full_name,
  leave_type: pick(["Annual", "Sick", "Casual", "Unpaid"], i),
  from_date: day(5 + i * 2),
  to_date: day(2 + i * 2),
  days: 1 + (i % 4),
  status: pick(["pending", "approved", "rejected", "approved"], i),
}));

export const payroll: PayrollRow[] = employees.slice(0, 12).map((e, i) => ({
  id: i + 1,
  payroll_id: `PR-${pad(i + 1, 3)}`,
  employee_name: e.full_name,
  department: e.department,
  basic_salary: e.salary,
  allowances: Math.round(e.salary * 0.15),
  deductions: Math.round(e.salary * 0.07),
  net_salary: Math.round(e.salary * 1.08),
  month: "November 2026",
  status: i % 5 === 0 ? "pending" : "paid",
}));

export const performance: PerformanceRow[] = employees.slice(0, 10).map((e, i) => ({
  id: i + 1,
  employee_name: e.full_name,
  department: e.department,
  review_period: "Q4 2026",
  rating: 3 + (i % 3),
  goals_met: 60 + i * 4,
  reviewer: pick(["Department Head", "HR Manager", "Operations Director"], i),
  status: i % 4 === 0 ? "draft" : "finalized",
}));

/* ────────────────────────── finance ────────────────────────── */

export const accounts: Account[] = [
  ["1000", "Cash on Hand", "Asset"],
  ["1010", "Bank — Current", "Asset"],
  ["1100", "Accounts Receivable", "Asset"],
  ["1500", "Property & Equipment", "Asset"],
  ["2000", "Accounts Payable", "Liability"],
  ["2100", "Security Deposits", "Liability"],
  ["3000", "Owner's Equity", "Equity"],
  ["4000", "Rental Income", "Revenue"],
  ["4100", "Sale of Property", "Revenue"],
  ["5000", "Salaries & Wages", "Expense"],
  ["5100", "Utilities", "Expense"],
  ["5200", "Repairs & Maintenance", "Expense"],
].map(([code, name, type], i) => ({
  id: i + 1,
  code: code ?? "",
  account_name: name ?? "",
  account_type: type ?? "",
  balance: [
    1_250_000, 12_800_000, 4_200_000, 85_000_000, 2_600_000, 5_400_000, 40_000_000, 9_800_000,
    22_400_000, 3_100_000, 860_000, 1_240_000,
  ][i]!,
  is_active: true,
}));

export const journals: Journal[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  journal_id: `JE-${pad(i + 1, 3)}`,
  date: day(i * 3),
  reference: `REF-${pad(3300 + i)}`,
  description: pick(
    [
      "Rent collection posting",
      "Supplier invoice",
      "Payroll accrual",
      "Maintenance expense",
      "Commission accrual",
    ],
    i,
  ),
  debit_account: pick(
    ["1010 Bank — Current", "5200 Repairs & Maintenance", "5000 Salaries & Wages"],
    i,
  ),
  credit_account: pick(["4000 Rental Income", "2000 Accounts Payable", "1000 Cash on Hand"], i),
  amount: 85_000 + i * 26_000,
  status: i % 6 === 0 ? "draft" : "posted",
}));

export const invoices: Invoice[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  invoice_no: `INV-2026-${pad(i + 1, 3)}`,
  client_name: pick([...clients.map((c) => c.name), "Fictional Vendor A"], i),
  issue_date: day(30 + i * 3),
  due_date: day(-(15 - i)),
  total_amount: 240_000 + i * 52_000,
  paid_amount: i % 4 === 0 ? 0 : 240_000 + i * 52_000,
  status: i % 4 === 0 ? "overdue" : i % 3 === 0 ? "partial" : "paid",
}));

export const financePayments: FinancePayment[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  payment_id: `FPAY-${pad(i + 1, 3)}`,
  date: day(i * 4),
  payer: pick(clients, i).name,
  invoice_no: pick(invoices, i).invoice_no,
  amount: 180_000 + i * 34_000,
  method: pick(["Bank Transfer", "Cheque", "Cash"], i),
  status: "cleared",
}));

export const bankAccounts: BankAccount[] = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  bank_name: pick(["Meezan Bank", "HBL", "Bank Alfalah", "UBL"], i),
  account_title: "Eyercall Demo Realty (Pvt) Ltd",
  account_number: `PK36 DEMO 0000 1234 56${i}`,
  branch: pick(["Gulberg", "DHA", "Johar Town", "Model Town"], i),
  balance: 6_800_000 + i * 2_450_000,
  status: "active",
}));

export const cashAccounts: CashAccount[] = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  name: pick(["Head Office Petty Cash", "Site Imprest — Project 1", "Site Imprest — Project 2"], i),
  custodian: pick(["Accounts Officer", "Site Manager", "Project Accountant"], i),
  balance: 185_000 + i * 62_000,
  last_reconciled: day(2 + i * 3),
  status: "active",
}));

export const commissions: Commission[] = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  dealer_name: pick(dealers, i).name,
  deal_code: pick(deals, i).deal_id,
  property_name: pick(PROPERTY_NAMES, i),
  sale_amount: 8_200_000 + i * 950_000,
  commission_rate: 1 + (i % 3),
  amount: 82_000 + i * 28_500,
  payment_status: i % 3 === 0 ? "unpaid" : "paid",
  date: day(10 + i * 4),
}));

export const expenses: Expense[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  account_code: pick(["5000", "5100", "5200"], i),
  account_name: pick(["Salaries & Wages", "Utilities", "Repairs & Maintenance"], i),
  description: pick(
    ["Monthly payroll", "Electricity bill", "Plumbing repair", "Office supplies", "Generator fuel"],
    i,
  ),
  amount: 35_000 + i * 18_000,
  date: day(i * 3),
  payment_method: pick(["Bank Transfer", "Cash", "Cheque"], i),
  status: "posted",
}));

export const ledger: LedgerRow[] = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  entry_id: `LE-${pad(i + 1, 4)}`,
  date: day(i * 2),
  account: pick(
    ["Bank — Current", "Rental Income", "Accounts Receivable", "Repairs & Maintenance"],
    i,
  ),
  description: pick(
    ["Rent received — Unit A-101", "Maintenance invoice", "Client installment", "Security deposit"],
    i,
  ),
  debit: i % 2 === 0 ? 120_000 + i * 15_000 : 0,
  credit: i % 2 === 0 ? 0 : 120_000 + i * 15_000,
  balance: 1_200_000 + i * 48_000,
  reference: `REF-${pad(5000 + i)}`,
}));

export const financeDashboard = {
  kpis: [
    {
      label: "Total Revenue",
      value: 148_600_000,
      hint: "+12.4% vs last period",
      tone: "green" as const,
    },
    {
      label: "Total Expenses",
      value: 62_340_000,
      hint: "+4.1% vs last period",
      tone: "red" as const,
    },
    { label: "Net Profit", value: 86_260_000, hint: "58.0% margin", tone: "green" as const },
    { label: "Outstanding", value: 18_450_000, hint: "12 open invoices", tone: "amber" as const },
  ],
  monthly: [
    { month: "Jun", income: 21_400_000, expense: 9_800_000 },
    { month: "Jul", income: 23_100_000, expense: 10_200_000 },
    { month: "Aug", income: 22_600_000, expense: 9_100_000 },
    { month: "Sep", income: 25_800_000, expense: 11_400_000 },
    { month: "Oct", income: 27_200_000, expense: 10_800_000 },
    { month: "Nov", income: 28_500_000, expense: 11_040_000 },
  ],
  expenseBreakdown: [
    { label: "Salaries", value: 24_800_000, color: "#3b82f6" },
    { label: "Utilities", value: 8_200_000, color: "#f59e0b" },
    { label: "Maintenance", value: 11_400_000, color: "#8b5cf6" },
    { label: "Procurement", value: 12_600_000, color: "#10b981" },
    { label: "Other", value: 5_340_000, color: "#64748b" },
  ],
};

/* ────────────────────────── reports ────────────────────────── */

export type ReportModule = {
  key: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  reportTypes: { key: string; label: string; description: string }[];
};

export const reportModules: ReportModule[] = [
  {
    key: "properties",
    label: "Property Reports",
    description: "Portfolio performance, occupancy and rent roll.",
    icon: "building",
    color: "#3b82f6",
    reportTypes: [
      {
        key: "rent-roll",
        label: "Rent Roll",
        description: "Every tenanted unit with rent and lease dates.",
      },
      {
        key: "occupancy",
        label: "Occupancy Report",
        description: "Occupied versus vacant units by property.",
      },
      {
        key: "property-register",
        label: "Property Register",
        description: "Master list of all properties and owners.",
      },
    ],
  },
  {
    key: "crm",
    label: "CRM Reports",
    description: "Lead funnel, client activity and dealer performance.",
    icon: "users",
    color: "#8b5cf6",
    reportTypes: [
      {
        key: "lead-pipeline",
        label: "Lead Pipeline",
        description: "Leads by stage, source and owner.",
      },
      {
        key: "dealer-performance",
        label: "Dealer Performance",
        description: "Deals, commission and conversion by dealer.",
      },
      {
        key: "client-activity",
        label: "Client Activity",
        description: "Follow-ups, visits and payments by client.",
      },
    ],
  },
  {
    key: "finance",
    label: "Finance Reports",
    description: "Income, expenses, ledgers and trial balance.",
    icon: "currency-dollar",
    color: "#10b981",
    reportTypes: [
      {
        key: "income-statement",
        label: "Income Statement",
        description: "Revenue and expenses for the selected period.",
      },
      {
        key: "trial-balance",
        label: "Trial Balance",
        description: "Debit and credit balances for every account.",
      },
      {
        key: "ledger",
        label: "General Ledger",
        description: "Detailed posting history by account.",
      },
    ],
  },
  {
    key: "tenants",
    label: "Tenant Reports",
    description: "Tenant register, lease expiry and arrears.",
    icon: "user-check",
    color: "#06b6d4",
    reportTypes: [
      {
        key: "tenant-register",
        label: "Tenant Register",
        description: "Active and ended tenants with contact details.",
      },
      {
        key: "lease-expiry",
        label: "Lease Expiry",
        description: "Leases ending in the next 90 days.",
      },
    ],
  },
  {
    key: "maintenance",
    label: "Maintenance Reports",
    description: "Work orders, cost and completion performance.",
    icon: "tool",
    color: "#f59e0b",
    reportTypes: [
      {
        key: "work-orders",
        label: "Work Order Register",
        description: "All maintenance requests with status and cost.",
      },
      {
        key: "cost-analysis",
        label: "Cost Analysis",
        description: "Actual versus estimated maintenance cost.",
      },
    ],
  },
  {
    key: "construction",
    label: "Construction Reports",
    description: "Project progress, budget and procurement.",
    icon: "building-skyscraper",
    color: "#f97316",
    reportTypes: [
      {
        key: "project-progress",
        label: "Project Progress",
        description: "Phase, budget and completion by project.",
      },
      {
        key: "budget-variance",
        label: "Budget Variance",
        description: "Budgeted versus actual project cost.",
      },
    ],
  },
  {
    key: "hr",
    label: "HR Reports",
    description: "Headcount, attendance and payroll summaries.",
    icon: "briefcase",
    color: "#ec4899",
    reportTypes: [
      { key: "headcount", label: "Headcount", description: "Employees by department and status." },
      {
        key: "attendance-summary",
        label: "Attendance Summary",
        description: "Present, late and absent counts.",
      },
      {
        key: "payroll-register",
        label: "Payroll Register",
        description: "Gross, deductions and net pay.",
      },
    ],
  },
  {
    key: "bookings",
    label: "Booking Reports",
    description: "Reservations, expiry and conversions.",
    icon: "calendar",
    color: "#6366f1",
    reportTypes: [
      {
        key: "booking-register",
        label: "Booking Register",
        description: "All bookings with amount and status.",
      },
      { key: "expiry", label: "Expiry Report", description: "Bookings approaching expiry." },
    ],
  },
];

export const reportRows = {
  "rent-roll": leases.map((l) => ({ ...l })),
  occupancy: properties.map((p) => ({
    id: p.id,
    property: p.name,
    town: p.town,
    units: p.units,
    occupied: p.occupied_units,
    vacant: p.vacant_units,
    occupancy: `${Math.round((p.occupied_units / p.units) * 100)}%`,
  })),
  "property-register": properties.map((p) => ({
    id: p.id,
    property_id: p.property_id,
    name: p.name,
    type: p.type,
    town: p.town,
    owner: p.owner_name,
    purchase_price: p.purchase_price,
  })),
  "lead-pipeline": leads,
  "dealer-performance": dealers,
  "client-activity": clients,
  "income-statement": accounts.filter(
    (a) => a.account_type === "Revenue" || a.account_type === "Expense",
  ),
  "trial-balance": accounts,
  ledger: ledger,
  "tenant-register": tenants,
  "lease-expiry": leases.filter((l) => l.status === "Expiring"),
  "work-orders": maintenance,
  "cost-analysis": maintenance.map((m) => ({
    id: m.id,
    request_id: m.request_id,
    property: m.property_name,
    estimated: m.estimated_cost,
    actual: m.actual_cost,
  })),
  "project-progress": projects,
  "budget-variance": projects.map((p) => ({
    id: p.id,
    project: p.name,
    budget: p.total_budget,
    spent: p.actual_cost,
    variance: p.total_budget - p.actual_cost,
  })),
  headcount: employees,
  "attendance-summary": attendance,
  "payroll-register": payroll,
  "booking-register": bookings,
  expiry: bookings,
} as Record<string, Record<string, unknown>[]>;

/* ────────────────────────── reminders ────────────────────────── */

export const reminders: Reminder[] = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  reminder_id: `REM-${pad(i + 1)}`,
  title: pick(
    [
      "Rent collection follow-up",
      "Lease renewal",
      "Site visit reminder",
      "Invoice due",
      "Maintenance inspection",
      "Client call-back",
    ],
    i,
  ),
  category: pick(["Payment", "Lease", "Visit", "Finance", "Maintenance", "CRM"], i),
  due_date: day(-(i - 4)),
  due_time: pick(["09:00", "11:30", "14:00", "16:45"], i),
  priority: pick(["high", "medium", "low"], i),
  status: pick(["pending", "completed", "overdue", "snoozed"], i),
  assigned_to: pick(["Demo Administrator", "Sara Khan", "Operations Desk"], i),
}));

export const reminderTemplates: ReminderTemplate[] = [
  {
    id: 1,
    name: "Rent due reminder",
    channel: "SMS",
    trigger: "3 days before due date",
    active: true,
  },
  {
    id: 2,
    name: "Lease expiry notice",
    channel: "Email",
    trigger: "30 days before expiry",
    active: true,
  },
  {
    id: 3,
    name: "Site visit confirmation",
    channel: "WhatsApp",
    trigger: "On scheduling",
    active: true,
  },
  {
    id: 4,
    name: "Invoice overdue notice",
    channel: "Email",
    trigger: "7 days after due date",
    active: false,
  },
];

export const reminderLogs: ReminderLog[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  sent_at: `${day(i)} ${pick(["09:05", "10:20", "13:45", "17:10"], i)}`,
  template: pick(reminderTemplates, i).name,
  recipient: pick(["Fictional Tenant A", "Fictional Client B", "Fictional Dealer C"], i),
  channel: pick(["Email", "SMS", "WhatsApp"], i),
  status: pick(["delivered", "delivered", "failed"], i),
}));

/* ────────────────────────── AI intelligence ────────────────────────── */

export const anomalies: Anomaly[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  anomaly_type: pick(
    ["unusual_payment", "duplicate_invoice", "rent_variance", "inactive_client", "high_expense"],
    i,
  ),
  severity: pick(["high", "medium", "low", "critical"], i),
  module: pick(["Finance", "CRM", "Property", "Maintenance"], i),
  description: pick(
    [
      "Payment amount is 38% above the trailing six-month average.",
      "Two invoices share the same amount and vendor in one week.",
      "Rent for this unit differs from comparable units by more than 25%.",
      "Client has had no activity for 120 days despite an open deal.",
      "Expense entry exceeds the department monthly threshold.",
    ],
    i,
  ),
  risk_score: 42 + i * 5,
  user_id: i % 3 === 0 ? null : 100 + i,
  created_at: `${day(i)}T10:${pad(i * 4, 2)}:00Z`,
}));

export const riskScores: RiskScore[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  subject_id: i + 1,
  subject_type: pick(["client", "dealer", "property", "employee"], i),
  risk_level: pick(["low", "medium", "high", "critical"], i),
  score: 18 + i * 9,
  last_computed: `${day(i)}T06:00:00Z`,
}));

export const duplicates: DuplicateRow[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  entity: pick(["Lead", "Client", "Dealer", "Property"], i),
  primary_record: `#${1200 + i}`,
  duplicate_record: `#${1300 + i}`,
  match_score: 88 + i,
  status: "open",
}));

export const aiInsights: AiInsight[] = [
  {
    id: 1,
    title: "Collections are improving",
    detail: "Verified payment volume is up 12.4% month over month.",
    tone: "positive",
  },
  {
    id: 2,
    title: "Lead response time is lagging",
    detail: "Average first response is 9.2 hours; target is 2 hours.",
    tone: "warning",
  },
  {
    id: 3,
    title: "Two projects trending over budget",
    detail: "Construction procurement is 8% above the approved budget.",
    tone: "danger",
  },
  {
    id: 4,
    title: "Maintenance backlog is stable",
    detail: "Pending work orders remain within the 30-day service window.",
    tone: "neutral",
  },
];

/* ────────────────────────── communication ────────────────────────── */

export const inbox: InboxMessage[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  from: pick(
    ["Fictional Client A", "Fictional Dealer B", "Fictional Tenant C", "Fictional Vendor D"],
    i,
  ),
  subject: pick(
    [
      "Re: Site visit confirmation",
      "Payment plan request",
      "Maintenance update",
      "Invoice query",
      "Property documents",
    ],
    i,
  ),
  preview: "This is a fictional message used to populate the read-only communication workspace.",
  date: day(i),
  unread: i < 4,
  channel: "Email",
}));

export const whatsappThreads: WhatsappThread[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  contact: pick(["Fictional Client A", "Fictional Dealer B", "Fictional Tenant C"], i),
  phone: `+92 300 9000${pad(i + 1, 3)}`,
  last_message: pick(
    [
      "Thanks, confirmed for tomorrow.",
      "Please share the payment plan.",
      "Is the unit still available?",
      "Received, thank you.",
    ],
    i,
  ),
  time: pick(["09:12", "10:04", "11:37", "Yesterday"], i),
  unread: i < 3,
}));

export const callLogs: CallLog[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  direction: pick(["inbound", "outbound"], i),
  contact: pick(["Fictional Client A", "Fictional Dealer B", "Fictional Tenant C"], i),
  number: `+92 300 8000${pad(i + 1, 3)}`,
  duration: `${1 + (i % 6)}m ${pad((i * 7) % 60, 2)}s`,
  date: `${day(i)} ${pick(["09:10", "11:22", "15:40"], i)}`,
  status: pick(["completed", "missed", "completed"], i),
}));

export const chatThreads: ChatThread[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  team: pick(["Sales Team", "Finance Desk", "Site Operations", "Management"], i),
  last_message: "Fictional internal chat message for the demo workspace.",
  time: pick(["09:02", "11:15", "13:28", "16:40"], i),
  unread: i < 2,
}));

/* ────────────────────────── admin / history / settings ────────────────────────── */

export const roles: Role[] = [
  {
    id: 1,
    name: "Administrator",
    description: "Full access to all company modules.",
    users: 3,
    permissions: 64,
  },
  {
    id: 2,
    name: "Sales Manager",
    description: "CRM, bookings and property read access.",
    users: 6,
    permissions: 28,
  },
  {
    id: 3,
    name: "Accountant",
    description: "Finance, ledger and reports.",
    users: 4,
    permissions: 22,
  },
  {
    id: 4,
    name: "Site Engineer",
    description: "Construction and maintenance workspaces.",
    users: 5,
    permissions: 18,
  },
  {
    id: 5,
    name: "Read Only",
    description: "View-only access to selected modules.",
    users: 2,
    permissions: 9,
  },
];

export const users: User[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  user_id: `USR-${pad(i + 1)}`,
  full_name: pick(
    ["Fictional User A", "Fictional User B", "Fictional User C", "Fictional User D"],
    i,
  ),
  email: `user${i + 1}@demo.example`,
  role: pick(roles, i).name,
  status: i % 8 === 0 ? "suspended" : "active",
  last_login: `${day(i)} ${pick(["08:45", "09:20", "14:05"], i)}`,
}));

export const auditLogs: AuditLog[] = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  created_at: `${day(i)}T${pad(8 + (i % 10), 2)}:${pad(i * 3, 2)}:00Z`,
  user: pick(users, i).full_name,
  role: pick(roles, i).name,
  module: pick(["CRM", "Finance", "Property", "Admin", "Maintenance"], i),
  action: pick(["VIEW", "LOGIN", "EXPORT", "UPDATE", "VIEW"], i),
  entity: pick(["Lead #LD-0004", "Invoice INV-2026-002", "Property PRP-0003", "User USR-0002"], i),
  description: "Read-only demonstration audit entry. No mutation was performed.",
  status: pick(["success", "success", "success", "denied"], i),
  ip: `192.168.10.${20 + i}`,
}));

export const history = auditLogs;

export const sheets: Sheet[] = [
  {
    id: 1,
    sheet_id: "SHT-001",
    sheet: "Rent Roll 2026",
    owner: "Demo Administrator",
    rows: 128,
    columns: 14,
    updated: day(1),
    status: "Published",
  },
  {
    id: 2,
    sheet_id: "SHT-002",
    sheet: "Lead Tracker Q4",
    owner: "Sales Manager",
    rows: 248,
    columns: 11,
    updated: day(2),
    status: "Draft",
  },
  {
    id: 3,
    sheet_id: "SHT-003",
    sheet: "Maintenance Log",
    owner: "Operations Desk",
    rows: 86,
    columns: 9,
    updated: day(4),
    status: "Published",
  },
  {
    id: 4,
    sheet_id: "SHT-004",
    sheet: "Commission Sheet",
    owner: "Accounts",
    rows: 42,
    columns: 8,
    updated: day(6),
    status: "Published",
  },
  {
    id: 5,
    sheet_id: "SHT-005",
    sheet: "Project Cost Tracker",
    owner: "Site Operations",
    rows: 320,
    columns: 16,
    updated: day(8),
    status: "Draft",
  },
];

export const recycleBin: RecycleBinRow[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  record: pick(
    [
      "Property PRP-0012",
      "Lead LD-0031",
      "Invoice INV-2026-009",
      "Maintenance MNT-0022",
      "Client CL-0015",
    ],
    i,
  ),
  module: pick(["Properties", "CRM", "Finance", "Maintenance", "CRM"], i),
  deleted_by: pick(["Fictional User A", "Fictional User B"], i),
  deleted_at: `${day(2 + i * 3)} 12:${pad(i * 5, 2)}`,
  size: `${1 + i * 2} records`,
}));

export const dashboard = {
  stats: {
    total_properties: 12,
    total_units: 52,
    occupied_units: 39,
    vacant_units: 13,
    income: 148_600_000,
    expense: 62_340_000,
    active_deals: 24,
  },
  monthly: [
    { month: "Jun", income: 21_400_000, expense: 9_800_000 },
    { month: "Jul", income: 23_100_000, expense: 10_200_000 },
    { month: "Aug", income: 22_600_000, expense: 9_100_000 },
    { month: "Sep", income: 25_800_000, expense: 11_400_000 },
    { month: "Oct", income: 27_200_000, expense: 10_800_000 },
    { month: "Nov", income: 28_500_000, expense: 11_040_000 },
  ],
  pipeline: [
    { stage: "New", count: 248 },
    { stage: "Contacted", count: 186 },
    { stage: "Qualified", count: 112 },
    { stage: "Site Visit", count: 74 },
    { stage: "Negotiation", count: 43 },
    { stage: "Converted", count: 28 },
  ],
  activity: [
    {
      title: "Payment received",
      detail: "Fictional Client B · PKR 450,000",
      time: "12 min ago",
      color: "#10b981",
    },
    {
      title: "Lead created",
      detail: "Website enquiry assigned to Sara Khan",
      time: "41 min ago",
      color: "#3b82f6",
    },
    {
      title: "Site visit scheduled",
      detail: "Emerald Heights · tomorrow 11:00 AM",
      time: "2 hr ago",
      color: "#8b5cf6",
    },
    {
      title: "Work order completed",
      detail: "MNT-0012 · AC repair · Unit B-104",
      time: "5 hr ago",
      color: "#f59e0b",
    },
    {
      title: "Lease renewal",
      detail: "Fictional Tenant C · Unit A-101",
      time: "Yesterday",
      color: "#06b6d4",
    },
  ],
  alerts: [
    { label: "Overdue installments", value: 14 },
    { label: "Leases expiring (30 days)", value: 6 },
    { label: "Open work orders", value: 9 },
    { label: "Bookings near expiry", value: 5 },
  ],
};
