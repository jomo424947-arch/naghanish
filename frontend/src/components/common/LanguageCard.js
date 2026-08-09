import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@lib/utils';
export const LanguageCard = ({ name, nativeName, flag, dirText, selected = false, onClick, }) => {
    return (_jsxs(motion.button, { whileHover: { y: -4, scale: 1.02 }, whileTap: { scale: 0.98 }, type: "button", onClick: onClick, className: cn('w-full p-5 rounded-3xl transition-all duration-300 flex items-center justify-between text-left rtl:text-right border cursor-pointer', selected
            ? 'bg-gradient-to-r from-brand-purple/30 via-brand-card to-brand-blue/20 border-brand-blue shadow-glow-blue'
            : 'bg-brand-card/80 border-brand-cardBorder hover:border-slate-500 hover:bg-brand-card'), children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "text-4xl shrink-0 drop-shadow-md select-none", children: flag }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-white", children: nativeName }), _jsxs("p", { className: "text-xs text-slate-400 font-medium", children: [name, " \u2022 ", _jsx("span", { className: "text-brand-blue", children: dirText })] })] })] }), _jsx("div", { className: cn('w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-200', selected
                    ? 'bg-gradient-to-r from-brand-blue to-cyan-400 border-cyan-300 text-slate-950 shadow-glow-blue'
                    : 'border-slate-600 bg-transparent'), children: selected && _jsx(Check, { className: "w-4 h-4 stroke-[3]" }) })] }));
};
