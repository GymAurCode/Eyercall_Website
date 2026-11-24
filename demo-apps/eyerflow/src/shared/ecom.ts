import { z } from "zod";

/**
 * E-commerce Operations Management (ECOM) — shared contracts.
 *
 * ECOM is a multi-channel commerce operations layer. It does not own a second
 * product catalogue, stock ledger or order lifecycle: channel identities,
 * mappings, listings, sync evidence and settlement records hang off Core/IMS
 * product ids and canonical IMS sales orders (`ims_documents.id`).
 */

export const ECOM_PLATFORMS = [
  "shopify",
  "woocommerce",
  "daraz",
  "amazon",
  "tiktok",
  "generic",
] as const;
export type EcomPlatform = (typeof ECOM_PLATFORMS)[number];

export const ECOM_CONNECTION_STATES = [
  "disconnected",
  "authorizing",
  "connected",
  "degraded",
  "paused",
  "revoked",
] as const;
export type EcomConnectionState = (typeof ECOM_CONNECTION_STATES)[number];

/**
 * How a connection was actually observed. `live_verified` requires a real
 * authenticated provider call; fixture and sandbox evidence are never presented
 * as live.
 */
export const ECOM_VERIFICATIONS = [
  "live_verified",
  "sandbox_verified",
  "fixture_verified",
  "implemented_unverified",
  "awaiting_credentials",
  "provider_blocked",
  "unsupported",
] as const;
export type EcomVerification = (typeof ECOM_VERIFICATIONS)[number];

export const ECOM_SYNC_MODES = ["webhook", "polling", "manual"] as const;
export type EcomSyncMode = (typeof ECOM_SYNC_MODES)[number];

export const ECOM_JOB_STATUSES = [
  "pending",
  "running",
  "retry",
  "succeeded",
  "failed",
  "dead_letter",
  "cancelled",
] as const;
export type EcomJobStatus = (typeof ECOM_JOB_STATUSES)[number];

export const ECOM_JOB_KINDS = [
  "testConnection",
  "publishListing",
  "updateListing",
  "updatePrice",
  "updateInventory",
  "importOrder",
  "fulfillment",
  "return",
  "refund",
  "settlement",
  "reconcile",
  "bulk",
] as const;
export type EcomJobKind = (typeof ECOM_JOB_KINDS)[number];

export const ECOM_PUBLISH_STATUSES = [
  "draft",
  "pending",
  "published",
  "rejected",
  "paused",
  "archived",
] as const;
export type EcomPublishStatus = (typeof ECOM_PUBLISH_STATUSES)[number];

export const ECOM_IMPORT_STATUSES = [
  "pending",
  "imported",
  "exception",
  "skipped",
  "duplicate",
] as const;
export type EcomImportStatus = (typeof ECOM_IMPORT_STATUSES)[number];

export const ECOM_PAYOUT_STATUSES = [
  "unreconciled",
  "matched",
  "partially_matched",
  "discrepancy",
  "remitted",
  "reconciled",
] as const;
export type EcomPayoutStatus = (typeof ECOM_PAYOUT_STATUSES)[number];

export const ECOM_FEE_TYPES = [
  "commission",
  "payment",
  "shipping",
  "fulfillment",
  "subscription",
  "storage",
  "advertising",
  "return",
  "penalty",
  "tax_withholding",
  "adjustment",
] as const;
export type EcomFeeType = (typeof ECOM_FEE_TYPES)[number];

export const ECOM_AUTHORITIES = ["eyerflow", "channel", "manual"] as const;
export type EcomAuthority = (typeof ECOM_AUTHORITIES)[number];

export interface EcomCapabilitySet {
  readonly productRead: boolean;
  readonly productWrite: boolean;
  readonly inventoryRead: boolean;
  readonly inventoryWrite: boolean;
  readonly orderRead: boolean;
  readonly orderWrite: boolean;
  readonly fulfillmentUpdates: boolean;
  readonly refundUpdates: boolean;
  readonly returns: boolean;
  readonly payouts: boolean;
  readonly marketingData: boolean;
  readonly webhookSupport: boolean;
  readonly pollingSupport: boolean;
}

export interface EcomProviderDescriptor {
  readonly platform: EcomPlatform;
  readonly label: string;
  readonly authModel: "oauth" | "apiKey" | "signedRequest";
  readonly docsUrl: string;
  readonly apiVersion: string;
  readonly capabilities: EcomCapabilitySet;
  /** Why a provider may not be connectable yet, in operator words. */
  readonly readiness: EcomVerification;
  readonly readinessNote: string;
}

