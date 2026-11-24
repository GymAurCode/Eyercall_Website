# EyerREMS source discovery

Status: discovery started. Demo implementation and visual verification are incomplete.

Scanned 347 source files. Identified 46 explicit route declarations (including relative child routes, authentication routes, and fallback). These are declarations, not a count of completed demo pages.

## Route declarations

- /login
- /change-password
- /settings
- /
- /property
- /property/:id
- /towns
- /towns/:id
- /crm
- /crm/leads/:id
- /crm/clients/:id
- /crm/deals/:id
- /crm/deals/:id/installment-plan
- /crm/dealers/:id
- /crm/bookings
- /crm/bookings/:id
- /finance
- /ledger
- /reports
- /reports/:module
- /reports/:module/:reportType
- /tenants
- /tenants/:id
- /maintenance
- /admin
- /construction
- /construction/projects
- /construction/projects/:id/view
- /construction/projects/:id
- /spreadsheet
- /products/spreadsheet
- /advance-options
- /reminders
- /hr
- /mail
- /communication
- /ai
- /history
- /activity
- /docs
- /superadmin
- companies
- companies/:id
- devices
- licenses
- *

## Evidence

source-evidence.json records source paths and line-numbered candidates for tabs, columns, filters, dialogs, charts, service operations, and guards. Matches require manual validation; no completeness or accessibility claim is implied.

The original uses React Router, Zustand, React Query, Axios and Electron. The website uses TanStack Start/Router and React 19. Original App.tsx bootstraps authentication, WebSockets, background refresh and production services. Copying its entry point is unsuitable for the isolated demo.

The module registry includes entries that cannot be treated as routed screens without checking actual render paths. Sidebar settings is a separate route. Super-admin has nested companies, company details, devices and licenses.

## Delivery status

- Demo pages implemented: 0
- Demo tabs implemented: 0
- Visual comparisons: none
- Website source changed: none
- Original applications changed: none
- Build/test verification: not performed

Full module-by-module review, safe presentation extraction, deterministic adapters, centralized policy, TanStack routes, interaction tests and screenshot comparisons remain outstanding.
