import { Theme, ThemeProviderContext } from "@/lib/theme-context";
import { useEffect, useState } from "react";
import { fromEvent, map, startWith } from "rxjs";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const sub = fromEvent<MediaQueryListEvent>(colorSchemeQuery, "change")
      .pipe(
        startWith(colorSchemeQuery),
        map(({ matches }) =>
          theme === "system" ? (matches ? "dark" : "light") : theme
        )
      )
      .subscribe((derivedTheme) => {
        // Remove existing theme classes
        root.classList.remove("light", "dark");
        root.classList.add(derivedTheme);
      });

    return () => {
      sub.unsubscribe();
    };
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
