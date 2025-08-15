import { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress, Box } from "@mui/material";
import { getLiveRate } from "../../../infrastructure/api-client/currencyApi";

interface LiveCurrencyCardProps {
  code: string; // USD, EUR vb.
}

export default function LiveCurrencyCard({ code }: LiveCurrencyCardProps) {
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getLiveRate(code)
      .then(data => setRate(data.rate))
      .catch(() => setRate(null))
      .finally(() => setLoading(false));
  }, [code]);

  return (
    <Card sx={{ minWidth: 200, textAlign: "center" }}>
      <CardContent>
        <Typography variant="h6">{code} / TRY</Typography>
        {loading ? (
          <Box display="flex" justifyContent="center"><CircularProgress size={20} /></Box>
        ) : (
          <Typography variant="h5" color="primary">
            {rate !== null ? rate.toFixed(2) : "Veri yok"}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
