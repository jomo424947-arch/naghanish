import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@lib/utils';
export const Checkbox = forwardRef(({ label, checked, onChange, disabled, className, error, ...props }, ref) => {
    return (_jsxs("label", { className: cn('inline-flex items-center gap-3 select-none cursor-pointer group', disabled && 'opacity-50 cursor-not-allowed'), children: [_jsxs("div", { className: "relative flex items-center justify-center", children: [_jsx("input", { ref: ref, type: "checkbox", checked: checked, onChange: onChange, disabled: disabled, className: "sr-only peer", ...props }), _jsx(motion.div, { animate: {
                            scale: checked ? 1 : 0.95,
                            borderColor: checked ? '#7C3AED' : error ? '#EF4444' : '#2E2E54',
                        }, className: cn('w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200', checked ? 'bg-gradient-to-br from-brand-purple to-purple-700 shadow-glow' : 'bg-brand-card hover:border-slate-500', error && !checked && 'border-red-500'), children: checked && (_jsx(motion.div, { initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0, opacity: 0 }, transition: { type: 'spring', stiffness: 500, damping: 30 }, children: _jsx(Check, { className: "w-3.5 h-3.5 text-white stroke-[3]" }) })) })] }), label && (_jsx("span", { className: cn('text-xs sm:text-sm font-medium text-slate-300 group-hover:text-white transition-colors', className), children: label }))] }));
});
Checkbox.displayName = 'Checkbox';
