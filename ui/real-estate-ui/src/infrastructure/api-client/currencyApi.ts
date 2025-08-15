// src/infrastructure/api-client/currencyApi.ts
import axiosInstance from "../http/axiosInstance";
export async function getLiveRate(code: string) {
  const res = await axiosInstance.get(`/currencies/live/${code}`);
  return res.data; // { currency:string, rate:number }
}
