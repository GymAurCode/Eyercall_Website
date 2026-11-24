import { api } from "../../lib/api";

export interface PairingToken {
  token: string;
  pairing_code: string;
  expires_at: string;
  qr_url: string;
}

export interface PairingStatus {
  paired: boolean;
  device_name: string | null;
  device_platform: string | null;
  paired_at: string | null;
}

export interface ConnectedDevice {
  id: number;
  device_name: string;
  platform: string;
  os_version: string | null;
  app_version: string | null;
  last_synced_at: string | null;
  is_active: boolean;
  paired_at: string;
  last_seen_at: string | null;
}

export async function createPairingToken(): Promise<PairingToken> {
  const { data } = await api.post("/devices/pairing/create");
  return data;
}

export async function getPairingStatus(token: string): Promise<PairingStatus> {
  const { data } = await api.get("/devices/pairing/status", { params: { token } });
  return data;
}

export async function unpairDevice(pairingId: string): Promise<{ message: string }> {
  const { data } = await api.post("/devices/pairing/unpair", { pairing_id: pairingId });
  return data;
}

export async function listMyDevices(): Promise<ConnectedDevice[]> {
  const { data } = await api.get("/devices/my-devices");
  return data.devices ?? data;
}

export async function revokeDevice(deviceId: number): Promise<{ message: string }> {
  const { data } = await api.delete(`/devices/${deviceId}`);
  return data;
}
