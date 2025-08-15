// src/presentation/components/molecules/PhotoUploadPreview.tsx
import { Stack, Avatar } from "@mui/material";
import AppFileButton from "../atoms/AppFileButton";
import { useTranslation } from "react-i18next";

interface Props {
  previewUrl: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PhotoUploadPreview({ previewUrl, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <AppFileButton label={t("photoUpload.upload", "Fotoğraf Yükle")} onChange={onChange} />
      {previewUrl && (
        <Avatar
          src={previewUrl}
          variant="rounded"
          sx={{ width: 64, height: 40 }}
        />
      )}
    </Stack>
  );
}
