/**
 * ERP shared contracts.
 *
 * These interfaces mirror the main-process ERP service types one-for-one so
 * the renderer can be typed against the same shape without importing main
 * code. Money everywhere is integer fils; rates are micro-units (×1,000,000);
 * quantities are integer milli-units.
 */

/* --------------------------------- Entities --------------------------------- */

export interface ErpCompany {
  readonly id: number;
  readonly code: string;
  readonly name: string;
  readonly legalName: string | null;
  readonly currencyCode: string;
  readonly fiscalStartMonth: number;
  readonly ntn: string | null;
  readonly strn: string | null;
  readonly address: string | null;
  readonly isDefault: boolean;
  readonly isActive: boolean;
}

export type ErpCurrency = { readonly code: string; readonly name: string; readonly decimals: number; readonly isActive: boolean };

export type ErpExchangeRate = {
  readonly id: number;
  readonly companyId: number;
  readonly currencyCode: string;
  readonly rateMicro: number;
  readonly effectiveFrom: string;
  readonly effectiveTo: string | null;
  readonly source: string | null;
};

/* ------------------------------ Fiscal calendar ------------------------------ */

export type FiscalStatus = "open" | "soft_closed" | "locked";

export interface FiscalPeriod {
  readonly id: number;
  readonly fiscalYearId: number;
  readonly periodName: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly status: FiscalStatus;
}

export interface FiscalYear {
  readonly id: number;
  readonly companyId: number;
  readonly name: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly status: "open" | "closed";
}

/* ------------------------------ Chart of accounts ---------------------------- */

export type ErpAccountType = "asset" | "liability" | "equity" | "income" | "expense";

export interface ErpAccount {
  readonly id: number;
  readonly companyId: number;
  readonly code: string;
  readonly name: string;
  readonly type: ErpAccountType;
  readonly subtype: string | null;
  readonly parentId: number | null;
  readonly normalBalance: "debit" | "credit";
  readonly isSystem: boolean;
  readonly isActive: boolean;
  readonly isPostable: boolean;
  readonly currencyCode: string | null;
  readonly requireCostCenter: boolean;
  readonly requireProject: boolean;
  readonly description: string | null;
  readonly hasPostings: boolean;
}

export interface ErpAccountInput {
  readonly id?: number;
  readonly companyId?: number;
  readonly code: string;
  readonly name: string;
  readonly type: ErpAccountType;
  readonly subtype?: string;
  readonly parentId?: number | null;
  readonly normalBalance: "debit" | "credit";
  readonly isPostable: boolean;
  readonly currencyCode?: string | null;
  readonly requireCostCenter?: boolean;
  readonly requireProject?: boolean;
  readonly description?: string;
  readonly isActive?: boolean;
}

/* ---------------------------------- Journals --------------------------------- */

export type ErpJournalType =
  | "manual"
  | "opening"
  | "adjustment"
  | "closing"
  | "reversal"
  | "accrual"
  | "revaluation";

export type ErpJournalStatus =
  | "draft"
  | "pending_review"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "posted";

export type ErpJournalSource =
  | "ar_invoice"
  | "credit_note"
  | "customer_receipt"
  | "ap_bill"
  | "debit_note"
  | "supplier_payment"
  | "bank_transfer"
  | "bank_charge"
  | "payroll"
  | "payroll_payment"
  | "depreciation"
  | "asset_acquisition"
  | "asset_disposal"
  | "inventory"
  | "manufacturing"
  | "ecommerce"
  | "oms"
  | "tax"
  | "opening"
  | "manual"
  | "reversal"
  | "adjustment"
  | "closing"
  | "intercompany"
  | "fx_revaluation";

export interface ErpJournalLine {
  readonly lineNo: number;
  readonly accountCode: string;
  readonly accountName: string | null;
  readonly debitFils: number;
  readonly creditFils: number;
  readonly description: string | null;
}

export interface ErpJournal {
  readonly id: number;
  readonly companyId: number;
  readonly entryNo: string;
  readonly entryDate: string;
  readonly reference: string | null;
  readonly description: string;
  readonly status: "draft" | "posted" | "reversed";
  readonly erpStatus: ErpJournalStatus;
  readonly erpSource: ErpJournalSource;
  readonly journalType: ErpJournalType;
  readonly sourceKey: string | null;
  readonly totalDebitFils: number;
  readonly totalCreditFils: number;
  readonly lines: readonly ErpJournalLine[];
}

