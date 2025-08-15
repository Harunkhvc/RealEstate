import { Card, Typography, Box } from "@mui/material";
import type { ReactNode } from "react";

interface StatWidgetProps {
  label: string;
  count: number | string;
  icon?: ReactNode;
  iconColor?: string; // İster mavi ister başka accent için
  bgColor?: string;   // İcon kutusunun arka planı
}

export default function StatWidget({
  label,
  count,
  icon,
  iconColor = "#2196f3",
  bgColor = "rgba(33,150,243,0.10)"
}: StatWidgetProps) {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2.5,
        borderRadius: 3,
        boxShadow: "0 4px 32px 0 #2196f333",
        minWidth: 220,
        transition: "transform 0.17s, box-shadow 0.17s",
        bgcolor: "#232536",
        "&:hover": {
          transform: "translateY(-2px) scale(1.04)",
          boxShadow: "0 8px 36px 0 #2196f344"
        },
      }}
    >
      <Box
        sx={{
          mr: 2.2,
          bgcolor: bgColor,
          p: 1.7,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 44,
          minHeight: 44,
          boxShadow: "0 1.5px 8px 0 #2196f333"
        }}
      >
        {/* Icon canlı renkte */}
        {icon &&
          <Box sx={{ color: iconColor, fontSize: 28, display: "flex" }}>
            {icon}
          </Box>
        }
      </Box>
      <Box>
        <Typography
          variant="subtitle2"
          sx={{
            color: "#a2a8cc",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.6,
            fontSize: 15,
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: "#fff",
            fontWeight: 800,
            fontSize: 28,
            lineHeight: 1.22,
            mt: 0.7
          }}
        >
          {count}
        </Typography>
      </Box>
    </Card>
  );
}
