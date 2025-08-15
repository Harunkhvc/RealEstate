import { Stack } from "@mui/material";
import AppNumberField from "../atoms/AppNumberField";

interface Props {
  minPrice: string;
  maxPrice: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  minLabel: string;
  maxLabel: string;
}

export default function PriceRangeFields({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
  minLabel,
  maxLabel,
}: Props) {
  return (
    <Stack direction="row" spacing={1}>
      <AppNumberField label={minLabel} value={minPrice} onChange={onMinChange} />
      <AppNumberField label={maxLabel} value={maxPrice} onChange={onMaxChange} />
    </Stack>
  );
}
