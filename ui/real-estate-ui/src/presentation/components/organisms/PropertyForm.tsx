// src/presentation/components/organisms/PropertyForm.tsx
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Stack } from "@mui/material";
import AppTextField from "../atoms/AppTextField";
import AppButton from "../atoms/AppButton";
import CoordinatesFields from "../molecules/CoordinatesFields";
import PropertyMetaSelects from "../molecules/PropertyMetaSelects";
import PriceAndDates from "../molecules/PriceAndDates";
import PhotoUploadPreview from "../molecules/PhotoUploadPreview";
import {
  PROPERTY_TYPE_OPTIONS,
  PROPERTY_STATUS_OPTIONS,
  CURRENCY_OPTIONS,
} from "../../../shared/constants/options";
import { useTranslation } from "react-i18next";

interface PropertyFormProps {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function PropertyForm({ initialData = {}, onSave, onCancel }: PropertyFormProps) {
  const { t } = useTranslation();

  const [data, setData] = useState<any>({
    title: "",
    description: "",
    address: "",
    latitude: "",
    longitude: "",
    propertyTypeId: PROPERTY_TYPE_OPTIONS[0].value,
    propertyStatusId: PROPERTY_STATUS_OPTIONS[0].value,
    currencyId: CURRENCY_OPTIONS[0].value,
    price: "",
    startDate: "",
    endDate: "",
    photoUrls: [],
    ...initialData,
  });

  const [photoPreview, setPhotoPreview] = useState<string>(initialData?.photoUrls?.[0] || "");

  useEffect(() => {
    if (initialData && initialData.id) {
      setData((prev: any) => ({
        ...prev,
        ...initialData,
        startDate: initialData.startDate ? initialData.startDate.substring(0, 10) : "",
        endDate: initialData.endDate ? initialData.endDate.substring(0, 10) : "",
        latitude: initialData.latitude || "",
        longitude: initialData.longitude || "",
        address: initialData.address || "",
        photoUrls: initialData.photoUrls || [],
      }));
      setPhotoPreview(initialData?.photoUrls?.[0] || "");
    }
  }, [initialData?.id]);

  const toShortDate = (val: string) => (val ? (val.length > 10 ? val.substring(0, 10) : val) : "");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setData((prev: any) => ({ ...prev, photoUrls: [url] }));
      setPhotoPreview(url);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const postData: any = {
      title: data.title,
      description: data.description,
      address: data.address || undefined,
      latitude: data.latitude ? Number(data.latitude) : undefined,
      longitude: data.longitude ? Number(data.longitude) : undefined,
      propertyTypeId: Number(data.propertyTypeId),
      propertyStatusId: Number(data.propertyStatusId),
      currencyId: Number(data.currencyId),
      price: Number(data.price),
      startDate: toShortDate(data.startDate),
      endDate: data.endDate ? toShortDate(data.endDate) : null,
      photoUrls: data.photoUrls || [],
    };
    if (initialData?.id) postData.id = initialData.id;
    onSave(postData);
  };

  return (
    <Dialog open onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData?.id ? t("propertyForm.updateTitle", "Emlak Güncelle") : t("propertyForm.createTitle", "Yeni Emlak")}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <AppTextField
              label={t("propertyForm.title", "Başlık")}
              name="title"
              value={data.title}
              onChange={handleChange}
              fullWidth
              required
            />
            <AppTextField
              label={t("propertyForm.description", "Açıklama")}
              name="description"
              value={data.description}
              onChange={handleChange}
              fullWidth
              required
              multiline
              minRows={2}
            />
            <AppTextField
              label={t("propertyForm.address", "Adres")}
              name="address"
              value={data.address}
              onChange={handleChange}
              fullWidth
            />

            <CoordinatesFields latitude={data.latitude} longitude={data.longitude} onChange={handleChange} />

            <PropertyMetaSelects
              typeId={data.propertyTypeId}
              statusId={data.propertyStatusId}
              currencyId={data.currencyId}
              onChange={handleChange}
            />

            <PriceAndDates price={data.price} startDate={data.startDate} endDate={data.endDate} onChange={handleChange} />

            <PhotoUploadPreview previewUrl={photoPreview} onChange={handlePhotoChange} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <AppButton variant="text" onClick={onCancel} label={t("actions.cancel", "İptal")} />
          <AppButton type="submit" variant="contained" label={t("actions.save", "Kaydet")} />
        </DialogActions>
      </form>
    </Dialog>
  );
}
