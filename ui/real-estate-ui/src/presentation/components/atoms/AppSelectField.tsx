import { MenuItem } from "@mui/material";
import AppTextField from "./AppTextField";

interface Option {
  value: string | number;
  label: string;
}

interface AppSelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  allLabel?: string;
}

export default function AppSelectField({
  label,
  value,
  onChange,
  options,
  allLabel,
}: AppSelectFieldProps) {
  return (
    <AppTextField
      select
      label={label}
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {allLabel && <MenuItem value="">{allLabel}</MenuItem>}
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value.toString()}>
          {opt.label}
        </MenuItem>
      ))}
    </AppTextField>
  );
}
