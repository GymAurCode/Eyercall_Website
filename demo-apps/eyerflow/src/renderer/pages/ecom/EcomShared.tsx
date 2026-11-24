/**
 * Small shared pieces for the E-commerce Operations screens.
 *
 * The store list is used by nearly every ECOM page (filters, dialogs, policy
 * forms), so it has one query key and one shape. Verification and connection
 * badges are drawn from the same helpers everywhere, which is what keeps a
 * fixture-seeded store from ever looking like a live connection on one screen
 * and not another.
 */

import { useQuery } from "@tanstack/react-query";
import { call } from "../../lib/api";
import { useApp } from "../../lib/app-context";
import { Badge, type BadgeTone } from "../../components/ui/Badge";
import type { EcomConnectionState, EcomPlatform, EcomVerification } from "../../../shared/ecom";
import type { SelectOption } from "../../components/ui/Input";

export function useEcomChannels() {
  const { can } = useApp();
  return useQuery({
    queryKey: ["ecom", "channels"],
    queryFn: () => call("ecom.channels.list", {}),
    enabled: can("ecommerce", "view"),
  });
}

/** Store picker options, with an "all stores" row where the filter allows one. */
export function channelOptions(
  channels: readonly { readonly id: number; readonly name: string; readonly platform: EcomPlatform }[],
  allLabel = "All stores",
): readonly SelectOption[] {
  return [
    ...(allLabel === "" ? [] : [{ value: "", label: allLabel }]),
    ...channels.map((channel) => ({
      value: String(channel.id),
      label: `${channel.name} (${channel.platform})`,
    })),
  ];
}

export function verificationTone(value: EcomVerification): BadgeTone {
  switch (value) {
    case "live_verified":
      return "success";
    case "sandbox_verified":
      return "info";
    case "fixture_verified":
      return "warning";
    case "implemented_unverified":
      return "brand";
    case "awaiting_credentials":
      return "neutral";
    case "provider_blocked":
    case "unsupported":
      return "danger";
    default:
      return "neutral";
  }
}

export function VerificationBadge({ value }: { readonly value: EcomVerification }): React.JSX.Element {
  return (
    <Badge tone={verificationTone(value)} dot>
      {value.replace(/_/g, " ")}
    </Badge>
  );
}

export function connectionTone(state: EcomConnectionState): BadgeTone {
  switch (state) {
    case "connected":
      return "success";
    case "degraded":
      return "warning";
    case "paused":
      return "info";
    case "revoked":
      return "danger";
    case "authorizing":
      return "brand";
    default:
      return "neutral";
  }
}

export function ConnectionBadge({ value }: { readonly value: EcomConnectionState }): React.JSX.Element {
  return (
    <Badge tone={connectionTone(value)} dot>
      {value}
    </Badge>
  );
}

/** A provider figure we have no evidence for is shown as such, never as zero. */
export function orUnknown(value: string | null | undefined): string {
  return value === null || value === undefined || value === "" ? "—" : value;
}

/** Drive a browser download from a string the main process produced. */
export function downloadText(filename: string, contents: string, mime = "text/csv"): void {
  const blob = new Blob([contents], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
