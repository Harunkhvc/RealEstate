// src/presentation/pages/admin/ParamManagementPage.tsx

import { Box, Typography } from "@mui/material";
import ParamManagement from "../../components/organisms/ParamManagement";

// Eğer ParamKey'i başka yerden import etmiyorsan buraya ekle:
type ParamKey = "types" | "statuses" | "currencies";

// Burada tip ekliyoruz!
interface ParamManagementPageProps {
  tabKey: ParamKey;
}

export default function ParamManagementPage({ tabKey }: ParamManagementPageProps) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={800} mb={3}>
        Parametre Yönetimi
      </Typography>
      <ParamManagement tabKey={tabKey} />
    </Box>
  );
}
