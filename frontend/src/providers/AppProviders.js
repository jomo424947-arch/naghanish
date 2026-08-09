import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import { useThemeStore } from '@store/themeStore';
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});
export function AppProviders({ children }) {
    const { theme, language } = useThemeStore();
    useEffect(() => {
        // Initialize Theme class on document root
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        if (theme === 'system') {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.add(systemDark ? 'dark' : 'light');
        }
        else {
            root.classList.add(theme);
        }
        // Initialize Direction and Language
        const dir = language === 'ar' ? 'rtl' : 'ltr';
        root.dir = dir;
        root.lang = language;
    }, [theme, language]);
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(MotionConfig, { reducedMotion: "user", children: children }) }));
}
