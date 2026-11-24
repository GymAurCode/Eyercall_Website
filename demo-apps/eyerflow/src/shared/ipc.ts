/**
 * IPC contract shared by the main process and the renderer.
 *
 * Every channel is a typed request/response pair. The renderer never touches
 * the database or Node APIs directly; it calls these, and the main process
 * validates every payload before acting on it.
 */

import type { ThemeId } from "./themes";

export interface AppInfo {
  readonly name: string;
  readonly version: string;
  readonly electronVersion: string;
  readonly chromeVersion: string;
  readonly nodeVersion: string;
  readonly platform: string;
  readonly schemaVersion: number;
  readonly locale: string;
  readonly isPackaged: boolean;
}

export interface MigrationStatus {
  readonly fromVersion: number;
  readonly toVersion: number;
  readonly applied: readonly { readonly version: number; readonly name: string }[];
  readonly safetyBackupPath: string | null;
}

export interface BackupSummary {
  readonly lastRunAtIso: string | null;
  readonly destination: string | null;
  readonly keepCount: number;
  readonly fileCount: number;
}

export interface ApiError {
  readonly requestId?: string | undefined;
  readonly code: string;
  readonly message: string;
  /** Present for validation failures so the UI can highlight the field. */
  readonly field?: string | undefined;
}

/**
 * Where an update check has got to.
 *
 * One word per state, so the renderer never has to infer what is happening
 * from a combination of flags, and so the same word can be shown, logged and
 * asserted on.
 */
export type UpdateState =
  /** Nothing has been asked for yet. */
  | "idle"
  /** Asking the release server. */
  | "checking"
  /** A newer version exists. */
  | "available"
  /** This build is the newest one. */
  | "upToDate"
  /** The installer is on its way. */
  | "downloading"
  /** The installer is here, waiting to be installed. */
  | "downloaded"
  /** The check or the download failed. */
  | "error";

/**
 * The state of the updater, as the renderer sees it.
 *
 * The updater lives in the main process - it is the only place that may write
 * to the install directory - so this is a copy of its state, pushed across the
 * bridge whenever it changes.
 */
export interface UpdateStatus {
  /**
   * False when this build cannot check for updates at all.
   *
   * A development build has no release manifest to read and no release to
   * compare itself against, so the updater is unavailable rather than broken.
   */
  readonly supported: boolean;
  readonly state: UpdateState;
  readonly currentVersion: string;
  /** The version on offer, once one has been found. */
  readonly latestVersion: string | null;
  /** How much of the download has arrived, 0-100. Null unless downloading. */
  readonly progressPercent: number | null;
  /** Why it failed, in words the reader can act on. */
  readonly message: string | null;
  /** The release page, so the notes can be read before installing. */
  readonly releaseUrl: string | null;
  /** When the last check finished. */
  readonly checkedAtIso: string | null;
}

export type ApiResult<T> =
  { readonly ok: true; readonly data: T } | { readonly ok: false; readonly error: ApiError };

/** Channel names. Kept in one place so main and preload cannot drift apart. */
export const IPC = {
  appInfo: "app:info",
  dbMigrateStatus: "db:migrateStatus",
  backupRunNow: "backup:runNow",
  backupChooseFolder: "backup:chooseFolder",
  backupList: "backup:list",
  backupVerify: "backup:verify",
  backupRestore: "backup:restore",
  diagnosticsExport: "diagnostics:export",
  /**
   * Single validated entry point for every domain operation.
   *
   * A per-method channel would mean one registration and one preload function
   * per method. One channel with a method name and a Zod-validated payload
   * gives the same safety with one registration point.
   */
  rpc: "api:invoke",
  /**
   * Native file/folder picker.
   *
   * The renderer has no filesystem access, so any "choose a file" affordance -
   * the company logo, a backup to restore, where an export goes - has to come
   * through the main process. One channel with an explicit allow-list of
   * purpose values is used instead of a generic path field, so the renderer
   * cannot ask main to reveal an arbitrary location on disk.
   */
  pickFile: "dialog:pickFile",
  pickImage: "dialog:pickImage",
  printDocument: "print:document",
  savePdf: "print:savePdf",
  openExternal: "shell:openExternal",
  /**
   * Application updates.
   *
   * Three requests and one push. The requests are what the user asked for -
   * check, download, install - and the push is the updater's own state
   * changing on its own, so a download that finishes in the background reaches
   * the screen that is waiting for it.
   */
  updateCheck: "update:check",
  updateDownload: "update:download",
  updateInstall: "update:install",
  /**
   * The updater's state as it is right now.
   *
   * Separate from the check, because a screen that opens after a background
   * check has already finished needs the answer, not another request to the
   * release server.
   */
  updateCurrent: "update:current",
  /** Main to renderer: the update state changed. */
  updateStatus: "update:status",
} as const;

/** What the picker is being used for. Main maps each to its own file filters. */
export type FilePickPurpose = "restoreBackup" | "exportDestination" | "companyLogo";

export type IpcChannel = (typeof IPC)[keyof typeof IPC];

export interface BackupFileInfo {
  readonly path: string;
  readonly name: string;
  readonly sizeBytes: number;
  readonly modifiedAtIso: string;
}

export interface RestoreVerificationInfo {
  readonly ok: boolean;
  readonly message: string;
  readonly schemaVersion: number;
}

export interface RpcRequest {
  readonly method: string;
  readonly payload: unknown;
  /** CSRF-style nonce: main rejects requests that do not come from this app. */
  readonly token: string;
}

/* ------------------------------------------------------------------------- */
/* RPC method map                                                            */
/* ------------------------------------------------------------------------- */

import type * as T from "./types";
import type * as I from "./ims";
import type * as M from "./mms";

/**
 * Method map: method name -> request/response types.
 *
 * `Api.invoke` is generic over this map, so calling a method with the wrong
 * payload shape is a compile error in the renderer.
 */
export interface RpcMethods {
  'wms.integration.purchaseOrders':{request:Record<string,never>;response:import('./wms').CommercialOrderSource[]};
  'wms.integration.salesOrders':{request:Record<string,never>;response:import('./wms').CommercialOrderSource[]};
  'wms.inbound.fromPurchaseOrder':{request:{purchaseOrderId:number;warehouseId:number};response:number};
  'wms.inbound.update':{request:{id:number;revision:number;reference:string;lines:{productId:number;quantityMilli:number}[]};response:number};
  'wms.inbound.cancel':{request:{id:number;reason:string};response:void};
  'wms.inbound.close':{request:{id:number;reason:string};response:number};
  'wms.dispatch.fromSalesOrder':{request:{salesOrderId:number;warehouseId:number};response:number};
  'wms.production.sources':{request:Record<string,never>;response:import('./warehouse-manufacturing').WarehouseProductionSource[]};
  'wms.production.create':{request:import('./warehouse-manufacturing').MaterialRequestInput;response:number};
  'wms.production.handover':{request:{dispatchId:number};response:void};
  'wms.owners.list':{request:Record<string,never>;response:import('./owners').StockOwner[]};
  'wms.owners.save':{request:import('./owners').StockOwnerInput;response:number};
  'wms.owners.grant':{request:{ownerId:number;userId:number;allowed:boolean};response:void};
  'wms.owners.grants':{request:Record<string,never>;response:{user_id:number;owner_id:number}[]};
  'wms.owners.export':{request:Record<string,never>;response:{path:string}};
  'wms.handling.receive':{request:import('./owners').OwnerReceipt;response:number};
  'wms.handling.list':{request:Record<string,never>;response:import('./handling').HandlingUnit[]};
  'wms.handling.get':{request:{id:number};response:import('./handling').HandlingDetail};
  'wms.handling.save':{request:import('./handling').HandlingSave;response:number};
  'wms.handling.execute':{request:import('./handling').HandlingCommand;response:number};
  'wms.waves.save':{request:import('./wms').WaveInput;response:number};
  'wms.waves.get':{request:{id:number};response:import('./wms').WaveDetail};
  'wms.waves.release':{request:{id:number;packingBinId:number;workerId:number|null};response:void};
  'wms.waves.complete':{request:{id:number};response:void};
  'wms.waves.cancel':{request:{id:number;reason:string};response:void};
  'wms.picks.manage':{request:{id:number;action:'split'|'reassign'|'hold'|'shortClose';quantityMilli:number|null;workerId:number|null;sourceBinId:number|null;reason:string;commandKey:string};response:number|null};
  'oms.orders.list':{request:{status?:string;partyId?:number;limit?:number};response:import('./oms').OmsOrderSnapshot[]};
  'oms.orders.get':{request:{id:number};response:import('./oms').OmsOrderSnapshot};
  'oms.orders.create':{request:import('./oms').OmsCreateOrderRequest;response:number};
  'oms.orders.validate':{request:{id:number};response:import('./oms').OmsValidationResult};
  'oms.orders.confirm':{request:{id:number;reason?:string};response:import('./oms').OmsOrderSnapshot};
  'oms.orders.hold':{request:{id:number;holdType:string;reason:string};response:import('./oms').OmsHold};
  'oms.orders.releaseHold':{request:{id:number;holdId?:number;reason:string};response:void};
  'oms.orders.cancel':{request:{id:number;reason:string};response:import('./oms').OmsOrderSnapshot};
  'oms.orders.partialCancel':{request:import('./oms').OmsPartialCancelRequest;response:import('./oms').OmsOrderSnapshot};
  'oms.orders.edit':{request:import('./oms').OmsOrderEditRequest;response:import('./oms').OmsOrderSnapshot};
  'oms.allocations.list':{request:import('./oms').OmsAllocationsListRequest;response:import('./oms').OmsAllocation[]};
  'oms.allocations.get':{request:{id:number};response:import('./oms').OmsAllocation};
  'oms.allocations.create':{request:import('./oms').OmsAllocateRequest;response:import('./oms').OmsAllocateResult};
  'oms.allocations.release':{request:{id:number};response:void};
  'oms.allocations.previewAvailability':{request:{productId:number;warehouseId:number};response:import('./oms').OmsAvailability};
  'oms.fulfillment.list':{request:{orderId?:number;status?:string;warehouseId?:number;limit?:number};response:import('./oms').OmsFulfillmentRequest[]};
  'oms.fulfillment.get':{request:{id:number};response:import('./oms').OmsFulfillmentRequest};
  'oms.fulfillment.create':{request:import('./oms').OmsCreateFulfillmentRequest;response:import('./oms').OmsFulfillmentRequest};
  'oms.fulfillment.release':{request:{id:number;packingBinId:number};response:void};
  'oms.shipments.list':{request:{orderId?:number;status?:string;limit?:number};response:import('./oms').OmsShipment[]};
  'oms.shipments.get':{request:{id:number};response:import('./oms').OmsShipment};
  'oms.shipments.create':{request:import('./oms').OmsCreateShipment;response:import('./oms').OmsShipment};
  'oms.shipments.handover':{request:import('./oms').OmsShipmentHandover;response:import('./oms').OmsShipment};
  'oms.shipments.confirmDelivery':{request:import('./oms').OmsDeliveryConfirmation;response:import('./oms').OmsShipment};
  'oms.backorders.list':{request:{orderId?:number;status?:string;productId?:number;limit?:number};response:import('./oms').OmsBackorder[]};
  'oms.backorders.get':{request:{id:number};response:import('./oms').OmsBackorder};
  'oms.backorders.create':{request:import('./oms').OmsCreateBackorder;response:import('./oms').OmsBackorder};
  'oms.backorders.fulfill':{request:{id:number;quantityMilli:number};response:import('./oms').OmsBackorder};
  'oms.backorders.cancel':{request:{id:number};response:import('./oms').OmsBackorder};
  'oms.returns.list':{request:{orderId?:number;status?:string;limit?:number};response:import('./oms').OmsReturn[]};
  'oms.returns.get':{request:{id:number};response:import('./oms').OmsReturn};
  'oms.returns.create':{request:import('./oms').OmsCreateReturn;response:import('./oms').OmsReturn};
  'oms.returns.authorize':{request:{id:number;authorizedQuantityMilli:number};response:import('./oms').OmsReturn};
  'oms.returns.receive':{request:{id:number;receivedQuantityMilli:number};response:import('./oms').OmsReturn};
  'oms.returns.inspect':{request:import('./oms').OmsInspectReturn;response:import('./oms').OmsReturn};
  'oms.refunds.list':{request:{orderId?:number;status?:string;limit?:number};response:import('./oms').OmsRefund[]};
  'oms.refunds.get':{request:{id:number};response:import('./oms').OmsRefund};
  'oms.refunds.create':{request:import('./oms').OmsCreateRefund;response:import('./oms').OmsRefund};
  'oms.refunds.approve':{request:import('./oms').OmsApproveRefund;response:import('./oms').OmsRefund};
  'oms.refunds.submit':{request:import('./oms').OmsSubmitRefund;response:import('./oms').OmsRefund};
  'oms.refunds.confirm':{request:import('./oms').OmsConfirmRefund;response:import('./oms').OmsRefund};
  'oms.refunds.reject':{request:import('./oms').OmsRejectRefund;response:import('./oms').OmsRefund};
  'oms.refunds.cancel':{request:{id:number};response:import('./oms').OmsRefund};
  'oms.cod.list':{request:{orderId?:number;status?:string;limit?:number};response:import('./oms').OmsCodRecord[]};
  'oms.cod.get':{request:{id:number};response:import('./oms').OmsCodRecord};
  'oms.cod.create':{request:import('./oms').OmsCreateCodRecord;response:import('./oms').OmsCodRecord};
  'oms.cod.collect':{request:import('./oms').OmsRecordCodCollection;response:import('./oms').OmsCodRecord};
  'oms.cod.remit':{request:import('./oms').OmsRecordCodRemittance;response:import('./oms').OmsCodRecord};
  'oms.cod.reconcile':{request:import('./oms').OmsReconcileCod;response:import('./oms').OmsCodRecord};
  'oms.settings.list':{request:Record<string,never>;response:import('./oms').OmsSetting[]};
  'oms.settings.set':{request:import('./oms').OmsSetSetting;response:import('./oms').OmsSetting};
  'oms.settings.get':{request:{key:string};response:string|null};
  'core.access':{request:Record<string,never>;response:import('./suites').AccessSnapshot};
  'wms.access.list':{request:Record<string,never>;response:{users:{id:number;name:string;role:string;active:boolean;allBranches:boolean;branches:string[]}[];branches:string[]}};
  'wms.access.save':{request:{userId:number;allBranches:boolean;branches:string[]};response:{userId:number;allBranches:boolean;branches:string[]}};
  'wms.products.save':{request:{id?:number;sku:string;name:string;barcode?:string|null;unit:string};response:{id:number;sku:string|null;name:string;barcode:string|null;unit:string}};
  'wms.tasks.start':{request:{id:number};response:void};
  'wms.docks.save':{request:import('./wms').DockInput;response:number};
  'wms.appointments.save':{request:import('./wms').AppointmentInput;response:number};
  'wms.appointments.transition':{request:{id:number;revision:number;status:'arrived'|'unloading'|'completed'|'cancelled'|'noShow';reason:string};response:void};
  "wms.returns.receive":{request:import('./wms').ReturnInput;response:number};
  "wms.returns.inspect":{request:{id:number;sellableMilli:number;destinationBinId:number;reason:string};response:void};
  "wms.replenishment.save":{request:import('./wms').ReplenishmentInput;response:number};
  "wms.replenishment.generate":{request:{id:number};response:number|null};
  "wms.settings.save": {request:import("./wms").WmsSettings;response:import("./wms").WmsSettings};
  "wms.receipts.adopt": {request:{movementId:number;receivingBinId:number};response:number};
  "wms.report": {request:import("./wms").WmsReportRequest;response:import("./wms").WmsReport};
  "wms.report.export": {request:import("./wms").WmsReportRequest;response:{path:string}};
  "wms.counts.record": {request:import("./wms").CountInput;response:number};
  "wms.counts.approve": {request:{id:number};response:void};
  "wms.dispatch.create": {request: import("./wms").DispatchInput;response:number};
  "wms.dispatch.release": {request:{id:number;packingBinId:number};response:void};
  "wms.picks.confirm": {request:import("./wms").CompleteTaskInput;response:void};
  "wms.cartons.pack": {request:import("./wms").CartonInput;response:number};
  "wms.cartons.scan": {request:{dispatchId:number;scan:string;action:"stage"|"load"};response:void};
  "wms.dispatch.handover": {request:{id:number;carrier:string;vehicle:string;acknowledgement:string};response:void};
  "wms.snapshot": { request: Record<string, never>; response: import("./wms").WmsSnapshot };
  "wms.warehouses.save": { request: import("./wms").WarehouseInput; response: import("./wms").Warehouse };
  "wms.bins.save": { request: import("./wms").BinInput; response: number };
  "wms.locations.map": { request: { warehouseId: number; locationId: number; code: string }; response: number };
  "wms.inbound.create": { request: import("./wms").InboundInput; response: number };
  "wms.inbound.arrive": { request: { id: number }; response: void };
  "wms.receiving.post": { request: import("./wms").ReceiptInput; response: number };
  "wms.moves.create": { request: { sourceBinId: number; destinationBinId: number; productId: number; quantityMilli: number }; response: number };
  "wms.tasks.complete": { request: import("./wms").CompleteTaskInput; response: void };
  "wms.tasks.assign": { request: { id: number; workerId: number }; response: void };
  /* session */
  "auth.setupStatus": { request: Record<string, never>; response: SetupStatus };
  "auth.setup": { request: T.SetupRequest; response: SetupStatus };
  "auth.login": { request: T.LoginRequest; response: T.LoginResponse };
  "auth.logout": { request: Record<string, never>; response: { readonly ok: true } };
  "auth.currentUser": { request: Record<string, never>; response: T.SessionUser | null };
  "auth.changePassword": {
    request: { readonly currentPassword: string; readonly newPassword: string };
    response: { readonly ok: true };
  };

