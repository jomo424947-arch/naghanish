import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Gamepad2, Sparkles, Users, Trophy, User } from 'lucide-react';
import { AnimatedBackground } from '@components/common/AnimatedBackground';
import { Logo } from '@components/common/Logo';
import { ROUTES } from '@constants/routes';
import { useAuthStore } from '@store/authStore';
import { useThemeStore } from '@store/themeStore';
import { cn } from '@lib/utils';
const NAV_ITEMS = [
    { to: ROUTES.HOME, icon: Home, labelAr: 'الرئيسية', labelEn: 'Home' },
    { to: ROUTES.GAMES, icon: Gamepad2, labelAr: 'الألعاب', labelEn: 'Games' },
    { to: ROUTES.QUIZ_CENTER, icon: Sparkles, labelAr: 'الإختبارات', labelEn: 'Quizzes' },
    { to: ROUTES.PARTY, icon: Users, labelAr: 'بارتي', labelEn: 'Party' },
    { to: ROUTES.LEADERBOARD, icon: Trophy, labelAr: 'الصدارة', labelEn: 'Rank' },
    { to: ROUTES.PROFILE, icon: User, labelAr: 'الملف', labelEn: 'Profile' },
];
export function DashboardLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthStore();
    const { dir } = useThemeStore();
    return (_jsxs("div", { className: "relative min-h-screen bg-brand-darkBg text-slate-100 flex flex-col overflow-x-hidden", children: [_jsx(AnimatedBackground, { variant: "minimal" }), _jsx("header", { className: "hidden md:flex relative z-30 w-full bg-brand-surface/80 border-b border-brand-cardBorder backdrop-blur-xl sticky top-0", children: _jsxs("div", { className: "w-full max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6", children: [_jsx(Logo, { size: "sm", showTagline: false }), _jsx("nav", { className: "flex items-center gap-1", children: NAV_ITEMS.map(({ to, icon: Icon, labelAr, labelEn }) => (_jsxs(NavLink, { to: to, className: ({ isActive }) => cn('flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-200', isActive
                                    ? 'bg-brand-purple/20 text-white border border-brand-purple/50 shadow-glow'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'), children: [_jsx(Icon, { className: "w-4 h-4" }), _jsx("span", { children: dir === 'rtl' ? labelAr : labelEn })] }, to))) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { onClick: () => navigate(ROUTES.STORE), className: "flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-brand-card border border-brand-cardBorder text-xs font-bold cursor-pointer hover:border-amber-400/50 transition-colors", children: [_jsx("span", { className: "text-amber-400", children: "\u26A1" }), _jsx("span", { className: "text-slate-100", children: user?.coins ?? 2350 })] }), _jsx("button", { onClick: () => navigate(ROUTES.PROFILE), className: "w-9 h-9 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-lg shadow-glow hover:scale-105 transition-transform", children: "\uD83E\uDDE0" })] })] }) }), _jsx("main", { className: "relative z-10 flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 pb-28 md:pb-8 pt-4", children: _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 }, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }, children: _jsx(Outlet, {}) }, location.pathname) }) }), _jsx("nav", { className: "md:hidden fixed bottom-0 inset-x-0 z-40 bg-brand-surface/95 backdrop-blur-xl border-t border-brand-cardBorder safe-area-inset-bottom", children: _jsx("div", { className: "flex items-center justify-around px-2 py-1.5", children: NAV_ITEMS.map(({ to, icon: Icon, labelAr, labelEn }) => (_jsx(NavLink, { to: to, className: ({ isActive }) => cn('flex flex-col items-center gap-0.5 px-2 py-1 rounded-2xl transition-all duration-200 min-w-[48px]', isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'), children: ({ isActive }) => (_jsxs(_Fragment, { children: [_jsx("div", { className: cn('w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-200', isActive
                                        ? 'bg-gradient-to-br from-brand-purple to-brand-blue shadow-glow'
                                        : 'bg-transparent'), children: _jsx(Icon, { className: cn('w-4 h-4', isActive ? 'text-white' : 'text-slate-500') }) }), _jsx("span", { className: cn('text-[9px] font-bold', isActive ? 'text-brand-blue' : 'text-slate-500'), children: dir === 'rtl' ? labelAr : labelEn })] })) }, to))) }) })] }));
}
