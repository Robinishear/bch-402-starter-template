import { httpClient } from "@/_core/axios/httpClient";
import { UsageHistory, UsageHistoryItem, UsageSummary } from "./usage_interface.ts";


//* usage summary */
export const getUsageSummary = async () => {
  const response = await httpClient.get<UsageSummary>("/usage/summary");
  
//   console.log("Usage summary response:", response.data);
  return response.data;
};


//* usage history
export const getUsageHistory = async (page = 1, limit = 10): Promise<UsageHistory> => {
  const response = await httpClient.get<UsageHistoryItem[]>(`/usage?page=${page}&limit=${limit}`);
  return { items: response.data, meta: response.meta };
};

