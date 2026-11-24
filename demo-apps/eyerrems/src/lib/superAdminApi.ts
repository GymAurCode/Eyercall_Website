import { api } from "./api";

export interface SACompany {
  id: number;
  name: string;
  code: string;
  contact_email: string;
  contact_phone?: string;
  address?: string;
  status: string;
  mode?: string;
  created_at: string;
  updated_at?: string;
  user_count?: number;
  device_count?: number;
  license_count?: number;
}

export interface SAUser {
  id: number;
  email: string;
  full_name: string;
  status: string;
  is_active: boolean;
  is_approved: boolean;
  role?: string;
  role_name?: string;
  role_id?: number;
  created_at: string;
  last_login?: string;
  company_id?: number;
  platform_access?: string[];
}

export interface SADevice {
  id: number;
  device_id: string;
  device_name?: string;
  platform?: string;
  os_version?: string;
  status: string;
  company_id: number;
  company_name?: string;
  user_id?: number;
  user_email?: string;
  created_at: string;
  last_active?: string;
}

export interface SALicense {
  id: number;
  key: string;
  type: string;
  status: string;
  max_devices: number;
  used_devices: number;
  company_id: number;
  company_name?: string;
  created_at: string;
  expires_at?: string;
  activated_at?: string;
}

export interface SAStats {
  total_companies: number;
  active_companies: number;
  total_users: number;
  active_users: number;
  total_devices: number;
  active_devices: number;
  total_licenses: number;
  active_licenses: number;
  suspended_companies: number;
  pending_users: number;
}

export const superAdminApi = {
  getStats: () => api.get<SAStats>("/superadmin/stats").then((r) => r.data),

  listCompanies: () => api.get<SACompany[]>("/superadmin/companies").then((r) => r.data),
  getCompany: (id: number) => api.get<SACompany>(`/superadmin/companies/${id}`).then((r) => r.data),
  createCompany: (data: Partial<SACompany>) => api.post<SACompany>("/superadmin/companies", data).then((r) => r.data),
  updateCompany: (id: number, data: Partial<SACompany>) => api.patch<SACompany>(`/superadmin/companies/${id}`, data).then((r) => r.data),
  deleteCompany: (id: number) => api.delete(`/superadmin/companies/${id}`),
  suspendCompany: (id: number) => api.patch(`/superadmin/companies/${id}/suspend`),
  activateCompany: (id: number) => api.patch(`/superadmin/companies/${id}/activate`),

  listUsers: (companyId: number) => api.get<SAUser[]>(`/superadmin/companies/${companyId}/users`).then((r) => r.data),
  createUser: (companyId: number, data: Partial<SAUser> & { password?: string }) =>
    api.post<SAUser>(`/superadmin/companies/${companyId}/users`, data).then((r) => r.data),
  updateUser: (companyId: number, uid: number, data: Partial<SAUser>) =>
    api.patch<SAUser>(`/superadmin/companies/${companyId}/users/${uid}`, data).then((r) => r.data),

  listAllDevices: () => api.get<SADevice[]>("/devices/admin/all-devices").then((r) => r.data),
  revokeDevice: (deviceId: number) => api.patch(`/devices/admin/devices/${deviceId}/revoke`),

  listLicenses: (companyId: number) => api.get<SALicense[]>(`/devices/company/${companyId}/licenses`).then((r) => r.data),
  createLicense: (companyId: number, data: Partial<SALicense>) =>
    api.post<SALicense>(`/devices/company/${companyId}/licenses`, data).then((r) => r.data),
  updateLicense: (companyId: number, lid: number, data: Partial<SALicense>) =>
    api.patch<SALicense>(`/devices/company/${companyId}/licenses/${lid}`, data).then((r) => r.data),
  revokeLicense: (companyId: number, lid: number) =>
    api.patch(`/devices/company/${companyId}/licenses/${lid}/revoke`),
};