  /**
   * Anonymous recovery for a forgotten password.
   *
   * There is no session yet; the main process checks the EyerCall recovery code
   * and then applies the normal password policy. Recovery codes never cross the
   * bridge in either direction.
   */
  "auth.recoverPassword": {
    request: T.RecoverPasswordRequest;
    response: { readonly ok: true };
  };
  "auth.saveDevSession": { request: Record<string, never>; response: { readonly ok: true } };
  "auth.loadDevSession": { request: Record<string, never>; response: T.SessionUser | null };
  "auth.clearDevSession": { request: Record<string, never>; response: { readonly ok: true } };

  /*
   * Registration management from the login screen.
   *
   * These are anonymous in the IPC sense because there is no session yet; each
   * one that reads or writes registration details verifies an existing
   * administrator password in the main process and re-checks the licence and
   * device binding. No method accepts or returns a machine id.
   */
  "registration.status": { request: Record<string, never>; response: T.RegistrationStatus };
  "registration.details": {
    request: T.RegistrationAuthorisation;
    response: T.RegistrationDetails;
  };
  "registration.update": {
    request: T.RegistrationUpdateRequest;
    response: T.RegistrationDetails;
  };
  "registration.createAccount": {
    request: T.RegistrationCreateAccountRequest;
    response: T.UserDto;
  };

  /* own profile - always the signed-in user, never an id from the renderer */
  "profile.get": { request: Record<string, never>; response: T.ProfileDto };
  "profile.update": { request: T.UpdateProfileRequest; response: T.ProfileDto };
  /** Shows the picture picker and stores the chosen file. Returns its name. */
  "profile.chooseAvatar": { request: Record<string, never>; response: { readonly name: string } };

  /* license */
  "license.check": { request: Record<string, never>; response: LicenseCheckResponse };
  "license.activate": { request: { readonly key: string }; response: LicenseActivateResponse };
  "license.status": { request: Record<string, never>; response: LicenseStatusResponse };

  /* dashboard */
  "dashboard.summary": {
    request: {
      readonly fromDate?: string;
      readonly toDate?: string;
      readonly previousFromDate?: string;
      readonly previousToDate?: string;
      readonly includeInventory?: boolean;
    };
    response: T.DashboardDto;
  };

  /* reports */
  "reports.profitAndLoss": {
    request: { readonly fromDate: string; readonly toDate: string };
    response: T.ProfitAndLossDto;
  };
  "reports.partnerSplit": {
    request: { readonly fromDate: string; readonly toDate: string };
    response: T.PartnerSplitDto;
  };
  "reports.stockValuation": {
    request: Record<string, never>;
    response: { readonly rows: T.StockValuationRow[] };
  };
  /**
   * The invoice register behind the sales and purchase reports.
   *
   * A report needs the money on every invoice, not the invoices themselves:
   * the full document carries its lines, and reading those for every invoice
   * in a year turns one query per row into thousands of them.
   */
  "reports.documentRegister": {
    request: T.DocumentRegisterRequest;
    response: readonly T.DocumentRegisterRow[];
  };
  "reports.export": {
    request: {
      readonly dataset: "profitAndLoss" | "partnerSplit" | "sales" | "stock";
      readonly fromDate?: string | undefined;
      readonly toDate?: string | undefined;
    };
    response: { readonly path: string };
  };

  /* parties */
  "parties.list": { request: T.PartyListRequest; response: T.PartyDto[] };
  "parties.get": { request: { readonly id: number }; response: T.PartyDto };
  "parties.save": {
    request: {
      readonly id?: number | undefined;
      readonly name: string;
      readonly kind: "customer" | "supplier" | "both";
      readonly phone?: string | null | undefined;
      readonly email?: string | null | undefined;
      readonly trn?: string | null | undefined;
      readonly addressLine?: string | null | undefined;
      readonly isActive?: boolean | undefined;
    };
    response: T.PartyDto;
  };
  /**
   * Remove a customer or supplier.
   *
   * Refused when the record has invoices or payments against it: those must
   * keep pointing at a real party. The error explains how to deactivate the
   * record instead.
   */
  "parties.delete": { request: { readonly id: number }; response: { readonly ok: true } };

  /* products */
  "products.list": { request: T.ProductListRequest; response: T.ProductDto[] };
  "products.get": { request: { readonly id: number }; response: T.ProductDto };
  "products.save": {
    request: {
      readonly id?: number | undefined;
      readonly sku?: string | undefined;
      readonly barcode?: string | null | undefined;
      readonly name: string;
      readonly description?: string | null | undefined;
      readonly category?: string | null | undefined;
      readonly subcategory?: string | null | undefined;
      readonly brand?: string | null | undefined;
      readonly unit?: string | undefined;
      readonly purchaseUnit?: string | null | undefined;
      readonly salesUnit?: string | null | undefined;
      readonly packSizeMilli?: number | undefined;
      readonly productType?: "simple" | "variant" | "rawMaterial" | "finishedGood" | "semiFinished" | "service" | "bundle" | undefined;
      readonly parentId?: number | null | undefined;
      readonly variantLabel?: string | null | undefined;
      readonly preferredSupplierId?: number | null | undefined;
      readonly reorderLevelMilli?: number | undefined;
      readonly averageCostFils?: number | undefined;
      readonly salePriceFils?: number | undefined;
      readonly vatTreatment?: T.VatTreatment | undefined;
      readonly isActive?: boolean | undefined;
      /** Opening stock quantity in milli-units. Creates an "opening" movement. */
      readonly openingQuantityMilli?: number | undefined;
      readonly imagePath?: string | null | undefined;
    };
    response: T.ProductDto;
  };
  "products.openStock": {
    request: {
      readonly productId: number;
      readonly quantityMilli: number;
      readonly unitCostFils: number;
      readonly notes?: string | undefined;
    };
    response: T.ProductDto;
  };
  "products.movements": { request: T.StockMovementRequest; response: T.StockMovementDto[] };
  /**
   * Remove a product.
   *
   * Refused when the item has stock history or invoice lines behind it: those
   * must keep pointing at a real item. The error explains how to deactivate it
   * instead.
   */
  "products.delete": { request: { readonly id: number }; response: { readonly ok: true } };

