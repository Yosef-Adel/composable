import { useMemo, useState, useEffect, createContext, useContext } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import "./types";
import { lightPalette, darkPalette } from "./core/palette";
import { shadows } from "./core/shadows";
import { customShadows } from "./core/custom-shadows";
import { typography } from "./core/typography";
import { components } from "./core/components";

type ColorMode = "light" | "dark";

interface ThemeContextType {
  mode: ColorMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  forcedMode?: ColorMode; // <-- Added
}

export function ThemeProvider({ children, forcedMode }: ThemeProviderProps) {
  const [mode, setMode] = useState<ColorMode>(() => {
    const saved = localStorage.getItem("theme-mode");
    return (saved as ColorMode) || "light";
  });

  // Only persist mode if user-not-forced
  useEffect(() => {
    if (!forcedMode) {
      localStorage.setItem("theme-mode", mode);
    }
  }, [mode, forcedMode]);

  // Compute real mode (Storybook toolbar wins)
  const effectiveMode = forcedMode ?? mode;

  // Disable toggle when Storybook controls theme
  const toggleTheme = () => {
    if (forcedMode) return;
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: effectiveMode === "light" ? lightPalette : darkPalette,
        shadows: shadows(effectiveMode),
        shape: { borderRadius: 8 },
        typography,
        customShadows: customShadows(effectiveMode),
        components,
      }),
    [effectiveMode],
  );

  return (
    <ThemeContext.Provider value={{ mode: effectiveMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
