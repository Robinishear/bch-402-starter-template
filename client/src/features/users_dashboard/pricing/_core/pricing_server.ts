import { httpClient } from "@/_core/axios/httpClient";
import { PricingData } from "./pricing_interface";

export const getPricing = async (): Promise<PricingData> => {
  const response = await httpClient.get<PricingData>("/pricing");
  
  return response.data;
};