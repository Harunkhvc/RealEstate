// src/presentation/components/atoms/AppMenu.tsx
import { Menu } from "@mui/material";
import type { MenuProps } from "@mui/material";

export default function AppMenu(props: MenuProps) {
  return (
    <Menu
      PaperProps={{
        sx: {
          borderRadius: 2.5,
          p: 0,
          mt: 1,
          minWidth: 250,
          boxShadow: "0 6px 32px 0 rgba(50,0,0,0.10)",
          ...(props.PaperProps?.sx || {}),
        },
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      MenuListProps={{ sx: { p: 0 }, ...props.MenuListProps }}
      {...props}
    />
  );
}
