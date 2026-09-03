import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';
import { SectionTitle } from '@components/common/SectionTitle';
import { useAuthStore } from '@store/authStore';
import { useThemeStore } from '@store/themeStore';
import { cn } from '@lib/utils';
const LEADERBOARD = [
    { rank: 1, name: 'علي محمد', nameEn: 'Ali Mohamed', avatar: '🏆', xp: 8420, badge: 'Grandmaster' },
    { rank: 2, name: 'أحمد علي', nameEn: 'Ahmed Ali', avatar: '🧠', xp: 6250, badge: 'Master' },
    { rank: 3, name: 'يوسف أحمد', nameEn: 'Yousef Ahmed', avatar: '⚡', xp: 5180, badge: 'Expert' },
    { rank: 4, name: 'ليلى سعيد', nameEn: 'Layla Said', avatar: '🌟', xp: 4320, badge: 'Pro' },
    { rank: 5, name: 'سارة خالد', nameEn: 'Sara Khaled', avatar: '🎯', xp: 3900, badge: 'Pro' },
    { rank: 6, name: 'محمد فاروق', nameEn: 'Mohamed Farouk', avatar: '🦅', xp: 3410, badge: 'Player' },
    { rank: 7, name: 'رنا وليد', nameEn: 'Rana Walid', avatar: '🎮', xp: 2980, badge: 'Player' },
];
const RANK_STYLES = {
    1: { bg: 'from-amber-400/30 to-amber-600/10 border-amber-400/50', text: 'text-amber-300', icon: _jsx(Crown, { className: "w-5 h-5 text-amber-400" }) },
    2: { bg: 'from-slate-300/20 to-slate-500/10 border-slate-400/40', text: 'text-slate-200', icon: _jsx(Medal, { className: "w-5 h-5 text-slate-300" }) },
    3: { bg: 'from-amber-700/30 to-amber-900/10 border-amber-700/40', text: 'text-amber-600', icon: _jsx(Medal, { className: "w-5 h-5 text-amber-600" }) },
};
export const LeaderboardPage = () => {
    const { user } = useAuthStore();
    const { dir } = useThemeStore();
    return (_jsxs("div", { className: "flex flex-col gap-8 py-4", children: [_jsx(SectionTitle, { title: dir === 'rtl' ? 'لوحة الصدارة 🏆' : 'Leaderboard 🏆', subtitle: dir === 'rtl' ? 'المتنافسون الأوائل هذا الأسبوع' : 'Top competitors this week', icon: _jsx(Trophy, { className: "w-5 h-5" }), badgeText: dir === 'rtl' ? 'أسبوعي' : 'Weekly', badgeColor: "orange" }), _jsxs("div", { className: "p-5 rounded-3xl bg-gradient-to-r from-brand-purple/20 via-brand-card to-brand-blue/20 border border-brand-purple/50 flex items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-2xl shadow-glow", children: "\uD83E\uDDE0" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold text-slate-400", children: dir === 'rtl' ? 'ترتيبك الحالي' : 'Your Current Rank' }), _jsx("h3", { className: "text-xl font-black text-white", children: user?.name ?? 'أحمد علي' })] })] }), _jsxs("div", { className: "text-right rtl:text-right text-left", children: [_jsx("p", { className: "text-3xl font-black text-gradient-primary", children: "#2" }), _jsxs("p", { className: "text-xs font-bold text-brand-blue", children: [user?.xp ?? 6250, " XP"] })] })] }), _jsx("div", { className: "grid grid-cols-3 gap-3", children: [LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((player, podiumIdx) => {
                    const displayRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
                    const style = RANK_STYLES[displayRank];
                    const isCenter = podiumIdx === 1;
                    return (_jsxs(motion.div, { initial: { opacity: 0, y: isCenter ? -20 : 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: podiumIdx * 0.1 }, className: cn('flex flex-col items-center text-center gap-2 p-4 rounded-3xl bg-gradient-to-b border', style.bg, isCenter ? 'pt-6 pb-5' : 'pt-4 pb-4'), children: [style.icon, _jsx("div", { className: "text-3xl", children: player.avatar }), _jsx("p", { className: "text-xs font-extrabold text-white leading-tight", children: dir === 'rtl' ? player.name : player.nameEn }), _jsxs("p", { className: cn('text-[11px] font-black', style.text), children: [player.xp.toLocaleString(), " XP"] })] }, player.rank));
                }) }), _jsx("div", { className: "flex flex-col gap-2", children: LEADERBOARD.map((player, i) => {
                    const isMe = player.rank === 2;
                    const style = RANK_STYLES[player.rank];
                    return (_jsxs(motion.div, { initial: { opacity: 0, x: -12 }, animate: { opacity: 1, x: 0 }, transition: { delay: i * 0.05 }, className: cn('p-4 rounded-2xl flex items-center justify-between gap-4 border transition-all', isMe
                            ? 'bg-brand-purple/20 border-brand-purple/60 shadow-glow'
                            : 'bg-brand-card border-brand-cardBorder hover:border-slate-600'), children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: cn('w-8 text-center font-black text-sm', style ? style.text : 'text-slate-400'), children: style ? style.icon : `#${player.rank}` }), _jsx("div", { className: "w-10 h-10 rounded-xl bg-brand-darkBg flex items-center justify-center text-xl border border-brand-cardBorder", children: player.avatar }), _jsxs("div", { children: [_jsxs("p", { className: cn('font-bold text-sm', isMe ? 'text-brand-blue' : 'text-white'), children: [dir === 'rtl' ? player.name : player.nameEn, isMe && _jsx("span", { className: "ml-2 rtl:ml-0 rtl:mr-2 text-[10px] bg-brand-blue/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/30", children: "YOU" })] }), _jsx("p", { className: "text-[11px] text-slate-400 font-medium", children: player.badge })] })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(TrendingUp, { className: "w-3.5 h-3.5 text-emerald-400" }), _jsx("span", { className: "text-sm font-black text-white", children: player.xp.toLocaleString() }), _jsx("span", { className: "text-[10px] text-slate-400 font-bold", children: "XP" })] })] }, player.rank));
                }) })] }));
};
