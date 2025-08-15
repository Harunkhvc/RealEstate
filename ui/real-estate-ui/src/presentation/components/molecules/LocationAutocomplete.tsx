import { Autocomplete } from "@mui/material";
import AppTextField from "../atoms/AppTextField";

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
}

export default function LocationAutocomplete({ value, onChange, options, label }: Props) {
  return (
    <Autocomplete
      freeSolo
      options={options}
      value={value}
      onChange={(_, newValue) => onChange(newValue || "")}
      renderInput={(params) => (
        <AppTextField {...params} label={label} />
      )}
    />
  );
}
