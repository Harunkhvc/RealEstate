// src/presentation/components/molecules/PriceAndDates.tsx
import { Stack } from "@mui/material";
import AppTextField from "../atoms/AppTextField";
import AppDateField from "../atoms/AppDateField";
import { useTranslation } from "react-i18next";

interface Props {
  price: string;
  startDate: string;
  endDate: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PriceAndDates({ price, startDate, endDate, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <Stack direction="row" spacing={2}>
      <AppTextField
        label={t("priceAndDates.price", "Fiyat")}
        name="price"
        type="number"
        value={price}
        onChange={onChange}
        required
      />
      <AppDateField
        label={t("priceAndDates.startDate", "Başlangıç Tarihi")}
        name="startDate"
        value={startDate}
        onChange={onChange}
        required
      />
      <AppDateField
        label={t("priceAndDates.endDate", "Bitiş Tarihi")}
        name="endDate"
        value={endDate || ""}
        onChange={onChange}
      />
    </Stack>
  );
}
