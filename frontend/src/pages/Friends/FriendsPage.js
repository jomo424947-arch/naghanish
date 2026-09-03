import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Users, UserPlus, Search } from 'lucide-react';
import { SectionTitle } from '@components/common/SectionTitle';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import { useThemeStore } from '@store/themeStore';
const FRIENDS = [
    { id: 'f1', name: 'ليلى سعيد', nameEn: 'Layla Said', avatar: '🌟', level: 8, online: true },
    { id: 'f2', name: 'يوسف أحمد', nameEn: 'Yousef Ahmed', avatar: '⚡', level: 15, online: true },
    { id: 'f3', name: 'سارة خالد', nameEn: 'Sara Khaled', avatar: '🎯', level: 6, online: false },
];
export const FriendsPage = () => {
    const { dir } = useThemeStore();
    return (_jsxs("div", { className: "flex flex-col gap-8 py-4", children: [_jsx(SectionTitle, { title: dir === 'rtl' ? 'الأصدقاء 👥' : 'Friends 👥', subtitle: dir === 'rtl' ? `${FRIENDS.filter(f => f.online).length} متصلون الآن` : `${FRIENDS.filter(f => f.online).length} online now`, icon: _jsx(Users, { className: "w-5 h-5" }), action: _jsx(Button, { variant: "secondary", size: "sm", leftIcon: _jsx(UserPlus, { className: "w-4 h-4" }), children: dir === 'rtl' ? 'إضافة صديق' : 'Add Friend' }) }), _jsx(Input, { leftIcon: _jsx(Search, { className: "w-4 h-4" }), placeholder: dir === 'rtl' ? 'ابحث عن أصدقائك...' : 'Search friends...' }), _jsx("div", { className: "flex flex-col gap-3", children: FRIENDS.map(friend => (_jsxs("div", { className: "p-4 rounded-3xl bg-brand-card border border-brand-cardBorder flex items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-brand-darkBg border border-brand-cardBorder flex items-center justify-center text-2xl", children: friend.avatar }), _jsx("div", { className: `absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-brand-card ${friend.online ? 'bg-emerald-400' : 'bg-slate-500'}` })] }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-white text-sm", children: dir === 'rtl' ? friend.name : friend.nameEn }), _jsxs("p", { className: "text-[11px] text-slate-400 font-medium", children: ["Level ", friend.level, " \u2022 ", friend.online ? (dir === 'rtl' ? 'متصل الآن' : 'Online') : (dir === 'rtl' ? 'غير متصل' : 'Offline')] })] })] }), _jsx(Button, { variant: "outline", size: "sm", children: dir === 'rtl' ? 'تحدّ' : 'Challenge' })] }, friend.id))) })] }));
};
