import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Search as SearchIcon, Brain, Zap, Users, Trophy } from 'lucide-react';
import { SectionTitle } from '@components/common/SectionTitle';
import { Input } from '@components/common/Input';
import { EmptyState } from '@components/common/EmptyState';
import { useThemeStore } from '@store/themeStore';
const SEARCH_ITEMS = [
    { type: 'game', icon: '🧠', name: 'Memory Cards', nameAr: 'بطاقات الذاكرة' },
    { type: 'game', icon: '⚡', name: 'Reaction Test', nameAr: 'اختبار ردة الفعل' },
    { type: 'player', icon: '🌟', name: 'Layla Said', nameAr: 'ليلى سعيد' },
    { type: 'player', icon: '🏆', name: 'Ali Mohamed', nameAr: 'علي محمد' },
    { type: 'category', icon: '🎮', name: 'Party Games', nameAr: 'ألعاب البارتي' },
];
export const SearchPage = () => {
    const { dir } = useThemeStore();
    const [query, setQuery] = useState('');
    const filtered = query
        ? SEARCH_ITEMS.filter(i => i.name.toLowerCase().includes(query.toLowerCase()) ||
            i.nameAr.includes(query))
        : [];
    return (_jsxs("div", { className: "flex flex-col gap-8 py-4", children: [_jsx(SectionTitle, { title: dir === 'rtl' ? 'البحث 🔍' : 'Search 🔍', subtitle: dir === 'rtl' ? 'ابحث عن ألعاب ولاعبين وتصنيفات' : 'Find games, players and categories' }), _jsx(Input, { leftIcon: _jsx(SearchIcon, { className: "w-4 h-4" }), placeholder: dir === 'rtl' ? 'ابحث عن أي شيء...' : 'Search anything...', value: query, onChange: e => setQuery(e.target.value), autoFocus: true }), query && filtered.length === 0 && (_jsx(EmptyState, { title: dir === 'rtl' ? 'لا توجد نتائج' : 'No Results Found', description: dir === 'rtl' ? `لا توجد نتائج لـ "${query}"` : `No results for "${query}"` })), filtered.length > 0 && (_jsx("div", { className: "flex flex-col gap-2", children: filtered.map((item, i) => (_jsxs("div", { className: "p-4 rounded-2xl bg-brand-card border border-brand-cardBorder flex items-center gap-4 hover:border-brand-blue/50 transition-all cursor-pointer", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-brand-darkBg flex items-center justify-center text-xl", children: item.icon }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-white text-sm", children: dir === 'rtl' ? item.nameAr : item.name }), _jsx("p", { className: "text-[11px] text-slate-400 capitalize font-medium", children: item.type })] })] }, i))) })), !query && (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsx("p", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider", children: dir === 'rtl' ? 'تصفح حسب الفئة' : 'Browse by Category' }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: [
                            { label: dir === 'rtl' ? 'ألعاب ذهنية' : 'Brain Games', icon: _jsx(Brain, { className: "w-5 h-5" }), color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
                            { label: dir === 'rtl' ? 'سرعة البديهة' : 'Speed Reflex', icon: _jsx(Zap, { className: "w-5 h-5" }), color: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30' },
                            { label: dir === 'rtl' ? 'بارتي نايت' : 'Party Night', icon: _jsx(Users, { className: "w-5 h-5" }), color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
                            { label: dir === 'rtl' ? 'الصدارة' : 'Leaderboard', icon: _jsx(Trophy, { className: "w-5 h-5" }), color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
                        ].map(cat => (_jsxs("button", { className: `flex items-center gap-3 p-4 rounded-2xl border font-bold text-sm transition-all hover:scale-105 ${cat.color}`, children: [cat.icon, cat.label] }, cat.label))) })] }))] }));
};
