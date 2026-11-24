import { z } from "zod";

/**
 * Order & Fulfillment Management (OMS) — shared contracts.
 *
 * OMS owns the customer-order lifecycle. The canonical order identity is the
 * IMS sales order document (`ims_documents.kind = 'salesOrder'`); OMS keeps its
 * own lifecycle state in the same row through status, holds and validation
 * evidence, plus its own hold ledger. No second order copy is created.
 */

export const OMS_HOLD_TYPES = [
  "validation",
  "fulfillment",
  "allocation",
  "payment",
  "credit",
  "fraud",
  "customer",
  "manual",
] as const;
export type OmsHoldType = (typeof OMS_HOLD_TYPES)[number];

export const OMS_STATUSES = [
  "draft",
  "awaiting_validation",
  "validated",
  "confirmed",
  "allocated",
  "partially_fulfilled",
  "fulfilled",
  "on_hold",
  "cancelled",
  "rejected",
] as const;
export type OmsOrderStatus = (typeof OMS_STATUSES)[number];

export interface OmsValidationCheck {
  readonly rule: string;
  readonly severity: "blocking" | "warning";
  readonly field: string;
  readonly reason: string;
  readonly correction: string;
  readonly blocking: boolean;
  readonly overrideReason: string | null;
  readonly overrideBy: string | null;
}

export interface OmsValidationResult {
  readonly orderId: number;
  readonly blocked: boolean;
  readonly checks: readonly OmsValidationCheck[];
}

export interface OmsHold {
  readonly id: number | null;
  readonly orderId: number;
  readonly holdType: OmsHoldType;
  readonly reason: string;
  readonly status: "open" | "released";
  readonly createdAt: string;
  readonly releasedAt: string | null;
}

export interface OmsOrderLineInput {
  readonly productId: number;
  readonly quantityMilli: number;
  readonly unitPriceFils: number;
  readonly discountFils?: number;
  readonly vatTreatment?: "standard" | "zero" | "exempt" | "outsideScope";
}

export interface OmsCreateOrderRequest {
  readonly partyId: number;
  readonly issueDate: string;
  readonly requiredDate?: string | null;
  readonly sourceChannel?: string | null;
  readonly lines: readonly OmsOrderLineInput[];
}

export interface OmsOrderSnapshot {
  readonly orderId: number;
  readonly number: string;
  readonly status: OmsOrderStatus;
  readonly imsStatus: string;
  readonly partyId: number | null;
  readonly customerName: string | null;
  readonly issueDate: string;
  readonly requiredDate: string | null;
  readonly sourceChannel: string | null;
  readonly totalFils: number;
  readonly lines: readonly {
    readonly lineId: number;
    readonly productId: number;
    readonly sku: string;
    readonly name: string;
    readonly quantityMilli: number;
    readonly unitPriceFils: number;
    readonly discountFils: number;
    readonly vatTreatment: string;
    readonly lineTotalFils: number;
  }[];
  readonly holds: readonly OmsHold[];
}

export const omsHoldTypeSchema = z.enum(OMS_HOLD_TYPES);
export const omsStatusSchema = z.enum(OMS_STATUSES);
export const omsCreateOrderSchema = z.object({
  partyId: z.number().int().positive(),
  issueDate: z.string().trim().min(1).max(10),
  requiredDate: z.string().trim().min(1).max(10).nullable().optional(),
  sourceChannel: z.string().trim().min(1).max(60).nullable().optional(),
  lines: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantityMilli: z.number().int().positive().max(1_000_000_000),
        unitPriceFils: z.number().int().min(0).max(1_000_000_000),
        discountFils: z.number().int().min(0).max(1_000_000_000).optional(),
        vatTreatment: z.enum(["standard", "zero", "exempt", "outsideScope"]).optional(),
      }),
    )
    .min(1)
    .max(500),
});
export const omsValidateOrderSchema = z.object({ orderId: z.number().int().positive() });
export const omsConfirmOrderSchema = z.object({
  orderId: z.number().int().positive(),
  reason: z.string().trim().min(1).max(500).nullable().optional(),
});
export const omsHoldOrderSchema = z.object({
  orderId: z.number().int().positive(),
  holdType: omsHoldTypeSchema,
  reason: z.string().trim().min(1).max(500),
});
export const omsReleaseHoldSchema = z.object({
  orderId: z.number().int().positive(),
  holdId: z.number().int().positive().optional(),
  reason: z.string().trim().min(1).max(500),
});
export const omsCancelOrderSchema = z.object({
  orderId: z.number().int().positive(),
  reason: z.string().trim().min(1).max(500),
});

