import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@lib/utils';
export const Button = ({ children, variant = 'primary', size = 'md', isLoading = false, fullWidth = false, leftIcon, rightIcon, className, disabled, ...props }) => {
    const variantStyles = {
        primary: 'bg-gradient-to-r from-brand-purpleDark via-brand-purple to-purple-600 text-white shadow-glow hover:shadow-purple-500/50 border border-purple-500/30',
        secondary: 'bg-gradient-to-r from-cyan-500 via-brand-blue to-sky-400 text-slate-950 font-bold shadow-glow-blue hover:shadow-cyan-400/50 border border-cyan-300/40', // Brighter electric blue
        accent: 'bg-gradient-to-r from-brand-orange to-amber-500 text-white shadow-glow-orange hover:shadow-amber-500/50 border border-orange-400/30',
        outline: 'border-2 border-brand-cardBorder bg-brand-card/40 text-slate-200 hover:bg-brand-card hover:border-brand-purple/60 hover:text-white',
        ghost: 'bg-transparent text-slate-300 hover:bg-white/10 hover:text-white',
        danger: 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-md hover:shadow-red-500/30',
    };
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5 font-medium',
        md: 'px-5 py-2.5 text-sm rounded-2xl gap-2 font-semibold',
        lg: 'px-7 py-3.5 text-base rounded-2xl gap-2.5 font-bold',
        xl: 'px-8 py-4 text-lg rounded-3xl gap-3 font-bold',
    };
    return (_jsx(motion.button, { whileTap: { scale: disabled || isLoading ? 1 : 0.96 }, whileHover: { scale: disabled || isLoading ? 1 : 1.02 }, transition: { type: 'spring', stiffness: 400, damping: 25 }, disabled: disabled || isLoading, className: cn('inline-flex items-center justify-center transition-all duration-200 select-none outline-none focus:ring-2 focus:ring-brand-purple/50 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer', variantStyles[variant], sizeStyles[size], fullWidth ? 'w-full' : '', className), ...props, children: isLoading ? (_jsx(Loader2, { className: "w-5 h-5 animate-spin" })) : (_jsxs(_Fragment, { children: [leftIcon && _jsx("span", { className: "inline-flex shrink-0", children: leftIcon }), children && _jsx("span", { children: children }), rightIcon && _jsx("span", { className: "inline-flex shrink-0", children: rightIcon })] })) }));
};
