// src/presentation/components/atoms/AppTabs.tsx
import { Tabs } from "@mui/material";
import type { TabsProps } from "@mui/material";

export default function AppTabs(props: TabsProps) {
  return (
    <Tabs
      textColor="primary"
      indicatorColor="primary"
      sx={{ mb: 2, ...props.sx }}
      {...props}
    />
  );
}
