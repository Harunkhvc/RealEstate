import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Snackbar, Alert } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPropertyById, toggleFavorite } from "../../infrastructure/api-client/propertyApi";
import type { PropertyDetailDto } from "../../shared/types/property";
import PropertyDetailView from "../components/organisms/PropertyDetailView";
import { formatDateTR, formatMoney } from "../../shared/utils/format";
import { useTranslation } from "react-i18next";
import { currencyRates } from "../../shared/constants/currencyRates";
import { useCurrency } from "../../shared/context/CurrencyContext"; // ✅ eklendi

const FALLBACK_OWNER = { name: "İsa N.", phone: "0 (533) 374 40 26" };

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { currency: selectedCurrency } = useCurrency(); // ✅ context üzerinden anlık değer

  const [property, setProperty] = useState<PropertyDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    msg: string;
    severity: "success" | "error" | "info";
  }>({ open: false, msg: "", severity: "success" });

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setProperty(null);
    if (!id) return;

    fetchPropertyById(id, { signal: ctrl.signal })
      .then(setProperty)
      .catch(() => setProperty(null))
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!property) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <Typography color="error" variant="h6">
          {t("detail.notFound", { defaultValue: "İlan bulunamadı." })}
        </Typography>
      </Box>
    );
  }

  const images =
    property.photoUrls && property.photoUrls.length > 0
      ? property.photoUrls
      : property.thumbnailUrl
      ? [property.thumbnailUrl]
      : ["/no-image.jpg"];

  const ilanTarihi =
    i18n.language === "tr"
      ? formatDateTR(property.startDate)
      : new Date(property.startDate).toLocaleDateString("en-GB");

  // Döviz dönüşümü (property.currency -> TL -> selectedCurrency)
  const priceInTL = property.price * (currencyRates[property.currency] ?? 1);
  const convertedPrice =
    selectedCurrency === "TL"
      ? priceInTL
      : priceInTL / (currencyRates[selectedCurrency] ?? 1);

  const priceText = formatMoney(convertedPrice, selectedCurrency);

  const details = [
    { label: t("detail.labels.listingId", { defaultValue: "İlan No" }), value: property.id },
    { label: t("detail.labels.listingDate", { defaultValue: "İlan Tarihi" }), value: ilanTarihi },
    {
      label: t("detail.labels.propertyType", { defaultValue: "Emlak Tipi" }),
      value: `${property.propertyType} ${property.propertyStatus}`,
    },
    { label: t("detail.labels.grossM2", { defaultValue: "m² (Brüt)" }), value: property.m2Brut ?? t("common.notSpecified", { defaultValue: "Belirtilmemiş" }) },
    { label: t("detail.labels.netM2", { defaultValue: "m² (Net)" }), value: property.m2Net ?? t("common.notSpecified", { defaultValue: "Belirtilmemiş" }) },
    { label: t("detail.labels.roomCount", { defaultValue: "Oda Sayısı" }), value: property.roomCount ?? t("common.notSpecified", { defaultValue: "Belirtilmemiş" }) },
    { label: t("detail.labels.buildingAge", { defaultValue: "Bina Yaşı" }), value: property.buildingAge ?? t("common.notSpecified", { defaultValue: "Belirtilmemiş" }) },
    { label: t("detail.labels.floor", { defaultValue: "Kat" }), value: property.floor ?? t("common.notSpecified", { defaultValue: "Belirtilmemiş" }) },
    { label: t("detail.labels.address", { defaultValue: "Adres" }), value: property.address ?? t("common.notSpecified", { defaultValue: "Belirtilmemiş" }) },
  ];

  const canShowMap = property.latitude != null && property.longitude != null;
  const mapUrl = canShowMap
    ? `https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=16&output=embed`
    : undefined;

  return (
    <>
      <PropertyDetailView
        title={property.title}
        priceText={priceText}
        type={property.propertyType}
        status={property.propertyStatus}
        description={property.description}
        details={details}
        images={images}
        canShowMap={!!canShowMap}
        mapUrl={mapUrl}
        ownerName={property.ownerName ?? FALLBACK_OWNER.name}
        ownerPhone={property.ownerPhone ?? FALLBACK_OWNER.phone}
        galleryIndex={galleryIndex}
        onGalleryIndexChange={setGalleryIndex}
        onBack={() => navigate(-1)}
        onFav={async () => {
          try {
            await toggleFavorite(property.id);
            setSnackbar({
              open: true,
              msg: t("detail.addedToFavorites", { defaultValue: "Favorilere eklendi." }),
              severity: "success",
            });
            setTimeout(() => navigate("/favorites"), 500);
          } catch (err) {
            console.error("Favorilere ekleme hatası:", err);
            setSnackbar({
              open: true,
              msg: t("detail.addToFavoritesError", { defaultValue: "Favorilere eklenemedi." }),
              severity: "error",
            });
          }
        }}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </>
  );
}
