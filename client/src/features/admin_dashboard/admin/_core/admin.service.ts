import { httpClient } from "@/_core/axios/httpClient";
import { IAnalytics, IInvoice, IStats, IUser, IUserSummary } from "./admin.interface";


export const AdminService = {
  async updateUserStatus(userId: string, status: "ACTIVE" | "BLOCKED"): Promise<IUser> {
    const response = await httpClient.patch<IUser>(`/admin/users/${userId}/status`, { status });
    return response.data;
  },

  async deleteUser(userId: string): Promise<IUser> {
    const response = await httpClient.delete<IUser>(`/admin/users/${userId}`);
    return response.data;
  },

  async getAllUsers(params?: Record<string, unknown>) {
    const response = await httpClient.get<IUser[]>("/admin/users", { params });
    return response;
  },

  async getUserSummary(): Promise<IUserSummary> {
    const response = await httpClient.get<IUserSummary>("/admin/users/summary");
    return response.data;
  },

  async getAllInvoices(params?: Record<string, unknown>) {
    const response = await httpClient.get<IInvoice[]>("/admin/invoices", { params });
    return response;
  },

  async getStats(): Promise<IStats> {
    const response = await httpClient.get<IStats>("/admin/stats");
    return response.data;
  },

    async getAnalytics(days: number = 30): Promise<IAnalytics> {
    const response = await httpClient.get<IAnalytics>("/admin/analytics", { params: { days } });
    return response.data;
  },
};