import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { darkColors, lightColors, type ThemeColors } from './colors';
import type { ThemePreference } from '@/store/useAppStore';

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  preference: ThemePreference;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: lightColors,
  isDark: false,
  preference: 'light',
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const preference = useAppStore((s) => s.themePreference);
  const systemScheme = useColorScheme();

  const value = useMemo<ThemeContextValue>(() => {
    const isDark =
      preference === 'dark' || (preference === 'system' && systemScheme === 'dark');
    return {
      colors: isDark ? darkColors : lightColors,
      isDark,
      preference,
    };
  }, [preference, systemScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
