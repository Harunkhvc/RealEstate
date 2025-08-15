import { Box, Typography, Stack, IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import PriceText from "../atoms/PriceText";

export default function PropertyHeader({
  title,
  priceText,
  onFav,
  onShare,
}: {
  title: string;
  priceText: string;
  onFav?: () => void;
  onShare?: () => void;
}) {
  return (
    <Box
      sx={{
        mb: 2,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h5" fontWeight={800} mb={0.5} sx={{ wordBreak: "break-word" }}>
          {title}
        </Typography>
        <PriceText value={priceText} />
      </Box>

      <Stack direction="row" spacing={1} flexShrink={0}>
        <IconButton color="primary" aria-label="Favorilere ekle" sx={{ bgcolor: "action.hover" }} onClick={onFav}>
          <FavoriteBorderIcon />
        </IconButton>
        <IconButton aria-label="Paylaş" sx={{ bgcolor: "action.hover" }} onClick={onShare}>
          <ShareIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}
