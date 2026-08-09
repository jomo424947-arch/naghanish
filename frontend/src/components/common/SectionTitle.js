import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@lib/utils';
export const SectionTitle = ({ title, subtitle, badgeText, badgeColor = 'purple', icon, action, className, }) => {
    const badgeColorStyles = {
        purple: 'bg-brand-purple/20 text-purple-300 border-purple-500/30',
        blue: 'bg-brand-blue/20 text-cyan-300 border-cyan-400/30',
        orange: 'bg-brand-orange/20 text-orange-300 border-orange-500/30',
        green: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        pink: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    };
    return (_jsxs("div", { className: cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6', className), children: [_jsxs("div", { className: "flex items-start gap-3", children: [icon && (_jsx("div", { className: "p-3 rounded-2xl bg-brand-card border border-brand-cardBorder text-brand-blue shrink-0 shadow-md", children: icon })), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2.5 flex-wrap", children: [_jsx("h2", { className: "text-xl sm:text-2xl font-extrabold text-white tracking-tight", children: title }), badgeText && (_jsx("span", { className: cn('px-2.5 py-0.5 rounded-full text-xs font-bold border', badgeColorStyles[badgeColor]), children: badgeText }))] }), subtitle && _jsx("p", { className: "text-xs sm:text-sm text-slate-400 font-medium mt-1", children: subtitle })] })] }), action && _jsx("div", { className: "shrink-0", children: action })] }));
};