export interface ErpJournalLineInput {
  readonly accountCode: string;
  readonly debitFils?: number;
  readonly creditFils?: number;
  readonly description?: string;
  readonly costCenterId?: number | null;
  readonly departmentId?: number | null;
  readonly projectId?: number | null;
  readonly branchId?: number | null;
  readonly partyId?: number | null;
}

export interface ErpJournalInput {
  readonly companyId?: number;
  readonly erpSource: ErpJournalSource;
  readonly journalType?: ErpJournalType;
  readonly entryDate: string;
  readonly documentDate?: string;
  readonly reference?: string;
  readonly description: string;
  readonly sourceKey?: string;
  readonly currencyCode?: string;
  readonly post?: boolean;
  readonly lines: readonly ErpJournalLineInput[];
}

/* ---------------------------------- Reports ---------------------------------- */

export interface ErpStatementLine {
  readonly code: string;
  readonly name: string;
  readonly amountFils: number;
}

export interface ErpTrialBalance {
  readonly companyId: number;
  readonly fromDate: string;
  readonly toDate: string;
  readonly lines: readonly {
    readonly code: string;
    readonly name: string;
    readonly type: ErpAccountType;
    readonly openingDebitFils: number;
    readonly openingCreditFils: number;
    readonly periodDebitFils: number;
    readonly periodCreditFils: number;
    readonly closingDebitFils: number;
    readonly closingCreditFils: number;
  }[];
  readonly totalDebitFils: number;
  readonly totalCreditFils: number;
  readonly isBalanced: boolean;
}

export interface ErpProfitLoss {
  readonly companyId: number;
  readonly fromDate: string;
  readonly toDate: string;
  readonly revenueFils: number;
  readonly revenueLines: readonly ErpStatementLine[];
  readonly costOfSalesFils: number;
  readonly costOfSalesLines: readonly ErpStatementLine[];
  readonly grossProfitFils: number;
  readonly operatingExpenseFils: number;
  readonly operatingExpenseLines: readonly ErpStatementLine[];
  readonly operatingProfitFils: number;
  readonly otherIncomeFils: number;
  readonly otherExpenseFils: number;
  readonly netProfitFils: number;
}

export interface ErpBalanceSheet {
  readonly companyId: number;
  readonly asOfDate: string;
  readonly assetLines: readonly ErpStatementLine[];
  readonly totalAssetsFils: number;
  readonly liabilityLines: readonly ErpStatementLine[];
  readonly totalLiabilitiesFils: number;
  readonly equityLines: readonly ErpStatementLine[];
  readonly totalEquityFils: number;
  readonly retainedProfitFils: number;
  readonly totalLiabilitiesAndEquityFils: number;
  readonly isBalanced: boolean;
  readonly differenceFils: number;
}

export interface ErpCashFlow {
  readonly companyId: number;
  readonly fromDate: string;
  readonly toDate: string;
  readonly cashInFils: number;
  readonly cashOutFils: number;
  readonly netFils: number;
  readonly lines: readonly { readonly code: string; readonly name: string; readonly inFils: number; readonly outFils: number }[];
}

export interface ErpAgingRow {
  readonly partyId: number;
  readonly partyName: string | null;
  readonly bucketCurrentFils: number;
  readonly bucket30Fils: number;
  readonly bucket60Fils: number;
  readonly bucket90Fils: number;
  readonly bucketOver90Fils: number;
  readonly totalFils: number;
}

export interface ErpSubledgerRecon {
  readonly companyId: number;
  readonly asOfDate: string;
  readonly rows: readonly {
    readonly code: string;
    readonly name: string;
    readonly glBalanceFils: number;
    readonly subledgerFils: number;
    readonly differenceFils: number;
    readonly inSync: boolean;
  }[];
}

export interface ErpClosingChecklist {
  readonly companyId: number;
  readonly fiscalYearId: number;
  readonly items: readonly {
    readonly label: string;
    readonly ok: boolean;
    readonly detail: string | null;
  }[];
  readonly readyToClose: boolean;
}

/* -------------------------------- Dimensions --------------------------------- */

export type DimensionKind =
  | "department"
  | "cost_center"
  | "branch"
  | "project"
  | "profit_center"
  | "business_unit";