  /* documents: invoices and purchases only */
  "documents.list": { request: T.DocumentListRequest; response: T.DocumentDto[] };
  "documents.get": { request: { readonly id: number }; response: T.DocumentDto };
  "documents.save": {
    request: T.SaveDocumentRequest & { readonly discountFils?: number | undefined };
    response: T.DocumentDto;
  };
  "documents.cancel": {
    request: { readonly id: number; readonly reason: string };
    response: T.DocumentDto;
  };
  "documents.delete": { request: { readonly id: number }; response: { readonly ok: true } };
  "documents.numberPreview": {
    request: { readonly kind: "invoice" | "purchaseInvoice" };
    response: { readonly number: string };
  };

  /* payments: the paid amount on a document, or a later receive-payment */
  "payments.list": { request: T.PaymentListRequest; response: T.PaymentDto[] };
  "payments.save": { request: T.SavePaymentRequest; response: T.PaymentDto };
  "payments.delete": { request: { readonly id: number }; response: { readonly ok: true } };

  /* expenses */
  "expenses.list": { request: T.ExpenseListRequest; response: T.ExpenseDto[] };
  "expenses.save": { request: T.SaveExpenseRequest; response: T.ExpenseDto };
  "expenses.delete": { request: { readonly id: number }; response: { readonly ok: true } };

  /* partners */
  "partners.list": { request: Record<string, never>; response: T.PartnerDto[] };
  "partners.save": {
    request: {
      readonly id?: number;
      readonly name: string;
      readonly sharePercent: number;
      readonly isActive?: boolean;
    };
    response: T.PartnerDto;
  };
  "partners.transactions": {
    request: { readonly limit?: number };
    response: T.PartnerTransactionDto[];
  };

  /* users: two fixed roles, no role editor */
  "users.list": { request: Record<string, never>; response: T.UserDto[] };
  "users.save": { request: T.SaveUserRequest; response: T.UserDto };
  "users.resetPassword": {
    request: {
      readonly id: number;
      readonly newPassword: string;
      readonly mustChangePassword?: boolean;
    };
    response: T.UserDto;
  };

  /* settings */
  "settings.get": { request: Record<string, never>; response: AppSettingsSnapshot };
  "settings.update": { request: Partial<AppSettingsSnapshot>; response: AppSettingsSnapshot };

  /* ---------------------------------------------------------------- finance -- */

  /** The finance dashboard: balances, period figures, series and reconciliations. */
  "finance.overview": {
    request: {
      readonly fromDate: string;
      readonly toDate: string;
      readonly asOfDate: string;
      readonly previousFromDate: string;
      readonly previousToDate: string;
      readonly granularity?: "day" | "week" | "month" | "quarter" | "year" | undefined;
    };
    response: T.FinanceOverviewDto;
  };

  /* chart of accounts */
  "finance.chart": { request: Record<string, never>; response: T.AccountDto[] };
  "finance.chart.save": { request: T.SaveAccountRequest; response: T.AccountDto };
  "finance.chart.setActive": {
    request: { readonly id: number; readonly isActive: boolean };
    response: T.AccountDto;
  };
  "finance.chart.delete": { request: { readonly id: number }; response: { readonly ok: true } };
  "finance.chart.export": { request: Record<string, never>; response: { readonly path: string } };

  /* ledger and journal */
  "finance.generalLedger": {
    request: { readonly code: string; readonly fromDate: string; readonly toDate: string };
    response: T.GeneralLedgerDto;
  };
  "finance.journal.list": {
    request: {
      readonly fromDate?: string | undefined;
      readonly toDate?: string | undefined;
      readonly source?: T.JournalSource | undefined;
      readonly status?: T.JournalStatus | undefined;
      readonly search?: string | undefined;
      readonly accountCode?: string | undefined;
      readonly limit?: number | undefined;
    };
    response: T.JournalEntryRowDto[];
  };
  "finance.journal.get": { request: { readonly id: number }; response: T.JournalEntryDetailDto };
  "finance.journal.save": { request: T.SaveJournalEntryRequest; response: T.JournalEntryDetailDto };
  "finance.journal.post": { request: { readonly id: number }; response: T.JournalEntryDetailDto };
  "finance.journal.reverse": {
    request: { readonly id: number; readonly reason: string };
    response: T.JournalEntryDetailDto;
  };
  "finance.journal.deleteDraft": {
    request: { readonly id: number };
    response: { readonly ok: true };
  };

  /* reports */
  "finance.trialBalance": {
    request: { readonly fromDate: string; readonly toDate: string };
    response: T.TrialBalanceDto;
  };
  "finance.balanceSheet": { request: { readonly asOfDate: string }; response: T.BalanceSheetDto };
  "finance.profitAndLoss": {
    request: { readonly fromDate: string; readonly toDate: string };
    response: T.ProfitLossDto;
  };
  "finance.cashFlow": {
    request: { readonly fromDate: string; readonly toDate: string };
    response: T.CashFlowDto;
  };
  "finance.aging": {
    request: { readonly asOfDate: string; readonly side: "receivable" | "payable" };
    response: T.AgingDto;
  };
  "finance.partyStatement": {
    request: {
      readonly partyId: number;
      readonly kind: T.PartyLedgerKind;
      readonly fromDate: string;
      readonly toDate: string;
    };
    response: T.PartyStatementDto;
  };
  "finance.partyBalances": {
    request: { readonly kind: T.PartyLedgerKind; readonly asOfDate: string };
    response: T.PartyBalanceDto[];
  };
  "finance.cashBook": {
    request: { readonly accountCode: string; readonly fromDate: string; readonly toDate: string };
    response: T.CashBookDto;
  };
  "finance.periodComparison": {
    request: {
      readonly fromDate: string;
      readonly toDate: string;
      readonly previousFromDate: string;
      readonly previousToDate: string;
    };
    response: T.PeriodComparisonDto;
  };
  "finance.export": {
    request: {
      readonly dataset: T.ExportDataset;
      readonly fromDate?: string | undefined;
      readonly toDate?: string | undefined;
      readonly accountCode?: string | undefined;
      readonly partyId?: number | undefined;
      readonly partyKind?: T.PartyLedgerKind | undefined;
    };
    response: { readonly path: string };
  };

  /* money in / money out */
  "finance.transfer": {
    request: {
      readonly transferDate: string;
      readonly fromAccountCode: string;
      readonly toAccountCode: string;
      readonly amountFils: number;
      readonly reference?: string | null | undefined;
    };
    response: { readonly ok: true };
  };
  "finance.recordPayment": {
    request: {
      readonly direction: "inbound" | "outbound";
      readonly partyId: number;
      readonly paymentDate: string;
      readonly method: T.PaymentMethod;
      readonly amountFils: number;
      readonly reference?: string | null | undefined;
      readonly notes?: string | null | undefined;
      readonly allocations?: readonly {
        readonly documentId: number;
        readonly amountFils: number;
      }[];
      /** What the money settles when it is not an invoice payment. */
      readonly postingKind?: T.PaymentPostingKind | undefined;
      /** Which cash or bank ledger the money lands in. */
      readonly cashAccountCode?: string | undefined;
      /** The account an expense-type payment is charged to. */
      readonly expenseAccountCode?: string | undefined;
    };
    response: T.PaymentDto;
  };

  /* settings and periods */
  "finance.periods.list": { request: Record<string, never>; response: T.AccountingPeriodDto[] };
  "finance.periods.save": {
    request: T.SaveAccountingPeriodRequest;
    response: T.AccountingPeriodDto;
  };
  "finance.periods.close": { request: { readonly id: number }; response: T.AccountingPeriodDto };
  "finance.periods.reopen": { request: { readonly id: number }; response: T.AccountingPeriodDto };
  "finance.openingBalances": {
    request: T.OpeningBalanceRequest;
    response: { readonly ok: true };
  };
  "finance.migrationAudit": { request: Record<string, never>; response: T.MigrationAuditDto };
  "finance.backfill": {
    request: { readonly confirm: boolean };
    response: { readonly posted: number; readonly skipped: number };
  };

  /* ------------------------------------------------------------------- IMS -- */

  "ims.reference": { request: Record<string, never>; response: I.ImsReferenceDto };
  "ims.dashboard": { request: I.ImsDashboardRequest; response: I.ImsDashboardDto };
  "ims.report": { request: I.ImsReportRequest; response: I.ImsReportDto };
  "ims.reports.list": {
    request: Record<string, never>;
    response: readonly { readonly id: I.ImsReportId; readonly title: string; readonly group: string }[];
  };

  "ims.config.get": { request: Record<string, never>; response: I.ImsConfigDto };
  "ims.config.update": { request: I.ImsConfigPatch; response: I.ImsConfigDto };

  "ims.locations.list": { request: Record<string, never>; response: readonly I.ImsLocationDto[] };
  "ims.locations.save": { request: I.SaveLocationRequest; response: readonly I.ImsLocationDto[] };

  "ims.brands.list": { request: Record<string, never>; response: readonly I.BrandDto[] };
  "ims.brands.save": {
    request: { readonly id?: number; readonly name: string; readonly isActive?: boolean };
    response: I.BrandDto;
  };
  "ims.units.list": { request: Record<string, never>; response: readonly I.UnitDto[] };
  "ims.units.save": {
    request: {
      readonly id?: number;
      readonly code: string;
      readonly name: string;
      readonly baseCode?: string | null;
      readonly factorMilli: number;
      readonly isActive?: boolean;
    };
    response: I.UnitDto;
  };
  "ims.categories.list": { request: Record<string, never>; response: readonly I.CategoryDto[] };
  "ims.categories.rename": {
    request: { readonly from: string; readonly to: string };
    response: readonly I.CategoryDto[];
  };

  "ims.priceLists.list": { request: Record<string, never>; response: readonly I.PriceListDto[] };
  "ims.priceLists.save": {
    request: I.SavePriceListRequest;
    response: readonly I.PriceListDto[];
  };
  "ims.priceItems.list": {
    request: { readonly priceListId: number };
    response: readonly I.PriceListItemDto[];
  };
  "ims.priceItems.save": {
    request: I.SavePriceItemRequest;
    response: readonly I.PriceListItemDto[];
  };
  "ims.priceItems.delete": {
    request: { readonly id: number };
    response: { readonly ok: true };
  };
  "ims.price.resolve": { request: {
    readonly productId: number;
    readonly partyId?: number | null;
    readonly quantityMilli?: number;
    readonly date?: string;
  }; response: I.ResolvedPriceDto };

  "ims.documents.list": { request: I.ImsListRequest; response: readonly I.ImsDocumentDto[] };
  "ims.documents.get": { request: { readonly id: number }; response: I.ImsDocumentDto };
  "ims.documents.save": { request: I.SaveImsDocumentRequest; response: I.ImsDocumentDto };
  "ims.documents.transition": {
    request: I.ImsTransitionRequest;
    response: I.ImsDocumentDto;
  };
  "ims.documents.convert": { request: I.ImsConvertRequest; response: I.ImsDocumentDto };
  "ims.documents.receiveTransfer": {
    request: I.ReceiveTransferRequest;
    response: I.ImsDocumentDto;
  };

  "ims.stock.overview": {
    request: I.StockOverviewRequest;
    response: readonly I.StockOverviewRow[];
  };
  "ims.stock.batches": {
    request: {
      readonly search?: string;
      readonly expiringDays?: number;
      readonly limit?: number;
    };
    response: readonly I.BatchRow[];
  };
  "ims.stock.serials": {
    request: { readonly search?: string; readonly limit?: number };
    response: readonly I.SerialRow[];
  };
  "ims.stock.reservations": {
    request: {
      readonly productId?: number;
      readonly status?: "active" | "released" | "consumed";
      readonly limit?: number;
    };
    response: readonly I.ReservationRow[];
  };
  "ims.stock.releaseReservation": {
    request: { readonly id: number };
    response: { readonly ok: true };
  };

  "ims.products.detail": {
    request: { readonly id: number };
    response: I.ProductDetailDto;
  };
  "ims.products.variants": {
    request: I.VariantListRequest;
    response: readonly I.VariantRow[];
  };
  "ims.products.saveVariant": {
    request: I.SaveVariantRequest;
    response: I.VariantRow;
  };