/* -------------------------------------------------------------------------- */
/* Order cancellation and revision                                            */
/* -------------------------------------------------------------------------- */

export interface OmsCancelLine {
  readonly orderLineId: number;
  readonly quantityMilli: number;
}

export interface OmsPartialCancelRequest {
  readonly lines: readonly OmsCancelLine[];
  readonly reason: string;
}

export interface OmsOrderEditRequest {
  readonly linesToReduce?: readonly { readonly orderLineId: number; readonly reduceQuantityMilli: number }[] | null | undefined;
  readonly requiredDate?: string | null | undefined;
  readonly shippingAddress?: string | null | undefined;
  readonly notes?: string | null | undefined;
  readonly reason: string;
}

export const omsPartialCancelSchema = z.object({
  orderId: z.number().int().positive(),
  lines: z
    .array(
      z.object({
        orderLineId: z.number().int().positive(),
        quantityMilli: z.number().int().positive().max(1_000_000_000),
      }),
    )
    .min(1),
  reason: z.string().trim().min(1).max(500),
});

export const omsOrderEditSchema = z.object({
  orderId: z.number().int().positive(),
  linesToReduce: z
    .array(
      z.object({
        orderLineId: z.number().int().positive(),
        reduceQuantityMilli: z.number().int().positive().max(1_000_000_000),
      }),
    )
    .optional(),
  requiredDate: z.string().trim().min(1).max(10).nullable().optional(),
  shippingAddress: z.string().trim().min(1).max(500).optional(),
  notes: z.string().trim().min(1).max(1000).optional(),
  reason: z.string().trim().min(1).max(500),
});

/* -------------------------------------------------------------------------- */
/* Allocation types                                                           */
/* -------------------------------------------------------------------------- */

export interface OmsAllocationLine {
  readonly id: number | null;
  readonly allocationId: number;
  readonly orderLineId: number;
  readonly productId: number;
  readonly sku: string;
  readonly name: string;
  readonly quantityMilli: number;
  readonly reservedQuantityMilli: number;
  readonly status: "pending" | "allocated" | "partial" | "released" | "cancelled";
  readonly warehouseId: number;
  readonly warehouseCode: string;
}

export interface OmsAllocation {
  readonly id: number;
  readonly orderId: number;
  readonly orderNumber: string;
  readonly warehouseId: number;
  readonly warehouseCode: string;
  readonly status: "draft" | "allocated" | "partially_allocated" | "released" | "cancelled";
  readonly requestedQuantityMilli: number;
  readonly allocatedQuantityMilli: number;
  readonly createdBy: string;
  readonly createdAt: string;
  readonly releasedAt: string | null;
  readonly lines: readonly OmsAllocationLine[];
}

export interface OmsAvailability {
  readonly productId: number;
  readonly sku: string;
  readonly name: string;
  readonly warehouseId: number;
  readonly warehouseCode: string;
  readonly onHandMilli: number;
  readonly reservedMilli: number;
  readonly availableMilli: number;
}

export interface OmsAllocateRequest {
  readonly orderId: number;
  readonly warehouseId?: number | null;
  readonly lineOverrides?: readonly { readonly orderLineId: number; readonly warehouseId: number; readonly quantityMilli: number }[];
}