export interface ErpDimension {
  readonly id: number;
  readonly companyId: number;
  readonly kind: DimensionKind;
  readonly code: string;
  readonly name: string;
  readonly parentId: number | null;
  readonly isActive: boolean;
}

/* ----------------------------------- Tax ------------------------------------- */

export interface ErpTaxCode {
  readonly id: number;
  readonly companyId: number;
  readonly code: string;
  readonly name: string;
  readonly kind: "output" | "input" | "withholding" | "exempt";
  readonly rateBp: number;
  readonly isInclusive: boolean;
  readonly glAccountCode: string;
  readonly effectiveFrom: string;
  readonly effectiveTo: string | null;
  readonly jurisdiction: string | null;
  readonly isActive: boolean;
}

/* ------------------------------------ AR ------------------------------------- */

export interface CustomerInvoiceLine {
  readonly lineNo: number;
  readonly description: string;
  readonly quantityMilli: number;
  readonly unitPriceFils: number;
  readonly taxCodeId: number | null;
  readonly taxFils: number;
  readonly lineTotalFils: number;
  readonly costCenterId: number | null;
  readonly projectId: number | null;
}

export interface CustomerInvoice {
  readonly id: number;
  readonly companyId: number;
  readonly invoiceNo: string;
  readonly customerId: number;
  readonly customerName: string | null;
  readonly invoiceDate: string;
  readonly dueDate: string;
  readonly currencyCode: string;
  readonly exchangeRate: number;
  readonly status: string;
  readonly subtotalFils: number;
  readonly taxFils: number;
  readonly totalFils: number;
  readonly paidFils: number;
  readonly sourceSuite: string | null;
  readonly sourceRef: string | null;
  readonly journalEntryId: number | null;
  readonly lines: readonly CustomerInvoiceLine[];
}

export interface CustomerInvoiceInput {
  readonly id?: number;
  readonly companyId?: number;
  readonly customerId: number;
  readonly invoiceDate: string;
  readonly dueDate?: string;
  readonly termsDays?: number;
  readonly currencyCode?: string;
  readonly sourceSuite?: string;
  readonly sourceRef?: string;
  readonly notes?: string;
  readonly lines: readonly {
    readonly description: string;
    readonly quantityMilli?: number;
    readonly unitPriceFils: number;
    readonly taxCodeId?: number | null;
    readonly costCenterId?: number | null;
    readonly projectId?: number | null;
  }[];
}

/* ------------------------------------ AP ------------------------------------- */

export interface SupplierBillLine {
  readonly lineNo: number;
  readonly description: string;
  readonly quantityMilli: number;
  readonly unitPriceFils: number;
  readonly taxCodeId: number | null;
  readonly taxFils: number;
  readonly lineTotalFils: number;
}

export interface SupplierBill {
  readonly id: number;
  readonly companyId: number;
  readonly billNo: string;
  readonly supplierId: number;
  readonly supplierName: string | null;
  readonly supplierRef: string | null;
  readonly poRef: string | null;
  readonly receiptRef: string | null;
  readonly billDate: string;
  readonly dueDate: string;
  readonly currencyCode: string;
  readonly exchangeRate: number;
  readonly status: string;
  readonly subtotalFils: number;
  readonly taxFils: number;
  readonly totalFils: number;
  readonly paidFils: number;
  readonly journalEntryId: number | null;
  readonly lines: readonly SupplierBillLine[];
}

export interface SupplierBillInput {
  readonly id?: number;
  readonly companyId?: number;
  readonly supplierId: number;
  readonly supplierRef?: string;
  readonly poRef?: string;
  readonly receiptRef?: string;
  readonly billDate: string;
  readonly dueDate?: string;
  readonly currencyCode?: string;
  readonly lines: readonly {
    readonly description: string;
    readonly quantityMilli?: number;
    readonly unitPriceFils: number;
    readonly taxCodeId?: number | null;
  }[];
}

/* ---------------------------------- Payments --------------------------------- */

export interface ErpPayment {
  readonly id: number;
  readonly companyId: number;
  readonly paymentNo: string;
  readonly kind: string;
  readonly direction: string;
  readonly partyId: number | null;
  readonly partyName: string | null;
  readonly method: string;
  readonly bankAccountId: number | null;
  readonly paymentDate: string;
  readonly amountFils: number;
  readonly unappliedFils: number;
  readonly status: string;
  readonly reference: string | null;
  readonly chequeNo: string | null;
  readonly journalEntryId: number | null;
  readonly allocations: readonly {
    readonly documentKind: string;
    readonly documentId: number;
    readonly amountFils: number;
    readonly documentNo: string | null;
  }[];
}

