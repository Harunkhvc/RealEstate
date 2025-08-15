import { useEffect, useState } from "react";
import { Box, Paper, Typography, Stack, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from "@mui/material";
import StringListTable from "../../components/molecules/StringListTable";
import AddStringDialog from "../../components/molecules/AddStringDialog";
import { getPropertyTypes, createPropertyType, deletePropertyType, } from "../../../infrastructure/api-client/lookupApi";
import type { PropertyTypeDto } from "../../../shared/types/lookups";

export default function TypesPage() {
  const [items, setItems] = useState<PropertyTypeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{open:boolean; msg:string; severity:"success"|"error"|"info"}>({open:false,msg:"",severity:"success"});

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getPropertyTypes()
      .then((data) => setItems(data))
      .catch(() => setError("Emlak tipleri alınamadı."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (val: string) => {
    const name = val.trim();
    if (!name) return;
    try {
      await createPropertyType({ name });
      setSnackbar({open:true,msg:"Tip eklendi.",severity:"success"});
      setOpen(false);
      load();
    } catch (e: any) {
      setSnackbar({open:true,msg:e?.response?.data?.message ?? "Ekleme sırasında hata.",severity:"error"});
    }
  };

  const handleDelete = (val: string) => {
    const found = items.find(x => x.name === val);
    if (found) setDeleteId(found.id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePropertyType(deleteId);
      setSnackbar({open:true,msg:"Tip silindi.",severity:"success"});
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
          <Typography variant="h6" fontWeight={800}>Emlak Tipleri</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>Ekle</Button>
        </Stack>

        {loading ? <CircularProgress /> : error ? <Alert severity="error">{error}</Alert> : (
          <StringListTable
            items={items.map(i=>i.name)}
            onDelete={handleDelete}
            addButtonText="Ekle"
            onAddClick={() => setOpen(true)}
          />
        )}
      </Paper>

      {/* Yeni ekleme */}
      <AddStringDialog
        open={open}
        title="Emlak Tipi Ekle"
        onClose={() => setOpen(false)}
        onAdd={handleAdd}
      />

      {/* Silme onayı */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Tipi Sil</DialogTitle>
        <DialogContent>Bu tipi silmek istediğinize emin misiniz?</DialogContent>
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
