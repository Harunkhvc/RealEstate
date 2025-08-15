import { Box, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import AppButton from "../atoms/AppButton";
import LocationAutocomplete from "../molecules/LocationAutocomplete";
import AppSelectField from "../atoms/AppSelectField";
import PriceRangeFields from "../molecules/PriceRangeFields";
import {
  PROPERTY_TYPE_OPTIONS,
  PROPERTY_STATUS_OPTIONS,
} from "../../../shared/constants/options";

interface FilterValues {
  location: string;
  minPrice: string;
  maxPrice: string;
  type: string;
  status: string;
}

interface FilterPanelProps {
  values: FilterValues;
  onChange: (field: keyof FilterValues, value: string) => void;
  onApply: () => void;
  onReset?: () => void;
}

const LOCATION_OPTIONS = [
  "Kadıköy",
  "Beşiktaş",
  "Çeşme",
  "Konyaaltı",
  "Ataşehir",
  "Karşıyaka",
];

export default function FilterPanel({
  values,
  onChange,
  onApply,
  onReset,
}: FilterPanelProps) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.85) 0%, rgba(250,250,250,0.75) 100%)",
        backdropFilter: "blur(10px) saturate(120%)",
        borderRadius: 4,
        boxShadow: "0 8px 28px rgba(0,0,0,0.1)",
        p: { xs: 2.5, sm: 3 },
        minWidth: { xs: "100%", sm: 300 },
        maxWidth: 360,
        mb: { xs: 2, sm: 0 },
        border: "1.5px solid rgba(229,57,53,0.15)",
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 12px 36px rgba(0,0,0,0.15)",
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Başlık */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          mb: 1,
          pb: 1,
          borderBottom: "2px solid rgba(229,57,53,0.15)",
        }}
      >
        <FilterAltOutlinedIcon sx={{ color: "#e53935", fontSize: 26 }} />
        <Box
          sx={{
            fontWeight: 800,
            fontSize: 20,
            color: "#222",
            letterSpacing: 0.5,
          }}
        >
          {t("filter")}
        </Box>
      </Stack>

      {/* Lokasyon */}
      <LocationAutocomplete
        value={values.location}
        onChange={(v) => onChange("location", v)}
        options={LOCATION_OPTIONS}
        label={t("location")}
      />

      {/* Tür */}
      <AppSelectField
        label={t("type")}
        value={values.type}
        onChange={(v) => onChange("type", v)}
        options={PROPERTY_TYPE_OPTIONS}
        allLabel={t("all")}
      />

      {/* Durum */}
      <AppSelectField
        label={t("status")}
        value={values.status}
        onChange={(v) => onChange("status", v)}
        options={PROPERTY_STATUS_OPTIONS}
        allLabel={t("all")}
      />

      {/* Fiyat */}
      <PriceRangeFields
        minPrice={values.minPrice}
        maxPrice={values.maxPrice}
        onMinChange={(v) => onChange("minPrice", v)}
        onMaxChange={(v) => onChange("maxPrice", v)}
        minLabel={t("minPrice")}
        maxLabel={t("maxPrice")}
      />

      {/* Butonlar */}
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <AppButton
          variant="contained"
          fullWidth
          sx={{
            background: "linear-gradient(90deg, #e53935 0%, #b71c1c 100%)",
            fontWeight: 800,
            borderRadius: 3,
            py: 1.2,
            fontSize: 16,
            letterSpacing: 1,
            boxShadow: "0 4px 14px rgba(229,57,53,0.35)",
            "&:hover": {
              background: "linear-gradient(90deg, #b71c1c 0%, #e53935 100%)",
              boxShadow: "0 6px 18px rgba(183,28,28,0.45)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.25s ease",
          }}
          onClick={onApply}
          label={t("apply")}
        />
        {onReset && (
          <AppButton
            variant="outlined"
            color="error"
            fullWidth
            sx={{
              borderRadius: 3,
              py: 1.2,
              fontWeight: 700,
              fontSize: 16,
              borderWidth: 2,
              "&:hover": {
                backgroundColor: "rgba(229,57,53,0.05)",
              },
            }}
            onClick={onReset}
            label={t("reset") || "Sıfırla"}
          />
        )}
      </Stack>
    </Box>
  );
}
