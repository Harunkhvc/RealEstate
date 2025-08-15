import React from "react";
import { Box, Typography, Tabs, Tab, Paper } from "@mui/material";
import ParamManagement from "../../components/organisms/ParamManagement";

// Tab key type
type ParamKey = "types" | "statuses" | "currencies";

const tabList: { label: string; tabKey: ParamKey }[] = [
  { label: "Tip Yönetimi", tabKey: "types" },
  { label: "Durum Yönetimi", tabKey: "statuses" },
  { label: "Döviz Yönetimi", tabKey: "currencies" },
];

export default function AdminPanelPage() {
  const [tab, setTab] = React.useState(0);

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 3, md: 5 },
        maxWidth: 780,
        mx: "auto",
        minHeight: 480,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          borderRadius: 4,
          p: { xs: 2, md: 4 },
          bgcolor: "#fff",
          boxShadow: "0 4px 32px 0 #1565c012",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={800}
          gutterBottom
          sx={{
            letterSpacing: 0.5,
            color: "#232d3b",
            mb: 3,
          }}
        >
          Parametre Yönetimi
        </Typography>
        <Box
          sx={{
            bgcolor: "#f5f7fb",
            borderRadius: 3,
            mb: 4,
            px: 2,
            py: 1.3,
            boxShadow: "0 2px 8px 0 #1565c008",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              "& .MuiTab-root": {
                fontWeight: 700,
                fontSize: 16,
                color: "#49546c",
                borderRadius: 2.5,
                mx: 0.5,
                px: 3,
                py: 1.1,
                minHeight: 44,
                transition: "all .13s cubic-bezier(.4,0,.2,1)",
              },
              "& .Mui-selected": {
                bgcolor: "#2196f310",
                color: "#1976d2",
                fontWeight: 900,
                boxShadow: "0 2px 12px 0 #1976d228",
              },
              "& .MuiTabs-indicator": {
                bgcolor: "#1976d2",
                height: 3,
                borderRadius: 1.5,
                bottom: 0,
              },
            }}
          >
            {tabList.map((t, i) => (
              <Tab key={i} label={t.label} disableRipple />
            ))}
          </Tabs>
        </Box>
        <Box sx={{ mt: 2 }}>
          <ParamManagement tabKey={tabList[tab].tabKey} />
        </Box>
      </Paper>
    </Box>
  );
}
