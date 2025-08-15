import AppTextField from "./AppTextField";

interface AppNumberFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function AppNumberField({ label, value, onChange }: AppNumberFieldProps) {
  return (
    <AppTextField
      label={label}
      fullWidth
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
