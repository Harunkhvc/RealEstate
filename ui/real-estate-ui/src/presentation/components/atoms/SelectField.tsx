// src/presentation/components/atoms/SelectField.tsx
import { TextField, MenuItem } from "@mui/material";

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  width?: number | string;
  size?: "small" | "medium";
  background?: string;
}

export default function SelectField({
  value,
  onChange,
  options,
  width = 150,
  size = "small",
  background = "#f7f8fa",
}: SelectFieldProps) {
  return (
    <TextField
      select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ width, background }}
      size={size}
    >
      {options.map((opt, i) => (
        <MenuItem key={i} value={opt}>
          {opt}
        </MenuItem>
      ))}
    </TextField>
  );
}
