import {
  Theme,
  ThemeOverride,
  ThemeProviderContext,
} from "@/lib/theme-context";
import { useEffect, useRef, useState } from "react";
import { fromEvent, map, startWith } from "rxjs";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemeOverride;
  storageKey?: string;
};

const usePrefersDarkMode = (themeOverride: ThemeOverride = "system") => {
  const colorSchemeQueryRef = useRef(
    window.matchMedia("(prefers-color-scheme: dark)")
  );
  const [theme, setTheme] = useState<Theme>(
    colorSchemeQueryRef.current ? "dark" : "light"
  );

  useEffect(() => {
    const sub = fromEvent<MediaQueryListEvent>(
      colorSchemeQueryRef.current,
      "change"
    )
      .pipe(
        startWith(colorSchemeQueryRef.current),
        map(({ matches }) =>
          themeOverride === "system"
            ? matches
              ? "dark"
              : "light"
            : themeOverride
        )
      )
      .subscribe((theme) => {
        setTheme(theme);
      });

    return () => {
      sub.unsubscribe();
    };
  }, [themeOverride]);

  return theme;
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "dashboard-theme",
  ...props
}: ThemeProviderProps) {
  const [themeOverride, setThemeOverride] = useState<ThemeOverride>(
    () => (localStorage.getItem(storageKey) as ThemeOverride) || defaultTheme
  );
  const rootRef = useRef(window.document.documentElement);

  const theme = usePrefersDarkMode(themeOverride);

  useEffect(() => {
    rootRef.current.classList.remove("light", "dark");
    rootRef.current.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    themeOverride,
    setThemeOverride: (themeOverride: ThemeOverride) => {
      localStorage.setItem(storageKey, themeOverride);
      setThemeOverride(themeOverride);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
