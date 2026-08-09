import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { Input } from './Input';
import { cn } from '@lib/utils';
export const TextField = forwardRef(({ label, helperText, errorMessage, required, id, className, wrapperClassName, ...inputProps }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    return (_jsxs("div", { className: cn('flex flex-col gap-1.5 w-full', wrapperClassName), children: [label && (_jsxs("label", { htmlFor: inputId, className: "text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1", children: [label, required && _jsx("span", { className: "text-brand-orange font-bold", children: "*" })] })), _jsx(Input, { ref: ref, id: inputId, error: !!errorMessage, className: className, ...inputProps }), errorMessage ? (_jsx("p", { className: "text-xs font-medium text-red-400 mt-0.5 animate-fadeIn", children: errorMessage })) : helperText ? (_jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: helperText })) : null] }));
});
TextField.displayName = 'TextField';
