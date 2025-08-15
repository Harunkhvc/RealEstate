import { Typography } from "@mui/material";

export default function PriceText({ value }: { value: string }) {
  return (
    <Typography
      variant="h4"
      fontWeight={900}
      sx={{
        lineHeight: 1.1,
        background: "linear-gradient(90deg, #1565c0, #26a69a)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {value}
    </Typography>
  );
}