export interface ErpPaymentInput {
  readonly companyId?: number;
  readonly kind: "customer_receipt" | "supplier_payment" | "bank_transfer" | "cash_transfer" | "bank_charge" | "other";
  readonly direction: "in" | "out" | "internal";
  readonly partyId?: number | null;
  readonly method: "cash" | "bank" | "cheque";
  readonly bankAccountId?: number | null;
  readonly paymentDate: string;
  readonly currencyCode?: string;
  readonly amountFils: number;
  readonly reference?: string;
  readonly chequeNo?: string;
  readonly notes?: string;
  readonly allocations?: readonly {
    readonly documentKind: "customer_invoice" | "supplier_bill" | "credit_note" | "debit_note";
    readonly documentId: number;
    readonly amountFils: number;
  }[];
  readonly counterAccountCode?: string;
  readonly targetBankAccountId?: number;
}

/* ----------------------------------- Bank ------------------------------------ */

export interface ErpBankAccount {
  readonly id: number;
  readonly companyId: number;
  readonly name: string;
  readonly bankName: string | null;
  readonly accountNumber: string | null;
  readonly kind: string;
  readonly glAccountCode: string;
  readonly currencyCode: string;
  readonly isActive: boolean;
}

export interface ErpStatementLineRow {
  readonly id: number;
  readonly statementId: number;
  readonly lineNo: number;
  readonly valueDate: string;
  readonly description: string;
  readonly amountFils: number;
  readonly matchedPaymentId: number | null;
  readonly matchedConfidence: number | null;
  readonly bookedJournalId: number | null;
  readonly status: string;
}

export interface ErpBankStatement {
  readonly id: number;
  readonly bankAccountId: number;
  readonly statementNo: string | null;
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly openingBalanceFils: number;
  readonly closingBalanceFils: number;
  readonly lines: readonly ErpStatementLineRow[];
}

/* ----------------------------------- Assets ---------------------------------- */

export interface ErpFixedAsset {
  readonly id: number;
  readonly companyId: number;
  readonly assetNo: string;
  readonly name: string;
  readonly categoryCode: string;
  readonly acquiredOn: string;
  readonly costFils: number;
  readonly salvageFils: number;
  readonly usefulLifeMonths: number;
  readonly method: "straight_line" | "declining_balance";
  readonly rateBp: number | null;
  readonly status: string;
  readonly accumulatedFils: number;
}

export interface ErpDepreciationRow {
  readonly assetId: number;
  readonly assetNo: string;
  readonly assetName: string;
  readonly periodName: string;
  readonly amountFils: number;
  readonly posted: boolean;
}

/* ---------------------------------- Budgets ---------------------------------- */

export interface ErpBudget {
  readonly id: number;
  readonly companyId: number;
  readonly code: string;
  readonly name: string;
  readonly fiscalYearId: number;
  readonly fiscalYearName: string | null;
  readonly scope: "company" | "department" | "cost_center" | "project";
  readonly dimensionId: number | null;
  readonly status: "draft" | "submitted" | "approved" | "locked";
  readonly approvedBy: string | null;
  readonly approvedAt: string | null;
  readonly lines: readonly { readonly periodName: string; readonly accountCode: string; readonly amountFils: number }[];
}

export interface ErpBudgetCheck {
  readonly budgetCode: string | null;
  readonly plannedFils: number;
  readonly actualFils: number;
  readonly remainingFils: number;
  readonly ok: boolean;
}

/* ------------------------------- Procurement --------------------------------- */

export interface ErpRequisition {
  readonly id: number;
  readonly companyId: number;
  readonly reqNo: string;
  readonly requestedBy: string;
  readonly kind: "service" | "stock";
  readonly neededBy: string | null;
  readonly justification: string | null;
  readonly estimatedFils: number;
  readonly status: "draft" | "submitted" | "approved" | "rejected" | "converted" | "closed";
  readonly budgetOk: boolean | null;
  readonly approvedBy: string | null;
  readonly approvedAt: string | null;
  readonly rejectionReason: string | null;
  readonly poRef: string | null;
  readonly lines: readonly {
    readonly lineNo: number;
    readonly description: string;
    readonly quantityMilli: number;
    readonly estimatedFils: number;
    readonly costCenterId: number | null;
    readonly projectId: number | null;
  }[];
}

