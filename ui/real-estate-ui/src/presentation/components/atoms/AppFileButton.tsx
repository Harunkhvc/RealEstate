// src/presentation/components/atoms/AppFileButton.tsx
import { Button } from "@mui/material";
import type { ChangeEvent } from "react";

interface Props {
  label: string;
  accept?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function AppFileButton({ label, accept = "image/*", onChange }: Props) {
  return (
    <Button variant="outlined" component="label">
      {label}
      <input hidden type="file" accept={accept} onChange={onChange} />
    </Button>
  );
}