export interface OmsAllocationsListRequest {
  readonly orderId?: number;
  readonly status?: string;
  readonly warehouseId?: number;
  readonly limit?: number;
}

export interface OmsAllocateResult {
  readonly allocations: readonly OmsAllocation[];
  readonly backorderedLines: readonly { readonly orderLineId: number; readonly productId: number; readonly shortMilli: number }[];
}

export const omsAllocationsListSchema = z.object({
  orderId: z.number().int().positive().optional(),
  status: z.string().max(40).optional(),
  warehouseId: z.number().int().positive().optional(),
  limit: z.number().int().min(1).max(500).optional(),
});

export const omsAllocationGetSchema = z.object({ id: z.number().int().positive() });

export const omsAllocateSchema = z.object({
  orderId: z.number().int().positive(),
  warehouseId: z.number().int().positive().optional().nullable(),
  lineOverrides: z
    .array(
      z.object({
        orderLineId: z.number().int().positive(),
        warehouseId: z.number().int().positive(),
        quantityMilli: z.number().int().positive().max(1_000_000_000),
      }),
    )
    .optional(),
});

export const omsAllocationReleaseSchema = z.object({
  id: z.number().int().positive(),
});

export const omsAvailabilitySchema = z.object({
  productId: z.number().int().positive(),
  warehouseId: z.number().int().positive(),
});

/* -------------------------------------------------------------------------- */
/* Fulfillment types                                                          */
/* -------------------------------------------------------------------------- */

export interface OmsFulfillmentRequest {
  readonly id: number;
  readonly orderId: number;
  readonly orderNumber: string;
  readonly allocationId: number | null;
  readonly warehouseId: number;
  readonly warehouseCode: string;
  readonly wmsDispatchId: number | null;
  readonly wmsDispatchNumber: string | null;
  readonly status: "planned" | "released" | "picked" | "packed" | "staged" | "loaded" | "handedOver" | "cancelled";
  readonly requiredDispatchDate: string | null;
  readonly carrier: string | null;
  readonly trackingNumber: string | null;
  readonly createdBy: string;
  readonly createdAt: string;
  readonly releasedAt: string | null;
  readonly releasedBy: string | null;
  readonly handedOverAt: string | null;
}

export interface OmsCreateFulfillmentRequest {
  readonly orderId: number;
  readonly allocationId?: number | null;
  readonly warehouseId: number;
  readonly requiredDispatchDate?: string | null;
}

export const omsFulfillmentRequestsListSchema = z.object({
  orderId: z.number().int().positive().optional(),
  status: z.string().max(40).optional(),
  warehouseId: z.number().int().positive().optional(),
  limit: z.number().int().min(1).max(500).optional(),
});

export const omsFulfillmentRequestGetSchema = z.object({ id: z.number().int().positive() });

export const omsCreateFulfillmentRequestSchema = z.object({
  orderId: z.number().int().positive(),
  allocationId: z.number().int().positive().optional().nullable(),
  warehouseId: z.number().int().positive(),
  requiredDispatchDate: z.string().trim().min(1).max(10).nullable().optional(),
});

export const omsFulfillmentReleaseSchema = z.object({
  id: z.number().int().positive(),
  packingBinId: z.number().int().positive(),
});

/* -------------------------------------------------------------------------- */
/* OMS shipments                                                              */
/* -------------------------------------------------------------------------- */

export interface OmsShipment {
  readonly id: number;
  readonly orderId: number;
  readonly orderNumber: string;
  readonly fulfillmentRequestId: number | null;
  readonly carrier: string | null;
  readonly serviceLevel: string | null;
  readonly trackingNumber: string | null;
  readonly status: "planned" | "packed" | "handedOver" | "in_transit" | "delivered" | "delayed" | "lost" | "failed" | "returned_to_sender" | "cancelled";
  readonly dispatchDate: string | null;
  readonly expectedDeliveryDate: string | null;
  readonly actualDeliveryDate: string | null;
  readonly podEvidence: string | null;
  readonly podReceivedAt: string | null;
  readonly createdBy: string;
  readonly createdAt: string;
  readonly lines: readonly OmsShipmentLine[];
}

