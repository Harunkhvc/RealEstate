import { Box, Typography } from "@mui/material";

export default function InfoItem({
  label,
  value,
  minWidth = 170,
}: {
  label: string;
  value: string | number;
  minWidth?: number;
}) {
  return (
    <Box sx={{ minWidth }}>
      <Typography variant="body2" color="#6b7280" fontWeight={600}>
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={800}>
        {value}
      </Typography>
    </Box>
  );
}
