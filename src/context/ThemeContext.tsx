import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { ThemeMode, ThemeState } from '../types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage';

interface ThemeContextType extends ThemeState {
    setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function getSystemPreference(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyThemeClass(isDark: boolean): void {
    const root = document.documentElement;
    if (isDark) {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
}

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [mode, setMode] = useState<ThemeMode>(() => {
        const stored = getStorageItem<ThemeMode>(STORAGE_KEYS.THEME);
        return stored || 'system';
    });

    const [isDark, setIsDark] = useState<boolean>(() => {
        const stored = getStorageItem<ThemeMode>(STORAGE_KEYS.THEME) || 'system';
        return stored === 'system' ? getSystemPreference() : stored === 'dark';
    });

    useEffect(() => {
        const newIsDark = mode === 'system' ? getSystemPreference() : mode === 'dark';
        setIsDark(newIsDark);
        applyThemeClass(newIsDark);
    }, [mode]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            if (mode === 'system') {
                setIsDark(e.matches);
                applyThemeClass(e.matches);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [mode]);

    useEffect(() => {
        applyThemeClass(isDark);
    }, [isDark]);

    const setThemeMode = useCallback((newMode: ThemeMode) => {
        setMode(newMode);
        setStorageItem(STORAGE_KEYS.THEME, newMode);
    }, []);

    const value: ThemeContextType = {
        mode,
        isDark,
        setThemeMode,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}