  "ims.replenishment.list": {
    request: { readonly locationId?: number; readonly supplierId?: number; readonly limit?: number };
    response: readonly I.ReplenishmentRow[];
  };
  "ims.replenishment.createRequisition": {
    request: {
      readonly productIds: readonly number[];
      readonly supplierId?: number | null;
      readonly locationId?: number;
    };
    response: I.ImsDocumentDto;
  };

  "ims.pos.state": { request: Record<string, never>; response: I.PosStateDto };
  "ims.pos.open": { request: I.OpenShiftRequest; response: I.PosStateDto };
  "ims.pos.close": { request: I.CloseShiftRequest; response: I.PosStateDto };
  "ims.pos.sale": { request: I.PosSaleRequest; response: I.PosSaleResult };
  "ims.pos.history": {
    request: { readonly limit?: number };
    response: readonly I.PosHistoryRow[];
  };

  /* ------------------------------------------------------------------ MMS -- */

  "mms.config.get": { request: Record<string, never>; response: M.MmsConfigDto };
  "mms.config.update": { request: M.MmsConfigPatch; response: M.MmsConfigDto };

  "mms.boms.list": { request: M.BomListRequest; response: readonly M.BomDto[] };
  "mms.boms.get": { request: { readonly id: number }; response: M.BomDto };
  "mms.boms.save": { request: M.SaveBomRequest; response: M.BomDto };
  "mms.boms.approve": { request: { readonly id: number }; response: M.BomDto };
  "mms.bomComponents.save": {
    request: M.SaveBomComponentRequest;
    response: M.BomComponentDto;
  };
  "mms.bomComponents.delete": {
    request: { readonly id: number };
    response: { readonly ok: true };
  };

  "mms.routes.list": { request: M.RouteListRequest; response: readonly M.RouteDto[] };
  "mms.routes.get": { request: { readonly id: number }; response: M.RouteDto };
  "mms.routes.save": { request: M.SaveRouteRequest; response: M.RouteDto };
  "mms.routeOperations.save": {
    request: M.SaveRouteOperationRequest;
    response: M.RouteOperationDto;
  };

  "mms.workCenters.list": {
    request: M.WorkCenterListRequest;
    response: readonly M.WorkCenterDto[];
  };
  "mms.workCenters.save": {
    request: M.SaveWorkCenterRequest;
    response: M.WorkCenterDto;
  };
  "mms.equipment.list": {
    request: M.EquipmentListRequest;
    response: readonly M.EquipmentDto[];
  };
  "mms.equipment.save": {
    request: M.SaveEquipmentRequest;
    response: M.EquipmentDto;
  };

  "mms.orders.list": { request: M.MoListRequest; response: readonly M.ManufacturingOrderDto[] };
  "mms.orders.get": { request: { readonly id: number }; response: M.ManufacturingOrderDto };
  "mms.orders.save": {
    request: M.SaveManufacturingOrderRequest;
    response: M.ManufacturingOrderDto;
  };
  "mms.orders.release": {
    request: { readonly id: number };
    response: M.ManufacturingOrderDto;
  };
  "mms.orders.cancel": {
    request: { readonly id: number; readonly reason: string };
    response: M.ManufacturingOrderDto;
  };

  "mms.workOrders.list": {
    request: M.WorkOrderListRequest;
    response: readonly M.WorkOrderDto[];
  };
  "mms.workOrders.get": { request: { readonly id: number }; response: M.WorkOrderDto };
  "mms.workOrders.save": {
    request: M.SaveWorkOrderRequest;
    response: M.WorkOrderDto;
  };
  "mms.workOrders.start": {
    request: { readonly id: number };
    response: M.WorkOrderDto;
  };
  "mms.workOrders.pause": {
    request: { readonly id: number };
    response: M.WorkOrderDto;
  };
  "mms.workOrders.resume": {
    request: { readonly id: number };
    response: M.WorkOrderDto;
  };
  "mms.workOrders.complete": {
    request: {
      readonly id: number;
      readonly actualQuantity: number;
      readonly acceptedQuantity: number;
      readonly rejectedQuantity: number;
    };
    response: M.WorkOrderDto;
  };
  "mms.jobTimeLogs.save": {
    request: M.SaveJobTimeLogRequest;
    response: M.JobTimeLogDto;
  };
  "mms.jobTimeLogs.list": {
    request: { readonly workOrderId: number };
    response: readonly M.JobTimeLogDto[];
  };

  "mms.materialIssues.list": {
    request: M.MaterialIssueListRequest;
    response: readonly M.MaterialIssueDto[];
  };
  "mms.materialIssues.reserve": {
    request: M.SaveMaterialIssueRequest;
    response: M.MaterialIssueDto;
  };
  "mms.materialIssues.issueToWip": {
    request: M.SaveMaterialIssueRequest;
    response: M.MaterialIssueDto;
  };
  "mms.materialIssues.returnFromWip": {
    request: M.SaveMaterialIssueRequest;
    response: M.MaterialIssueDto;
  };
  "mms.materialIssues.consume": {
    request: M.SaveConsumptionRecordRequest;
    response: M.ConsumptionRecordDto;
  };
  "mms.materialIssues.consumptionList": {
    request: { readonly moId?: number };
    response: readonly M.ConsumptionRecordDto[];
  };

  "mms.wip.list": {
    request: M.WipListRequest;
    response: readonly M.WipRecordDto[];
  };

  "mms.qualityChecks.list": {
    request: M.QualityCheckListRequest;
    response: readonly M.QualityCheckDto[];
  };
  "mms.qualityChecks.save": {
    request: M.SaveQualityCheckRequest;
    response: M.QualityCheckDto;
  };

  "mms.scrap.list": {
    request: M.ScrapListRequest;
    response: readonly M.ScrapDto[];
  };
  "mms.scrap.save": {
    request: M.SaveScrapRequest;
    response: M.ScrapDto;
  };

  "mms.rework.list": {
    request: M.ReworkListRequest;
    response: readonly M.ReworkDto[];
  };
  "mms.rework.save": {
    request: M.SaveReworkRequest;
    response: M.ReworkDto;
  };

  "mms.finishedReceipts.list": {
    request: M.FinishedReceiptListRequest;
    response: readonly M.FinishedReceiptDto[];
  };
  "mms.finishedReceipts.get": {
    request: { readonly id: number };
    response: M.FinishedReceiptDto;
  };
  "mms.finishedReceipts.save": {
    request: M.SaveFinishedReceiptRequest;
    response: M.FinishedReceiptDto;
  };

  "mms.costRecords.list": {
    request: M.MoCostListRequest;
    response: readonly M.CostRecordDto[];
  };
  "mms.costRecords.save": {
    request: M.SaveCostRecordRequest;
    response: M.CostRecordDto;
  };
  "mms.costRecords.moSummary": {
    request: { readonly moId: number };
    response: M.MoCostSummaryDto;
  };

  "mms.genealogy.list": {
    request: M.GenealogyListRequest;
    response: readonly M.GenealogyLinkDto[];
  };

  "mms.mrp.run": { request: M.MrpRunRequest; response: M.MrpRunDto };
  "mms.mrp.runs.list": { request: Record<string, never>; response: readonly M.MrpRunDto[] };
  "mms.mrp.get": { request: { id: number }; response: M.MrpRunDto };
  "mms.mrp.approve": { request: { id: number }; response: M.MrpRunDto };
  "mms.mrp.generateRequisitions": { request: { id: number; requirementIds?: readonly number[] }; response: M.MrpRunDto };
  "mms.mrp.generateOrders": { request: { id: number; requirementIds?: readonly number[] }; response: M.MrpRunDto };
  "mms.mrp.requirements.list": {
    request: M.MrpRequirementListRequest;
    response: readonly M.MrpRequirementDto[];
  };

  "mms.mps.plans.list": {
    request: M.MpsPlanListRequest;
    response: readonly M.MpsPlanDto[];
  };
  "mms.mps.save": { request: M.SaveMpsPlanRequest; response: M.MpsPlanDto };
  "mms.mps.calculate": { request: { id: number }; response: M.MpsPlanDto };
  "mms.mps.approve": { request: { id: number }; response: M.MpsPlanDto };
  "mms.mps.generateOrders": { request: { id: number }; response: M.MpsPlanDto };
  "mms.mps.history": { request: { id: number }; response: readonly M.PlanningHistoryDto[] };

  "mms.maintenanceRequests.list": {
    request: M.MaintenanceRequestListRequest;
    response: readonly M.MaintenanceRequestDto[];
  };
  "mms.maintenanceRequests.save": {
    request: M.SaveMaintenanceRequestRequest;
    response: M.MaintenanceRequestDto;
  };

  "mms.subcontractOrders.list": {
    request: M.SubcontractOrderListRequest;
    response: readonly M.SubcontractOrderDto[];
  };
  "mms.subcontractOrders.save": {
    request: M.SaveSubcontractOrderRequest;
    response: M.SubcontractOrderDto;
  };

  "mms.dashboard": { request: M.MmsDashboardRequest; response: M.MmsDashboardDto };
  "mms.report": { request: M.MmsReportRequest; response: M.MmsReportDto };
  "mms.reports.list": {
    request: Record<string, never>;
    response: readonly M.MmsReportTitle[];
  };

  "mms.stock.snapshot": {
    request: { readonly productId?: number };
    response: readonly M.StockSnapshotDto[];
  };

  /* ------------------------------ ECOM ------------------------------ */
  "ecom.providers.list": { request: Record<string, never>; response: readonly import('./ecom').EcomProviderDescriptor[] };
  "ecom.channels.list": {
    request: { readonly platform?: import('./ecom').EcomPlatform; readonly state?: import('./ecom').EcomConnectionState; readonly search?: string };
    response: readonly import('./ecom').EcomChannel[];
  };
  "ecom.channels.save": { request: import('./ecom').EcomChannelInput; response: import('./ecom').EcomChannel };
  "ecom.channels.state": {
    request: { readonly id: number; readonly state: 'paused' | 'connected' | 'revoked' };
    response: import('./ecom').EcomChannel;
  };
  "ecom.channels.disconnect": { request: { readonly id: number }; response: import('./ecom').EcomChannel };
  "ecom.channels.test": { request: { readonly id: number; readonly sandbox?: boolean }; response: import('./ecom').EcomChannel };
  "ecom.channels.health": { request: { readonly id: number }; response: import('./ecom').EcomChannelHealth };
  "ecom.channels.stockPolicy.get": { request: { readonly id: number }; response: import('./ecom').EcomStockPolicy };
  "ecom.channels.stockPolicy.save": {
    request: import('./ecom').EcomStockPolicyInput;
    response: import('./ecom').EcomStockPolicy;
  };

  "ecom.mappings.list": {
    request: {
      readonly channelId?: number;
      readonly productId?: number;
      readonly search?: string;
      readonly status?: 'active' | 'inactive';
      readonly limit?: number;
      readonly offset?: number;
    };
    response: readonly import('./ecom').EcomMapping[];
  };
  "ecom.mappings.save": {
    request: {
      readonly id?: number;
      readonly channelId: number;
      readonly productId: number;
      readonly variantKey?: string | null;
      readonly remoteProductId: string;
      readonly remoteVariantId: string;
      readonly remoteInventoryItemId?: string | null;
      readonly remoteSku?: string | null;
      readonly remoteLocationId?: string | null;
      readonly status?: 'active' | 'inactive';
    };
    response: import('./ecom').EcomMapping;
  };
  "ecom.mappings.deactivate": { request: { readonly id: number }; response: import('./ecom').EcomMapping };
  "ecom.mappings.bulkMatch": {
    request: {
      readonly channelId: number;
      readonly rows: readonly {
        readonly remoteProductId: string;
        readonly remoteVariantId: string;
        readonly sku: string;
        readonly remoteInventoryItemId?: string | null;
      }[];
    };
    response: import('./ecom').EcomBulkResult;
  };
  "ecom.mappings.unmapped": {
    request: { readonly channelId?: number; readonly search?: string; readonly limit?: number };
    response: readonly { readonly id: number; readonly sku: string; readonly name: string; readonly salePriceFils: number }[];
  };
  "ecom.mappings.export": { request: { readonly channelId?: number }; response: string };

