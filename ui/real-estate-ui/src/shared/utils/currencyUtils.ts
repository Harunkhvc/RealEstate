// src/shared/utils/currencyUtils.ts
import { currencyRates } from "../constants/currencyRates";

export function convertToTL(amount: number, currency: string): number {
  const rate = currencyRates[currency] ?? 1;
  return amount * rate;
}