export interface OmsShipmentLine {
  readonly id: number | null;
  readonly shipmentId: number;
  readonly orderLineId: number;
  readonly productId: number;
  readonly sku: string;
  readonly name: string;
  readonly quantityMilli: number;
}

export interface OmsCreateShipment {
  readonly orderId: number;
  readonly fulfillmentRequestId?: number | null;
  readonly carrier?: string | null;
  readonly serviceLevel?: string | null;
  readonly trackingNumber?: string | null;
  readonly expectedDeliveryDate?: string | null;
  readonly lines: readonly { readonly orderLineId: number; readonly productId: number; readonly quantityMilli: number }[];
}

export interface OmsShipmentHandover {
  readonly shipmentId: number;
  readonly carrier: string;
  readonly trackingNumber?: string | null;
  readonly dispatchDate?: string | null;
}

export interface OmsDeliveryConfirmation {
  readonly shipmentId: number;
  readonly actualDeliveryDate?: string | null;
  readonly deliveredQuantityMilli?: number | null;
  readonly podEvidence?: string | null;
  readonly receivedBy?: string | null;
}

export const omsShipmentsListSchema = z.object({
  orderId: z.number().int().positive().optional(),
  status: z.string().max(40).optional(),
  limit: z.number().int().min(1).max(500).optional(),
});

export const omsShipmentGetSchema = z.object({ id: z.number().int().positive() });

export const omsCreateShipmentSchema = z.object({
  orderId: z.number().int().positive(),
  fulfillmentRequestId: z.number().int().positive().optional().nullable(),
  carrier: z.string().trim().min(1).max(160).optional(),
  serviceLevel: z.string().trim().min(1).max(160).optional(),
  trackingNumber: z.string().trim().min(1).max(160).optional(),
  expectedDeliveryDate: z.string().trim().min(1).max(10).nullable().optional(),
  lines: z
    .array(
      z.object({
        orderLineId: z.number().int().positive(),
        productId: z.number().int().positive(),
        quantityMilli: z.number().int().positive().max(1_000_000_000),
      }),
    )
    .min(1)
    .max(500),
});

export const omsShipmentHandoverSchema = z.object({
  shipmentId: z.number().int().positive(),
  carrier: z.string().trim().min(1).max(160),
  trackingNumber: z.string().trim().min(1).max(160).optional(),
  dispatchDate: z.string().trim().min(1).max(10).optional(),
});

export const omsDeliveryConfirmationSchema = z.object({
  shipmentId: z.number().int().positive(),
  actualDeliveryDate: z.string().trim().min(1).max(10).optional(),
  deliveredQuantityMilli: z.number().int().nonnegative().max(1_000_000_000).optional(),
  podEvidence: z.string().trim().min(1).max(1000).optional(),
  receivedBy: z.string().trim().min(1).max(160).optional(),
});

/* -------------------------------------------------------------------------- */
/* OMS backorders                                                             */
/* -------------------------------------------------------------------------- */

export interface OmsBackorder {
  readonly id: number;
  readonly orderId: number;
  readonly orderNumber: string;
  readonly allocationLineId: number | null;
  readonly productId: number;
  readonly sku: string;
  readonly name: string;
  readonly quantityMilli: number;
  readonly expectedSupplyDate: string | null;
  readonly priority: number;
  readonly status: "open" | "fulfilled" | "cancelled";
  readonly createdBy: string;
  readonly createdAt: string;
  readonly fulfilledAt: string | null;
  readonly fulfilledBy: string | null;
  readonly cancelledAt: string | null;
  readonly cancelledBy: string | null;
}

