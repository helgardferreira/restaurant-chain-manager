import { createContext } from "react";

type Theme = "dark" | "light";
type ThemeOverride = Theme | "system";

type ThemeProviderState = {
  theme: Theme;
  themeOverride: ThemeOverride;
  setThemeOverride: (theme: ThemeOverride) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | null>(null);

export type { ThemeOverride, Theme, ThemeProviderState };

export { ThemeProviderContext };
