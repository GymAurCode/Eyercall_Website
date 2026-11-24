# eyerrems source parity

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
| `Eyerrems-desktop/frontend/src/App.tsx` | `demo-apps/eyerrems/src/App.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/actions/ActionButton.tsx` | `demo-apps/eyerrems/src/components/actions/ActionButton.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/actions/ActionDropdown.tsx` | `demo-apps/eyerrems/src/components/actions/ActionDropdown.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/actions/ActionsCell.tsx` | `demo-apps/eyerrems/src/components/actions/ActionsCell.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/actions/ConfirmDialog.tsx` | `demo-apps/eyerrems/src/components/actions/ConfirmDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/actions/RowActions.tsx` | `demo-apps/eyerrems/src/components/actions/RowActions.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/attachments/AttachmentPanel.tsx` | `demo-apps/eyerrems/src/components/attachments/AttachmentPanel.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/attachments/AttachmentPreviewModal.tsx` | `demo-apps/eyerrems/src/components/attachments/AttachmentPreviewModal.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/attachments/AttachmentsButton.tsx` | `demo-apps/eyerrems/src/components/attachments/AttachmentsButton.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/attachments/FileUploadDialog.tsx` | `demo-apps/eyerrems/src/components/attachments/FileUploadDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/crm/ActivityTimeline.tsx` | `demo-apps/eyerrems/src/components/crm/ActivityTimeline.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/crm/AddNoteModal.tsx` | `demo-apps/eyerrems/src/components/crm/AddNoteModal.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/crm/BookingFormDialog.tsx` | `demo-apps/eyerrems/src/components/crm/BookingFormDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/crm/ClientForm.tsx` | `demo-apps/eyerrems/src/components/crm/ClientForm.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/crm/ClientFormDialog.tsx` | `demo-apps/eyerrems/src/components/crm/ClientFormDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/crm/CommunicationForm.tsx` | `demo-apps/eyerrems/src/components/crm/CommunicationForm.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/crm/DealerForm.tsx` | `demo-apps/eyerrems/src/components/crm/DealerForm.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/crm/DealerHierarchyView.tsx` | `demo-apps/eyerrems/src/components/crm/DealerHierarchyView.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/crm/DealForm.tsx` | `demo-apps/eyerrems/src/components/crm/DealForm.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/crm/FollowUpModal.tsx` | `demo-apps/eyerrems/src/components/crm/FollowUpModal.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/crm/FormField.tsx` | `demo-apps/eyerrems/src/components/crm/FormField.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/crm/JourneyTracker.tsx` | `demo-apps/eyerrems/src/components/crm/JourneyTracker.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/crm/LeadFormDialog.tsx` | `demo-apps/eyerrems/src/components/crm/LeadFormDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/crm/PaymentVerificationDialog.tsx` | `demo-apps/eyerrems/src/components/crm/PaymentVerificationDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/crm/PipelineStepper.tsx` | `demo-apps/eyerrems/src/components/crm/PipelineStepper.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/crm/QuickActionsPanel.tsx` | `demo-apps/eyerrems/src/components/crm/QuickActionsPanel.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/data-table/AppTable.tsx` | `demo-apps/eyerrems/src/components/data-table/AppTable.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/data-table/components/EmptyState.tsx` | `demo-apps/eyerrems/src/components/data-table/components/EmptyState.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/data-table/components/LoadingState.tsx` | `demo-apps/eyerrems/src/components/data-table/components/LoadingState.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/data-table/components/TableHeader.tsx` | `demo-apps/eyerrems/src/components/data-table/components/TableHeader.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/data-table/components/TablePagination.tsx` | `demo-apps/eyerrems/src/components/data-table/components/TablePagination.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/data-table/components/TableRow.tsx` | `demo-apps/eyerrems/src/components/data-table/components/TableRow.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/data-table/components/TableToolbar.tsx` | `demo-apps/eyerrems/src/components/data-table/components/TableToolbar.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/data-table/DataTable.tsx` | `demo-apps/eyerrems/src/components/data-table/DataTable.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/data-table/examples/EmployeeTable.tsx` | `demo-apps/eyerrems/src/components/data-table/examples/EmployeeTable.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/data-table/examples/index.tsx` | `demo-apps/eyerrems/src/components/data-table/examples/index.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/data-table/SmartTable.tsx` | `demo-apps/eyerrems/src/components/data-table/SmartTable.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/DemoModeBanner.tsx` | `demo-apps/eyerrems/src/components/DemoModeBanner.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/detail/index.tsx` | `demo-apps/eyerrems/src/components/detail/index.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/ErrorBoundary.tsx` | `demo-apps/eyerrems/src/components/ErrorBoundary.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/ErrorTracker.tsx` | `demo-apps/eyerrems/src/components/ErrorTracker.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/FeatureGuard.tsx` | `demo-apps/eyerrems/src/components/FeatureGuard.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/finance/AccountDetailPanel.tsx` | `demo-apps/eyerrems/src/components/finance/AccountDetailPanel.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/finance/AccountDialogs.tsx` | `demo-apps/eyerrems/src/components/finance/AccountDialogs.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/finance/ChartOfAccountsSimple.tsx` | `demo-apps/eyerrems/src/components/finance/ChartOfAccountsSimple.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/finance/CommissionWorkflow.tsx` | `demo-apps/eyerrems/src/components/finance/CommissionWorkflow.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/finance/CreateExpenseDialog.tsx` | `demo-apps/eyerrems/src/components/finance/CreateExpenseDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/finance/CreateInvoiceDialog.tsx` | `demo-apps/eyerrems/src/components/finance/CreateInvoiceDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/finance/CreateJournalDialog.tsx` | `demo-apps/eyerrems/src/components/finance/CreateJournalDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/finance/FinanceDialogs.tsx` | `demo-apps/eyerrems/src/components/finance/FinanceDialogs.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/finance/FinanceSyncBadge.tsx` | `demo-apps/eyerrems/src/components/finance/FinanceSyncBadge.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/finance/GeneralLedger.tsx` | `demo-apps/eyerrems/src/components/finance/GeneralLedger.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/finance/InvoiceDetailView.tsx` | `demo-apps/eyerrems/src/components/finance/InvoiceDetailView.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/finance/InvoicesTab.tsx` | `demo-apps/eyerrems/src/components/finance/InvoicesTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/finance/JournalDetailView.tsx` | `demo-apps/eyerrems/src/components/finance/JournalDetailView.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/finance/JournalsTab.tsx` | `demo-apps/eyerrems/src/components/finance/JournalsTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/finance/MakePaymentDialog.tsx` | `demo-apps/eyerrems/src/components/finance/MakePaymentDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/finance/OperationsTab.tsx` | `demo-apps/eyerrems/src/components/finance/OperationsTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/finance/PaymentHistory.tsx` | `demo-apps/eyerrems/src/components/finance/PaymentHistory.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/finance/ReceiptView.tsx` | `demo-apps/eyerrems/src/components/finance/ReceiptView.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/finance/TenantSelect.tsx` | `demo-apps/eyerrems/src/components/finance/TenantSelect.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/finance/UnifiedLedgersTab.tsx` | `demo-apps/eyerrems/src/components/finance/UnifiedLedgersTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/finance/VendorSelect.tsx` | `demo-apps/eyerrems/src/components/finance/VendorSelect.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/guards/ModuleGuard.tsx` | `demo-apps/eyerrems/src/components/guards/ModuleGuard.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/guards/RoleUserGuard.tsx` | `demo-apps/eyerrems/src/components/guards/RoleUserGuard.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/import/BulkImportTab.tsx` | `demo-apps/eyerrems/src/components/import/BulkImportTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/import/FileDropzone.tsx` | `demo-apps/eyerrems/src/components/import/FileDropzone.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/import/ImportPreviewTable.tsx` | `demo-apps/eyerrems/src/components/import/ImportPreviewTable.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/import/ImportWizard.tsx` | `demo-apps/eyerrems/src/components/import/ImportWizard.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/import/MasterImportModal.tsx` | `demo-apps/eyerrems/src/components/import/MasterImportModal.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/import/MasterImportWizard.tsx` | `demo-apps/eyerrems/src/components/import/MasterImportWizard.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/mail/AccountSetupModal.tsx` | `demo-apps/eyerrems/src/components/mail/AccountSetupModal.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/mail/ComposeModal.tsx` | `demo-apps/eyerrems/src/components/mail/ComposeModal.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/mail/EmailList.tsx` | `demo-apps/eyerrems/src/components/mail/EmailList.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/mail/EmailPreview.tsx` | `demo-apps/eyerrems/src/components/mail/EmailPreview.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/mail/MailSidebar.tsx` | `demo-apps/eyerrems/src/components/mail/MailSidebar.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/Modal.tsx` | `demo-apps/eyerrems/src/components/Modal.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/notifications/NotificationBell.tsx` | `demo-apps/eyerrems/src/components/notifications/NotificationBell.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/notifications/ToastContainer.tsx` | `demo-apps/eyerrems/src/components/notifications/ToastContainer.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/AdvancedOptions.tsx` | `demo-apps/eyerrems/src/components/property/AdvancedOptions.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/AmenityPicker.tsx` | `demo-apps/eyerrems/src/components/property/AmenityPicker.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/dialogs/AddBuyerDialog.tsx` | `demo-apps/eyerrems/src/components/property/dialogs/AddBuyerDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/dialogs/AddLeaseDialog.tsx` | `demo-apps/eyerrems/src/components/property/dialogs/AddLeaseDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/dialogs/AddPropertyDialog.tsx` | `demo-apps/eyerrems/src/components/property/dialogs/AddPropertyDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/dialogs/AddRoleDialog.tsx` | `demo-apps/eyerrems/src/components/property/dialogs/AddRoleDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/dialogs/AddSellerDialog.tsx` | `demo-apps/eyerrems/src/components/property/dialogs/AddSellerDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/dialogs/AddUnitDialog.tsx` | `demo-apps/eyerrems/src/components/property/dialogs/AddUnitDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/dialogs/BuyerProfileDialog.tsx` | `demo-apps/eyerrems/src/components/property/dialogs/BuyerProfileDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/dialogs/CancelSaleDialog.tsx` | `demo-apps/eyerrems/src/components/property/dialogs/CancelSaleDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/dialogs/CompleteSaleDialog.tsx` | `demo-apps/eyerrems/src/components/property/dialogs/CompleteSaleDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/dialogs/LogInteractionDialog.tsx` | `demo-apps/eyerrems/src/components/property/dialogs/LogInteractionDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/dialogs/RecordPaymentDialog.tsx` | `demo-apps/eyerrems/src/components/property/dialogs/RecordPaymentDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/dialogs/RecordSaleDialog.tsx` | `demo-apps/eyerrems/src/components/property/dialogs/RecordSaleDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/dialogs/SaleDetailsDialog.tsx` | `demo-apps/eyerrems/src/components/property/dialogs/SaleDetailsDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/dialogs/SellerProfileDialog.tsx` | `demo-apps/eyerrems/src/components/property/dialogs/SellerProfileDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/dialogs/UpdateSaleStageDialog.tsx` | `demo-apps/eyerrems/src/components/property/dialogs/UpdateSaleStageDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/LocationPicker.tsx` | `demo-apps/eyerrems/src/components/property/LocationPicker.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/PropertyDetail.tsx` | `demo-apps/eyerrems/src/components/property/PropertyDetail.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/tabs/BuyersTab.tsx` | `demo-apps/eyerrems/src/components/property/tabs/BuyersTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/tabs/LeaseTab.tsx` | `demo-apps/eyerrems/src/components/property/tabs/LeaseTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/tabs/PropertiesTab.tsx` | `demo-apps/eyerrems/src/components/property/tabs/PropertiesTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/tabs/SalesTab.tsx` | `demo-apps/eyerrems/src/components/property/tabs/SalesTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/tabs/SellersTab.tsx` | `demo-apps/eyerrems/src/components/property/tabs/SellersTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/property/tabs/UnitsTab.tsx` | `demo-apps/eyerrems/src/components/property/tabs/UnitsTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/ProtectedRoute.tsx` | `demo-apps/eyerrems/src/components/ProtectedRoute.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/RecordHistory.tsx` | `demo-apps/eyerrems/src/components/RecordHistory.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/reminders/AddReminderButton.tsx` | `demo-apps/eyerrems/src/components/reminders/AddReminderButton.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/reminders/MyRemindersTable.tsx` | `demo-apps/eyerrems/src/components/reminders/MyRemindersTable.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/reminders/NotificationCenter.tsx` | `demo-apps/eyerrems/src/components/reminders/NotificationCenter.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/reminders/NotificationLogs.tsx` | `demo-apps/eyerrems/src/components/reminders/NotificationLogs.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/reminders/ReminderCalendar.tsx` | `demo-apps/eyerrems/src/components/reminders/ReminderCalendar.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/reminders/ReminderCard.tsx` | `demo-apps/eyerrems/src/components/reminders/ReminderCard.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/reminders/ReminderDashboard.tsx` | `demo-apps/eyerrems/src/components/reminders/ReminderDashboard.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/reminders/ReminderForm.tsx` | `demo-apps/eyerrems/src/components/reminders/ReminderForm.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/reminders/ReminderStats.tsx` | `demo-apps/eyerrems/src/components/reminders/ReminderStats.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/reminders/TemplatesTab.tsx` | `demo-apps/eyerrems/src/components/reminders/TemplatesTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/reports/ReportDialog.tsx` | `demo-apps/eyerrems/src/components/reports/ReportDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/reports/ReportSettingsModal.tsx` | `demo-apps/eyerrems/src/components/reports/ReportSettingsModal.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/Sidebar.tsx` | `demo-apps/eyerrems/src/components/Sidebar.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/Topbar.tsx` | `demo-apps/eyerrems/src/components/Topbar.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/ui/AppDialog.jsx` | `demo-apps/eyerrems/src/components/ui/AppDialog.jsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/ui/AsyncCombobox.tsx` | `demo-apps/eyerrems/src/components/ui/AsyncCombobox.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/ui/AsyncDebouncedSelect.tsx` | `demo-apps/eyerrems/src/components/ui/AsyncDebouncedSelect.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/ui/DataTable.tsx` | `demo-apps/eyerrems/src/components/ui/DataTable.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/ui/Dialog.jsx` | `demo-apps/eyerrems/src/components/ui/Dialog.jsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/ui/DialogButtons.jsx` | `demo-apps/eyerrems/src/components/ui/DialogButtons.jsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/ui/DialogForm.jsx` | `demo-apps/eyerrems/src/components/ui/DialogForm.jsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/ui/FilesCountBadge.jsx` | `demo-apps/eyerrems/src/components/ui/FilesCountBadge.jsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/ui/FileUpload.jsx` | `demo-apps/eyerrems/src/components/ui/FileUpload.jsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/ui/FormLabel.tsx` | `demo-apps/eyerrems/src/components/ui/FormLabel.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/ui/FormSection.tsx` | `demo-apps/eyerrems/src/components/ui/FormSection.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/ui/ModuleDialog.tsx` | `demo-apps/eyerrems/src/components/ui/ModuleDialog.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/ui/ModuleTabs.tsx` | `demo-apps/eyerrems/src/components/ui/ModuleTabs.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/ui/ScreenBackground.tsx` | `demo-apps/eyerrems/src/components/ui/ScreenBackground.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/ui/SearchableSelect.tsx` | `demo-apps/eyerrems/src/components/ui/SearchableSelect.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/ui/StatCard.tsx` | `demo-apps/eyerrems/src/components/ui/StatCard.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/ui/ToggleSwitch.jsx` | `demo-apps/eyerrems/src/components/ui/ToggleSwitch.jsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/components/UpdateNotification.tsx` | `demo-apps/eyerrems/src/components/UpdateNotification.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/contexts/ModuleColorContext.tsx` | `demo-apps/eyerrems/src/contexts/ModuleColorContext.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/main.tsx` | `demo-apps/eyerrems/src/main.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/Admin/tabs/AuditLogsTab.tsx` | `demo-apps/eyerrems/src/modules/Admin/tabs/AuditLogsTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/Admin/tabs/DetailTab.tsx` | `demo-apps/eyerrems/src/modules/Admin/tabs/DetailTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/Admin/tabs/MonitoringTab.tsx` | `demo-apps/eyerrems/src/modules/Admin/tabs/MonitoringTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/Admin/tabs/ReportSettingsTab.tsx` | `demo-apps/eyerrems/src/modules/Admin/tabs/ReportSettingsTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/Admin/tabs/RolesTab.tsx` | `demo-apps/eyerrems/src/modules/Admin/tabs/RolesTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/Admin/tabs/UsersTab.tsx` | `demo-apps/eyerrems/src/modules/Admin/tabs/UsersTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/construction/ConstructionDashboard.tsx` | `demo-apps/eyerrems/src/modules/construction/ConstructionDashboard.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/construction/ProjectDetails.tsx` | `demo-apps/eyerrems/src/modules/construction/ProjectDetails.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/construction/ProjectList.tsx` | `demo-apps/eyerrems/src/modules/construction/ProjectList.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/construction/ProjectView.tsx` | `demo-apps/eyerrems/src/modules/construction/ProjectView.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/construction/tabs/BudgetTab.tsx` | `demo-apps/eyerrems/src/modules/construction/tabs/BudgetTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/construction/tabs/DocumentsTab.tsx` | `demo-apps/eyerrems/src/modules/construction/tabs/DocumentsTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/construction/tabs/ExecutionTab.tsx` | `demo-apps/eyerrems/src/modules/construction/tabs/ExecutionTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/construction/tabs/FinanceTab.tsx` | `demo-apps/eyerrems/src/modules/construction/tabs/FinanceTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/construction/tabs/NotificationsTab.tsx` | `demo-apps/eyerrems/src/modules/construction/tabs/NotificationsTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/construction/tabs/OverviewTab.tsx` | `demo-apps/eyerrems/src/modules/construction/tabs/OverviewTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/construction/tabs/PlanningTab.tsx` | `demo-apps/eyerrems/src/modules/construction/tabs/PlanningTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/construction/tabs/ProcurementTab.tsx` | `demo-apps/eyerrems/src/modules/construction/tabs/ProcurementTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/construction/tabs/QualityTab.tsx` | `demo-apps/eyerrems/src/modules/construction/tabs/QualityTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/construction/tabs/ResourcesTab.tsx` | `demo-apps/eyerrems/src/modules/construction/tabs/ResourcesTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/construction/tabs/SafetyTab.tsx` | `demo-apps/eyerrems/src/modules/construction/tabs/SafetyTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/construction/tabs/TimelineTab.tsx` | `demo-apps/eyerrems/src/modules/construction/tabs/TimelineTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/SuperAdmin/pages/CompaniesPage.tsx` | `demo-apps/eyerrems/src/modules/SuperAdmin/pages/CompaniesPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/SuperAdmin/pages/CompanyDetailPage.tsx` | `demo-apps/eyerrems/src/modules/SuperAdmin/pages/CompanyDetailPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/SuperAdmin/pages/DevicesPage.tsx` | `demo-apps/eyerrems/src/modules/SuperAdmin/pages/DevicesPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/SuperAdmin/pages/LicensesPage.tsx` | `demo-apps/eyerrems/src/modules/SuperAdmin/pages/LicensesPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/SuperAdmin/pages/SuperAdminDashboard.tsx` | `demo-apps/eyerrems/src/modules/SuperAdmin/pages/SuperAdminDashboard.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/SuperAdmin/SuperAdminLayout.tsx` | `demo-apps/eyerrems/src/modules/SuperAdmin/SuperAdminLayout.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/Sync/SyncPage.tsx` | `demo-apps/eyerrems/src/modules/Sync/SyncPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/modules/Users/UsersPage.tsx` | `demo-apps/eyerrems/src/modules/Users/UsersPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/AccessDenied.tsx` | `demo-apps/eyerrems/src/pages/AccessDenied.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/Admin.tsx` | `demo-apps/eyerrems/src/pages/Admin.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/AdvanceOptions.tsx` | `demo-apps/eyerrems/src/pages/AdvanceOptions.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/AIIntelligence.tsx` | `demo-apps/eyerrems/src/pages/AIIntelligence.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/BackupRestore.tsx` | `demo-apps/eyerrems/src/pages/BackupRestore.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/Bookings.tsx` | `demo-apps/eyerrems/src/pages/Bookings.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/ChangePassword.tsx` | `demo-apps/eyerrems/src/pages/ChangePassword.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/Communication.tsx` | `demo-apps/eyerrems/src/pages/Communication.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/crm/bookings/BookingConvertModal.tsx` | `demo-apps/eyerrems/src/pages/crm/bookings/BookingConvertModal.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/crm/bookings/BookingCreateModal.tsx` | `demo-apps/eyerrems/src/pages/crm/bookings/BookingCreateModal.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/crm/bookings/BookingDetail.tsx` | `demo-apps/eyerrems/src/pages/crm/bookings/BookingDetail.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/crm/bookings/BookingExtendModal.tsx` | `demo-apps/eyerrems/src/pages/crm/bookings/BookingExtendModal.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/crm/bookings/BookingList.tsx` | `demo-apps/eyerrems/src/pages/crm/bookings/BookingList.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/crm/ClientDetail.tsx` | `demo-apps/eyerrems/src/pages/crm/ClientDetail.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/crm/CRMDashboard.tsx` | `demo-apps/eyerrems/src/pages/crm/CRMDashboard.tsx` | Original component copied unchanged | Limited browser smoke passed; see JSON | Pending |
| `Eyerrems-desktop/frontend/src/pages/crm/DealDetail.tsx` | `demo-apps/eyerrems/src/pages/crm/DealDetail.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/crm/DealerDetail.tsx` | `demo-apps/eyerrems/src/pages/crm/DealerDetail.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/crm/FollowUps.tsx` | `demo-apps/eyerrems/src/pages/crm/FollowUps.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/crm/InstallmentPlanBuilder.tsx` | `demo-apps/eyerrems/src/pages/crm/InstallmentPlanBuilder.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/crm/Installments.tsx` | `demo-apps/eyerrems/src/pages/crm/Installments.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/crm/LeadDetail.tsx` | `demo-apps/eyerrems/src/pages/crm/LeadDetail.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/crm/Payments.tsx` | `demo-apps/eyerrems/src/pages/crm/Payments.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/crm/SiteVisits.tsx` | `demo-apps/eyerrems/src/pages/crm/SiteVisits.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/CRM.tsx` | `demo-apps/eyerrems/src/pages/CRM.tsx` | Original component copied unchanged | Limited browser smoke passed; see JSON | Pending |
| `Eyerrems-desktop/frontend/src/pages/Dashboard.tsx` | `demo-apps/eyerrems/src/pages/Dashboard.tsx` | Original component copied unchanged | Limited browser smoke passed; see JSON | Pending |
| `Eyerrems-desktop/frontend/src/pages/Documentation.tsx` | `demo-apps/eyerrems/src/pages/Documentation.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/Finance.tsx` | `demo-apps/eyerrems/src/pages/Finance.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/History.tsx` | `demo-apps/eyerrems/src/pages/History.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/hr/PerformanceTab.tsx` | `demo-apps/eyerrems/src/pages/hr/PerformanceTab.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/HR.tsx` | `demo-apps/eyerrems/src/pages/HR.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/ImportCenter.tsx` | `demo-apps/eyerrems/src/pages/ImportCenter.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/ledger/AddEntryModal.tsx` | `demo-apps/eyerrems/src/pages/ledger/AddEntryModal.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/ledger/ClientLedger.tsx` | `demo-apps/eyerrems/src/pages/ledger/ClientLedger.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/ledger/DealerLedger.tsx` | `demo-apps/eyerrems/src/pages/ledger/DealerLedger.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/ledger/LedgerDetailModal.tsx` | `demo-apps/eyerrems/src/pages/ledger/LedgerDetailModal.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/ledger/LedgerFilters.tsx` | `demo-apps/eyerrems/src/pages/ledger/LedgerFilters.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/ledger/LedgersPage.tsx` | `demo-apps/eyerrems/src/pages/ledger/LedgersPage.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/ledger/LedgerSummaryCards.tsx` | `demo-apps/eyerrems/src/pages/ledger/LedgerSummaryCards.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/ledger/LedgerTable.tsx` | `demo-apps/eyerrems/src/pages/ledger/LedgerTable.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/ledger/PropertyLedger.tsx` | `demo-apps/eyerrems/src/pages/ledger/PropertyLedger.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/Login.tsx` | `demo-apps/eyerrems/src/pages/Login.tsx` | Adapted; inspect diff | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/Mail.tsx` | `demo-apps/eyerrems/src/pages/Mail.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/Maintenance.tsx` | `demo-apps/eyerrems/src/pages/Maintenance.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/ProductSpreadsheetPage.jsx` | `demo-apps/eyerrems/src/pages/ProductSpreadsheetPage.jsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/Property.tsx` | `demo-apps/eyerrems/src/pages/Property.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/PropertyView.tsx` | `demo-apps/eyerrems/src/pages/PropertyView.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/RecentActivity.tsx` | `demo-apps/eyerrems/src/pages/RecentActivity.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/RecycleBin.tsx` | `demo-apps/eyerrems/src/pages/RecycleBin.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/Reminders.tsx` | `demo-apps/eyerrems/src/pages/Reminders.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/ReportDetail.tsx` | `demo-apps/eyerrems/src/pages/ReportDetail.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/ReportsHub.tsx` | `demo-apps/eyerrems/src/pages/ReportsHub.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/Settings.tsx` | `demo-apps/eyerrems/src/pages/Settings.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/Tenant.tsx` | `demo-apps/eyerrems/src/pages/Tenant.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/TenantDetail.tsx` | `demo-apps/eyerrems/src/pages/TenantDetail.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/towns/TownDetail.tsx` | `demo-apps/eyerrems/src/pages/towns/TownDetail.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/pages/towns/TownList.tsx` | `demo-apps/eyerrems/src/pages/towns/TownList.tsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/spreadsheet/components/ContextMenu.jsx` | `demo-apps/eyerrems/src/spreadsheet/components/ContextMenu.jsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/spreadsheet/components/FindReplace.jsx` | `demo-apps/eyerrems/src/spreadsheet/components/FindReplace.jsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/spreadsheet/components/FormulaBar.jsx` | `demo-apps/eyerrems/src/spreadsheet/components/FormulaBar.jsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/spreadsheet/components/SheetTabs.jsx` | `demo-apps/eyerrems/src/spreadsheet/components/SheetTabs.jsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/spreadsheet/components/StatusBar.jsx` | `demo-apps/eyerrems/src/spreadsheet/components/StatusBar.jsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/spreadsheet/components/Toolbar.jsx` | `demo-apps/eyerrems/src/spreadsheet/components/Toolbar.jsx` | Original component copied unchanged | Pending | Pending |
| `Eyerrems-desktop/frontend/src/spreadsheet/Spreadsheet.jsx` | `demo-apps/eyerrems/src/spreadsheet/Spreadsheet.jsx` | Adapted; inspect diff | Pending | Pending |
| `Eyerrems-desktop/frontend/src/spreadsheet/SpreadsheetWorkspace.jsx` | `demo-apps/eyerrems/src/spreadsheet/SpreadsheetWorkspace.jsx` | Original component copied unchanged | Pending | Pending |