  "ecom.listings.list": {
    request: {
      readonly channelId?: number;
      readonly status?: import('./ecom').EcomPublishStatus;
      readonly search?: string;
      readonly limit?: number;
      readonly offset?: number;
    };
    response: readonly import('./ecom').EcomListing[];
  };
  "ecom.listings.save": { request: import('./ecom').EcomListingInput; response: import('./ecom').EcomListing };
  "ecom.listings.publish": {
    request: { readonly id: number; readonly action: 'publish' | 'update' | 'unpublish' | 'archive' };
    response: { readonly listingId: number; readonly jobId: number; readonly status: 'pending' };
  };
  "ecom.listings.bulkPublish": {
    request: { readonly ids: readonly number[]; readonly action: 'publish' | 'update' | 'unpublish' | 'archive' };
    response: import('./ecom').EcomBulkResult;
  };
  "ecom.listings.revisions": {
    request: { readonly id: number };
    response: readonly Readonly<Record<string, string | number | null>>[];
  };
  "ecom.pricing.rules": {
    request: { readonly channelId?: number };
    response: readonly import('./ecom').EcomPriceRule[];
  };
  "ecom.pricing.rule.save": { request: import('./ecom').EcomPriceRuleInput; response: import('./ecom').EcomPriceRule };
  "ecom.pricing.rule.delete": { request: { readonly id: number }; response: void };
  "ecom.pricing.preview": {
    request: { readonly channelId: number; readonly productIds?: readonly number[] };
    response: readonly import('./ecom').EcomPricePreview[];
  };
  "ecom.pricing.bulk": {
    request: { readonly channelId: number; readonly percent: number; readonly roundTo?: number };
    response: import('./ecom').EcomBulkResult;
  };

  "ecom.inventory.list": {
    request: { readonly channelId?: number; readonly search?: string; readonly onlyConflicts?: boolean; readonly limit?: number };
    response: readonly import('./ecom').EcomStockRow[];
  };
  "ecom.inventory.conflicts": {
    request: { readonly channelId?: number };
    response: readonly import('./ecom').EcomStockRow[];
  };
  "ecom.inventory.history": {
    request: { readonly channelId?: number; readonly mappingId?: number; readonly limit?: number };
    response: readonly Readonly<Record<string, string | number | null>>[];
  };
  "ecom.inventory.syncProduct": {
    request: { readonly productId: number; readonly channelId?: number };
    response: readonly import('./ecom').EcomQueuedStockSync[];
  };
  "ecom.inventory.syncChannel": {
    request: { readonly id: number };
    response: readonly import('./ecom').EcomQueuedStockSync[];
  };
  "ecom.inventory.resolveConflict": {
    request: { readonly snapshotId: number; readonly action: 'push' | 'accept_remote' | 'ignore'; readonly note?: string };
    response: void;
  };

  "ecom.orders.list": {
    request: {
      readonly channelId?: number;
      readonly importStatus?: import('./ecom').EcomImportStatus;
      readonly search?: string;
      readonly limit?: number;
      readonly offset?: number;
    };
    response: readonly import('./ecom').EcomExternalOrder[];
  };
  "ecom.orders.get": { request: { readonly id: number }; response: import('./ecom').EcomExternalOrder };
  "ecom.orders.import": {
    request: {
      readonly channelId: number;
      readonly externalOrderId: string;
      readonly externalNumber: string;
      readonly eventId?: string | null;
      readonly orderedAt: string;
      readonly currency: string;
      readonly customer: {
        readonly name: string;
        readonly email?: string | null;
        readonly phone?: string | null;
        readonly city?: string | null;
        readonly address?: string | null;
      };
      readonly lines: readonly {
        readonly remoteLineId: string;
        readonly remoteVariantId?: string | null;
        readonly sku?: string | null;
        readonly title: string;
        readonly quantityMilli: number;
        readonly unitPriceFils: number;
        readonly discountFils?: number;
        readonly taxFils?: number;
      }[];
      readonly shippingFils?: number;
      readonly discountFils?: number;
      readonly taxFils?: number;
      readonly subtotalFils: number;
      readonly totalFils: number;
      readonly paymentStatus?: string;
      readonly fulfillmentStatus?: string;
      readonly raw?: Record<string, unknown>;
    };
    response: import('./ecom').EcomExternalOrder;
  };
  "ecom.orders.exceptions": {
    request: {
      readonly status?: 'open' | 'resolved' | 'skipped' | 'escalated';
      readonly channelId?: number;
      readonly limit?: number;
    };
    response: readonly import('./ecom').EcomOrderException[];
  };
  "ecom.orders.resolveException": {
    request: {
      readonly id: number;
      readonly action: 'reprocess' | 'skip' | 'escalate' | 'resolve';
      readonly reason?: string;
    };
    response: import('./ecom').EcomOrderException;
  };
  "ecom.orders.stats": { request: Record<string, never>; response: import('./ecom').EcomOrderImportStats };

  "ecom.shipments.list": {
    request: {
      readonly channelId?: number;
      readonly status?: import('./ecom').EcomShipmentLink['status'];
      readonly limit?: number;
    };
    response: readonly import('./ecom').EcomShipmentLink[];
  };
  "ecom.shipments.create": {
    request: {
      readonly externalOrderId: number;
      readonly omsShipmentId?: number | null;
      readonly carrier: string;
      readonly trackingNumber: string;
      readonly remoteFulfillmentId?: string | null;
    };
    response: import('./ecom').EcomShipmentCreateResult;
  };
  "ecom.shipments.sync": { request: { readonly linkId: number }; response: number };
  "ecom.returns.list": {
    request: { readonly channelId?: number; readonly status?: string; readonly limit?: number };
    response: readonly import('./ecom').EcomReturnLink[];
  };
  "ecom.returns.link": {
    request: {
      readonly channelId: number;
      readonly externalReturnId: string;
      readonly externalOrderId?: number | null;
      readonly omsReturnId?: number | null;
      readonly reason: string;
      readonly quantityMilli: number;
      readonly status: string;
      readonly refundStatus: string;
      readonly remoteClaimId?: string | null;
    };
    response: import('./ecom').EcomReturnLink;
  };
  "ecom.refunds.list": {
    request: { readonly channelId?: number; readonly limit?: number };
    response: readonly Readonly<Record<string, string | number | null>>[];
  };
  "ecom.refunds.record": {
    request: {
      readonly channelId: number;
      readonly externalOrderId?: number | null;
      readonly omsRefundId?: number | null;
      readonly remoteRefundId: string;
      readonly amountFils: number;
      readonly currency: string;
      readonly status: string;
      readonly idempotencyKey: string;
    };
    response: readonly Readonly<Record<string, string | number | null>>[];
  };

  "ecom.payouts.list": {
    request: {
      readonly channelId?: number;
      readonly status?: import('./ecom').EcomPayoutStatus;
      readonly limit?: number;
    };
    response: readonly import('./ecom').EcomPayout[];
  };
  "ecom.payouts.get": { request: { readonly id: number }; response: import('./ecom').EcomPayout };
  "ecom.payouts.import": { request: import('./ecom').EcomPayoutInput; response: import('./ecom').EcomPayout };
  "ecom.payouts.remit": {
    request: { readonly id: number; readonly remittedFils: number; readonly remittedAt: string; readonly reference: string };
    response: import('./ecom').EcomPayout;
  };
  "ecom.payouts.reconcile": {
    request: { readonly id: number; readonly bankReference: string };
    response: import('./ecom').EcomPayout;
  };
  "ecom.payouts.fees": {
    request: { readonly channelId?: number; readonly payoutId?: number; readonly limit?: number };
    response: readonly import('./ecom').EcomFeeLine[];
  };
  "ecom.payouts.matches": {
    request: { readonly payoutId: number };
    response: readonly import('./ecom').EcomSettlementMatch[];
  };
  "ecom.payouts.discrepancies": {
    request: Record<string, never>;
    response: readonly Readonly<Record<string, string | number | null>>[];
  };
  "ecom.payouts.summary": {
    request: Record<string, never>;
    response: {
      readonly pendingFils: number;
      readonly remittedFils: number;
      readonly discrepancyCount: number;
      readonly feeFils: number;
    };
  };

  "ecom.webhooks.list": {
    request: {
      readonly channelId?: number;
      readonly status?: import('./ecom').EcomWebhookEvent['status'];
      readonly limit?: number;
    };
    response: readonly import('./ecom').EcomWebhookEvent[];
  };
  "ecom.webhooks.ingest": {
    request: import('./ecom').EcomWebhookInput;
    response: import('./ecom').EcomWebhookIngestResult;
  };
  "ecom.webhooks.replay": {
    request: { readonly id: number };
    response: import('./ecom').EcomWebhookIngestResult;
  };
  "ecom.webhooks.health": {
    request: Record<string, never>;
    response: readonly Readonly<Record<string, string | number | null>>[];
  };

  "ecom.marketing.list": {
    request: { readonly channelId?: number; readonly fromDate?: string; readonly toDate?: string; readonly limit?: number };
    response: readonly import('./ecom').EcomCampaign[];
  };
  "ecom.marketing.save": { request: import('./ecom').EcomCampaignInput; response: import('./ecom').EcomCampaign };
  "ecom.marketing.delete": { request: { readonly id: number }; response: void };
  "ecom.marketing.summary": {
    request: { readonly fromDate?: string; readonly toDate?: string };
    response: readonly import('./ecom').EcomMarketingSummary[];
  };

  "ecom.sync.jobs": {
    request: {
      readonly channelId?: number;
      readonly status?: import('./ecom').EcomJobStatus;
      readonly kind?: import('./ecom').EcomJobKind;
      readonly limit?: number;
      readonly offset?: number;
    };
    response: readonly import('./ecom').EcomSyncJob[];
  };
  "ecom.sync.summary": { request: Record<string, never>; response: import('./ecom').EcomSyncSummary };
  "ecom.sync.retry": { request: { readonly id: number }; response: import('./ecom').EcomSyncJob };
  "ecom.sync.retryDeadLetter": { request: { readonly channelId?: number }; response: number };
  "ecom.sync.cancel": { request: { readonly id: number }; response: import('./ecom').EcomSyncJob };
  "ecom.sync.run": {
    request: { readonly maxJobs?: number };
    response: import('./ecom').EcomDrainResult;
  };
  "ecom.sync.poll": { request: { readonly id: number }; response: import('./ecom').EcomPollResult };

  "ecom.dashboard": { request: Record<string, never>; response: import('./ecom').EcomDashboard };
  "ecom.reports.list": { request: Record<string, never>; response: readonly string[] };
  "ecom.reports.run": {
    request: { readonly report: string; readonly fromDate?: string; readonly toDate?: string };
    response: import('./ecom').EcomReportResult;
  };
  "ecom.reports.export": {
    request: { readonly report: string; readonly fromDate?: string; readonly toDate?: string };
    response: string;
  };
  "ecom.settings.list": { request: Record<string, never>; response: readonly import('./ecom').EcomSetting[] };
  "ecom.settings.save": {
    request: { readonly patch: Readonly<Record<string, string>> };
    response: readonly import('./ecom').EcomSetting[];
  };

  /* ------------------------------ ERP ------------------------------ */
  "erp.lookups": { request: { readonly companyId?: number }; response: Readonly<Record<string, readonly { readonly value: string; readonly label: string }[]>> };
  "erp.hr.lookups": { request: { readonly companyId?: number }; response: Readonly<Record<string, readonly { readonly value: string; readonly label: string }[]>> };
  "erp.companies.save": { request: { readonly id?: number; readonly code: string; readonly name: string; readonly legalName?: string; readonly currencyCode?: string; readonly fiscalStartMonth?: number; readonly ntn?: string; readonly strn?: string; readonly address?: string; readonly isActive?: boolean }; response: import('./erp').ErpCompany };
  "erp.bank.statements.get": { request: { readonly id: number }; response: Readonly<Record<string, unknown>> };
  "erp.payroll.assignments.list": { request: { readonly companyId?: number }; response: readonly Readonly<Record<string, unknown>>[] };
  "erp.onboarding.bootstrap": { request: { readonly companyId?: number; readonly fiscalYearName?: string }; response: { readonly companyId: number; readonly fiscalYearId: number | null; readonly accountsAdded: number } };