export interface ErpRfq {
  readonly id: number;
  readonly companyId: number;
  readonly rfqNo: string;
  readonly reqId: number | null;
  readonly issuedOn: string;
  readonly closesOn: string | null;
  readonly status: "open" | "closed" | "awarded" | "cancelled";
  readonly awardedSupplierId: number | null;
  readonly awardedQuoteId: number | null;
  readonly quotes: readonly {
    readonly id: number;
    readonly rfqId: number;
    readonly supplierId: number;
    readonly supplierName: string | null;
    readonly quotedFils: number;
    readonly leadTimeDays: number | null;
    readonly validUntil: string | null;
    readonly notes: string | null;
    readonly isSelected: boolean;
    readonly rating: number | null;
  }[];
}

export interface ErpQuoteComparison {
  readonly quoteId: number;
  readonly supplierId: number;
  readonly supplierName: string | null;
  readonly quotedFils: number;
  readonly leadTimeDays: number | null;
  readonly validUntil: string | null;
  readonly rating: number | null;
  readonly isSelected: boolean;
  readonly isLowest: boolean;
}

/* --------------------------------- Suppliers --------------------------------- */

export interface ErpSupplierProfile {
  readonly partyId: number;
  readonly partyName: string | null;
  readonly qualification: string | null;
  readonly category: string | null;
  readonly paymentTermsDays: number | null;
  readonly approvalStatus: "pending" | "approved" | "blocked" | "suspended";
  readonly rating: number | null;
  readonly taxMetadata: string | null;
  readonly contractRef: string | null;
  readonly notes: string | null;
}

/* ------------------------------------ CRM ------------------------------------ */

export interface ErpLead {
  readonly id: number;
  readonly companyId: number;
  readonly leadNo: string;
  readonly name: string;
  readonly organization: string | null;
  readonly source: string | null;
  readonly owner: string | null;
  readonly stage: "new" | "contacted" | "qualified" | "unqualified";
  readonly priority: "low" | "medium" | "high";
  readonly phone: string | null;
  readonly email: string | null;
  readonly notes: string | null;
  readonly convertedOpportunityId: number | null;
}

export interface ErpOpportunity {
  readonly id: number;
  readonly companyId: number;
  readonly oppNo: string;
  readonly name: string;
  readonly partyId: number | null;
  readonly leadId: number | null;
  readonly stage: "new" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
  readonly valueFils: number;
  readonly probability: number;
  readonly expectedClose: string | null;
  readonly owner: string | null;
  readonly winLossReason: string | null;
  readonly orderRef: string | null;
}

export interface ErpActivity {
  readonly id: number;
  readonly companyId: number;
  readonly kind: "call" | "meeting" | "email" | "task" | "note";
  readonly subject: string;
  readonly details: string | null;
  readonly dueOn: string | null;
  readonly doneAt: string | null;
  readonly owner: string | null;
  readonly leadId: number | null;
  readonly opportunityId: number | null;
}

export interface ErpContract {
  readonly id: number;
  readonly companyId: number;
  readonly contractNo: string;
  readonly counterpartyType: "customer" | "supplier";
  readonly counterpartyId: number;
  readonly title: string;
  readonly startDate: string;
  readonly endDate: string | null;
  readonly renewal: string | null;
  readonly pricingTerms: string | null;
  readonly paymentTerms: string | null;
  readonly status: "draft" | "pending_approval" | "approved" | "active" | "expired" | "terminated";
  readonly approvedBy: string | null;
  readonly approvedAt: string | null;
}

export interface ErpPipelineStage {
  readonly stage: string;
  readonly count: number;
  readonly weightedFils: number;
}

/* ------------------------------------- HR ------------------------------------ */

export interface ErpDepartment {
  readonly id: number;
  readonly companyId: number;
  readonly code: string;
  readonly name: string;
  readonly parentId: number | null;
  readonly isActive: boolean;
}

export interface ErpDesignation {
  readonly id: number;
  readonly companyId: number;
  readonly code: string;
  readonly name: string;
  readonly grade: string | null;
  readonly isActive: boolean;
}

