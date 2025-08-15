// presentation/pages/PropertyListPage.tsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Pagination,
  CircularProgress,
  Button,
  Stack,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import PropertyTable from "../../components/organisms/PropertyTable";
import PropertyForm from "../../components/organisms/PropertyForm";
import { usePropertyList } from "../../../shared/hooks/usePropertyList";
import {
  createProperty,
  deleteProperty,
  updateProperty,
} from "../../../infrastructure/api-client/propertyApi";
import type {
  PropertyListDto,
  PropertyCreateDto,
  PropertyUpdateDto,
  PropertyTableRow,
} from "../../../shared/types/property";

const PAGE_SIZE = 12;

export default function PropertyListPage() {
  const [params, setParams] = useSearchParams();
  const pageParam = Number(params.get("page") || 1);

  // Edit ve refresh için state'ler
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<PropertyListDto | null>(null);

  const { properties, totalCount, loading, filter, setFilter, refetch } = usePropertyList({
    page: pageParam,
    pageSize: PAGE_SIZE,
  });

  // Sayfa değişince hook filtresini güncelle
  // (status vs. yok; yalnızca sayfa/paging var)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setFilter((f) => ({
      ...f,
      page: pageParam,
      pageSize: PAGE_SIZE,
    }));
  }, [pageParam, setFilter]);

  // Snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    msg: string;
    severity: "success" | "error";
  }>({ open: false, msg: "", severity: "success" });

  // Silme Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<number | null>(null);

  // Sayfa değiştir
  const handlePageChange = (_: any, value: number) => {
    setParams((p) => {
      p.set("page", String(value));
      return p;
    });
    // setFilter çağrısı gerekmiyor; effect pageParam üzerinden tetikler
  };

  // Edit normalize
  const handleEdit = (row: PropertyTableRow) => {
    const normalized: PropertyListDto = {
      id: row.id,
      title: row.title,
      propertyType: row.propertyType,
      propertyStatus: row.propertyStatus,
      price: row.price,
      currency: row.currency,
      startDate: row.startDate ? row.startDate.substring(0, 10) : "",
      endDate: row.endDate ? row.endDate.substring(0, 10) : "",
      thumbnailUrl: row.thumbnailUrl || "",
    };
    setEditData(normalized);
    setFormOpen(true);
  };

  // Silme isteği
  const handleDelete = (id: number) => {
    setToDeleteId(id);
    setDeleteDialogOpen(true);
  };

  // Silme onayı
  const confirmDelete = async () => {
    if (!toDeleteId) return;
    try {
      await deleteProperty(toDeleteId);
      setSnackbar({ open: true, msg: "Emlak başarıyla silindi!", severity: "success" });
      refetch();
    } catch {
      setSnackbar({ open: true, msg: "Silme sırasında hata oluştu!", severity: "error" });
    }
    setDeleteDialogOpen(false);
    setToDeleteId(null);
  };

  // Ekle/Güncelle
  const handleSave = async (data: PropertyCreateDto | PropertyUpdateDto) => {
    try {
      if (editData) {
        await updateProperty({ ...(data as PropertyUpdateDto), id: editData.id });
        setSnackbar({ open: true, msg: "Emlak başarıyla güncellendi!", severity: "success" });
      } else {
        await createProperty(data as PropertyCreateDto);
        setSnackbar({ open: true, msg: "Emlak başarıyla eklendi!", severity: "success" });
      }
      setFormOpen(false);
      setEditData(null);
      refetch();
    } catch {
      setSnackbar({
        open: true,
        msg: "Ekleme/Güncelleme sırasında hata oluştu!",
        severity: "error",
      });
    }
  };

  const handleFormCancel = () => {
    setFormOpen(false);
    setEditData(null);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          onClick={() => {
            setEditData(null);
            setFormOpen(true);
          }}
        >
          + Yeni Emlak
        </Button>
      </Stack>

      {loading ? (
        <CircularProgress />
      ) : (
        <PropertyTable
          properties={properties.map((p) => ({
            id: p.id,
            title: p.title,
            propertyType: p.propertyType,
            propertyStatus: p.propertyStatus,
            currency: p.currency,
            price: p.price,
            startDate: p.startDate,
            endDate: p.endDate,
            thumbnailUrl: p.thumbnailUrl || "",
          }))}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Pagination
        count={Math.max(1, Math.ceil(totalCount / PAGE_SIZE))}
        page={filter.page}
        onChange={handlePageChange}
        sx={{ mt: 3, display: "flex", justifyContent: "center" }}
      />

      {/* Ekle/Güncelle Formu */}
      {formOpen && (
        <PropertyForm
          onSave={handleSave}
          onCancel={handleFormCancel}
          initialData={editData || undefined}
        />
      )}

      {/* Silme Onayı Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Emlak Sil</DialogTitle>
        <DialogContent>Bu emlağı silmek istediğinize emin misiniz?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bildirim */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