  "erp.companies.list": { request: Record<string, never>; response: readonly import('./erp').ErpCompany[] };
  "erp.fiscal.years.list": { request: {readonly companyId?:number}; response: readonly import('./erp').FiscalYear[] };
  "erp.fiscal.years.create": { request: { readonly companyId?:number; readonly name: string; readonly startDate: string; readonly endDate: string }; response: import('./erp').FiscalYear };
  "erp.fiscal.periods.list": { request: { readonly fiscalYearId: number }; response: readonly import('./erp').FiscalPeriod[] };
  "erp.fiscal.periods.setStatus": { request: { readonly periodId: number; readonly status: import('./erp').FiscalStatus }; response: import('./erp').FiscalPeriod };

  "erp.accounts.list": { request: { readonly companyId?: number; readonly includeInactive?: boolean }; response: readonly import('./erp').ErpAccount[] };
  "erp.accounts.get": { request: { readonly id: number }; response: import('./erp').ErpAccount };
  "erp.accounts.save": { request: import('./erp').ErpAccountInput; response: import('./erp').ErpAccount };
  "erp.accounts.delete": { request: { readonly id: number }; response: void };

  "erp.journals.list": { request: { readonly companyId?: number; readonly status?: import('./erp').ErpJournalStatus; readonly fromDate?: string; readonly toDate?: string; readonly limit?: number }; response: readonly import('./erp').ErpJournal[] };
  "erp.journals.get": { request: { readonly id: number }; response: import('./erp').ErpJournal };
  "erp.journals.create": { request: import('./erp').ErpJournalInput; response: import('./erp').ErpJournal };
  "erp.journals.update": { request: { readonly id: number; readonly input: import('./erp').ErpJournalInput }; response: import('./erp').ErpJournal };
  "erp.journals.submit": { request: { readonly id: number }; response: import('./erp').ErpJournal };
  "erp.journals.review": { request: { readonly id: number; readonly approve: boolean; readonly reason?: string }; response: import('./erp').ErpJournal };
  "erp.journals.approve": { request: { readonly id: number; readonly approve: boolean; readonly reason?: string }; response: import('./erp').ErpJournal };
  "erp.journals.post": { request: { readonly id: number }; response: import('./erp').ErpJournal };
  "erp.journals.returnToDraft": { request: { readonly id: number }; response: import('./erp').ErpJournal };
  "erp.journals.delete": { request: { readonly id: number }; response: void };
  "erp.journals.reverse": { request: { readonly id: number; readonly reason: string; readonly reversalDate: string }; response: import('./erp').ErpJournal };
  "erp.journals.integrityCheck": { request: { readonly companyId?: number }; response: readonly { readonly check: string; readonly ok: boolean; readonly detail: string }[] };

  "erp.reports.trialBalance": { request: { readonly companyId?: number; readonly fromDate: string; readonly toDate: string }; response: import('./erp').ErpTrialBalance };
  "erp.reports.profitAndLoss": { request: { readonly companyId?: number; readonly fromDate: string; readonly toDate: string }; response: import('./erp').ErpProfitLoss };
  "erp.reports.balanceSheet": { request: { readonly companyId?: number; readonly asOf: string }; response: import('./erp').ErpBalanceSheet };
  "erp.reports.cashFlow": { request: { readonly companyId?: number; readonly fromDate: string; readonly toDate: string }; response: import('./erp').ErpCashFlow };
  "erp.reports.arAging": { request: { readonly companyId?: number; readonly asOf: string }; response: readonly import('./erp').ErpAgingRow[] };
  "erp.reports.apAging": { request: { readonly companyId?: number; readonly asOf: string }; response: readonly import('./erp').ErpAgingRow[] };
  "erp.reports.subledgerReconciliation": { request: { readonly companyId?: number; readonly asOf: string }; response: import('./erp').ErpSubledgerRecon };
  "erp.reports.closingChecklist": { request: { readonly companyId?: number; readonly fiscalYearId: number }; response: import('./erp').ErpClosingChecklist };
  "erp.reports.postClosing": { request: { readonly companyId?: number; readonly fiscalYearId: number }; response: import('./erp').ErpJournal };

  "erp.dimensions.list": { request: { readonly companyId?: number; readonly kind?: import('./erp').DimensionKind }; response: readonly import('./erp').ErpDimension[] };
  "erp.dimensions.save": { request: { readonly id?: number; readonly companyId?: number; readonly kind: import('./erp').DimensionKind; readonly code: string; readonly name: string; readonly parentId?: number | null; readonly isActive?: boolean }; response: import('./erp').ErpDimension };
  "erp.dimensions.delete": { request: { readonly id: number }; response: void };

  "erp.taxCodes.list": { request: { readonly companyId?: number }; response: readonly import('./erp').ErpTaxCode[] };
  "erp.taxCodes.save": { request: { readonly id?: number; readonly companyId?: number; readonly code: string; readonly name: string; readonly kind: 'output' | 'input' | 'withholding' | 'exempt'; readonly rateBp: number; readonly isInclusive?: boolean; readonly glAccountCode: string; readonly effectiveFrom: string; readonly effectiveTo?: string | null; readonly jurisdiction?: string }; response: import('./erp').ErpTaxCode };

  "erp.ar.invoices.list": { request: { readonly companyId?: number; readonly status?: string; readonly customerId?: number; readonly search?: string; readonly limit?: number }; response: readonly import('./erp').CustomerInvoice[] };
  "erp.ar.invoices.get": { request: { readonly id: number }; response: import('./erp').CustomerInvoice };
  "erp.ar.invoices.save": { request: import('./erp').CustomerInvoiceInput; response: import('./erp').CustomerInvoice };
  "erp.ar.invoices.post": { request: { readonly id: number }; response: import('./erp').CustomerInvoice };
  "erp.ar.creditNotes.create": { request: { readonly invoiceId: number; readonly reason: string }; response: import('./erp').CustomerInvoice };
  "erp.ar.statement": { request: { readonly companyId?: number; readonly customerId: number; readonly fromDate: string; readonly toDate: string }; response: readonly Readonly<Record<string, unknown>>[] };

  "erp.ap.bills.list": { request: { readonly companyId?: number; readonly status?: string; readonly supplierId?: number; readonly search?: string; readonly limit?: number }; response: readonly import('./erp').SupplierBill[] };
  "erp.ap.bills.get": { request: { readonly id: number }; response: import('./erp').SupplierBill };
  "erp.ap.bills.save": { request: import('./erp').SupplierBillInput; response: import('./erp').SupplierBill };
  "erp.ap.bills.match": { request: { readonly billId: number }; response: import('./erp').SupplierBill };
  "erp.ap.bills.approveMatchVariance": { request: { readonly billId: number; readonly approve: boolean; readonly reason?: string }; response: import('./erp').SupplierBill };
  "erp.ap.bills.post": { request: { readonly id: number }; response: import('./erp').SupplierBill };
  "erp.ap.debitNotes.create": { request: { readonly billId: number; readonly reason: string }; response: import('./erp').SupplierBill };
  "erp.ap.acceptances.list": { request: { readonly companyId?: number; readonly supplierId?: number; readonly status?: string; readonly poRef?: string }; response: readonly Readonly<Record<string, unknown>>[] };
  "erp.ap.acceptances.create": { request: { readonly companyId?: number; readonly supplierId: number; readonly poRef?: string; readonly receiptRef?: string; readonly serviceDate: string; readonly description: string; readonly quantityMilli: number; readonly rateFils: number; readonly taxCodeId?: number | null }; response: Readonly<Record<string, unknown>> };

  "erp.payments.list": { request: { readonly companyId?: number; readonly kind?: string; readonly fromDate?: string; readonly toDate?: string; readonly limit?: number }; response: readonly import('./erp').ErpPayment[] };
  "erp.payments.get": { request: { readonly id: number }; response: import('./erp').ErpPayment };
  "erp.payments.save": { request: import('./erp').ErpPaymentInput; response: import('./erp').ErpPayment };
  "erp.payments.post": { request: { readonly id: number }; response: import('./erp').ErpPayment };
  "erp.payments.reverse": { request: { readonly id: number; readonly reason: string; readonly reversalDate: string }; response: import('./erp').ErpPayment };
  "erp.payments.applyUnappliedCredit": { request: { readonly paymentId: number; readonly invoiceId: number; readonly amountFils: number }; response: import('./erp').ErpPayment };

  "erp.bank.accounts.list": { request: { readonly companyId?: number }; response: readonly import('./erp').ErpBankAccount[] };
  "erp.bank.accounts.save": { request: { readonly id?: number; readonly companyId?: number; readonly name: string; readonly bankName?: string; readonly accountNumber?: string; readonly kind?: 'cash' | 'bank'; readonly glAccountCode?: string; readonly currencyCode?: string; readonly isActive?: boolean }; response: import('./erp').ErpBankAccount };
  "erp.bank.statements.list": { request: { readonly companyId?: number; readonly bankAccountId?: number }; response: readonly import('./erp').ErpBankStatement[] };
  "erp.bank.statements.import": { request: { readonly companyId?: number; readonly bankAccountId: number; readonly statementNo?: string; readonly periodStart: string; readonly periodEnd: string; readonly openingBalanceFils: number; readonly closingBalanceFils: number; readonly lines: readonly { readonly valueDate: string; readonly description: string; readonly amountFils: number; readonly externalRef?: string }[] }; response: import('./erp').ErpBankStatement };
  "erp.bank.lines.autoReconcile": { request: { readonly statementId: number }; response: { readonly matched: number; readonly unmatched: number } };
  "erp.bank.lines.match": { request: { readonly lineId: number; readonly paymentId: number }; response: import('./erp').ErpStatementLineRow };
  "erp.bank.lines.book": { request: { readonly lineId: number; readonly eventKind: 'fee' | 'interest' | 'returned_payment' | 'direct_receipt' | 'direct_payment'; readonly accountCode?: string; readonly partyId?: number | null }; response: import('./erp').ErpStatementLineRow };
  "erp.bank.balances": { request: { readonly companyId?: number; readonly asOf?: string }; response: readonly { readonly bankAccountId: number; readonly name: string; readonly glFils: number; readonly statementFils: number | null }[] };

  "erp.assets.list": { request: { readonly companyId?: number; readonly status?: string }; response: readonly import('./erp').ErpFixedAsset[] };
  "erp.assets.save": { request: { readonly id?: number; readonly companyId?: number; readonly name: string; readonly categoryCode: string; readonly acquiredOn: string; readonly costFils: number; readonly salvageFils?: number; readonly usefulLifeMonths?: number; readonly method?: 'straight_line' | 'declining_balance'; readonly notes?: string }; response: import('./erp').ErpFixedAsset };
  "erp.assets.capitalize": { request: { readonly assetId: number }; response: import('./erp').ErpFixedAsset };
  "erp.assets.depreciate": { request: { readonly companyId?: number; readonly periodName: string; readonly assetId?: number }; response: { readonly postedCount: number; readonly totalFils: number } };
  "erp.assets.schedule": { request: { readonly companyId?: number; readonly fiscalYearId: number }; response: readonly import('./erp').ErpDepreciationRow[] };
  "erp.assets.dispose": { request: { readonly assetId: number; readonly disposalDate: string; readonly proceedsFils: number; readonly reason: string }; response: import('./erp').ErpFixedAsset };

