import { useEffect, useState } from "react";
import { Box, Paper, Typography, Stack, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from "@mui/material";
import StringListTable from "../../components/molecules/StringListTable";
import AddStringDialog from "../../components/molecules/AddStringDialog";
import { getLanguages, createLanguage, deleteLanguage } from "../../../infrastructure/api-client/lookupApi";
import type { LanguageDto } from "../../../shared/types/lookups";

export default function LanguagePage() {
  const [items, setItems] = useState<LanguageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{open:boolean; msg:string; severity:"success"|"error"|"info"}>({open:false,msg:"",severity:"success"});
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getLanguages()
      .then((data) => setItems(data))
      .catch(() => setError("Diller alınamadı."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (val: string) => {
    const name = val.trim();
    if (!name) return;
    // basit code üret: Türkçe -> tr, English -> en
    const code = name.toLowerCase().startsWith("t") ? "tr" : name.toLowerCase().startsWith("e") ? "en" : name.toLowerCase().slice(0,2);
    try {
      await createLanguage({ code, name });
      setSnackbar({open:true,msg:"Dil eklendi.",severity:"success"});
      setOpen(false);
      load();
    } catch (e:any) {
      setSnackbar({open:true,msg:e?.response?.data?.message ?? "Ekleme sırasında hata.",severity:"error"});
    }
  };

  const handleDelete = (val: string) => {
    const found = items.find(x => x.name === val || x.code === val.toLowerCase());
    if (found) setDeleteId(found.id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteLanguage(deleteId);
      setSnackbar({open:true,msg:"Dil silindi.",severity:"success"});
      setDeleteId(null);
      load();
    } catch (e:any) {
      const msg = e?.response?.data?.message ?? "Silme sırasında hata.";
      setSnackbar({open:true,msg, severity:"error"});
      setDeleteId(null);
    }
  };

  return (
    <Box sx={{ maxWidth: 720, mx: "auto" }}>
      <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight={800}>Diller</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>Ekle</Button>
        </Stack>

        {loading ? <CircularProgress /> : error ? <Alert severity="error">{error}</Alert> : (
          <StringListTable
            items={items.map(i=>i.name)}
            onDelete={handleDelete}
            addButtonText="Dil Ekle"
            onAddClick={() => setOpen(true)}
          />
        )}
      </Paper>

      <AddStringDialog
        open={open}
        title="Dil Ekle"
        onClose={() => setOpen(false)}
        onAdd={handleAdd}
      />

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Dil Sil</DialogTitle>
        <DialogContent>Bu dili silmek istediğinize emin misiniz?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>İptal</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>Sil</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={()=>setSnackbar(s=>({...s,open:false}))}>
        <Alert onClose={()=>setSnackbar(s=>({...s,open:false}))} severity={snackbar.severity}>{snackbar.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
