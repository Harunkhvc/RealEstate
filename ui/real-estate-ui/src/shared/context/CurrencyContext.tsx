import { createContext, useContext, useState, type ReactNode } from "react";

type CurrencyContextType = {
  currency: string;
  setCurrency: (c: string) => void;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // LocalStorage'dan okurken TL'yi TRY'ye çevir
  const stored = localStorage.getItem("currency");
  const initial = stored === "TL" ? "TRY" : stored || "USD";

  const [currency, setCurrencyState] = useState(initial);

  const setCurrency = (c: string) => {
    const normalized = c === "TL" ? "TRY" : c; // TL yerine TRY kaydet
    setCurrencyState(normalized);
    localStorage.setItem("currency", normalized);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}
