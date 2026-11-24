# eyerstock source parity

Status: original frontend port in progress. **No screen is certified visually identical.**

Original sources remain unchanged, verified against the import-time SHA-256 inventory. Sources and assets are vendored inside the website; deployment does not import sibling repositories.

The exhaustive per-component audit is in [SOURCE_PARITY.json](SOURCE_PARITY.json), including original paths, ported paths, module, navigation literals, tab/label literals, column headers, dialogs, charts, asset imports and verification status. Literal extraction is a discovery aid: dynamically composed tabs and imported child tables must still be checked at their referenced source paths. Empty extracted lists do not certify absence.

Each original app keeps its own routed shell, JSX, CSS and Tailwind 3 configuration in an isolated document. The surrounding website uses TanStack Router. A 30px read-only strip is the only added framing. Native/API services are replaced locally.

## Verification limits

- Original desktop apps have not been launched against a safe sample database; original-to-demo screenshot comparison is pending for every screen.
- Typed Stock/Flow fixtures preserve response shapes but still need semantic and cross-record validation for every nested view.
- REMS endpoint fixtures are incomplete; complex detail and reporting response shapes require further verification.
- Original create/edit controls remain in source, but actions and data mutations are blocked. Local UI state in complex editors needs a complete interaction audit.
- Source presence does not mean runtime or visual parity has passed.

## Component inventory