export interface OmsCreateBackorder {
  readonly orderId: number;
  readonly allocationLineId?: number | null;
  readonly productId: number;
  readonly quantityMilli: number;
  readonly expectedSupplyDate?: string | null;
  readonly priority?: number;
}

export const omsBackordersListSchema = z.object({
  orderId: z.number().int().positive().optional(),
  status: z.string().max(40).optional(),
  productId: z.number().int().positive().optional(),
  limit: z.number().int().min(1).max(500).optional(),
});

export const omsBackorderGetSchema = z.object({ id: z.number().int().positive() });

export const omsCreateBackorderSchema = z.object({
  orderId: z.number().int().positive(),
  allocationLineId: z.number().int().positive().optional().nullable(),
  productId: z.number().int().positive(),
  quantityMilli: z.number().int().positive().max(1_000_000_000),
  expectedSupplyDate: z.string().trim().min(1).max(10).nullable().optional(),
  priority: z.number().int().min(0).max(100).optional(),
});

export const omsFulfillBackorderSchema = z.object({
  id: z.number().int().positive(),
  quantityMilli: z.number().int().positive().max(1_000_000_000),
});

export const omsCancelBackorderSchema = z.object({ id: z.number().int().positive() });

/* -------------------------------------------------------------------------- */
/* OMS returns / RMA                                                          */
/* -------------------------------------------------------------------------- */

export interface OmsReturn {
  readonly id: number;
  readonly orderId: number;
  readonly orderNumber: string;
  readonly shipmentId: number | null;
  readonly shipmentNumber: string | null;
  readonly rmaNumber: string;
  readonly returnType: "refund" | "exchange" | "replacement" | "damaged" | "wrong_item" | "customer_rejection" | "warranty";
  readonly reason: string;
  readonly conditionNote: string | null;
  readonly status: "requested" | "reviewed" | "authorized" | "in_transit" | "received" | "inspected" | "dispositioned" | "closed" | "rejected" | "cancelled";
  readonly requestedQuantityMilli: number;
  readonly authorizedQuantityMilli: number;
  readonly receivedQuantityMilli: number;
  readonly sellableQuantityMilli: number;
  readonly createdBy: string;
  readonly createdAt: string;
  readonly authorizedAt: string | null;
  readonly authorizedBy: string | null;
  readonly closedAt: string | null;
  readonly closedBy: string | null;
  readonly lines: readonly OmsReturnLine[];
}

export interface OmsReturnLine {
  readonly id: number | null;
  readonly returnId: number;
  readonly orderLineId: number;
  readonly productId: number;
  readonly sku: string;
  readonly name: string;
  readonly quantityMilli: number;
  readonly disposition: "resellable" | "quarantine" | "damaged" | "repair" | "scrap" | "return_to_supplier";
}

export interface OmsCreateReturn {
  readonly orderId: number;
  readonly shipmentId?: number | null;
  readonly returnType: "refund" | "exchange" | "replacement" | "damaged" | "wrong_item" | "customer_rejection" | "warranty";
  readonly reason: string;
  readonly conditionNote?: string | null;
  readonly requestedQuantityMilli: number;
  readonly lines: readonly { readonly orderLineId: number; readonly productId: number; readonly quantityMilli: number }[];
}

export interface OmsInspectReturnLine {
  readonly returnLineId: number;
  readonly disposition: "resellable" | "quarantine" | "damaged" | "repair" | "scrap" | "return_to_supplier";
  readonly quantityMilli: number;
}

export interface OmsInspectReturn {
  readonly id: number;
  readonly lines: readonly OmsInspectReturnLine[];
}

export const omsReturnsListSchema = z.object({
  orderId: z.number().int().positive().optional(),
  status: z.string().max(40).optional(),
  limit: z.number().int().min(1).max(500).optional(),
});

export const omsReturnGetSchema = z.object({ id: z.number().int().positive() });

