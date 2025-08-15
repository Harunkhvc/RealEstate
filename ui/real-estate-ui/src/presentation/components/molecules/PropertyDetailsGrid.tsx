import { Stack } from "@mui/material";
import InfoItem from "../atoms/InfoItem";

export interface DetailItem {
  label: string;
  value: string | number;
}

export default function PropertyDetailsGrid({ items }: { items: DetailItem[] }) {
  return (
    <Stack direction="row" flexWrap="wrap" useFlexGap rowGap={2.5} columnGap={5} mb={2}>
      {items.map((d, i) => (
        <InfoItem key={i} label={d.label} value={d.value} />
      ))}
    </Stack>
  );
}