export interface ErpEmployee {
  readonly id: number;
  readonly companyId: number;
  readonly employeeNo: string;
  readonly fullName: string;
  readonly status: "draft" | "active" | "probation" | "on_leave" | "resigned" | "terminated";
  readonly employmentType: "permanent" | "probation" | "contract" | "intern" | "part_time";
  readonly departmentId: number | null;
  readonly designationId: number | null;
  readonly managerId: number | null;
  readonly joiningDate: string;
  readonly exitDate: string | null;
  readonly phone: string | null;
  readonly email: string | null;
  readonly cnic: string | null;
  readonly bankAccountRef: string | null;
  readonly userId: number | null;
  readonly notes: string | null;
}

export interface ErpShift {
  readonly id: number;
  readonly companyId: number;
  readonly code: string;
  readonly name: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly crossesMidnight: boolean;
  readonly graceMinutes: number;
}

export interface ErpAttendance {
  readonly id: number;
  readonly companyId: number;
  readonly employeeId: number;
  readonly workDate: string;
  readonly shiftId: number | null;
  readonly checkIn: string | null;
  readonly checkOut: string | null;
  readonly status: "present" | "absent" | "late" | "half_day" | "leave" | "holiday" | "weekend" | "missing_punch";
  readonly lateMinutes: number;
  readonly overtimeMinutes: number;
  readonly correctionNote: string | null;
  readonly isManual: boolean;
}

export interface ErpLeaveType {
  readonly id: number;
  readonly companyId: number;
  readonly code: string;
  readonly name: string;
  readonly annualEntitlementDays: number;
  readonly carryForward: boolean;
  readonly isPaid: boolean;
}

export interface ErpLeaveBalance {
  readonly employeeId: number;
  readonly leaveTypeId: number;
  readonly leaveTypeCode: string;
  readonly year: number;
  readonly carriedForward: number;
  readonly accrued: number;
  readonly used: number;
  readonly remaining: number;
}

export interface ErpLeaveRequest {
  readonly id: number;
  readonly companyId: number;
  readonly requestNo: string;
  readonly employeeId: number;
  readonly employeeName: string | null;
  readonly leaveTypeId: number;
  readonly fromDate: string;
  readonly toDate: string;
  readonly days: number;
  readonly reason: string | null;
  readonly status: "pending" | "approved" | "rejected" | "cancelled";
  readonly decidedBy: string | null;
  readonly decidedAt: string | null;
  readonly decisionNote: string | null;
}

/* ---------------------------------- Payroll ---------------------------------- */

export interface ErpSalaryComponent {
  readonly id: number;
  readonly structureId: number;
  readonly name: string;
  readonly kind: "earning" | "deduction";
  readonly calcType: "fixed" | "percent_of_basic" | "attendance_based" | "formula";
  readonly amountFils: number;
  readonly percentBp: number | null;
  readonly glAccountCode: string | null;
  readonly sequence: number;
}

export interface ErpSalaryStructure {
  readonly id: number;
  readonly companyId: number;
  readonly code: string;
  readonly name: string;
  readonly currencyCode: string;
  readonly isActive: boolean;
  readonly components: readonly ErpSalaryComponent[];
}

export interface ErpPayrollRun {
  readonly id: number;
  readonly companyId: number;
  readonly runNo: string;
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly status: "draft" | "calculated" | "reviewed" | "approved" | "posted" | "paid" | "cancelled";
  readonly totalGrossFils: number;
  readonly totalDeductionsFils: number;
  readonly totalNetFils: number;
  readonly journalEntryId: number | null;
  readonly paymentId: number | null;
  readonly payslips: readonly {
    readonly id: number;
    readonly runId: number;
    readonly employeeId: number;
    readonly grossFils: number;
    readonly deductionsFils: number;
    readonly netFils: number;
    readonly components: readonly {
      readonly name: string;
      readonly kind: "earning" | "deduction";
      readonly amountFils: number;
      readonly glAccountCode: string | null;
    }[];
  }[];
}

/* --------------------------------- Approvals --------------------------------- */

