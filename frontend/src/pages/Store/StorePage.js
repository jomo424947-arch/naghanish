import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ShoppingBag, Zap } from 'lucide-react';
import { SectionTitle } from '@components/common/SectionTitle';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { useAuthStore } from '@store/authStore';
import { useThemeStore } from '@store/themeStore';
const ITEMS = [
    { id: 'i1', name: 'قفص الذكاء الخارق', nameEn: 'Super Brain Frame', icon: '💎', price: 500, type: 'frame', owned: false },
    { id: 'i2', name: 'تأثير النجوم', nameEn: 'Star Effect', icon: '⭐', price: 300, type: 'effect', owned: true },
    { id: 'i3', name: 'شارة الأسطورة', nameEn: 'Legend Badge', icon: '🏅', price: 800, type: 'badge', owned: false },
    { id: 'i4', name: 'خلفية الكون', nameEn: 'Galaxy Background', icon: '🌌', price: 1200, type: 'bg', owned: false },
    { id: 'i5', name: 'إيموجي مخصص', nameEn: 'Custom Emoji Pack', icon: '🎭', price: 400, type: 'emoji', owned: true },
    { id: 'i6', name: 'درع الانتصار', nameEn: 'Victory Shield', icon: '🛡️', price: 650, type: 'badge', owned: false },
];
export const StorePage = () => {
    const { user } = useAuthStore();
    const { dir } = useThemeStore();
    return (_jsxs("div", { className: "flex flex-col gap-8 py-4", children: [_jsx(SectionTitle, { title: dir === 'rtl' ? 'متجر نغانيش 🛍️' : 'Naghanish Store 🛍️', subtitle: dir === 'rtl' ? 'اشترِ عناصر حصرية وميّز ملفك الشخصي' : 'Get exclusive items and customize your profile', icon: _jsx(ShoppingBag, { className: "w-5 h-5" }), action: _jsxs("div", { className: "flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-card border border-brand-cardBorder text-sm font-black", children: [_jsx(Zap, { className: "w-4 h-4 text-amber-400" }), _jsx("span", { className: "text-white", children: user?.coins ?? 2350 }), _jsx("span", { className: "text-slate-400 text-xs", children: "Coins" })] }) }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4", children: ITEMS.map((item) => (_jsxs(Card, { variant: "glowing", glowColor: "orange", className: "flex flex-col items-center text-center gap-3 p-5", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-brand-darkBg border border-brand-cardBorder flex items-center justify-center text-3xl", children: item.icon }), _jsxs("div", { children: [_jsx("h4", { className: "font-extrabold text-white text-sm leading-tight", children: dir === 'rtl' ? item.name : item.nameEn }), _jsx("p", { className: "text-[10px] text-slate-400 font-medium capitalize mt-0.5", children: item.type })] }), item.owned ? (_jsx("span", { className: "px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30", children: dir === 'rtl' ? 'مملوك ✓' : 'Owned ✓' })) : (_jsx(Button, { variant: "accent", size: "sm", leftIcon: _jsx(Zap, { className: "w-3.5 h-3.5" }), children: item.price }))] }, item.id))) })] }));
};
