// src/presentation/components/layout/AdminSidebar.tsx
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Home, Apartment, Settings, Language, CurrencyExchange } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";

type MenuItem = {
  key: "dashboard" | "properties" | "types" | "currency" | "language";
  icon: ReactNode;
  path: string;
  end?: boolean;
};

const MENU: MenuItem[] = [
  { key: "dashboard",  icon: <Home />,             path: "/admin",            end: true },
  { key: "properties", icon: <Apartment />,        path: "/admin/properties" },
  { key: "types",      icon: <Settings />,         path: "/admin/types" },
  { key: "currency",   icon: <CurrencyExchange />, path: "/admin/currency" },
  { key: "language",   icon: <Language />,         path: "/admin/i18n" },
];

export default function AdminSidebar() {
  const { t } = useTranslation();

  return (
    <List sx={{ mt: 2 }}>
      {MENU.map((item) => (
        <ListItemButton
          key={item.key}
          component={NavLink}
          to={item.path}
          end={item.end}
          sx={(theme) => ({
            borderRadius: 2.5,
            mx: 1,
            mb: 0.5,
            px: 2.2,
            py: 1.1,
            alignItems: "center",
            transition: "all 0.22s ease-in-out",
            "& .MuiListItemIcon-root": {
              transition: "color 0.22s ease-in-out, transform 0.18s ease-in-out",
            },
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: theme.palette.primary.main,
              transform: "translateX(3px)",
              "& .MuiListItemIcon-root": {
                color: theme.palette.primary.main,
                transform: "scale(1.12)",
              },
            },
            "&.active": {
              bgcolor: alpha(theme.palette.primary.main, 0.14),
              color: theme.palette.primary.main,
              fontWeight: 700,
              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.25)}`,
              "& .MuiListItemIcon-root": {
                color: theme.palette.primary.main,
              },
            },
          })}
          aria-label={t(`sidebar.${item.key}`, {
            defaultValue:
              item.key === "dashboard"  ? "Dashboard" :
              item.key === "properties" ? "Emlaklar" :
              item.key === "types"      ? "Emlak Tipleri" :
              item.key === "currency"   ? "Döviz" :
              "Dil",
          })}
        >
          <ListItemIcon
            sx={(theme) => ({
              color: alpha(theme.palette.text.primary, 0.55),
              minWidth: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            })}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={t(`sidebar.${item.key}`, {
              defaultValue:
                item.key === "dashboard"  ? "Dashboard" :
                item.key === "properties" ? "Emlaklar" :
                item.key === "types"      ? "Emlak Tipleri" :
                item.key === "currency"   ? "Döviz" :
                "Dil",
            })}
            primaryTypographyProps={{
              fontWeight: 600,
              fontSize: 15.5,
              letterSpacing: 0.15,
              sx: { fontFamily: "inherit" },
            }}
          />
        </ListItemButton>
      ))}
    </List>
  );
}