/* -------------------------------------------------------------------------- */
/* channels                                                                    */
/* -------------------------------------------------------------------------- */

export interface EcomChannel {
  readonly id: number;
  readonly platform: EcomPlatform;
  readonly name: string;
  readonly storeUrl: string;
  readonly region: string;
  readonly currency: string;
  readonly timeZone: string;
  readonly branch: string;
  readonly companyId: string | null;
  readonly defaultWarehouseId: number | null;
  readonly defaultWarehouseName: string | null;
  readonly inventoryLocationId: number | null;
  readonly syncMode: EcomSyncMode;
  readonly authScopes: readonly string[];
  readonly tokenStatus: "valid" | "expiring" | "expired" | "revoked" | "missing";
  readonly tokenExpiresAt: string | null;
  readonly connectionState: EcomConnectionState;
  readonly verification: EcomVerification;
  readonly externalStoreId: string | null;
  readonly lastConnectedAt: string | null;
  readonly lastSuccessSyncAt: string | null;
  readonly lastError: string | null;
  readonly paused: boolean;
  readonly credentialConfigured: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface EcomChannelHealth {
  readonly channelId: number;
  readonly pendingJobs: number;
  readonly failedJobs: number;
  readonly deadLetters: number;
  readonly lastEventAt: string | null;
  readonly webhookCount24h: number;
  readonly mappingCount: number;
  readonly publishedListings: number;
  readonly rejectedListings: number;
}

export interface EcomChannelInput {
  readonly id?: number;
  readonly platform: EcomPlatform;
  readonly name: string;
  readonly storeUrl: string;
  readonly region: string;
  readonly currency: string;
  readonly timeZone: string;
  readonly branch: string;
  readonly companyId?: string | null;
  readonly defaultWarehouseId?: number | null;
  readonly inventoryLocationId?: number | null;
  readonly syncMode: EcomSyncMode;
  readonly authScopes?: readonly string[];
  readonly externalStoreId?: string | null;
  /** Secret material. Never returned to the renderer. */
  readonly accessToken?: string | null;
  readonly refreshToken?: string | null;
  readonly apiKey?: string | null;
  readonly apiSecret?: string | null;
  readonly webhookSecret?: string | null;
  readonly tokenExpiresAt?: string | null;
  readonly verification?: EcomVerification;
}

/* -------------------------------------------------------------------------- */
/* mapping, listings and pricing                                               */
/* -------------------------------------------------------------------------- */

export interface EcomMapping {
  readonly id: number;
  readonly channelId: number;
  readonly channelName: string;
  readonly platform: EcomPlatform;
  readonly currency: string;
  readonly productId: number | null;
  readonly sku: string;
  readonly productName: string;
  readonly variantKey: string | null;
  readonly remoteProductId: string;
  readonly remoteVariantId: string;
  readonly remoteInventoryItemId: string | null;
  readonly remoteSku: string | null;
  readonly remoteLocationId: string | null;
  readonly status: "active" | "inactive";
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface EcomListing {
  readonly id: number;
  readonly channelId: number;
  readonly channelName: string;
  readonly platform: EcomPlatform;
  readonly mappingId: number;
  readonly productId: number;
  readonly sku: string;
  readonly productName: string;
  readonly title: string;
  readonly category: string;
  readonly brand: string;
  readonly priceFils: number;
  readonly compareAtFils: number | null;
  readonly currency: string;
  readonly publishStatus: EcomPublishStatus;
  readonly remoteUrl: string | null;
  readonly rejectionReason: string | null;
  readonly lastPublishedAt: string | null;
  readonly lastSyncedAt: string | null;
  readonly updatedAt: string;
}

export interface EcomListingInput {
  readonly mappingId: number;
  readonly title: string;
  readonly description?: string;
  readonly category?: string;
  readonly brand?: string;
  readonly attributesJson?: string;
  readonly priceFils: number;
  readonly compareAtFils?: number | null;
}

export interface EcomPriceRule {
  readonly id: number;
  readonly channelId: number;
  readonly channelName: string;
  readonly productId: number | null;
  readonly productName: string | null;
  readonly ruleType: "fixed" | "markup";
  readonly value: number;
  readonly currency: string;
  readonly effectiveFrom: string | null;
  readonly effectiveTo: string | null;
  readonly floorFils: number | null;
  readonly rounding: "none" | "nearest" | "up" | "down";
  readonly authority: EcomAuthority;
  readonly active: boolean;
  readonly createdAt: string;
}

export interface EcomPriceRuleInput {
  readonly id?: number;
  readonly channelId: number;
  readonly productId?: number | null;
  readonly ruleType: "fixed" | "markup";
  readonly value: number;
  readonly currency: string;
  readonly effectiveFrom?: string | null;
  readonly effectiveTo?: string | null;
  readonly floorFils?: number | null;
  readonly rounding: "none" | "nearest" | "up" | "down";
  readonly authority: EcomAuthority;
  readonly active?: boolean;
}

export interface EcomPricePreview {
  readonly productId: number;
  readonly sku: string;
  readonly productName: string;
  readonly basePriceFils: number;
  readonly calculatedPriceFils: number;
  readonly ruleId: number | null;
  readonly currency: string;
  readonly floorViolated: boolean;
}

/* -------------------------------------------------------------------------- */
/* inventory                                                                   */
/* -------------------------------------------------------------------------- */

export interface EcomStockPolicy {
  readonly id: number;
  readonly channelId: number;
  readonly warehouseId: number | null;
  readonly safetyBufferMilli: number;
  readonly minExportMilli: number;
  readonly maxExportMilli: number | null;
  readonly syncFrequencyMinutes: number;
  readonly allowBackorders: boolean;
  readonly oosPolicy: "publish_zero" | "hide_listing" | "keep_last";
  readonly skuExclusions: readonly string[];
  readonly updatedAt: string;
}

export interface EcomStockRow {
  readonly mappingId: number;
  readonly channelId: number;
  readonly channelName: string;
  readonly productId: number;
  readonly sku: string;
  readonly productName: string;
  /** The evidence row this read of the conflict came from. */
  readonly snapshotId: number;
  readonly onHandMilli: number;
  readonly reservedMilli: number;
  readonly availableMilli: number;
  readonly safetyBufferMilli: number;
  readonly eligibleMilli: number;
  readonly remoteQuantityMilli: number | null;
  readonly syncStatus: "in_sync" | "pending" | "conflict" | "never_synced";
  readonly observedAt: string | null;
  readonly conflictNote: string | null;
}

export interface EcomStockPolicyInput {
  readonly channelId: number;
  readonly warehouseId?: number | null;
  readonly safetyBufferMilli: number;
  readonly minExportMilli: number;
  readonly maxExportMilli?: number | null;
  readonly syncFrequencyMinutes: number;
  readonly allowBackorders: boolean;
  readonly oosPolicy: "publish_zero" | "hide_listing" | "keep_last";
  readonly skuExclusions?: readonly string[];
}

/* -------------------------------------------------------------------------- */
/* sync                                                                        */
/* -------------------------------------------------------------------------- */

export interface EcomSyncJob {
  readonly id: number;
  readonly channelId: number;
  readonly channelName: string;
  readonly platform: EcomPlatform;
  readonly kind: EcomJobKind;
  readonly status: EcomJobStatus;
  readonly priority: number;
  readonly attempts: number;
  readonly maxAttempts: number;
  readonly idempotencyKey: string;
  readonly payloadJson: string;
  readonly resultJson: string | null;
  readonly lastError: string | null;
  readonly nextAttemptAt: string | null;
  readonly startedAt: string | null;
  readonly finishedAt: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface EcomWebhookEvent {
  readonly id: number;
  readonly platform: EcomPlatform;
  readonly channelId: number | null;
  readonly channelName: string | null;
  readonly eventId: string;
  readonly topic: string;
  readonly signatureVerified: boolean;
  readonly status: "received" | "processing" | "processed" | "failed" | "dead_letter" | "duplicate";
  readonly payloadJson: string;
  readonly error: string | null;
  readonly receivedAt: string;
  readonly processedAt: string | null;
}

export interface EcomWebhookInput {
  readonly platform: EcomPlatform;
  readonly channelId: number;
  readonly eventId: string;
  readonly topic: string;
  readonly rawBody: string;
  readonly signature?: string | null;
  readonly headers?: Readonly<Record<string, string>>;
}

/* -------------------------------------------------------------------------- */
/* external orders                                                             */
/* -------------------------------------------------------------------------- */

export interface EcomExternalOrderLine {
  readonly id: number;
  readonly remoteLineId: string;
  readonly remoteVariantId: string | null;
  readonly sku: string | null;
  readonly title: string;
  readonly quantityMilli: number;
  readonly unitPriceFils: number;
  readonly discountFils: number;
  readonly taxFils: number;
  readonly totalFils: number;
  readonly productId: number | null;
  readonly mappingStatus: "mapped" | "unmapped" | "conflict";
}

export interface EcomExternalOrder {
  readonly id: number;
  readonly channelId: number;
  readonly channelName: string;
  readonly platform: EcomPlatform;
  readonly externalOrderId: string;
  readonly externalNumber: string;
  readonly sourceEventId: string | null;
  readonly orderedAt: string;
  readonly currency: string;
  readonly subtotalFils: number;
  readonly discountFils: number;
  readonly taxFils: number;
  readonly shippingFils: number;
  readonly totalFils: number;
  readonly paymentStatus: string;
  readonly fulfillmentStatus: string;
  readonly customerName: string | null;
  readonly shippingCity: string | null;
  readonly importStatus: EcomImportStatus;
  readonly canonicalOrderId: number | null;
  readonly canonicalOrderNumber: string | null;
  readonly error: string | null;
  readonly lines: readonly EcomExternalOrderLine[];
  readonly createdAt: string;
  readonly importedAt: string | null;
}

export interface EcomOrderException {
  readonly id: number;
  readonly externalOrderId: number;
  readonly channelId: number;
  readonly channelName: string;
  readonly externalOrderNumber: string;
  readonly code: string;
  readonly message: string;
  readonly sourceJson: string | null;
  readonly status: "open" | "resolved" | "skipped" | "escalated";
  readonly resolvedBy: string | null;
  readonly resolvedAt: string | null;
  readonly createdAt: string;
}

export interface EcomShipmentLink {
  readonly id: number;
  readonly channelId: number;
  readonly channelName: string;
  readonly externalOrderId: number;
  readonly externalOrderNumber: string;
  readonly omsShipmentId: number | null;
  readonly carrier: string | null;
  readonly trackingNumber: string | null;
  readonly remoteFulfillmentId: string | null;
  readonly status: "pending" | "sent" | "failed" | "delivered" | "returned";
  readonly lastSyncedAt: string | null;
  readonly error: string | null;
  readonly createdAt: string;
}

export interface EcomReturnLink {
  readonly id: number;
  readonly channelId: number;
  readonly channelName: string;
  readonly externalReturnId: string;
  readonly externalOrderId: number | null;
  readonly externalOrderNumber: string | null;
  readonly omsReturnId: number | null;
  readonly reason: string;
  readonly quantityMilli: number;
  readonly status: string;
  readonly refundStatus: string;
  readonly remoteClaimId: string | null;
  readonly createdAt: string;
}

/* -------------------------------------------------------------------------- */
/* settlements and marketing                                                   */
/* -------------------------------------------------------------------------- */

export interface EcomPayout {
  readonly id: number;
  readonly channelId: number;
  readonly channelName: string;
  readonly platform: EcomPlatform;
  readonly payoutId: string;
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly currency: string;
  readonly grossFils: number;
  readonly discountFils: number;
  readonly refundFils: number;
  readonly commissionFils: number;
  readonly otherFeesFils: number;
  readonly taxFils: number;
  readonly netPayoutFils: number;
  readonly remittedFils: number;
  readonly remittedAt: string | null;
  readonly reference: string | null;
  readonly status: EcomPayoutStatus;
  readonly createdAt: string;
}

export interface EcomFeeLine {
  readonly id: number;
  readonly payoutId: number | null;
  readonly channelId: number;
  readonly externalOrderId: number | null;
  readonly feeType: EcomFeeType;
  readonly amountFils: number;
  readonly currency: string;
  readonly sourceReference: string;
  readonly occurredAt: string;
}

export interface EcomSettlementMatch {
  readonly id: number;
  readonly payoutId: number;
  readonly externalOrderId: number | null;
  readonly externalOrderNumber: string | null;
  readonly kind: "order" | "refund" | "fee" | "payout";
  readonly amountFils: number;
  readonly status: "matched" | "missing" | "discrepancy";
  readonly note: string | null;
}

export interface EcomPayoutInput {
  readonly channelId: number;
  readonly payoutId: string;
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly currency: string;
  readonly grossFils: number;
  readonly discountFils?: number;
  readonly refundFils?: number;
  readonly commissionFils?: number;
  readonly otherFeesFils?: number;
  readonly taxFils?: number;
  readonly remittedFils?: number;
  readonly remittedAt?: string | null;
  readonly reference?: string | null;
  readonly fees?: readonly {
    readonly feeType: EcomFeeType;
    readonly amountFils: number;
    readonly externalOrderId?: number | null;
    readonly sourceReference: string;
    readonly occurredAt: string;
  }[];
}

export interface EcomCampaign {
  readonly id: number;
  readonly channelId: number;
  readonly channelName: string;
  readonly name: string;
  readonly startsOn: string;
  readonly endsOn: string;
  readonly spendFils: number;
  readonly attributedOrders: number;
  readonly attributedRevenueFils: number;
  readonly source: "api" | "csv" | "manual";
  readonly createdAt: string;
}

export interface EcomCampaignInput {
  readonly channelId: number;
  readonly name: string;
  readonly startsOn: string;
  readonly endsOn: string;
  readonly spendFils: number;
  readonly attributedOrders: number;
  readonly attributedRevenueFils: number;
  readonly source?: "api" | "csv" | "manual";
}

/* -------------------------------------------------------------------------- */
/* dashboard / reports                                                        */
/* -------------------------------------------------------------------------- */

export interface EcomKpi {
  readonly connectedStores: number;
  readonly totalImportedOrders: number;
  readonly grossChannelSalesFils: number;
  readonly netChannelSalesFils: number;
  readonly awaitingProcessing: number;
  readonly awaitingFulfillment: number;
  readonly listingsPublished: number;
  readonly syncFailures: number;
  readonly pendingMappings: number;
  readonly stockSyncDelays: number;
  readonly outOfStockListings: number;
  readonly returns: number;
  readonly refundsFils: number;
  readonly marketplaceFeesFils: number;
  readonly pendingPayoutsFils: number;
  readonly reconciliationDiscrepancies: number;
}

export interface EcomSeriesPoint {
  readonly label: string;
  readonly value: number;
}

export interface EcomNamedValue {
  readonly name: string;
  readonly value: number;
}

export interface EcomDashboard {
  readonly kpi: EcomKpi;
  readonly revenueByStore: readonly EcomNamedValue[];
  readonly salesOverTime: readonly EcomSeriesPoint[];
  readonly ordersByChannel: readonly EcomNamedValue[];
  readonly topProducts: readonly EcomNamedValue[];
  readonly listingHealth: readonly EcomNamedValue[];
  readonly syncSuccessRate: number | null;
  readonly returnsByChannel: readonly EcomNamedValue[];
  readonly recentJobs: readonly EcomSyncJob[];
  readonly disconnectedStores: readonly EcomChannel[];
  readonly pendingShipments: number;
  readonly pendingReturns: number;
  readonly payoutMismatches: number;
  readonly uncaughtExceptions: number;
  readonly costDataComplete: boolean;
  readonly currency: string;
  readonly generatedAt: string;
}

export interface EcomReportColumn {
  readonly key: string;
  readonly label: string;
  readonly align?: "start" | "end" | undefined;
}

export interface EcomReportResult {
  readonly report: string;
  readonly title: string;
  readonly columns: readonly EcomReportColumn[];
  readonly rows: readonly Readonly<Record<string, string | number | null>>[];
  readonly generatedAt: string;
  readonly cutoff: string;
  readonly incomplete: boolean;
  readonly note: string | null;
}

/* -------------------------------------------------------------------------- */
/* operation results                                                          */
/* -------------------------------------------------------------------------- */

export interface EcomBulkResult {
  readonly total: number;
  readonly succeeded: number;
  readonly failed: number;
  readonly skipped: number;
  readonly errors: readonly string[];
}

export interface EcomWebhookIngestResult {
  readonly eventId: number;
  readonly duplicate: boolean;
  readonly status: EcomWebhookEvent["status"];
  readonly importedOrderId: number | null;
  readonly message: string;
}

export interface EcomMarketingSummary {
  readonly channelId: number;
  readonly channelName: string;
  readonly spendFils: number;
  readonly attributedOrders: number;
  readonly attributedRevenueFils: number;
  readonly roas: number | null;
}

export interface EcomSyncSummary {
  readonly pending: number;
  readonly retry: number;
  readonly running: number;
  readonly succeeded: number;
  readonly failed: number;
  readonly deadLetters: number;
  readonly lastSuccessAt: string | null;
  readonly lastFailureAt: string | null;
}

export interface EcomDrainResult {
  readonly claimed: number;
  readonly succeeded: number;
  readonly retried: number;
  readonly failed: number;
  readonly deadLetters: number;
}

export interface EcomPollResult {
  readonly channelId: number;
  readonly fetched: number;
  readonly imported: number;
  readonly exceptions: number;
  readonly skipped: number;
  readonly checkpoint: string | null;
  readonly errors: readonly string[];
}

export interface EcomQueuedStockSync {
  readonly mappingId: number;
  readonly channelId: number;
  readonly jobId: number;
  readonly eligibleMilli: number;
}

export interface EcomShipmentCreateResult {
  readonly link: EcomShipmentLink;
  readonly jobId: number | null;
}

export interface EcomOrderImportStats {
  readonly total: number;
  readonly imported: number;
  readonly exceptions: number;
  readonly canonical: number;
}

/* -------------------------------------------------------------------------- */
/* settings                                                                   */
/* -------------------------------------------------------------------------- */

export const ECOM_SETTING_KEYS = [
  "defaultCurrency",
  "defaultTimeZone",
  "defaultBranch",
  "productSync",
  "priceSync",
  "stockSync",
  "orderImport",
  "dataAuthority",
  "autoConfirmOrders",
  "unmappedSkuPolicy",
  "fulfillmentRouting",
  "trackingSync",
  "carrierMapping",
  "statusMapping",
  "feeCategories",
  "reconciliationToleranceFils",
  "notificationFailedSync",
  "notificationTokenExpiry",
  "notificationStockConflict",
  "notificationPayoutDiscrepancy",
] as const;
export type EcomSettingKey = (typeof ECOM_SETTING_KEYS)[number];

export interface EcomSetting {
  readonly key: string;
  readonly value: string;
  readonly updatedBy: string | null;
  readonly updatedAt: string | null;
}

export const ECOM_DEFAULT_SETTINGS: Readonly<Record<EcomSettingKey, string>> = {
  defaultCurrency: "PKR",
  defaultTimeZone: "Asia/Karachi",
  defaultBranch: "Main",
  productSync: "authoritative",
  priceSync: "eyerflow",
  stockSync: "authoritative",
  orderImport: "auto",
  dataAuthority: "eyerflow",
  autoConfirmOrders: "0",
  unmappedSkuPolicy: "exception",
  fulfillmentRouting: "oms",
  trackingSync: "1",
  carrierMapping: "{}",
  statusMapping: "{}",
  feeCategories: "commission,payment,shipping,fulfillment,subscription,storage,advertising,return,penalty,tax_withholding,adjustment",
  reconciliationToleranceFils: "100",
  notificationFailedSync: "1",
  notificationTokenExpiry: "1",
  notificationStockConflict: "1",
  notificationPayoutDiscrepancy: "1",
};

/* -------------------------------------------------------------------------- */
/* input schemas                                                              */
/* -------------------------------------------------------------------------- */

const platformSchema = z.enum(ECOM_PLATFORMS);
const currencySchema = z.string().trim().min(3).max(3).toUpperCase();

export const ecomChannelSaveSchema = z.object({
  id: z.number().int().positive().optional(),
  platform: platformSchema,
  name: z.string().trim().min(1).max(120),
  storeUrl: z.string().trim().max(300),
  region: z.string().trim().max(120),
  currency: currencySchema,
  timeZone: z.string().trim().max(80),
  branch: z.string().trim().max(80),
  companyId: z.string().trim().max(120).optional().nullable(),
  defaultWarehouseId: z.number().int().positive().optional().nullable(),
  inventoryLocationId: z.number().int().positive().optional().nullable(),
  syncMode: z.enum(ECOM_SYNC_MODES),
  authScopes: z.array(z.string().trim().max(160)).max(100).optional(),
  externalStoreId: z.string().trim().max(160).optional().nullable(),
  accessToken: z.string().trim().max(4000).optional().nullable(),
  refreshToken: z.string().trim().max(4000).optional().nullable(),
  apiKey: z.string().trim().max(4000).optional().nullable(),
  apiSecret: z.string().trim().max(4000).optional().nullable(),
  webhookSecret: z.string().trim().max(4000).optional().nullable(),
  tokenExpiresAt: z.string().trim().max(40).optional().nullable(),
  verification: z.enum(ECOM_VERIFICATIONS).optional(),
});

export const ecomChannelIdSchema = z.object({ id: z.number().int().positive() });

export const ecomChannelStateSchema = z.object({
  id: z.number().int().positive(),
  state: z.enum(["paused", "connected", "revoked"]),
});

export const ecomMappingSaveSchema = z.object({
  id: z.number().int().positive().optional(),
  channelId: z.number().int().positive(),
  productId: z.number().int().positive(),
  variantKey: z.string().trim().max(160).optional().nullable(),
  remoteProductId: z.string().trim().min(1).max(160),
  remoteVariantId: z.string().trim().min(1).max(160),
  remoteInventoryItemId: z.string().trim().max(160).optional().nullable(),
  remoteSku: z.string().trim().max(160).optional().nullable(),
  remoteLocationId: z.string().trim().max(160).optional().nullable(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const ecomMappingBulkSchema = z.object({
  channelId: z.number().int().positive(),
  rows: z
    .array(
      z.object({
        remoteProductId: z.string().trim().min(1).max(160),
        remoteVariantId: z.string().trim().min(1).max(160),
        sku: z.string().trim().min(1).max(160),
        remoteInventoryItemId: z.string().trim().max(160).optional().nullable(),
      }),
    )
    .min(1)
    .max(5000),
});

export const ecomListingSaveSchema = z.object({
  mappingId: z.number().int().positive(),
  title: z.string().trim().min(1).max(300),
  description: z.string().max(20000).optional(),
  category: z.string().trim().max(160).optional(),
  brand: z.string().trim().max(160).optional(),
  attributesJson: z.string().max(20000).optional(),
  priceFils: z.number().int().nonnegative().max(1_000_000_000_000),
  compareAtFils: z.number().int().nonnegative().max(1_000_000_000_000).optional().nullable(),
});

export const ecomListingIdSchema = z.object({ id: z.number().int().positive() });

export const ecomPriceRuleSchema = z.object({
  id: z.number().int().positive().optional(),
  channelId: z.number().int().positive(),
  productId: z.number().int().positive().optional().nullable(),
  ruleType: z.enum(["fixed", "markup"]),
  value: z.number().int().min(0).max(10_000_000),
  currency: currencySchema,
  effectiveFrom: z.string().trim().max(20).optional().nullable(),
  effectiveTo: z.string().trim().max(20).optional().nullable(),
  floorFils: z.number().int().nonnegative().max(1_000_000_000_000).optional().nullable(),
  rounding: z.enum(["none", "nearest", "up", "down"]),
  authority: z.enum(ECOM_AUTHORITIES),
  active: z.boolean().optional(),
});

export const ecomStockPolicySchema = z.object({
  channelId: z.number().int().positive(),
  warehouseId: z.number().int().positive().optional().nullable(),
  safetyBufferMilli: z.number().int().min(0).max(1_000_000_000),
  minExportMilli: z.number().int().min(0).max(1_000_000_000),
  maxExportMilli: z.number().int().min(0).max(1_000_000_000).optional().nullable(),
  syncFrequencyMinutes: z.number().int().min(1).max(1440),
  allowBackorders: z.boolean(),
  oosPolicy: z.enum(["publish_zero", "hide_listing", "keep_last"]),
  skuExclusions: z.array(z.string().trim().max(80)).max(1000).optional(),
});

export const ecomJobIdSchema = z.object({ id: z.number().int().positive() });

export const ecomWebhookSchema = z.object({
  platform: platformSchema,
  channelId: z.number().int().positive(),
  eventId: z.string().trim().min(1).max(200),
  topic: z.string().trim().min(1).max(160),
  rawBody: z.string().min(1).max(2_000_000),
  signature: z.string().max(500).optional().nullable(),
  headers: z.record(z.string(), z.string()).optional(),
});

export const ecomOrderImportSchema = z.object({
  channelId: z.number().int().positive(),
  externalOrderId: z.string().trim().min(1).max(200),
  externalNumber: z.string().trim().min(1).max(200),
  eventId: z.string().trim().max(200).optional().nullable(),
  orderedAt: z.string().trim().min(10).max(40),
  currency: currencySchema,
  customer: z.object({
    name: z.string().trim().max(200),
    email: z.string().trim().max(200).optional().nullable(),
    phone: z.string().trim().max(80).optional().nullable(),
    city: z.string().trim().max(120).optional().nullable(),
    address: z.string().trim().max(500).optional().nullable(),
  }),
  lines: z
    .array(
      z.object({
        remoteLineId: z.string().trim().min(1).max(160),
        remoteVariantId: z.string().trim().max(160).optional().nullable(),
        sku: z.string().trim().max(160).optional().nullable(),
        title: z.string().trim().max(300),
        quantityMilli: z.number().int().positive(),
        unitPriceFils: z.number().int().nonnegative(),
        discountFils: z.number().int().nonnegative().optional(),
        taxFils: z.number().int().nonnegative().optional(),
      }),
    )
    .min(1)
    .max(1000),
  shippingFils: z.number().int().nonnegative().optional(),
  discountFils: z.number().int().nonnegative().optional(),
  taxFils: z.number().int().nonnegative().optional(),
  subtotalFils: z.number().int().nonnegative(),
  totalFils: z.number().int().nonnegative(),
  paymentStatus: z.string().trim().max(60).optional(),
  fulfillmentStatus: z.string().trim().max(60).optional(),
  shippingAddress: z.record(z.string(), z.unknown()).optional(),
  billingAddress: z.record(z.string(), z.unknown()).optional(),
  raw: z.record(z.string(), z.unknown()).optional(),
});

export const ecomExceptionResolveSchema = z.object({
  id: z.number().int().positive(),
  action: z.enum(["reprocess", "skip", "escalate", "resolve"]),
  reason: z.string().trim().max(500).optional(),
});

export const ecomShipmentSyncSchema = z.object({
  externalOrderId: z.number().int().positive().optional(),
});

export const ecomManualShipmentSchema = z.object({
  externalOrderId: z.number().int().positive(),
  carrier: z.string().trim().max(120),
  trackingNumber: z.string().trim().min(1).max(160),
  remoteFulfillmentId: z.string().trim().max(160).optional().nullable(),
});

export const ecomReturnLinkSchema = z.object({
  channelId: z.number().int().positive(),
  externalReturnId: z.string().trim().min(1).max(160),
  externalOrderId: z.number().int().positive().optional().nullable(),
  omsReturnId: z.number().int().positive().optional().nullable(),
  reason: z.string().trim().min(1).max(500),
  quantityMilli: z.number().int().positive(),
  status: z.string().trim().min(1).max(60),
  refundStatus: z.string().trim().min(1).max(60),
  remoteClaimId: z.string().trim().max(160).optional().nullable(),
});

export const ecomPayoutImportSchema = z.object({
  channelId: z.number().int().positive(),
  payoutId: z.string().trim().min(1).max(160),
  periodStart: z.string().trim().min(10).max(20),
  periodEnd: z.string().trim().min(10).max(20),
  currency: currencySchema,
  grossFils: z.number().int().nonnegative(),
  discountFils: z.number().int().nonnegative().optional(),
  refundFils: z.number().int().nonnegative().optional(),
  commissionFils: z.number().int().nonnegative().optional(),
  otherFeesFils: z.number().int().nonnegative().optional(),
  taxFils: z.number().int().nonnegative().optional(),
  remittedFils: z.number().int().nonnegative().optional(),
  remittedAt: z.string().trim().max(40).optional().nullable(),
  reference: z.string().trim().max(160).optional().nullable(),
  fees: z
    .array(
      z.object({
        feeType: z.enum(ECOM_FEE_TYPES),
        amountFils: z.number().int().nonnegative(),
        externalOrderId: z.number().int().positive().optional().nullable(),
        sourceReference: z.string().trim().min(1).max(200),
        occurredAt: z.string().trim().min(10).max(40),
      }),
    )
    .max(5000)
    .optional(),
});

export const ecomPayoutRemitSchema = z.object({
  payoutId: z.number().int().positive(),
  remittedFils: z.number().int().nonnegative(),
  remittedAt: z.string().trim().min(10).max(40),
  reference: z.string().trim().max(160),
});

export const ecomCampaignSaveSchema = z.object({
  channelId: z.number().int().positive(),
  name: z.string().trim().min(1).max(200),
  startsOn: z.string().trim().min(10).max(20),
  endsOn: z.string().trim().min(10).max(20),
  spendFils: z.number().int().nonnegative(),
  attributedOrders: z.number().int().nonnegative(),
  attributedRevenueFils: z.number().int().nonnegative(),
  source: z.enum(["api", "csv", "manual"]).optional(),
});

export const ecomSettingsSaveSchema = z.object({
  values: z.record(z.string().max(120), z.string().max(4000)),
});

export const ecomReportSchema = z.object({
  report: z.string().trim().min(1).max(80),
  from: z.string().trim().max(20).optional(),
  to: z.string().trim().max(20).optional(),
  channelId: z.number().int().positive().optional(),
  limit: z.number().int().min(1).max(5000).optional(),
});

export const ecomBulkPriceSchema = z.object({
  channelId: z.number().int().positive(),
  percent: z.number().min(-90).max(500),
  roundTo: z.number().int().min(1).max(1_000_000).optional(),
});

export const ecomProviderTestSchema = z.object({ id: z.number().int().positive() });
