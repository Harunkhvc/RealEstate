// src/presentation/components/organisms/ImageGallery.tsx
import { Box, IconButton, Stack } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ImageThumb from "../atoms/ImageThumb";
import { useTranslation } from "react-i18next";

export default function ImageGallery({
  images,
  index,
  onIndexChange,
}: {
  images: string[];
  index: number;
  onIndexChange: (i: number) => void;
}) {
  const { t } = useTranslation();
  const current = images[index] ?? "/no-image.jpg";

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          borderRadius: 3,
          overflow: "hidden",
          mb: 1,
          border: "1px solid #eef2f7",
          aspectRatio: "4/3",
          background: "#f7f9fc",
        }}
      >
        <img
          src={current}
          alt={t("gallery.mainAlt", "İlan görseli")}
          loading="lazy"
          onError={(e) => ((e.currentTarget as HTMLImageElement).src = "/no-image.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />

        <IconButton
          onClick={() => onIndexChange(Math.max(index - 1, 0))}
          disabled={index === 0}
          aria-label={t("gallery.prev", "Önceki görsel")}
          sx={{
            position: "absolute",
            top: "50%",
            left: 8,
            transform: "translateY(-50%)",
            bgcolor: "rgba(255,255,255,0.9)",
            "&:hover": { bgcolor: "rgba(255,255,255,1)" },
            boxShadow: 2,
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton
          onClick={() => onIndexChange(Math.min(index + 1, images.length - 1))}
          disabled={index === images.length - 1}
          aria-label={t("gallery.next", "Sonraki görsel")}
          sx={{
            position: "absolute",
            top: "50%",
            right: 8,
            transform: "translateY(-50%)",
            bgcolor: "rgba(255,255,255,0.9)",
            "&:hover": { bgcolor: "rgba(255,255,255,1)" },
            boxShadow: 2,
          }}
        >
          <ChevronRightIcon />
        </IconButton>

        <Box
          sx={{
            position: "absolute",
            bottom: 8,
            right: 10,
            px: 1.25,
            py: 0.5,
            borderRadius: 2,
            bgcolor: "rgba(0,0,0,0.55)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {index + 1} / {images.length}
        </Box>
      </Box>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="center"
        mt={2}
        sx={{ flexWrap: "wrap" }}
      >
        {images.map((img, idx) => (
          <ImageThumb
            key={idx}
            src={img}
            alt={t("gallery.thumbAlt", "Küçük önizleme {{n}}", { n: idx + 1 })}
            active={idx === index}
            onClick={() => onIndexChange(idx)}
          />
        ))}
      </Stack>
    </Box>
  );
}
