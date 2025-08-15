// src/presentation/components/molecules/CurrencySelector.tsx
import { Box, MenuItem, Select, type SelectChangeEvent, Typography } from "@mui/material";

// SVG dosyalarını normal image gibi import ediyoruz
import FlagTRY from "../../../assets/flags/tr.svg";
import FlagUSD from "../../../assets/flags/us.svg";
import FlagEUR from "../../../assets/flags/eu.svg";
import FlagGBP from "../../../assets/flags/gb.svg";

interface CurrencySelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

const currencyOptions: Record<
  string,
  { label: string; symbol: string; flag: string }
> = {
  TRY: { label: "TRY", symbol: "₺", flag: FlagTRY },
  USD: { label: "USD", symbol: "$", flag: FlagUSD },
  EUR: { label: "EUR", symbol: "€", flag: FlagEUR },
  GBP: { label: "GBP", symbol: "£", flag: FlagGBP },
};

export default function CurrencySelector({
  selectedCurrency,
  onCurrencyChange,
}: CurrencySelectorProps) {
  const handleChange = (e: SelectChangeEvent<string>) => {
    onCurrencyChange(e.target.value);
  };

  return (
    <Select
      value={selectedCurrency}
      onChange={handleChange}
      size="small"
      sx={{
        minWidth: 120,
        fontWeight: 600,
        "& .MuiSelect-select": {
          display: "flex",
          alignItems: "center",
          gap: 1,
        },
      }}
    >
      {Object.entries(currencyOptions).map(([code, { label, symbol, flag }]) => (
        <MenuItem key={code} value={code}>
          <Box
            component="img"
            src={flag}
            alt={label}
            sx={{
              width: 20,
              height: 14,
              objectFit: "cover",
              borderRadius: "2px",
              mr: 1,
            }}
          />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {symbol} ({label})
          </Typography>
        </MenuItem>
      ))}
    </Select>
  );
}
