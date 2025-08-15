// src/presentation/components/molecules/OwnerCard.tsx
import { Paper, Typography, Stack, Button, Box } from "@mui/material";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import EmailIcon from "@mui/icons-material/Email";
import { useTranslation } from "react-i18next";

export default function OwnerCard({
  name,
  phone,
  onMessage,
}: {
  name: string;
  phone: string;
  onMessage?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        position: "relative",
        bgcolor: "#fafcff",
        border: "1px solid",
        borderColor: "primary.100",
        boxShadow: "0 8px 24px rgba(21,101,192,0.08)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: "linear-gradient(90deg, #1565c0, #26a69a)",
        }}
      />
      <Typography variant="subtitle1" fontWeight={800} mt={0.5}>
        {name}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={1}>
        {t("owner.title", "İlan sahibi")}
      </Typography>

      <Stack direction="column" gap={1.2}>
        <Button
          startIcon={<PhoneAndroidIcon />}
          variant="outlined"
          fullWidth
          sx={{
            fontWeight: 700,
            borderWidth: 2,
            "&:hover": { borderWidth: 2 },
            py: 1.1,
          }}
          href={`tel:${phone.replace(/\D/g, "")}`}
        >
          {phone}
        </Button>
        <Button
          startIcon={<EmailIcon />}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ fontWeight: 700, py: 1.1 }}
          onClick={onMessage}
        >
          {t("owner.sendMessage", "Mesaj Gönder")}
        </Button>
      </Stack>
    </Paper>
  );
}
