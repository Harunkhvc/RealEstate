// src/presentation/components/molecules/UserMenu.tsx
import { Divider, List, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import AppMenu from "../atoms/AppMenu";
import AppListItemButton from "../atoms/AppListItemButton";
import AppButton from "../atoms/AppButton";

interface UserMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

export default function UserMenu({
  anchorEl,
  open,
  onClose,
  onLoginClick,
}: UserMenuProps) {
  const { t } = useTranslation();

  return (
    <AppMenu anchorEl={anchorEl} open={open} onClose={onClose}>
      <Box sx={{ p: 2, pb: 1 }}>
        <AppButton
          variant="contained"
          fullWidth
          sx={{
            background: "#e53935",
            fontWeight: 700,
            borderRadius: 1.5,
            py: 1,
            fontSize: 15,
            mb: 2,
            "&:hover": { background: "#b71c1c" },
            boxShadow: "none",
            textTransform: "none",
          }}
          onClick={onLoginClick}
          label={t("userMenu.login", "Giriş Yap")}
        />
        <Typography
          align="center"
          sx={{ fontWeight: 700, color: "#444", mb: 1, fontSize: 16 }}
        >
          {t("userMenu.registerOn", "Kayıt Ol")}
        </Typography>
      </Box>

      <Divider sx={{ mb: 0.5 }} />

      <List dense sx={{ p: 0, pb: 1 }}>
        <AppListItemButton text={t("userMenu.mySearches", "Aramalarım")} />
        <AppListItemButton text={t("userMenu.myFavorites", "Favorilerim")} />
        <AppListItemButton text={t("userMenu.myMessages", "Mesajlarım")} />
        <AppListItemButton text={t("userMenu.myEarnings", "Kazançlarım")} />
        <AppListItemButton text={t("userMenu.myListings", "İlanlarım")} />
      </List>
    </AppMenu>
  );
}
