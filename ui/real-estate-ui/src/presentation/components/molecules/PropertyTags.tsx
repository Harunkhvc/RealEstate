import { Chip, Stack } from "@mui/material";

export default function PropertyTags({
  type,
  status,
}: {
  type: string;
  status: string;
}) {
  const isSale = status.toLowerCase().includes("satılık");
  return (
    <Stack direction="row" spacing={1.2} mb={2} sx={{ flexWrap: "wrap" }}>
      <Chip
        label={type}
        variant="outlined"
        sx={{ borderColor: "#cfe8ff", bgcolor: "#eef6ff", fontWeight: 700, letterSpacing: 0.2 }}
      />
      <Chip
        label={status}
        variant="outlined"
        sx={{
          borderColor: isSale ? "#c7f3dd" : "#ffe7c2",
          bgcolor: isSale ? "#edfdf4" : "#fff6e6",
          fontWeight: 700,
          letterSpacing: 0.2,
        }}
      />
    </Stack>
  );
}
