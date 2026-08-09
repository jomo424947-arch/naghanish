import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { cn } from '@lib/utils';
export const ProgressIndicator = ({ currentStep, totalSteps, variant = 'dots', showLabels = false, className, }) => {
    const percentage = Math.min(Math.max((currentStep / totalSteps) * 100, 0), 100);
    if (variant === 'bar') {
        return (_jsxs("div", { className: cn('w-full flex flex-col gap-2', className), children: [showLabels && (_jsxs("div", { className: "flex items-center justify-between text-xs font-bold text-slate-400", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { className: "text-brand-blue", children: [currentStep, " / ", totalSteps] })] })), _jsx("div", { className: "w-full h-3 rounded-full bg-brand-cardBorder overflow-hidden p-0.5 border border-white/5", children: _jsx(motion.div, { initial: { width: 0 }, animate: { width: `${percentage}%` }, transition: { duration: 0.5, ease: 'easeOut' }, className: "h-full rounded-full bg-gradient-to-r from-brand-purple via-brand-blue to-cyan-400 shadow-glow-blue" }) })] }));
    }
    return (_jsx("div", { className: cn('flex items-center justify-center gap-2 select-none', className), children: Array.from({ length: totalSteps }).map((_, index) => {
            const isActive = index === currentStep - 1;
            const isCompleted = index < currentStep - 1;
            return (_jsx(motion.div, { animate: {
                    width: isActive ? 28 : 10,
                    backgroundColor: isActive
                        ? '#00D2FF'
                        : isCompleted
                            ? '#7C3AED'
                            : '#2E2E54',
                }, transition: { duration: 0.3 }, className: "h-2.5 rounded-full cursor-pointer shadow-sm" }, index));
        }) }));
};
