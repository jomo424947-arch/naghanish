import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, forwardRef } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { TextField } from './TextField';
export const PasswordField = forwardRef(({ showStrengthMeter = false, value, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const toggleVisibility = () => {
        setShowPassword((prev) => !prev);
    };
    // Basic password strength calculation
    const getStrength = (pass) => {
        if (!pass)
            return 0;
        let score = 0;
        if (pass.length >= 6)
            score += 1;
        if (pass.length >= 10)
            score += 1;
        if (/[A-Z]/.test(pass))
            score += 1;
        if (/[0-9]/.test(pass))
            score += 1;
        if (/[^A-Za-z0-9]/.test(pass))
            score += 1;
        return score;
    };
    const passwordStr = typeof value === 'string' ? value : '';
    const strength = getStrength(passwordStr);
    return (_jsxs("div", { className: "w-full flex flex-col gap-1.5", children: [_jsx(TextField, { ref: ref, type: showPassword ? 'text' : 'password', leftIcon: _jsx(Lock, { className: "w-4 h-4" }), rightIcon: _jsx("button", { type: "button", onClick: toggleVisibility, tabIndex: -1, className: "text-slate-400 hover:text-white transition-colors focus:outline-none p-1", "aria-label": showPassword ? 'Hide password' : 'Show password', children: showPassword ? _jsx(EyeOff, { className: "w-4 h-4" }) : _jsx(Eye, { className: "w-4 h-4" }) }), value: value, ...props }), showStrengthMeter && passwordStr.length > 0 && (_jsx("div", { className: "flex items-center gap-1.5 mt-1", children: [1, 2, 3, 4, 5].map((level) => (_jsx("div", { className: `h-1.5 flex-1 rounded-full transition-all duration-300 ${level <= strength
                        ? strength <= 2
                            ? 'bg-red-500'
                            : strength <= 3
                                ? 'bg-amber-400'
                                : 'bg-emerald-400 shadow-glow-blue'
                        : 'bg-brand-cardBorder'}` }, level))) }))] }));
});
PasswordField.displayName = 'PasswordField';
