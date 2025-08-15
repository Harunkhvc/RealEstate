import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Paper,
} from "@mui/material";
import { useAuth } from "../../../shared/context/AuthContext";
import { useCurrency } from "../../../shared/context/CurrencyContext"; // ✅ global state
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HomeIcon from "@mui/icons-material/Home";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LanguageIcon from "@mui/icons-material/Language";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CurrencySelector from "../molecules/CurrencySelector";

export default function Appbar() {
  const { user, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  // Dil menüsü
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleLangMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleLangClose = (lang?: string) => {
    setAnchorEl(null);
    if (lang) i18n.changeLanguage(lang);
  };

  // Aktif buton stili
  const isActive = (key: "sale" | "rent") =>
    new URLSearchParams(location.search).get("status") === key;

  const goList = (status: "sale" | "rent") => {
    navigate(`/emlaklar?status=${status}`);
  };

  const roleLabel =
    (user?.role && t(`roles.${String(user.role).toLowerCase()}`)) || user?.role || "";

  const currentLangCode = i18n.language?.toLowerCase() === "en" ? "en" : "tr";
  const nextLangCode = currentLangCode === "tr" ? "en" : "tr";
  const currentLangLabel = t(`langSwitch.${currentLangCode}`, currentLangCode.toUpperCase());
  const nextLangLabel = t(`langSwitch.${nextLangCode}`, nextLangCode.toUpperCase());

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ px: 2 }}>
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 56 }}>
        {/* Sol Logo ve Menüler */}
        <Stack direction="row" alignItems="center" spacing={4}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              gap: 1,
            }}
            onClick={() => navigate("/")}
            aria-label={t("title", "Harun Emlak")}
          >
            <HomeIcon sx={{ color: "error.main", fontSize: 38 }} />
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: 26,
                fontFamily: "'Montserrat', 'Segoe UI', sans-serif",
                color: "#222",
                letterSpacing: -1,
                textShadow: "0 2px 12px #f2f2f2",
              }}
            >
              <span style={{ color: "#f00" }}>harun</span>
              <span style={{ color: "#444" }}>emlak</span>
            </Typography>
          </Box>

          {/* Menü Butonları */}
          <Stack direction="row" spacing={2}>
            <Button
              startIcon={<HomeIcon />}
              sx={{
                color: isActive("sale") ? "error.main" : "#111",
                fontWeight: 700,
              }}
              onClick={() => goList("sale")}
              aria-label={t("forSale", "Satılık")}
            >
              {t("forSale", "Satılık")}
            </Button>
            <Button
              startIcon={<MeetingRoomIcon />}
              sx={{
                color: isActive("rent") ? "error.main" : "#111",
                fontWeight: 700,
              }}
              onClick={() => goList("rent")}
              aria-label={t("forRent", "Kiralık")}
            >
              {t("forRent", "Kiralık")}
            </Button>
          </Stack>
        </Stack>

        {/* Sağ Kısım */}
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Döviz seçici (bayrak + sembol) */}
          <CurrencySelector
            selectedCurrency={currency}
            onCurrencyChange={(newCurrency) => setCurrency(newCurrency)}
          />

          {/* Dil */}
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 4,
              px: 1.5,
              py: 0.5,
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton size="small" onClick={handleLangMenu}>
              <LanguageIcon />
            </IconButton>
            <Typography sx={{ mx: 1, fontSize: 12, fontWeight: 500 }}>
              {`${currentLangLabel} - ${nextLangLabel}`}
            </Typography>
          </Paper>
          <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={() => handleLangClose()}
          >
            <MenuItem onClick={() => handleLangClose("tr")}>
              {t("langSwitch.tr", "TR")}
            </MenuItem>
            <MenuItem onClick={() => handleLangClose("en")}>
              {t("langSwitch.en", "EN")}
            </MenuItem>
          </Menu>

          {/* Favoriler */}
          <Button
            startIcon={<FavoriteIcon />}
            sx={{
              color: location.pathname === "/favorites" ? "error.main" : "#111",
              fontWeight: 700,
            }}
            onClick={() => navigate("/favorites")}
            aria-label={t("favorites", "Favorilerim")}
          >
            {t("favorites", "Favorilerim")}
          </Button>

          {/* Giriş/Profil */}
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 4,
              px: 2,
              py: 0.5,
              ml: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton>
              <AccountCircleIcon />
            </IconButton>
            <Box sx={{ ml: 1 }}>
              {user ? (
                <>
                  <Button color="inherit" onClick={() => navigate("/profile")}>
                    {user.username} {roleLabel ? `(${roleLabel})` : ""}
                  </Button>
                  <Button color="inherit" onClick={logout}>
                    {t("logout", "Çıkış")}
                  </Button>
                </>
              ) : (
                <Typography sx={{ fontSize: 14 }}>
                  <span
                    style={{
                      fontWeight: 700,
                      color: "#222",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/login")}
                  >
                    {t("login", "Giriş Yap")}
                  </span>
                  <span style={{ color: "#bbb" }}> {t("or", "veya")} </span>
                  <span
                    style={{
                      color: "#e22",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/register")}
                  >
                    {t("signup", "Üye Ol")}
                  </span>
                </Typography>
              )}
            </Box>
          </Paper>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
