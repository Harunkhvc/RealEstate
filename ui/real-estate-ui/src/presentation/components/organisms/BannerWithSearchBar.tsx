// src/presentation/components/organisms/BannerWithSearchBar.tsx
import {
  Box,
  Paper,
  InputBase,
  Button,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Trans, useTranslation } from "react-i18next";
import { useTheme, type Theme } from "@mui/material/styles";

export interface BannerWithSearchBarProps {
  type: string;
  onTypeChange: (v: string) => void;
  query: string;
  onQueryChange: (v: string) => void;
  types: string[];
  onSearch: () => void;
}

export default function BannerWithSearchBar({
  query,
  onQueryChange,
  onSearch,
}: BannerWithSearchBarProps) {
  const theme = useTheme<Theme>();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: 320, md: 420 },
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 4,
        backgroundImage: `linear-gradient(rgba(18,20,28,0.38), rgba(0,0,0,0.58)),
           url(https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=80)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1100,
          px: { xs: 2, md: 3 },
          position: "absolute",
          top: { xs: "12%", md: "16%" },
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          color="white"
          fontWeight={800}
          sx={{
            letterSpacing: 0.2,
            lineHeight: 1.15,
            fontSize: { xs: 28, md: 40 },
            textShadow: "0 8px 28px rgba(0,0,0,0.45)",
            mb: 1.5,
          }}
        >
          <Trans
            i18nKey="banner.title"
            components={{
              highlight: <Box component="span" sx={{ color: "#ffd600" }} />,
            }}
          />
        </Typography>

        <Stack
          direction="row"
          gap={1}
          flexWrap="wrap"
          sx={{ mb: { xs: 2.5, md: 3 } }}
        >
          <Chip
            label={t("banner.features.updatedListings")}
            sx={chipStyle(theme)}
            variant="filled"
          />
          <Chip
            label={t("banner.features.verifiedSellers")}
            sx={chipStyle(theme)}
            variant="filled"
          />
          <Chip
            label={t("banner.features.mapSearch")}
            sx={chipStyle(theme)}
            variant="filled"
          />
          <Chip
            label={t("banner.features.noCommission")}
            sx={chipStyle(theme)}
            variant="filled"
          />
        </Stack>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ position: "relative", maxWidth: 980 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1, md: 1.25 },
              pr: { xs: 1, md: 18 },
              borderRadius: 4,
              backdropFilter: "saturate(120%) blur(10px)",
              background:
                theme.palette.mode === "dark"
                  ? "rgba(20,22,28,0.45)"
                  : "rgba(255,255,255,0.92)",
              border: `1px solid ${
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(0,0,0,0.08)"
              }`,
              boxShadow:
                "0 12px 34px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Box
                aria-hidden
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 3,
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid",
                  borderColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.14)"
                      : "rgba(0,0,0,0.1)",
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(0,0,0,0.2)"
                      : "rgba(255,255,255,0.85)",
                }}
              >
                <SearchIcon />
              </Box>

              <InputBase
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder={t("banner.searchPlaceholder")}
                inputProps={{ "aria-label": t("banner.searchAria") }}
                sx={{
                  flex: 1,
                  px: 2,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.16)"
                      : "rgba(0,0,0,0.12)",
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(0,0,0,0.18)"
                      : "rgba(255,255,255,0.98)",
                  height: 56,
                  fontSize: 16,
                  "::placeholder": { opacity: 0.9 },
                  ":focus-within": {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 0 3px ${theme.palette.primary.main}22`,
                  },
                }}
              />
            </Stack>
          </Paper>

          <Button
            type="submit"
            variant="contained"
            startIcon={<SearchIcon />}
            sx={{
              position: "absolute",
              right: { xs: 12, md: 20 },
              top: { xs: "auto", md: "50%" },
              bottom: { xs: -26, md: "auto" },
              transform: { xs: "none", md: "translateY(-50%)" },
              height: 56,
              px: 3.5,
              borderRadius: 3,
              fontWeight: 800,
              letterSpacing: 0.2,
              boxShadow:
                "0 16px 36px rgba(0,0,0,0.30), 0 4px 10px rgba(0,0,0,0.18)",
              "::after": {
                content: '""',
                position: "absolute",
                inset: 0,
                borderRadius: 12,
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -10px 22px rgba(0,0,0,0.12)",
              },
            }}
          >
            {t("banner.searchButton")}
          </Button>
        </Box>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: { xs: 5, md: 3.5 },
            color: "rgba(255,255,255,0.9)",
            textShadow: "0 2px 10px rgba(0,0,0,0.35)",
          }}
        >
          {t("banner.noCommissionNote")}
        </Typography>
      </Box>
    </Box>
  );
}

function chipStyle(theme: Theme) {
  return {
    bgcolor:
      theme.palette.mode === "dark"
        ? "rgba(0,0,0,0.35)"
        : "rgba(255,255,255,0.25)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.28)",
    backdropFilter: "blur(6px)",
    fontWeight: 700,
    letterSpacing: 0.2,
    boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
    "& .MuiChip-label": { px: 1.25, py: 0.25 },
  };
}