export const omsCreateReturnSchema = z.object({
  orderId: z.number().int().positive(),
  shipmentId: z.number().int().positive().optional().nullable(),
  returnType: z.enum(["refund", "exchange", "replacement", "damaged", "wrong_item", "customer_rejection", "warranty"]),
  reason: z.string().trim().min(1).max(500),
  conditionNote: z.string().trim().min(1).max(500).optional(),
  requestedQuantityMilli: z.number().int().positive().max(1_000_000_000),
  lines: z
    .array(
      z.object({
        orderLineId: z.number().int().positive(),
        productId: z.number().int().positive(),
        quantityMilli: z.number().int().positive().max(1_000_000_000),
      }),
    )
    .min(1)
    .max(500),
});

export const omsAuthorizeReturnSchema = z.object({
  id: z.number().int().positive(),
  authorizedQuantityMilli: z.number().int().positive().max(1_000_000_000),
});

export const omsRecordReturnReceivedSchema = z.object({
  id: z.number().int().positive(),
  receivedQuantityMilli: z.number().int().positive().max(1_000_000_000),
});

export const omsInspectReturnSchema = z.object({
  id: z.number().int().positive(),
  lines: z
    .array(
      z.object({
        returnLineId: z.number().int().positive(),
        disposition: z.enum(["resellable", "quarantine", "damaged", "repair", "scrap", "return_to_supplier"]),
        quantityMilli: z.number().int().positive().max(1_000_000_000),
      }),
    )
    .min(1)
    .max(500),
});

/* -------------------------------------------------------------------------- */
/* OMS refunds                                                                */
/* -------------------------------------------------------------------------- */
export interface OmsRefund {
  readonly id: number;
  readonly orderId: number;
  readonly orderNumber: string;
  readonly returnId: number | null;
  readonly rmaNumber: string | null;
  readonly originalPaymentReference: string | null;
  readonly refundableAmountFils: number;
  readonly refundAmountFils: number;
  readonly taxAdjustmentFils: number;
  readonly status: "requested" | "approved" | "submitted" | "confirmed" | "failed" | "rejected" | "cancelled";
  readonly refundMethod: string | null;
  readonly externalTransactionReference: string | null;
  readonly approvalReason: string | null;
  readonly createdBy: string;
  readonly createdAt: string;
  readonly approvedAt: string | null;
  readonly approvedBy: string | null;
  readonly submittedAt: string | null;
  readonly confirmedAt: string | null;
}

export interface OmsCreateRefund {
  readonly orderId: number;
  readonly returnId?: number | null;
  readonly originalPaymentReference?: string | null;
  readonly refundableAmountFils: number;
  readonly refundAmountFils: number;
  readonly taxAdjustmentFils?: number;
  readonly refundMethod?: string | null;
  readonly approvalReason?: string | null;
}

export interface OmsApproveRefund {
  readonly id: number;
  readonly approvalReason: string;
}

export interface OmsSubmitRefund {
  readonly id: number;
  readonly refundMethod: string;
  readonly externalTransactionReference?: string | null;
}

export interface OmsConfirmRefund {
  readonly id: number;
  readonly externalTransactionReference: string;
}

export interface OmsRejectRefund {
  readonly id: number;
  readonly reason: string;
}

/* -------------------------------------------------------------------------- */
/* OMS COD                                                                    */
/* -------------------------------------------------------------------------- */
export interface OmsCodRecord {
  readonly id: number;
  readonly orderId: number;
  readonly orderNumber: string;
  readonly shipmentId: number | null;
  readonly carrier: string | null;
  readonly amountDueFils: number;
  readonly amountCollectedFils: number;
  readonly amountRemittedFils: number;
  readonly collectionDate: string | null;
  readonly remittanceDate: string | null;
  readonly collectorReference: string | null;
  readonly reconciliationStatus: "pending" | "collected" | "remitted" | "reconciled" | "discrepancy";
  readonly shortExcessFils: number;
  readonly createdBy: string;
  readonly createdAt: string;
}

