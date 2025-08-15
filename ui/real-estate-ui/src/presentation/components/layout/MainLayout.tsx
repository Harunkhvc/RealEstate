import React from "react";
import Appbar from "./Appbar"; // Doğru path!
import { Box } from "@mui/material";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Appbar />
      <Box component="main">{children}</Box>
    </>
  );
}