| Original component | Website component | Implementation | Functional | Visual |
|---|---|---|---|---|
| `Eyerstock/src/renderer/App.tsx` | `demo-apps/eyerstock/src/renderer/App.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/charts/CategoryDonut.tsx` | `demo-apps/eyerstock/src/renderer/components/charts/CategoryDonut.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/charts/FinanceCharts.tsx` | `demo-apps/eyerstock/src/renderer/components/charts/FinanceCharts.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/charts/MiniBars.tsx` | `demo-apps/eyerstock/src/renderer/components/charts/MiniBars.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/charts/MixDonut.tsx` | `demo-apps/eyerstock/src/renderer/components/charts/MixDonut.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/charts/SalesExpenseChart.tsx` | `demo-apps/eyerstock/src/renderer/components/charts/SalesExpenseChart.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/charts/Sparkline.tsx` | `demo-apps/eyerstock/src/renderer/components/charts/Sparkline.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/charts/StockValueTrendChart.tsx` | `demo-apps/eyerstock/src/renderer/components/charts/StockValueTrendChart.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/documents/DocumentDetailDialog.tsx` | `demo-apps/eyerstock/src/renderer/components/documents/DocumentDetailDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/documents/DocumentPaymentDialog.tsx` | `demo-apps/eyerstock/src/renderer/components/documents/DocumentPaymentDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/documents/LineItemsEditor.tsx` | `demo-apps/eyerstock/src/renderer/components/documents/LineItemsEditor.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/documents/PurchaseDialog.tsx` | `demo-apps/eyerstock/src/renderer/components/documents/PurchaseDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/documents/SaleDialog.tsx` | `demo-apps/eyerstock/src/renderer/components/documents/SaleDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/layout/AppShell.tsx` | `demo-apps/eyerstock/src/renderer/components/layout/AppShell.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/layout/BottomNav.tsx` | `demo-apps/eyerstock/src/renderer/components/layout/BottomNav.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/layout/Sidebar.tsx` | `demo-apps/eyerstock/src/renderer/components/layout/Sidebar.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/layout/Topbar.tsx` | `demo-apps/eyerstock/src/renderer/components/layout/Topbar.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/print/DocumentPreview.tsx` | `demo-apps/eyerstock/src/renderer/components/print/DocumentPreview.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/print/DocumentPrintDialog.tsx` | `demo-apps/eyerstock/src/renderer/components/print/DocumentPrintDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/print/ReportPreview.tsx` | `demo-apps/eyerstock/src/renderer/components/print/ReportPreview.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/theme/ThemeCard.tsx` | `demo-apps/eyerstock/src/renderer/components/theme/ThemeCard.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/theme/ThemeOnboarding.tsx` | `demo-apps/eyerstock/src/renderer/components/theme/ThemeOnboarding.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/ui/Avatar.tsx` | `demo-apps/eyerstock/src/renderer/components/ui/Avatar.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/ui/Badge.tsx` | `demo-apps/eyerstock/src/renderer/components/ui/Badge.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/ui/Button.tsx` | `demo-apps/eyerstock/src/renderer/components/ui/Button.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/ui/Card.tsx` | `demo-apps/eyerstock/src/renderer/components/ui/Card.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/ui/ChartCard.tsx` | `demo-apps/eyerstock/src/renderer/components/ui/ChartCard.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/ui/Combobox.tsx` | `demo-apps/eyerstock/src/renderer/components/ui/Combobox.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/ui/DataTable.tsx` | `demo-apps/eyerstock/src/renderer/components/ui/DataTable.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/ui/DeleteConfirmDialog.tsx` | `demo-apps/eyerstock/src/renderer/components/ui/DeleteConfirmDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/ui/DetailList.tsx` | `demo-apps/eyerstock/src/renderer/components/ui/DetailList.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/ui/Dialog.tsx` | `demo-apps/eyerstock/src/renderer/components/ui/Dialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/ui/Dropdown.tsx` | `demo-apps/eyerstock/src/renderer/components/ui/Dropdown.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/ui/Feedback.tsx` | `demo-apps/eyerstock/src/renderer/components/ui/Feedback.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/ui/Glass.tsx` | `demo-apps/eyerstock/src/renderer/components/ui/Glass.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/ui/HighlightText.tsx` | `demo-apps/eyerstock/src/renderer/components/ui/HighlightText.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/ui/Input.tsx` | `demo-apps/eyerstock/src/renderer/components/ui/Input.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/ui/RecordActions.tsx` | `demo-apps/eyerstock/src/renderer/components/ui/RecordActions.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/ui/StatCard.tsx` | `demo-apps/eyerstock/src/renderer/components/ui/StatCard.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/updates/UpdateDialog.tsx` | `demo-apps/eyerstock/src/renderer/components/updates/UpdateDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/components/updates/UpdateNotifier.tsx` | `demo-apps/eyerstock/src/renderer/components/updates/UpdateNotifier.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/lib/app-context.tsx` | `demo-apps/eyerstock/src/renderer/lib/app-context.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/lib/updates.tsx` | `demo-apps/eyerstock/src/renderer/lib/updates.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/main.tsx` | `demo-apps/eyerstock/src/renderer/main.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/admin/AppearancePanel.tsx` | `demo-apps/eyerstock/src/renderer/pages/admin/AppearancePanel.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/admin/SettingsPage.tsx` | `demo-apps/eyerstock/src/renderer/pages/admin/SettingsPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/auth/ActivatePage.tsx` | `demo-apps/eyerstock/src/renderer/pages/auth/ActivatePage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/auth/AuthPanel.tsx` | `demo-apps/eyerstock/src/renderer/pages/auth/AuthPanel.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/auth/BrandPanel.tsx` | `demo-apps/eyerstock/src/renderer/pages/auth/BrandPanel.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/auth/ForgotPasswordDialog.tsx` | `demo-apps/eyerstock/src/renderer/pages/auth/ForgotPasswordDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/auth/LoginPage.tsx` | `demo-apps/eyerstock/src/renderer/pages/auth/LoginPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/auth/RegistrationDialogs.tsx` | `demo-apps/eyerstock/src/renderer/pages/auth/RegistrationDialogs.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/Dashboard.tsx` | `demo-apps/eyerstock/src/renderer/pages/Dashboard.tsx` | Original component copied unchanged | Limited browser smoke passed; see JSON | Pending |
| `Eyerstock/src/renderer/pages/finance/AccountDetailPanel.tsx` | `demo-apps/eyerstock/src/renderer/pages/finance/AccountDetailPanel.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/finance/AccountEditorDialog.tsx` | `demo-apps/eyerstock/src/renderer/pages/finance/AccountEditorDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/finance/AccountLedgerPage.tsx` | `demo-apps/eyerstock/src/renderer/pages/finance/AccountLedgerPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/finance/AccountTreePanel.tsx` | `demo-apps/eyerstock/src/renderer/pages/finance/AccountTreePanel.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/finance/CashAndBankPage.tsx` | `demo-apps/eyerstock/src/renderer/pages/finance/CashAndBankPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/finance/ChartOfAccountsPage.tsx` | `demo-apps/eyerstock/src/renderer/pages/finance/ChartOfAccountsPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/finance/ExpensesPage.tsx` | `demo-apps/eyerstock/src/renderer/pages/finance/ExpensesPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/finance/FinanceLayout.tsx` | `demo-apps/eyerstock/src/renderer/pages/finance/FinanceLayout.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/finance/FinanceOverviewPage.tsx` | `demo-apps/eyerstock/src/renderer/pages/finance/FinanceOverviewPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/finance/FinancePaymentsPage.tsx` | `demo-apps/eyerstock/src/renderer/pages/finance/FinancePaymentsPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/finance/FinanceSettingsPage.tsx` | `demo-apps/eyerstock/src/renderer/pages/finance/FinanceSettingsPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/finance/FinancialReportsPage.tsx` | `demo-apps/eyerstock/src/renderer/pages/finance/FinancialReportsPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/finance/JournalEntriesPage.tsx` | `demo-apps/eyerstock/src/renderer/pages/finance/JournalEntriesPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/finance/PartyBalancesPage.tsx` | `demo-apps/eyerstock/src/renderer/pages/finance/PartyBalancesPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/inventory/ProductsPage.tsx` | `demo-apps/eyerstock/src/renderer/pages/inventory/ProductsPage.tsx` | Original component copied unchanged | Limited browser smoke passed; see JSON | Pending |
| `Eyerstock/src/renderer/pages/parties/PartiesPage.tsx` | `demo-apps/eyerstock/src/renderer/pages/parties/PartiesPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/ProfilePage.tsx` | `demo-apps/eyerstock/src/renderer/pages/ProfilePage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/ReportsPage.tsx` | `demo-apps/eyerstock/src/renderer/pages/ReportsPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/sales/DocumentListPage.tsx` | `demo-apps/eyerstock/src/renderer/pages/sales/DocumentListPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerstock/src/renderer/pages/sales/SalesListPage.tsx` | `demo-apps/eyerstock/src/renderer/pages/sales/SalesListPage.tsx` | Original component copied unchanged | Pending | Pending |