export interface ErpApproval {
  readonly id: number;
  readonly companyId: number;
  readonly docType: string;
  readonly docId: number;
  readonly docNo: string | null;
  readonly level: number;
  readonly requiredRole: string | null;
  readonly thresholdFils: number | null;
  readonly requestedBy: string | null;
  readonly status: "pending" | "approved" | "rejected" | "expired" | "cancelled";
  readonly decidedBy: string | null;
  readonly decidedAt: string | null;
  readonly reason: string | null;
}

/* ------------------------------- Multi-company ------------------------------- */

export interface ErpIntercompanyLink {
  readonly id: number;
  readonly companyAId: number;
  readonly companyAName: string | null;
  readonly companyBId: number;
  readonly companyBName: string | null;
  readonly dueFromCode: string;
  readonly dueToCode: string;
}

export interface ErpIntercompanyTxn {
  readonly id: number;
  readonly linkId: number;
  readonly txnNo: string;
  readonly direction: "a_to_b" | "b_to_a";
  readonly amountFils: number;
  readonly description: string;
  readonly txnDate: string;
  readonly journalAId: number | null;
  readonly journalBId: number | null;
  readonly status: "pending" | "posted" | "settled" | "cancelled";
}

export interface ErpConsolidationMember {
  readonly companyId: number;
  readonly companyName: string | null;
  readonly ownershipBp: number;
}

export interface ErpConsolidationGroup {
  readonly id: number;
  readonly name: string;
  readonly parentCompanyId: number;
  readonly members: readonly ErpConsolidationMember[];
}

export interface ErpConsolidationWorksheet {
  readonly groupId: number;
  readonly groupName: string;
  readonly members: readonly ErpConsolidationMember[];
  readonly assets: readonly ErpStatementLine[];
  readonly liabilities: readonly ErpStatementLine[];
  readonly equity: readonly ErpStatementLine[];
  readonly totalAssetsFils: number;
  readonly totalLiabilitiesFils: number;
  readonly totalEquityFils: number;
  readonly intercompanyDueFromFils: number;
  readonly intercompanyDueToFils: number;
  readonly asOf: string;
}

/* ----------------------------------- FBR ------------------------------------- */

export interface ErpFbrConfig {
  readonly companyId: number;
  readonly ntn: string | null;
  readonly strn: string | null;
  readonly taxpayerCategory: string | null;
  readonly integrator: string | null;
  readonly endpoint: string | null;
  readonly credentialRef: string | null;
  readonly mode: "not_connected" | "sandbox" | "production";
  readonly isEnabled: boolean;
}

export interface ErpFbrSubmission {
  readonly id: number;
  readonly companyId: number;
  readonly invoiceId: number;
  readonly payload: string;
  readonly status: "prepared" | "validation_error" | "submitted" | "accepted" | "rejected" | "cancelled";
  readonly fbrRef: string | null;
  readonly irn: string | null;
  readonly error: string | null;
  readonly attempts: number;
  readonly submittedAt: string | null;
}

/* --------------------------------- Projects ---------------------------------- */

export interface ErpProject {
  readonly id: number;
  readonly companyId: number;
  readonly code: string;
  readonly name: string;
  readonly customerId: number | null;
  readonly customerName: string | null;
  readonly status: "planned" | "active" | "on_hold" | "completed" | "cancelled";
  readonly startDate: string | null;
  readonly endDate: string | null;
  readonly budgetFils: number;
  readonly notes: string | null;
}

export interface ErpTask {
  readonly id: number;
  readonly projectId: number;
  readonly title: string;
  readonly description: string | null;
  readonly milestone: string | null;
  readonly status: "todo" | "in_progress" | "blocked" | "done" | "cancelled";
  readonly priority: string;
  readonly assignee: string | null;
  readonly dependsOn: number | null;
  readonly dueDate: string | null;
  readonly completedAt: string | null;
}

export interface ErpTimesheetRow {
  readonly id: number;
  readonly companyId: number;
  readonly projectId: number;
  readonly taskId: number | null;
  readonly employeeId: number;
  readonly workDate: string;
  readonly minutes: number;
  readonly isBillable: boolean;
  readonly hourlyCostFils: number;
  readonly notes: string | null;
}

export interface ErpProjectCostReport {
  readonly project: ErpProject;
  readonly budgetFils: number;
  readonly labourCostFils: number;
  readonly glCostFils: number;
  readonly glRevenueFils: number;
  readonly billableMinutes: number;
  readonly totalMinutes: number;
  readonly budgetRemainingFils: number;
}
