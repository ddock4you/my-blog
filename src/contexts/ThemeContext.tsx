'use client';

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { resolveDarkModePreference } from '@/lib/theme';

export type ThemeContextValue = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 초기 다크모드 설정: 로컬스토리지 또는 시스템 선호도
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applyResolvedTheme = () => {
      const isDark = resolveDarkModePreference(
        localStorage.getItem('darkMode'),
        mediaQuery.matches
      );
      setIsDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    };

    applyResolvedTheme();
    const handleSystemChange = () => {
      if (localStorage.getItem('darkMode') === null) applyResolvedTheme();
    };
    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  const toggleDarkMode = useCallback(() => {
    const next = !document.documentElement.classList.contains('dark');
    localStorage.setItem('darkMode', String(next));
    document.documentElement.classList.toggle('dark', next);
    setIsDarkMode(next);
  }, []);

  const value = useMemo(() => ({ isDarkMode, toggleDarkMode }), [isDarkMode, toggleDarkMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
