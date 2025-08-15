export const currencyToISO: Record<string, string> = {
  TL: "TRY",
  TRY: "TRY",
  USD: "USD",
  EUR: "EUR",
};

export const formatMoney = (amount: number, cur: string) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: currencyToISO[cur] ?? "TRY",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDateTR = (iso: string) =>
  new Date(iso).toLocaleDateString("tr-TR");
