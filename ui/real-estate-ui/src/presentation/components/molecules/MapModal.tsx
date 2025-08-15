// src/presentation/components/molecules/MapModal.tsx
import { Modal, Box, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function MapModal({
  open,
  onClose,
  mapUrl,
}: {
  open: boolean;
  onClose: () => void;
  mapUrl?: string;
}) {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: "90vw",
          maxWidth: 780,
          height: 500,
          bgcolor: "#fff",
          p: 2,
          borderRadius: 3,
          boxShadow: 4,
          mx: "auto",
          mt: "10vh",
          outline: "none",
        }}
      >
        <Typography variant="h6" mb={1}>
          {t("map.title", "Konum")}
        </Typography>
        {mapUrl ? (
          <iframe
            title={t("map.title", "Harita")}
            src={mapUrl}
            width="100%"
            height="420"
            style={{ border: 0, borderRadius: 8 }}
            loading="lazy"
          />
        ) : (
          <Typography color="text.secondary">
            {t("map.noInfo", "Konum bilgisi yok.")}
          </Typography>
        )}
        <Button
          onClick={onClose}
          sx={{ mt: 2, float: "right" }}
          variant="contained"
        >
          {t("map.close", "Kapat")}
        </Button>
      </Box>
    </Modal>
  );
}
