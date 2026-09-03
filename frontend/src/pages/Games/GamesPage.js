import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Star, Play } from 'lucide-react';
import { SectionTitle } from '@components/common/SectionTitle';
import { Card } from '@components/common/Card';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import { SEO } from '@components/common/SEO';
import { AdSlot } from '@components/common/AdSlot';
import { ROUTES } from '@constants/routes';
import { useThemeStore } from '@store/themeStore';
const GAMES = [
    { id: 'g1', title: 'Memory Cards', titleAr: 'بطاقات الذاكرة', category: 'Memory', icon: '🃏', color: 'from-purple-600 to-indigo-700', plays: '45.2k', stars: 4.9, isNew: false },
    { id: 'g2', title: 'Reaction Test', titleAr: 'اختبار ردة الفعل', category: 'Speed', icon: '⚡', color: 'from-cyan-500 to-blue-600', plays: '32.1k', stars: 4.7, isNew: true },
    { id: 'g3', title: 'Math Challenge', titleAr: 'تحدي الرياضيات', category: 'Brain', icon: '🧮', color: 'from-green-500 to-emerald-700', plays: '28.4k', stars: 4.8, isNew: false },
    { id: 'g4', title: 'Color Rush', titleAr: 'سباق الألوان', category: 'Speed', icon: '🎨', color: 'from-pink-500 to-rose-600', plays: '19.3k', stars: 4.6, isNew: true },
    { id: 'g5', title: 'Word Search', titleAr: 'البحث عن الكلمات', category: 'Logic', icon: '🔤', color: 'from-amber-500 to-orange-600', plays: '22.7k', stars: 4.5, isNew: false },
    { id: 'g6', title: 'Pattern Master', titleAr: 'سيد الأنماط', category: 'Brain', icon: '🧩', color: 'from-brand-purple to-purple-800', plays: '15.8k', stars: 4.8, isNew: true },
];
const CATEGORIES = ['All', 'Brain', 'Memory', 'Speed', 'Logic'];
export const GamesPage = () => {
    const navigate = useNavigate();
    const { dir } = useThemeStore();
    const [selected, setSelected] = React.useState('All');
    const [search, setSearch] = React.useState('');
    const filtered = GAMES.filter(g => (selected === 'All' || g.category === selected) &&
        (g.title.toLowerCase().includes(search.toLowerCase()) || g.titleAr.includes(search)));
    return (_jsxs("div", { className: "flex flex-col gap-8 py-4", children: [_jsx(SEO, { title: "\u0627\u0644\u0623\u0644\u0639\u0627\u0628 \u0627\u0644\u0630\u0647\u0646\u064A\u0629 | \u0646\u063A\u0646\u0650\u0634", description: "\u062A\u062D\u062F\u064E \u0623\u0635\u062F\u0642\u0627\u0621\u0643 \u0648\u0642\u0648\u0650\u0651 \u0642\u062F\u0631\u0627\u062A\u0643 \u0627\u0644\u0630\u0647\u0646\u064A\u0629 \u0648\u0633\u0631\u0639\u0629 \u0628\u062F\u064A\u0647\u062A\u0643 \u0645\u0639 \u0623\u0644\u0639\u0627\u0628 \u0646\u063A\u0646\u0650\u0634 \u0627\u0644\u062A\u0641\u0627\u0639\u0644\u064A\u0629.", keywords: ['ألعاب ذهنية', 'العاب ذاكرة', 'اختبار سرعة', 'العاب نغنش'] }), _jsx(SectionTitle, { title: dir === 'rtl' ? 'الألعاب الذهنية 🎮' : 'Brain Games 🎮', subtitle: dir === 'rtl' ? 'اختر لعبتك المفضلة وابدأ التحدي' : 'Choose your game and start the challenge', badgeText: `${GAMES.length}`, badgeColor: "blue" }), _jsx("div", { className: "flex items-center gap-3", children: _jsx(Input, { leftIcon: _jsx(Search, { className: "w-4 h-4" }), placeholder: dir === 'rtl' ? 'ابحث عن لعبة...' : 'Search games...', value: search, onChange: e => setSearch(e.target.value), className: "flex-1" }) }), _jsx("div", { className: "flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none", children: CATEGORIES.map(cat => (_jsx("button", { onClick: () => setSelected(cat), className: `shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 border ${selected === cat
                        ? 'bg-brand-purple/20 border-brand-purple text-white shadow-glow'
                        : 'bg-brand-card border-brand-cardBorder text-slate-400 hover:text-white hover:border-slate-500'}`, children: cat }, cat))) }), _jsx(AdSlot, { variant: "in-feed", slotId: "ad-games-page" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: filtered.map((game, i) => (_jsx(motion.div, { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.06, duration: 0.35 }, children: _jsxs(Card, { variant: "glowing", isInteractive: true, padding: "none", className: "overflow-hidden group", children: [_jsxs("div", { className: `relative h-28 bg-gradient-to-br ${game.color} flex items-center justify-center text-5xl`, children: [game.icon, game.isNew && (_jsx("span", { className: "absolute top-3 right-3 rtl:right-auto rtl:left-3 px-2 py-0.5 rounded-full bg-brand-orange text-white text-[10px] font-black shadow", children: "NEW" }))] }), _jsxs("div", { className: "p-4 flex flex-col gap-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-extrabold text-white text-base", children: dir === 'rtl' ? game.titleAr : game.title }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx("span", { className: "text-[11px] font-bold text-slate-400", children: game.category }), _jsx("span", { className: "text-slate-600", children: "\u2022" }), _jsxs("span", { className: "text-[11px] font-bold text-slate-400", children: [game.plays, " ", dir === 'rtl' ? 'لاعب' : 'plays'] }), _jsx(Star, { className: "w-3 h-3 text-amber-400 fill-amber-400 ml-auto rtl:ml-0 rtl:mr-auto" }), _jsx("span", { className: "text-[11px] font-bold text-amber-300", children: game.stars })] })] }), _jsx(Button, { variant: "primary", size: "sm", fullWidth: true, leftIcon: _jsx(Play, { className: "w-3.5 h-3.5 fill-current" }), onClick: () => navigate(`${ROUTES.GAMES}/${game.id}`), children: dir === 'rtl' ? 'العب الآن' : 'Play Now' })] })] }) }, game.id))) })] }));
};
