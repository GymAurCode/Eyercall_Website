# eyerflow source parity

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
| `Eyerflow-1/src/renderer/App.tsx` | `demo-apps/eyerflow/src/renderer/App.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/charts/CategoryDonut.tsx` | `demo-apps/eyerflow/src/renderer/components/charts/CategoryDonut.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/charts/FinanceCharts.tsx` | `demo-apps/eyerflow/src/renderer/components/charts/FinanceCharts.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/charts/MiniBars.tsx` | `demo-apps/eyerflow/src/renderer/components/charts/MiniBars.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/charts/MixDonut.tsx` | `demo-apps/eyerflow/src/renderer/components/charts/MixDonut.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/charts/SalesExpenseChart.tsx` | `demo-apps/eyerflow/src/renderer/components/charts/SalesExpenseChart.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/charts/Sparkline.tsx` | `demo-apps/eyerflow/src/renderer/components/charts/Sparkline.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/charts/StockValueTrendChart.tsx` | `demo-apps/eyerflow/src/renderer/components/charts/StockValueTrendChart.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/documents/DocumentDetailDialog.tsx` | `demo-apps/eyerflow/src/renderer/components/documents/DocumentDetailDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/documents/DocumentPaymentDialog.tsx` | `demo-apps/eyerflow/src/renderer/components/documents/DocumentPaymentDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/documents/LineItemsEditor.tsx` | `demo-apps/eyerflow/src/renderer/components/documents/LineItemsEditor.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/documents/PurchaseDialog.tsx` | `demo-apps/eyerflow/src/renderer/components/documents/PurchaseDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/documents/SaleDialog.tsx` | `demo-apps/eyerflow/src/renderer/components/documents/SaleDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/layout/AppShell.tsx` | `demo-apps/eyerflow/src/renderer/components/layout/AppShell.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/layout/BottomNav.tsx` | `demo-apps/eyerflow/src/renderer/components/layout/BottomNav.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/layout/Sidebar.tsx` | `demo-apps/eyerflow/src/renderer/components/layout/Sidebar.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/layout/Topbar.tsx` | `demo-apps/eyerflow/src/renderer/components/layout/Topbar.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/print/DocumentPreview.tsx` | `demo-apps/eyerflow/src/renderer/components/print/DocumentPreview.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/print/DocumentPrintDialog.tsx` | `demo-apps/eyerflow/src/renderer/components/print/DocumentPrintDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/print/ReportPreview.tsx` | `demo-apps/eyerflow/src/renderer/components/print/ReportPreview.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/theme/ThemeCard.tsx` | `demo-apps/eyerflow/src/renderer/components/theme/ThemeCard.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/theme/ThemeOnboarding.tsx` | `demo-apps/eyerflow/src/renderer/components/theme/ThemeOnboarding.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/ui/Avatar.tsx` | `demo-apps/eyerflow/src/renderer/components/ui/Avatar.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/ui/Badge.tsx` | `demo-apps/eyerflow/src/renderer/components/ui/Badge.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/ui/Button.tsx` | `demo-apps/eyerflow/src/renderer/components/ui/Button.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/ui/Card.tsx` | `demo-apps/eyerflow/src/renderer/components/ui/Card.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/ui/ChartCard.tsx` | `demo-apps/eyerflow/src/renderer/components/ui/ChartCard.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/ui/Combobox.tsx` | `demo-apps/eyerflow/src/renderer/components/ui/Combobox.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/ui/DataTable.tsx` | `demo-apps/eyerflow/src/renderer/components/ui/DataTable.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/ui/DeleteConfirmDialog.tsx` | `demo-apps/eyerflow/src/renderer/components/ui/DeleteConfirmDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/ui/DetailList.tsx` | `demo-apps/eyerflow/src/renderer/components/ui/DetailList.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/ui/Dialog.tsx` | `demo-apps/eyerflow/src/renderer/components/ui/Dialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/ui/Dropdown.tsx` | `demo-apps/eyerflow/src/renderer/components/ui/Dropdown.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/ui/Feedback.tsx` | `demo-apps/eyerflow/src/renderer/components/ui/Feedback.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/ui/Glass.tsx` | `demo-apps/eyerflow/src/renderer/components/ui/Glass.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/ui/HighlightText.tsx` | `demo-apps/eyerflow/src/renderer/components/ui/HighlightText.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/ui/Input.tsx` | `demo-apps/eyerflow/src/renderer/components/ui/Input.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/ui/RecordActions.tsx` | `demo-apps/eyerflow/src/renderer/components/ui/RecordActions.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/ui/StatCard.tsx` | `demo-apps/eyerflow/src/renderer/components/ui/StatCard.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/updates/UpdateDialog.tsx` | `demo-apps/eyerflow/src/renderer/components/updates/UpdateDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/components/updates/UpdateNotifier.tsx` | `demo-apps/eyerflow/src/renderer/components/updates/UpdateNotifier.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/lib/app-context.tsx` | `demo-apps/eyerflow/src/renderer/lib/app-context.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/lib/updates.tsx` | `demo-apps/eyerflow/src/renderer/lib/updates.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/main.tsx` | `demo-apps/eyerflow/src/renderer/main.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/admin/AppearancePanel.tsx` | `demo-apps/eyerflow/src/renderer/pages/admin/AppearancePanel.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/admin/SettingsPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/admin/SettingsPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/auth/ActivatePage.tsx` | `demo-apps/eyerflow/src/renderer/pages/auth/ActivatePage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/auth/AuthPanel.tsx` | `demo-apps/eyerflow/src/renderer/pages/auth/AuthPanel.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/auth/BrandPanel.tsx` | `demo-apps/eyerflow/src/renderer/pages/auth/BrandPanel.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/auth/ForgotPasswordDialog.tsx` | `demo-apps/eyerflow/src/renderer/pages/auth/ForgotPasswordDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/auth/LoginPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/auth/LoginPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/auth/RegistrationDialogs.tsx` | `demo-apps/eyerflow/src/renderer/pages/auth/RegistrationDialogs.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/Dashboard.tsx` | `demo-apps/eyerflow/src/renderer/pages/Dashboard.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/ecom/EcomCatalogPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/ecom/EcomCatalogPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/ecom/EcomChannelsPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/ecom/EcomChannelsPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/ecom/EcomDashboardPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/ecom/EcomDashboardPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/ecom/EcomFulfillmentPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/ecom/EcomFulfillmentPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/ecom/EcomInventoryPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/ecom/EcomInventoryPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/ecom/EcomMarketingPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/ecom/EcomMarketingPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/ecom/EcomOrdersPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/ecom/EcomOrdersPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/ecom/EcomReportsPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/ecom/EcomReportsPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/ecom/EcomSettingsPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/ecom/EcomSettingsPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/ecom/EcomSettlementsPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/ecom/EcomSettlementsPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/ecom/EcomShared.tsx` | `demo-apps/eyerflow/src/renderer/pages/ecom/EcomShared.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/ecom/EcomSyncPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/ecom/EcomSyncPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/erp/ErpWorkspacePage.tsx` | `demo-apps/eyerflow/src/renderer/pages/erp/ErpWorkspacePage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/finance/AccountDetailPanel.tsx` | `demo-apps/eyerflow/src/renderer/pages/finance/AccountDetailPanel.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/finance/AccountEditorDialog.tsx` | `demo-apps/eyerflow/src/renderer/pages/finance/AccountEditorDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/finance/AccountLedgerPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/finance/AccountLedgerPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/finance/AccountTreePanel.tsx` | `demo-apps/eyerflow/src/renderer/pages/finance/AccountTreePanel.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/finance/CashAndBankPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/finance/CashAndBankPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/finance/ChartOfAccountsPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/finance/ChartOfAccountsPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/finance/ExpensesPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/finance/ExpensesPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/finance/FinanceLayout.tsx` | `demo-apps/eyerflow/src/renderer/pages/finance/FinanceLayout.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/finance/FinanceOverviewPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/finance/FinanceOverviewPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/finance/FinancePaymentsPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/finance/FinancePaymentsPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/finance/FinanceSettingsPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/finance/FinanceSettingsPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/finance/FinancialReportsPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/finance/FinancialReportsPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/finance/JournalEntriesPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/finance/JournalEntriesPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/finance/PartyBalancesPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/finance/PartyBalancesPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/HomeDashboard.tsx` | `demo-apps/eyerflow/src/renderer/pages/HomeDashboard.tsx` | Original component copied unchanged | Limited browser smoke passed; see JSON | Pending |
| `Eyerflow-1/src/renderer/pages/inventory/ProductsPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/inventory/ProductsPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/inventory/StockLedgerPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/inventory/StockLedgerPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/mms/BomDetailPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/mms/BomDetailPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/mms/BomsPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/mms/BomsPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/mms/CostingPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/mms/CostingPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/mms/EquipmentPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/mms/EquipmentPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/mms/FinishedReceiptsPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/mms/FinishedReceiptsPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/mms/MaterialIssuesPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/mms/MaterialIssuesPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/mms/MmsCollectionPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/mms/MmsCollectionPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/mms/MmsDashboardPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/mms/MmsDashboardPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/mms/MmsReportsPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/mms/MmsReportsPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/mms/MmsSettingsPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/mms/MmsSettingsPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/mms/MmsTable.tsx` | `demo-apps/eyerflow/src/renderer/pages/mms/MmsTable.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/mms/MoDetailPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/mms/MoDetailPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/mms/MoListPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/mms/MoListPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/mms/MpsPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/mms/MpsPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/mms/MrpPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/mms/MrpPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/mms/QualityPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/mms/QualityPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/mms/ReworkPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/mms/ReworkPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/mms/RouteDetailPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/mms/RouteDetailPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/mms/RoutesPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/mms/RoutesPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/mms/ScrapPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/mms/ScrapPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/mms/ShopFloorPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/mms/ShopFloorPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/mms/WorkCentersPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/mms/WorkCentersPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/mms/WorkOrderListPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/mms/WorkOrderListPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/oms/OmsOrderDetailPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/oms/OmsOrderDetailPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/oms/OmsOrdersPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/oms/OmsOrdersPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/parties/PartiesPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/parties/PartiesPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/ProfilePage.tsx` | `demo-apps/eyerflow/src/renderer/pages/ProfilePage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/ReportsPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/ReportsPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/sales/DocumentListPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/sales/DocumentListPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/sales/SalesListPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/sales/SalesListPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/wms/AccessPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/wms/AccessPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/wms/AnalyticsPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/wms/AnalyticsPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/wms/HandlingPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/wms/HandlingPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/wms/OutboundPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/wms/OutboundPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/wms/OwnersPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/wms/OwnersPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/wms/ProductionPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/wms/ProductionPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerflow-1/src/renderer/pages/wms/WavesPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/wms/WavesPage.tsx` | Original component copied unchanged | Limited browser smoke passed; see JSON | Pending |
| `Eyerflow-1/src/renderer/pages/wms/WmsPage.tsx` | `demo-apps/eyerflow/src/renderer/pages/wms/WmsPage.tsx` | Original component copied unchanged | Limited browser smoke passed; see JSON | Pending |
