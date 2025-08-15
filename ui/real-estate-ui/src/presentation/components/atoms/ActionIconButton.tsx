// src/presentation/components/atoms/ActionIconButton.tsx
import { IconButton, Tooltip } from "@mui/material";
import type { ReactNode } from "react";

interface Props {
  title: string;
  onClick: () => void;
  color?: string;
  hoverColor?: string;
  hoverBg?: string;
  size?: "small" | "medium" | "large";
  icon: ReactNode;
  mr?: number;
}

export default function ActionIconButton({
  title,
  onClick,
  color = "#90caf9",
  hoverColor = "#2196f3",
  hoverBg = "#233255",
  size = "small",
  icon,
  mr = 0,
}: Props) {
  return (
    <Tooltip title={title} arrow>
      <IconButton
        size={size}
        onClick={onClick}
        sx={{
          color,
          mr,
          "&:hover": { color: hoverColor, bgcolor: hoverBg },
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
}