export interface OmsCreateCodRecord {
  readonly orderId: number;
  readonly shipmentId?: number | null;
  readonly carrier?: string | null;
  readonly amountDueFils: number;
  readonly collectorReference?: string | null;
}

export interface OmsRecordCodCollection {
  readonly id: number;
  readonly amountCollectedFils: number;
  readonly collectionDate?: string | null;
}

export interface OmsRecordCodRemittance {
  readonly id: number;
  readonly amountRemittedFils: number;
  readonly remittanceDate?: string | null;
}

export interface OmsReconcileCod {
  readonly id: number;
}

/* -------------------------------------------------------------------------- */
/* OMS settings                                                               */
/* -------------------------------------------------------------------------- */
export interface OmsSetting {
  readonly key: string;
  readonly value: string;
  readonly updatedBy: string | null;
  readonly updatedAt: string | null;
}

export interface OmsSetSetting {
  readonly key: string;
  readonly value: string;
}

export const omsRefundsListSchema = z.object({
  orderId: z.number().int().positive().optional(),
  status: z.string().max(40).optional(),
  limit: z.number().int().min(1).max(500).optional(),
});

export const omsRefundGetSchema = z.object({ id: z.number().int().positive() });

export const omsCreateRefundSchema = z.object({
  orderId: z.number().int().positive(),
  returnId: z.number().int().positive().optional().nullable(),
  originalPaymentReference: z.string().trim().min(1).max(100).optional(),
  refundableAmountFils: z.number().int().nonnegative().max(1_000_000_000),
  refundAmountFils: z.number().int().nonnegative().max(1_000_000_000),
  taxAdjustmentFils: z.number().int().min(0).max(1_000_000_000).optional(),
  refundMethod: z.string().trim().min(1).max(80).optional(),
  approvalReason: z.string().trim().min(1).max(500).optional(),
});

export const omsApproveRefundSchema = z.object({
  id: z.number().int().positive(),
  approvalReason: z.string().trim().min(1).max(500),
});

export const omsSubmitRefundSchema = z.object({
  id: z.number().int().positive(),
  refundMethod: z.string().trim().min(1).max(80),
  externalTransactionReference: z.string().trim().min(1).max(100).optional(),
});

export const omsConfirmRefundSchema = z.object({
  id: z.number().int().positive(),
  externalTransactionReference: z.string().trim().min(1).max(100),
});

export const omsRejectRefundSchema = z.object({
  id: z.number().int().positive(),
  reason: z.string().trim().min(1).max(500),
});

export const omsCancelRefundSchema = z.object({ id: z.number().int().positive() });

export const omsCodRecordsListSchema = z.object({
  orderId: z.number().int().positive().optional(),
  status: z.string().max(40).optional(),
  limit: z.number().int().min(1).max(500).optional(),
});

export const omsCodRecordGetSchema = z.object({ id: z.number().int().positive() });

export const omsCreateCodRecordSchema = z.object({
  orderId: z.number().int().positive(),
  shipmentId: z.number().int().positive().optional().nullable(),
  carrier: z.string().trim().min(1).max(160).optional(),
  amountDueFils: z.number().int().nonnegative().max(1_000_000_000),
  collectorReference: z.string().trim().min(1).max(160).optional(),
});

export const omsRecordCodCollectionSchema = z.object({
  id: z.number().int().positive(),
  amountCollectedFils: z.number().int().positive().max(1_000_000_000),
  collectionDate: z.string().trim().min(1).max(10).optional(),
});

export const omsRecordCodRemittanceSchema = z.object({
  id: z.number().int().positive(),
  amountRemittedFils: z.number().int().positive().max(1_000_000_000),
  remittanceDate: z.string().trim().min(1).max(10).optional(),
});

export const omsReconcileCodSchema = z.object({ id: z.number().int().positive() });

export const omsSettingsListSchema = z.object({});
export const omsSetSettingSchema = z.object({
  key: z.string().trim().min(1).max(160),
  value: z.string().trim().min(1).max(1000),
});
