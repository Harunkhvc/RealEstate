// src/presentation/components/atoms/AppDateField.tsx
import AppTextField from "./AppTextField";

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export default function AppDateField({ label, name, value, onChange, required }: Props) {
  return (
    <AppTextField
      label={label}
      name={name}
      type="date"
      value={value}
      onChange={onChange}
      InputLabelProps={{ shrink: true }}
      required={required}
    />
  );
}
