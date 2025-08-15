// src/presentation/components/organisms/PropertyDetailView.tsx
import { useState } from "react";
import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MapIcon from "@mui/icons-material/Map";
import PropertyHeader from "../molecules/PropertyHeader";
import PropertyTags from "../molecules/PropertyTags";
import PropertyDetailsGrid from "../molecules/PropertyDetailsGrid";
import type { DetailItem } from "../molecules/PropertyDetailsGrid";
import OwnerCard from "../molecules/OwnerCard";
import ImageGallery from "./ImageGallery";
import MapModal from "../molecules/MapModal";
import { useTranslation } from "react-i18next";

export interface PropertyDetailViewProps {
  title: string;
  priceText: string;
  type: string;
  status: string;
  description: string;
  details: DetailItem[];
  images: string[];
  canShowMap: boolean;
  mapUrl?: string;
  ownerName: string;
  ownerPhone: string;
  galleryIndex: number;
  onGalleryIndexChange: (i: number) => void;
  onBack: () => void;
  onFav?: () => void;
}

export default function PropertyDetailView(props: PropertyDetailViewProps) {
  const [mapOpen, setMapOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <Box sx={{ maxWidth: 1300, mx: "auto", mt: { xs: 2, md: 4 }, mb: 6, px: { xs: 1, md: 0 } }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          p: { xs: 1.5, md: 3 },
          bgcolor: "#fff",
          border: "1px solid #e9eef5",
          boxShadow: "0 10px 30px rgba(16,21,45,0.05), 0 1px 0 0 rgba(16,21,45,0.03) inset",
        }}
      >
        {/* Dış iskelet: flexbox */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "stretch",
            gap: { xs: 3, md: 4 },
          }}
        >
          {/* Ana alan (galeri + içerik) */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 3, md: 4 },
              flex: 1,
              minWidth: 0,
            }}
          >
            {/* Sol: Galeri sütunu (sabit genişlik) */}
            <Box sx={{ flex: { xs: "1 1 auto", md: "0 0 460px" }, width: { xs: "100%", md: 460 } }}>
              <ImageGallery
                images={props.images}
                index={props.galleryIndex}
                onIndexChange={props.onGalleryIndexChange}
              />

              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mt: 2, fontWeight: 800, borderWidth: 2, "&:hover": { borderWidth: 2 } }}
                startIcon={<MapIcon />}
                onClick={() => setMapOpen(true)}
                disabled={!props.canShowMap}
              >
                {t("detail.showOnMap", "Haritada Göster")}
              </Button>

              <MapModal open={mapOpen} onClose={() => setMapOpen(false)} mapUrl={props.mapUrl} />
            </Box>

            {/* Orta: İçerik sütunu (esnek) */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <PropertyHeader title={props.title} priceText={props.priceText} onFav={props.onFav} />
              <PropertyTags type={props.type} status={props.status} />

              <Divider sx={{ mb: 2 }} />
              <PropertyDetailsGrid items={props.details} />
              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                {props.description}
              </Typography>

              {/* Alt aksiyonlar */}
              <Stack direction="row" gap={2} mt={2} sx={{ position: "sticky", bottom: 0 }}>
                <Button
                  variant="outlined"
                  onClick={props.onBack}
                  startIcon={<ArrowBackIcon />}
                  sx={{ fontWeight: 700 }}
                >
                  {t("detail.goBack", "Geri Dön")}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<FavoriteBorderIcon />}
                  sx={{ fontWeight: 800 }}
                  onClick={props.onFav}
                >
                  {t("detail.addToFavorites", "Favorilere Ekle")}
                </Button>
              </Stack>
            </Box>
          </Box>

          {/* Sağ: Kişi kartı (sticky sidebar) */}
          <Box
            sx={{
              flex: { xs: "1 1 auto", md: "0 0 320px" },
              width: { xs: "100%", md: 320 },
              position: { md: "sticky" as const },
              top: { md: 88 },
              alignSelf: { md: "flex-start" },
            }}
          >
            <OwnerCard name={props.ownerName} phone={props.ownerPhone} />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
