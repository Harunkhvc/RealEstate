import { Card, CardMedia, CardContent, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LikeButton from "../atoms/LikeButton";
import { useCurrency } from "../../../shared/context/CurrencyContext";
import { useTranslation } from "react-i18next";

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const symbols: Record<string, string> = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export default function PropertyCard({
  id, title, price, location, image,
  isFavorite, onToggleFavorite
}: PropertyCardProps) {
  const navigate = useNavigate();
  const { currency } = useCurrency();
  const { t, i18n } = useTranslation();

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
        }
      }}
    >
      {/* ATOM: LikeButton */}
      <Box sx={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}>
        <LikeButton liked={isFavorite} onClick={onToggleFavorite} />
      </Box>
      <CardMedia
        component="img"
        height="180"
        image={image}
        alt={title}
        sx={{
          cursor: "pointer",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)"
          }
        }}
        onClick={() => navigate(`/property/${id}`)}
      />
      <CardContent sx={{ background: "linear-gradient(180deg, #ffffff, #f9f9f9)" }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={1}>
          {location}
        </Typography>
        <Typography variant="h6" color="primary" fontWeight={700} mb={1}>
          {symbols[currency]}{" "}
          {price.toLocaleString(i18n.language === "tr" ? "tr-TR" : "en-US")}
        </Typography>
        <Box textAlign="right">
          <Button
            variant="contained"
            size="small"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 2,
              py: 0.5,
              background: "linear-gradient(90deg, #1976d2, #42a5f5)",
              boxShadow: "0 2px 8px rgba(25, 118, 210, 0.4)",
              "&:hover": {
                background: "linear-gradient(90deg, #1565c0, #1e88e5)",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.6)"
              }
            }}
            onClick={() => navigate(`/property/${id}`)}
          >
            {t("property.detailButton")}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
