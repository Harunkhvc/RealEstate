// src/presentation/pages/admin/CurrencyPage.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Chip,
  Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CurrencyExchangeRoundedIcon from "@mui/icons-material/CurrencyExchangeRounded";

import StringListTable from "../../components/molecules/StringListTable";
import AddStringDialog from "../../components/molecules/AddStringDialog";
import { getCurrencies, createCurrency, deleteCurrency } from "../../../infrastructure/api-client/lookupApi";
import { getLiveRate } from "../../../infrastructure/api-client/currencyApi";
import type { CurrencyDto } from "../../../shared/types/lookups";

// --- LiveCurrencyCard (inline bileşen)
function LiveCurrencyCard({ code }: { code: string }) {
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getLiveRate(code)
      .then((data) => setRate(data.rate))
      .catch(() => setRate(null))
      .finally(() => setLoading(false));
  }, [code]);

  return (
    <Paper
      sx={{
        p: 2,
        textAlign: "center",
        borderRadius: 3,
        border: (t) => `1px solid ${t.palette.divider}`,
        minWidth: 160,
      }}
    >
      <Typography variant="subtitle2" fontWeight={700}>
        {code} / TRY
      </Typography>
      {loading ? (
        <Skeleton variant="text" width={80} sx={{ mx: "auto" }} />
      ) : (
        <Typography variant="h6" color="primary">
          {rate !== null ? rate.toFixed(2) : "Veri yok"}
        </Typography>
      )}
    </Paper>
  );
}

export default function CurrencyPage() {
  const [items, setItems] = useState<CurrencyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; msg: string; severity: "success" | "error" | "info" }>({
    open: false,
    msg: "",
    severity: "success",
  });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getCurrencies()
      .then((data) => setItems(data))
      .catch(() => setError("Döviz listesi alınamadı."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (val: string) => {
    const code = val.trim().toUpperCase();
    if (!code) return;
    const symbol = code === "TL" || code === "TRY" ? "₺" : code === "USD" ? "$" : code === "EUR" ? "€" : code;
    try {
      await createCurrency({ code, symbol });
      setSnackbar({ open: true, msg: "Döviz eklendi.", severity: "success" });
      setOpen(false);
      load();
    } catch (e: any) {
      setSnackbar({ open: true, msg: e?.response?.data?.message ?? "Ekleme sırasında hata.", severity: "error" });
    }
  };

  const handleDelete = (val: string) => {
    const found = items.find((x) => x.code === val || x.code === val.toUpperCase());
    if (found) setDeleteId(found.id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCurrency(deleteId);
      setSnackbar({ open: true, msg: "Döviz silindi.", severity: "success" });
      setDeleteId(null);
      load();
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? "Silme sırasında hata.";
      setSnackbar({ open: true, msg, severity: "error" });
      setDeleteId(null);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: { xs: 2.5, sm: 4 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          bgcolor: "background.paper",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={1.5}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                bgcolor: (t) => (t.palette.mode === "light" ? "grey.100" : "grey.900"),
                border: (t) => `1px solid ${t.palette.divider}`,
              }}
            >
              <CurrencyExchangeRoundedIcon fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={800} lineHeight={1.2}>
                Döviz Türleri
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Uygulamanızda kullanılacak para birimilerini yönetin
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, px: 2.25, py: 1 }}
          >
            Yeni Döviz Ekle
          </Button>
        </Stack>

        {/* Live Currency Cards (Stack ile, Grid yok) */}
       <Stack
  direction="row"
  spacing={2}
  sx={{ mt: 2 }}
  useFlexGap
  flexWrap="wrap"
  alignItems="stretch"
>
  {["USD", "EUR"].map((code) => (
    <LiveCurrencyCard key={code} code={code} />
  ))}
</Stack>

        <Divider sx={{ my: 2.5 }} />

        {/* Content states */}
        {loading ? (
          <Stack spacing={1.5}>
            <Skeleton variant="rounded" height={48} />
            <Skeleton variant="rounded" height={48} />
            <Skeleton variant="rounded" height={48} />
          </Stack>
        ) : error ? (
          <Alert severity="error" variant="outlined" sx={{ borderRadius: 2, borderWidth: 2 }}>
            {error}
          </Alert>
        ) : items.length === 0 ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{
              py: 6,
              borderRadius: 3,
              bgcolor: (t) => (t.palette.mode === "light" ? "grey.50" : "grey.900"),
              border: (t) => `1px dashed ${t.palette.divider}`,
            }}
          >
            <Chip
              icon={<WarningAmberRoundedIcon />}
              label="Kayıt bulunamadı"
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
            <Typography variant="body2" color="text.secondary" align="center">
              Henüz bir döviz eklenmemiş. Başlamak için “Yeni Döviz Ekle” butonuna tıklayın.
            </Typography>
            <Button
              onClick={() => setOpen(true)}
              startIcon={<AddIcon />}
              variant="contained"
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
            >
              Döviz Ekle
            </Button>
          </Stack>
        ) : (
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              border: (t) => `1px solid ${t.palette.divider}`,
            }}
          >
            <StringListTable
              items={items.map((i) => i.code)}
              onDelete={handleDelete}
              addButtonText="Döviz Ekle"
              onAddClick={() => setOpen(true)}
            />
          </Box>
        )}
      </Paper>

      {/* Add dialog */}
      <AddStringDialog
        open={open}
        title="Döviz Ekle (ör. TL, USD, EUR)"
        onClose={() => setOpen(false)}
        onAdd={handleAdd}
      />

      {/* Delete confirm */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800, pb: 1.5 }}>Döviz Sil</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 1.5 }}>
          <Alert icon={<WarningAmberRoundedIcon fontSize="small" />} severity="warning" variant="outlined" sx={{ borderRadius: 2 }}>
            Bu dövizi silmek istediğinize emin misiniz?
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ borderRadius: 2, textTransform: "none" }}>
            İptal
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar((s) => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
