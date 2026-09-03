import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { cn } from '@lib/utils';
export const Input = forwardRef(({ leftIcon, rightIcon, error = false, fullWidth = true, className, wrapperClassName, disabled, ...props }, ref) => {
    return (_jsxs("div", { className: cn('relative flex items-center', fullWidth && 'w-full', wrapperClassName), children: [leftIcon && (_jsx("div", { className: "absolute left-4 rtl:left-auto rtl:right-4 text-slate-400 pointer-events-none z-10 flex items-center justify-center", children: leftIcon })), _jsx("input", { ref: ref, disabled: disabled, className: cn('w-full bg-brand-card/90 border rounded-2xl text-slate-100 placeholder-slate-500 text-sm font-medium transition-all duration-200 outline-none', 'py-3.5 px-4', leftIcon && 'pl-11 rtl:pl-4 rtl:pr-11', rightIcon && 'pr-11 rtl:pr-4 rtl:pl-11', error
                    ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                    : 'border-brand-cardBorder focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 hover:border-slate-600', disabled && 'opacity-50 cursor-not-allowed bg-brand-surface', className), ...props }), rightIcon && (_jsx("div", { className: "absolute right-4 rtl:right-auto rtl:left-4 text-slate-400 z-10 flex items-center justify-center", children: rightIcon }))] }));
});
Input.displayName = 'Input';
