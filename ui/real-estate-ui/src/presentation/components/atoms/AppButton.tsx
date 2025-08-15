// src/presentation/components/atoms/AppButton.tsx
import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";

interface AppButtonProps extends ButtonProps {
  label: string;
}

export default function AppButton({ label, ...rest }: AppButtonProps) {
  return (
    <Button {...rest}>
      {label}
    </Button>
  );
}
