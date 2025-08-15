// src/theme/ColorModeProvider.tsx
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

type Mode = "light" | "dark";
interface ColorModeCtx { mode: Mode; toggle: () => void; }

const ColorModeContext = createContext<ColorModeCtx>({ mode: "light", toggle: () => {} });
export const useColorMode = () => useContext(ColorModeContext);

function getInitialMode(): Mode {
  try {
    const saved = localStorage.getItem("admin-color-mode") as Mode | null;
    if (saved === "light" || saved === "dark") return saved;
  } catch {}
  // sistem tercihi
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export default function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(getInitialMode);

  const toggle = () => {
    setMode((m) => {
      const next = m === "light" ? "dark" : "light";
      try { localStorage.setItem("admin-color-mode", next); } catch {}
      return next;
    });
  };

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary: { main: "#1976d2" },
        secondary: { main: "#673ab7" },
        background: {
          default: mode === "dark" ? "#1e2230" : "#f4f6fa",
          paper:   mode === "dark" ? "#232636" : "#ffffff",
        },
      },
      shape: { borderRadius: 14 },
      typography: {
        fontFamily: ['Inter', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'].join(","),
        h5: { fontWeight: 800, letterSpacing: 0.3 },
        button: { textTransform: "none", fontWeight: 700 },
      },
      components: {
        MuiPaper: {
          styleOverrides: {
            root: ({ theme }) => ({
              border: `1px solid ${theme.palette.divider}`,
            }),
          },
        },
      },
    });
  }, [mode]);

  const value = useMemo(() => ({ mode, toggle }), [mode]);

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
