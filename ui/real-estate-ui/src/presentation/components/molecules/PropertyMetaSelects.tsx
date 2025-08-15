// src/presentation/components/molecules/PropertyMetaSelects.tsx
import { Stack } from "@mui/material";
import AppSelectField from "../atoms/AppSelectField";
import {
  PROPERTY_TYPE_OPTIONS,
  PROPERTY_STATUS_OPTIONS,
  CURRENCY_OPTIONS,
} from "../../../shared/constants/options";
import { useTranslation } from "react-i18next";

interface Props {
  typeId: string | number;
  statusId: string | number;
  currencyId: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PropertyMetaSelects({ typeId, statusId, currencyId, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <Stack direction="row" spacing={2}>
      <AppSelectField
        label={t("propertyMeta.type", "Tip")}
        value={String(typeId)}
        onChange={(v) =>
          onChange({ target: { name: "propertyTypeId", value: v } } as any)
        }
        options={PROPERTY_TYPE_OPTIONS}
      />
      <AppSelectField
        label={t("propertyMeta.status", "Durum")}
        value={String(statusId)}
        onChange={(v) =>
          onChange({ target: { name: "propertyStatusId", value: v } } as any)
        }
        options={PROPERTY_STATUS_OPTIONS}
      />
      <AppSelectField
        label={t("propertyMeta.currency", "Döviz")}
        value={String(currencyId)}
        onChange={(v) =>
          onChange({ target: { name: "currencyId", value: v } } as any)
        }
        options={CURRENCY_OPTIONS}
      />
    </Stack>
  );
}
