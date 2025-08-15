// src/presentation/components/layout/AdminLayout.tsx
import { Box, Drawer, AppBar, Toolbar, Typography, Avatar, IconButton, Tooltip } from "@mui/material";
import { alpha } from "@mui/material/styles";
import AdminSidebar from "./AdminSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import LogoutIcon from "@mui/icons-material/Logout";
import { useColorMode } from "../../../shared/theme/ColorModeProvider";
import { useAuth } from "../../../shared/context/AuthContext";
import { useTranslation } from "react-i18next";

export default function AdminLayout() {
  const { mode, toggle } = useColorMode();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(); // <-- i18n
  const drawerWidth = 220;

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
        backgroundImage: (tTheme) =>
          `radial-gradient(40rem 40rem at 10% -10%, ${alpha(tTheme.palette.primary.main, 0.06)} 0%, transparent 35%),
           radial-gradient(36rem 36rem at 120% 10%, ${alpha(tTheme.palette.secondary.main, 0.06)} 0%, transparent 40%)`,
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: (tTheme) => ({
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "background.paper",
            color: "text.primary",
            borderRight: `1px solid ${alpha(tTheme.palette.divider, 0.6)}`,
            boxShadow: `2px 0 24px ${alpha(tTheme.palette.common.black, 0.08)}`,
            backgroundImage:
              mode === "dark"
                ? "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))"
                : "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0))",
            backdropFilter: "blur(2px)",
          }),
        }}
      >
        <AdminSidebar />
      </Drawer>

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            color: "text.primary",
            borderBottom: (tTheme) => `1px solid ${alpha(tTheme.palette.divider, 0.6)}`,
            backgroundImage: (tTheme) =>
              `linear-gradient(180deg, ${alpha(tTheme.palette.background.paper, 0.85)}, ${alpha(
                tTheme.palette.background.paper,
                0.75
              )})`,
            backdropFilter: "blur(8px)",
            minHeight: 64,
          }}
        >
          <Toolbar sx={{ minHeight: 64, px: { xs: 1.5, sm: 3 } }}>
            <Typography
              variant="h5"
              sx={{
                flexGrow: 1,
                fontWeight: 800,
                letterSpacing: 0.5,
                background: (tTheme) =>
                  `linear-gradient(90deg, ${tTheme.palette.text.primary}, ${alpha(
                    tTheme.palette.text.primary,
                    0.7
                  )})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("admin.adminPanelTitle", "Harun Emlak Admin Panel")}
            </Typography>

            {/* Tema toggle */}
            <Tooltip
              title={
                mode === "dark"
                  ? t("theme.light", "Aydınlık tema")
                  : t("theme.dark", "Karanlık tema")
              }
            >
              <IconButton
                onClick={toggle}
                sx={(tTheme) => ({
                  mr: 1,
                  border: `1px solid ${alpha(tTheme.palette.divider, 0.6)}`,
                  boxShadow: `0 2px 10px ${alpha(tTheme.palette.common.black, 0.08)}`,
                  bgcolor: alpha(tTheme.palette.background.paper, 0.6),
                  backdropFilter: "blur(6px)",
                  "&:hover": { bgcolor: alpha(tTheme.palette.action.hover, 0.2) },
                })}
                aria-label={t("theme.toggle", "Temayı değiştir")}
              >
                {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </IconButton>
            </Tooltip>

            {/* Çıkış butonu */}
            <Tooltip title={t("actions.logout", "Çıkış yap")}>
              <IconButton
                onClick={handleLogout}
                sx={(tTheme) => ({
                  mr: 1.5,
                  border: `1px solid ${alpha(tTheme.palette.divider, 0.6)}`,
                  boxShadow: `0 2px 10px ${alpha(tTheme.palette.common.black, 0.08)}`,
                  bgcolor: alpha(tTheme.palette.background.paper, 0.6),
                  backdropFilter: "blur(6px)",
                  "&:hover": { bgcolor: alpha(tTheme.palette.error.light, 0.15) },
                })}
                aria-label={t("actions.logout", "Çıkış yap")}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Avatar
              sx={(tTheme) => ({
                bgcolor: "primary.main",
                width: 32,
                height: 32,
                fontSize: 18,
                fontWeight: 700,
                mr: 1,
                boxShadow: `0 6px 18px ${alpha(tTheme.palette.primary.main, 0.45)}`,
                border: `2px solid ${alpha(tTheme.palette.common.white, mode === "dark" ? 0.1 : 0.6)}`,
              })}
            >
              A
            </Avatar>
            <Typography sx={{ fontWeight: 600, fontSize: 16, mr: 0.5 }}>
              {t("roles.admin", "Admin")}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            p: { xs: 1.5, sm: 3, md: 4 },
            flex: 1,
            bgcolor: "transparent",
            minHeight: "100vh",
            "& > *": { borderRadius: 2.5 },
            "&::-webkit-scrollbar": { width: 10 },
            "&::-webkit-scrollbar-thumb": (tTheme) => ({
              backgroundColor: alpha(tTheme.palette.text.primary, 0.25),
              borderRadius: 8,
            }),
            "&::-webkit-scrollbar-track": (tTheme) => ({
              backgroundColor: alpha(tTheme.palette.background.paper, 0.5),
            }),
          }}
        >
          <Box
            sx={{
              maxWidth: 1400,
              mx: "auto",
              width: "100%",
              animation: "fadeIn 320ms ease-out",
              "@keyframes fadeIn": {
                from: { opacity: 0, transform: "translateY(4px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