  "erp.budgets.list": { request: { readonly companyId?: number }; response: readonly import('./erp').ErpBudget[] };
  "erp.budgets.get": { request: { readonly id: number }; response: import('./erp').ErpBudget };
  "erp.budgets.save": { request: { readonly id?: number; readonly companyId?: number; readonly code: string; readonly name: string; readonly fiscalYearId: number; readonly scope?: 'company' | 'department' | 'cost_center' | 'project'; readonly dimensionId?: number | null; readonly lines: readonly { readonly periodName: string; readonly accountCode: string; readonly amountFils: number }[] }; response: import('./erp').ErpBudget };
  "erp.budgets.submit": { request: { readonly id: number }; response: import('./erp').ErpBudget };
  "erp.budgets.decide": { request: { readonly id: number; readonly approve: boolean }; response: import('./erp').ErpBudget };
  "erp.budgets.lock": { request: { readonly id: number }; response: import('./erp').ErpBudget };
  "erp.budgets.check": { request: { readonly companyId?: number; readonly fiscalYearId: number; readonly accountCode: string; readonly periodName: string; readonly dimensionId?: number | null }; response: import('./erp').ErpBudgetCheck };

  "erp.procurement.requisitions.list": { request: { readonly companyId?: number }; response: readonly import('./erp').ErpRequisition[] };
  "erp.procurement.requisitions.get": { request: { readonly id: number }; response: import('./erp').ErpRequisition };
  "erp.procurement.requisitions.save": { request: { readonly id?: number; readonly companyId?: number; readonly requestedBy: string; readonly kind?: 'service' | 'stock'; readonly neededBy?: string; readonly justification?: string; readonly lines: readonly { readonly description: string; readonly quantityMilli?: number; readonly estimatedFils?: number; readonly costCenterId?: number | null; readonly projectId?: number | null }[] }; response: import('./erp').ErpRequisition };
  "erp.procurement.requisitions.submit": { request: { readonly id: number }; response: import('./erp').ErpRequisition };
  "erp.procurement.requisitions.decide": { request: { readonly id: number; readonly approve: boolean; readonly reason?: string }; response: import('./erp').ErpRequisition };
  "erp.procurement.requisitions.close": { request: { readonly id: number }; response: import('./erp').ErpRequisition };
  "erp.procurement.rfqs.list": { request: { readonly companyId?: number }; response: readonly import('./erp').ErpRfq[] };
  "erp.procurement.rfqs.get": { request: { readonly id: number }; response: import('./erp').ErpRfq };
  "erp.procurement.rfqs.create": { request: { readonly companyId?: number; readonly reqId?: number | null; readonly issuedOn: string; readonly closesOn?: string }; response: import('./erp').ErpRfq };
  "erp.procurement.quotes.add": { request: { readonly rfqId: number; readonly supplierId: number; readonly quotedFils: number; readonly leadTimeDays?: number; readonly validUntil?: string; readonly notes?: string }; response: import('./erp').ErpRfq };
  "erp.procurement.quotes.compare": { request: { readonly rfqId: number }; response: readonly import('./erp').ErpQuoteComparison[] };
  "erp.procurement.rfqs.award": { request: { readonly rfqId: number; readonly quoteId: number }; response: import('./erp').ErpRfq };
  "erp.procurement.rfqs.cancel": { request: { readonly rfqId: number }; response: import('./erp').ErpRfq };

  "erp.suppliers.profiles.list": { request: Record<string, never>; response: readonly import('./erp').ErpSupplierProfile[] };
  "erp.suppliers.profiles.get": { request: { readonly partyId: number }; response: import('./erp').ErpSupplierProfile };
  "erp.suppliers.profiles.save": { request: { readonly partyId: number; readonly qualification?: string; readonly category?: string; readonly paymentTermsDays?: number; readonly approvalStatus?: 'pending' | 'approved' | 'blocked' | 'suspended'; readonly rating?: number; readonly taxMetadata?: string; readonly contractRef?: string; readonly notes?: string }; response: import('./erp').ErpSupplierProfile };

