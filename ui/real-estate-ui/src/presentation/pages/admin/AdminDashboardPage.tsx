import { useEffect, useState } from "react";
import { Box, Typography, Stack, CircularProgress, Alert } from "@mui/material";
import StatWidget from "../../components/dashboard/StatWidget";
import { Home, Apartment, CheckCircle, MonetizationOn } from "@mui/icons-material";
import { fetchDashboardSummary } from "../../../shared/types/dashboardApi";
import type { DashboardSummaryDto } from "../../../shared/types/dashboard";
import { useNavigate } from "react-router-dom";

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<DashboardSummaryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardSummary()
      .then(setSummary)
      .catch(() => setError("Dashboard verisi alınamadı."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!summary) return null;

  const stats = [
    {
      label: "Toplam Emlak",
      count: summary.totalProperties,
      icon: <Apartment />,
      iconColor: "#1976d2",
      bgColor: "rgba(25,118,210,0.12)",
      onClick: () => navigate("/admin/properties"),
    },
    {
      label: "Satılık",
      count: summary.totalForSale,
      icon: <CheckCircle />,
      iconColor: "#43a047",
      bgColor: "rgba(67,160,71,0.13)",
      onClick: () => navigate("/admin/properties?status=Satılık"),
    },
    {
      label: "Kiralık",
      count: summary.totalForRent,
      icon: <Home />,
      iconColor: "#ffa000",
      bgColor: "rgba(255,160,0,0.11)",
      onClick: () => navigate("/admin/properties?status=Kiralık"),
    },
    {
      label: "Portföy Değeri",
      count: summary.totalPortfolioValue.toLocaleString("tr-TR") + " ₺",
      icon: <MonetizationOn />,
      iconColor: "#673ab7",
      bgColor: "rgba(103,58,183,0.12)",
      onClick: undefined, // Maddi durum widget’ı, tıklanmaz
    },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Dashboard
      </Typography>
      <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
        {stats.map((stat) => (
          <Box
            key={stat.label}
            sx={{ cursor: stat.onClick ? "pointer" : "default" }}
            onClick={stat.onClick}
          >
            <StatWidget {...stat} />
          </Box>
        ))}
      </Stack>

      {/* Emlak Tiplerine Göre Dağılım */}
      <Box mt={5}>
        <Typography variant="h6" mb={2}>Emlak Tipine Göre Dağılım</Typography>
        <Stack direction="row" spacing={2}>
          {summary.propertyTypeCounts.map((type) => (
            <Box
              key={type.propertyType}
              sx={{
                p: 2,
                bgcolor: "#f5f6fa",
                borderRadius: 2,
                minWidth: 120,
                boxShadow: "0 2px 12px #1976d211"
              }}
            >
              <Typography color="primary" fontWeight={700}>
                {type.propertyType}
              </Typography>
              <Typography fontWeight={600} variant="h5">{type.count}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