  "erp.crm.leads.list": { request: { readonly companyId?: number }; response: readonly import('./erp').ErpLead[] };
  "erp.crm.leads.save": { request: { readonly id?: number; readonly companyId?: number; readonly name: string; readonly organization?: string; readonly source?: string; readonly owner?: string; readonly stage?: 'new' | 'contacted' | 'qualified' | 'unqualified'; readonly priority?: 'low' | 'medium' | 'high'; readonly phone?: string; readonly email?: string; readonly notes?: string }; response: import('./erp').ErpLead };
  "erp.crm.leads.convert": { request: { readonly leadId: number; readonly valueFils: number }; response: import('./erp').ErpOpportunity };
  "erp.crm.opportunities.list": { request: { readonly companyId?: number }; response: readonly import('./erp').ErpOpportunity[] };
  "erp.crm.opportunities.save": { request: { readonly id?: number; readonly companyId?: number; readonly name: string; readonly partyId?: number | null; readonly stage?: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'; readonly valueFils: number; readonly probability?: number; readonly expectedClose?: string; readonly owner?: string }; response: import('./erp').ErpOpportunity };
  "erp.crm.opportunities.close": { request: { readonly id: number; readonly won: boolean; readonly reason?: string; readonly orderRef?: string }; response: import('./erp').ErpOpportunity };
  "erp.crm.opportunities.pipeline": { request: { readonly companyId?: number }; response: readonly import('./erp').ErpPipelineStage[] };
  "erp.crm.activities.list": { request: { readonly companyId?: number; readonly leadId?: number; readonly opportunityId?: number }; response: readonly import('./erp').ErpActivity[] };
  "erp.crm.activities.add": { request: { readonly companyId?: number; readonly kind?: 'call' | 'meeting' | 'email' | 'task' | 'note'; readonly subject: string; readonly details?: string; readonly dueOn?: string; readonly owner?: string; readonly leadId?: number | null; readonly opportunityId?: number | null }; response: import('./erp').ErpActivity };
  "erp.crm.activities.complete": { request: { readonly id: number }; response: import('./erp').ErpActivity };
  "erp.crm.contracts.list": { request: { readonly companyId?: number }; response: readonly import('./erp').ErpContract[] };
  "erp.crm.contracts.save": { request: { readonly id?: number; readonly companyId?: number; readonly counterpartyType: 'customer' | 'supplier'; readonly counterpartyId: number; readonly title: string; readonly startDate: string; readonly endDate?: string; readonly renewal?: string; readonly pricingTerms?: string; readonly paymentTerms?: string }; response: import('./erp').ErpContract };
  "erp.crm.contracts.submit": { request: { readonly id: number }; response: import('./erp').ErpContract };
  "erp.crm.contracts.decide": { request: { readonly id: number; readonly approve: boolean }; response: import('./erp').ErpContract };
  "erp.crm.contracts.activate": { request: { readonly id: number }; response: import('./erp').ErpContract };
  "erp.crm.contracts.terminate": { request: { readonly id: number }; response: import('./erp').ErpContract };

  "erp.hr.departments.list": { request: { readonly companyId?: number }; response: readonly import('./erp').ErpDepartment[] };
  "erp.hr.departments.save": { request: { readonly id?: number; readonly companyId?: number; readonly code: string; readonly name: string; readonly parentId?: number | null; readonly isActive?: boolean }; response: import('./erp').ErpDepartment };
  "erp.hr.departments.delete": { request: { readonly id: number }; response: void };
  "erp.hr.designations.list": { request: { readonly companyId?: number }; response: readonly import('./erp').ErpDesignation[] };
  "erp.hr.designations.save": { request: { readonly id?: number; readonly companyId?: number; readonly code: string; readonly name: string; readonly grade?: string }; response: import('./erp').ErpDesignation };
  "erp.hr.employees.list": { request: { readonly companyId?: number; readonly activeOnly?: boolean }; response: readonly import('./erp').ErpEmployee[] };
  "erp.hr.employees.get": { request: { readonly id: number }; response: import('./erp').ErpEmployee };
  "erp.hr.employees.save": { request: { readonly id?: number; readonly companyId?: number; readonly fullName: string; readonly status?: import('./erp').ErpEmployee['status']; readonly employmentType?: import('./erp').ErpEmployee['employmentType']; readonly departmentId?: number | null; readonly designationId?: number | null; readonly managerId?: number | null; readonly joiningDate: string; readonly exitDate?: string; readonly phone?: string; readonly email?: string; readonly cnic?: string; readonly bankAccountRef?: string; readonly notes?: string }; response: import('./erp').ErpEmployee };
  "erp.hr.shifts.list": { request: { readonly companyId?: number }; response: readonly import('./erp').ErpShift[] };
  "erp.hr.shifts.save": { request: { readonly id?: number; readonly companyId?: number; readonly code: string; readonly name: string; readonly startTime: string; readonly endTime: string; readonly graceMinutes?: number }; response: import('./erp').ErpShift };
  "erp.hr.attendance.list": { request: { readonly companyId?: number; readonly employeeId?: number | null; readonly fromDate: string; readonly toDate: string }; response: readonly import('./erp').ErpAttendance[] };
  "erp.hr.attendance.save": { request: { readonly companyId?: number; readonly employeeId: number; readonly workDate: string; readonly shiftId?: number | null; readonly checkIn?: string | null; readonly checkOut?: string | null; readonly status?: import('./erp').ErpAttendance['status']; readonly correctionNote?: string }; response: import('./erp').ErpAttendance };
  "erp.hr.leaveTypes.list": { request: { readonly companyId?: number }; response: readonly import('./erp').ErpLeaveType[] };
  "erp.hr.leaveTypes.save": { request: { readonly id?: number; readonly companyId?: number; readonly code: string; readonly name: string; readonly annualEntitlementDays: number; readonly carryForward?: boolean; readonly isPaid?: boolean }; response: import('./erp').ErpLeaveType };
  "erp.hr.leaveBalance": { request: { readonly companyId?: number; readonly employeeId: number; readonly leaveTypeId: number; readonly year: number }; response: import('./erp').ErpLeaveBalance };
  "erp.hr.leaveRequests.list": { request: { readonly companyId?: number; readonly status?: 'pending' | 'approved' | 'rejected' | 'cancelled' }; response: readonly import('./erp').ErpLeaveRequest[] };
  "erp.hr.leaveRequests.request": { request: { readonly companyId?: number; readonly employeeId: number; readonly leaveTypeId: number; readonly fromDate: string; readonly toDate: string; readonly days: number; readonly reason?: string }; response: import('./erp').ErpLeaveRequest };
  "erp.hr.leaveRequests.decide": { request: { readonly id: number; readonly approve: boolean; readonly note?: string }; response: import('./erp').ErpLeaveRequest };

  "erp.payroll.structures.list": { request: { readonly companyId?: number }; response: readonly import('./erp').ErpSalaryStructure[] };
  "erp.payroll.structures.save": { request: { readonly id?: number; readonly companyId?: number; readonly code: string; readonly name: string; readonly components: readonly { readonly name: string; readonly kind: 'earning' | 'deduction'; readonly calcType: 'fixed' | 'percent_of_basic' | 'attendance_based' | 'formula'; readonly amountFils?: number; readonly percentBp?: number; readonly glAccountCode?: string; readonly sequence?: number }[] }; response: import('./erp').ErpSalaryStructure };
  "erp.payroll.assignments.save": { request: { readonly companyId?: number; readonly employeeId: number; readonly structureId: number; readonly basicFils: number; readonly effectiveFrom: string; readonly effectiveTo?: string }; response: Readonly<Record<string, unknown>> };
  "erp.payroll.runs.list": { request: { readonly companyId?: number }; response: readonly import('./erp').ErpPayrollRun[] };
  "erp.payroll.runs.get": { request: { readonly id: number }; response: import('./erp').ErpPayrollRun };
  "erp.payroll.runs.create": { request: { readonly companyId?: number; readonly periodStart: string; readonly periodEnd: string }; response: import('./erp').ErpPayrollRun };
  "erp.payroll.runs.calculate": { request: { readonly id: number }; response: import('./erp').ErpPayrollRun };
  "erp.payroll.runs.review": { request: { readonly id: number }; response: import('./erp').ErpPayrollRun };
  "erp.payroll.runs.decide": { request: { readonly id: number; readonly approve: boolean }; response: import('./erp').ErpPayrollRun };
  "erp.payroll.runs.post": { request: { readonly id: number }; response: import('./erp').ErpPayrollRun };
  "erp.payroll.runs.pay": { request: { readonly id: number; readonly method: 'cash' | 'bank' | 'cheque'; readonly bankAccountId?: number | null }; response: import('./erp').ErpPayrollRun };
  "erp.payroll.runs.cancel": { request: { readonly id: number }; response: import('./erp').ErpPayrollRun };

  "erp.approvals.list": { request: { readonly companyId?: number; readonly status?: import('./erp').ErpApproval['status']; readonly docType?: string }; response: readonly import('./erp').ErpApproval[] };
  "erp.approvals.pending": { request: { readonly companyId?: number; readonly docType?: string }; response: readonly import('./erp').ErpApproval[] };
  "erp.approvals.request": { request: { readonly companyId?: number; readonly docType: string; readonly docId: number; readonly docNo?: string; readonly level?: number; readonly requiredRole?: string; readonly thresholdFils?: number }; response: import('./erp').ErpApproval };
  "erp.approvals.decide": { request: { readonly id: number; readonly approve: boolean; readonly reason?: string }; response: import('./erp').ErpApproval };
  "erp.approvals.cancel": { request: { readonly id: number }; response: import('./erp').ErpApproval };

  "erp.ic.links.list": { request: Record<string, never>; response: readonly import('./erp').ErpIntercompanyLink[] };
  "erp.ic.links.create": { request: { readonly companyAId: number; readonly companyBId: number; readonly dueFromCode?: string; readonly dueToCode?: string }; response: import('./erp').ErpIntercompanyLink };
  "erp.ic.txns.list": { request: { readonly linkId?: number }; response: readonly import('./erp').ErpIntercompanyTxn[] };
  "erp.ic.txns.post": { request: { readonly linkId: number; readonly direction: 'a_to_b' | 'b_to_a'; readonly amountFils: number; readonly description: string; readonly txnDate: string }; response: import('./erp').ErpIntercompanyTxn };
  "erp.ic.txns.settle": { request: { readonly id: number }; response: import('./erp').ErpIntercompanyTxn };
  "erp.consolidation.groups.list": { request: Record<string, never>; response: readonly import('./erp').ErpConsolidationGroup[] };
  "erp.consolidation.groups.create": { request: { readonly name: string; readonly parentCompanyId: number; readonly members: readonly { readonly companyId: number; readonly ownershipBp: number }[] }; response: { readonly groupId: number } };
  "erp.consolidation.worksheet": { request: { readonly groupId: number; readonly asOf: string }; response: import('./erp').ErpConsolidationWorksheet };

  "erp.fbr.credentials.save": { request: { readonly companyId?: number; readonly reference: string; readonly accessToken: string }; response: { readonly reference: string; readonly stored: boolean } };
  "erp.fbr.config.get": { request: { readonly companyId?: number }; response: import('./erp').ErpFbrConfig };
  "erp.fbr.config.save": { request: { readonly companyId?: number; readonly ntn?: string; readonly strn?: string; readonly taxpayerCategory?: string; readonly integrator?: string; readonly endpoint?: string; readonly credentialRef?: string; readonly mode?: 'not_connected' | 'sandbox' | 'production'; readonly isEnabled?: boolean }; response: import('./erp').ErpFbrConfig };
  "erp.fbr.status": { request: { readonly companyId?: number }; response: { readonly status: string } };
  "erp.fbr.submissions.list": { request: { readonly companyId?: number }; response: readonly import('./erp').ErpFbrSubmission[] };
  "erp.fbr.submissions.prepare": { request: { readonly invoiceId: number }; response: import('./erp').ErpFbrSubmission };
  "erp.fbr.submissions.attempt": { request: { readonly id: number }; response: import('./erp').ErpFbrSubmission };

  "erp.projects.list": { request: { readonly companyId?: number; readonly status?: import('./erp').ErpProject['status'] }; response: readonly import('./erp').ErpProject[] };
  "erp.projects.get": { request: { readonly id: number }; response: import('./erp').ErpProject };
  "erp.projects.save": { request: { readonly id?: number; readonly companyId?: number; readonly code: string; readonly name: string; readonly customerId?: number | null; readonly status?: import('./erp').ErpProject['status']; readonly startDate?: string; readonly endDate?: string; readonly budgetFils?: number; readonly notes?: string }; response: import('./erp').ErpProject };
  "erp.projects.tasks.list": { request: { readonly projectId: number }; response: readonly import('./erp').ErpTask[] };
  "erp.projects.tasks.save": { request: { readonly id?: number; readonly projectId: number; readonly title: string; readonly description?: string; readonly milestone?: string; readonly status?: import('./erp').ErpTask['status']; readonly priority?: 'low' | 'medium' | 'high'; readonly assignee?: string; readonly dependsOn?: number | null; readonly dueDate?: string }; response: import('./erp').ErpTask };
  "erp.projects.tasks.complete": { request: { readonly id: number }; response: import('./erp').ErpTask };
  "erp.projects.timesheets.list": { request: { readonly companyId?: number; readonly projectId?: number | null; readonly fromDate: string; readonly toDate: string }; response: readonly import('./erp').ErpTimesheetRow[] };
  "erp.projects.timesheets.save": { request: { readonly companyId?: number; readonly projectId: number; readonly taskId?: number | null; readonly employeeId: number; readonly workDate: string; readonly minutes: number; readonly isBillable?: boolean; readonly hourlyCostFils?: number; readonly notes?: string }; response: import('./erp').ErpTimesheetRow };
  "erp.projects.costReport": { request: { readonly projectId: number }; response: import('./erp').ErpProjectCostReport };
}

export interface SetupStatus {
  readonly isComplete: boolean;
  readonly companyName: string;
  readonly machineId: string;
  readonly appVersion: string;
}

export interface LicenseCheckResponse {
  readonly ok: boolean;
  readonly machineId: string;
  readonly clientName: string;
  readonly expiresAt: string | null;
  readonly daysUntilExpiry: number | null;
  readonly isExpiringSoon: boolean;
}

export interface LicenseActivateResponse {
  readonly ok: boolean;
  readonly machineId: string;
  readonly clientName: string;
  readonly expiresAt: string | null;
  readonly daysUntilExpiry: number | null;
  readonly isExpiringSoon: boolean;
}

export interface LicenseStatusResponse {
  readonly clientName: string;
  readonly expiresAt: string | null;
  readonly daysUntilExpiry: number | null;
  readonly isExpiringSoon: boolean;
  readonly machineId: string;
}

/**
 * The one currency the application supports.
 *
 * EyerStock trades in Pakistani Rupees only. The amounts are stored as plain
 * integers with no currency attached, so there is nothing to convert: the
 * figures a shop recorded are the figures it recorded.
 */
export type Currency = "PKR";

/**
 * The theme the user picked.
 *
 * `system` defers to the OS appearance and is resolved in the renderer; the
 * main process only ever stores the preference, never the resolved value.
 */
export type ThemePreference = "light" | "dark" | "system";

export interface AppSettingsSnapshot {
  readonly theme: ThemePreference;
  /**
   * The colour pack, independent of the light/dark preference above.
   *
   * The two are separate choices: `theme` says how bright the screen is and
   * `themePalette` says which family of colours it uses. Keeping them apart is
   * what lets a shop run "Midnight Navy in dark" without the stored value
   * having to enumerate thirty combinations.
   */
  readonly themePalette: ThemeId;
  /**
   * Whether the first-login theme chooser has been completed.
   *
   * The flag is installation-wide because the palette itself is: there is one
   * theme stored for the whole database, not one per account. A fresh install
   * starts at `false` and the chooser marks it `true` once the user picks a
   * theme or chooses to keep the current one.
   */
  readonly themeOnboardingComplete: boolean;
  readonly companyName: string;
  readonly companyTrn: string;
  readonly companyAddress: string;
  readonly companyPhone: string;
  readonly companyEmail: string;
  readonly companyLogoPath: string;
  /**
   * The logo inlined as a `data:` URL, or null.
   *
   * Derived from `companyLogoPath` on every settings read and never persisted:
   * printed documents render in a sandboxed window with no filesystem access,
   * so the bytes have to travel with them. Callers treat it as read-only.
   */
  readonly companyLogoDataUrl: string | null;
  readonly invoiceFooter: string;
  readonly invoiceTerms: string;
  /** The organisation that built this software, shown on printed documents. */
  readonly vendorName: string;
  readonly fiscalYearStartMonth: number;
  /**
   * The currency every amount in the application is in.
   *
   * It is always PKR. The value is still reported so a report can name the
   * currency it was produced in.
   */
  readonly currency: Currency;
  readonly backupDirectory: string;
  readonly backupKeepCount: number;
  readonly dailyBackupEnabled: boolean;
  readonly dailyBackupHour: number;
  /** Share of net profit set aside as a donation before the partner split. */
  readonly donationRatePercent: number;
  /** VAT rate in percent applied to standard-rated lines. Defaults to 5. */
  readonly vatRatePercent: number;
  /** When true, a sale may take stock below zero. Defaults to false. */
  readonly allowNegativeStock: boolean;
}

export type RpcMethod = keyof RpcMethods;
export type RpcRequestOf<M extends RpcMethod> = RpcMethods[M]["request"];
export type RpcResponseOf<M extends RpcMethod> = RpcMethods[M]["response"];

/** The surface exposed on `window.api` by the preload script. */
export interface MinhaApi {
  getAppInfo(): Promise<ApiResult<AppInfo>>;
  getMigrationStatus(): Promise<ApiResult<MigrationStatus>>;
  runBackupNow(): Promise<ApiResult<BackupSummary>>;
  chooseBackupFolder(): Promise<ApiResult<BackupSummary>>;
  listBackups(): Promise<ApiResult<readonly BackupFileInfo[]>>;
  verifyBackup(path: string): Promise<ApiResult<RestoreVerificationInfo>>;
  restoreBackup(path: string, confirmation: string): Promise<ApiResult<MigrationStatus>>;
  exportDiagnostics(): Promise<ApiResult<string>>;
  /** Opens a native picker. Resolves to `null` when the user cancels. */
  pickFile(purpose: FilePickPurpose): Promise<ApiResult<string | null>>;
  pickImage(purpose: FilePickPurpose): Promise<ApiResult<string | null>>;
  invoke<M extends RpcMethod>(
    method: M,
    payload: RpcRequestOf<M>,
  ): Promise<ApiResult<RpcResponseOf<M>>>;
  printHtml(html: string, options: PrintOptions): Promise<ApiResult<string>>;
  saveHtmlAsPdf(
    html: string,
    suggestedName: string,
    options?: PdfOptions,
  ): Promise<ApiResult<string>>;
  openExternal(url: string): Promise<ApiResult<{ readonly opened: boolean }>>;

  /* updates */

  /** The updater's state as it is right now, without asking the server. */
  currentUpdate(): Promise<ApiResult<UpdateStatus>>;
  /** Ask the release server whether a newer version exists. */
  checkForUpdate(): Promise<ApiResult<UpdateStatus>>;
  /** Download the installer for the version that was found. */
  downloadUpdate(): Promise<ApiResult<UpdateStatus>>;
  /** Close the app and install the downloaded update. */
  installUpdate(): Promise<ApiResult<UpdateStatus>>;
  /**
   * Listen for update state changes.
   *
   * Returns a function that stops listening, so a screen that unmounts does
   * not leave a listener behind holding the renderer alive.
   */
  onUpdateStatus(listener: (status: UpdateStatus) => void): () => void;
}

export interface PrintOptions {
  readonly silent: boolean;
  readonly paperSize: "A4" | "A5" | "Letter";
  readonly landscape: boolean;
  readonly copies: number;
  /**
   * The document's name, shown beside the page number.
   *
   * Chromium has no CSS page counter, so the running title and the page number
   * come from Chromium's own page footer.
   */
  readonly footerLabel?: string | undefined;
}

/**
 * Options for the PDF export.
 *
 * Chromium has no CSS page counter, so the page number on an exported PDF
 * comes from its own footer template. `footerLabel` is the document's name,
 * shown beside it.
 */
export interface PdfOptions {
  readonly footerLabel?: string | undefined;
}
