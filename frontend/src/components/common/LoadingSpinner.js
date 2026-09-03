import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { cn } from '@lib/utils';
export const LoadingSpinner = ({ size = 'md', text, fullScreen = false, className, }) => {
    const sizeStyles = {
        sm: 'w-6 h-6 border-2',
        md: 'w-10 h-10 border-3',
        lg: 'w-16 h-16 border-4',
        xl: 'w-24 h-24 border-4',
    };
    const spinnerContent = (_jsxs("div", { className: cn('flex flex-col items-center justify-center gap-4 select-none', className), children: [_jsxs("div", { className: "relative flex items-center justify-center", children: [_jsx(motion.div, { animate: { scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }, transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }, className: cn('absolute rounded-full bg-gradient-to-tr from-brand-purple via-brand-blue to-cyan-300 blur-md', sizeStyles[size]) }), _jsx(motion.div, { animate: { rotate: 360 }, transition: { duration: 1.2, repeat: Infinity, ease: 'linear' }, className: cn('rounded-full border-t-transparent border-r-brand-blue border-b-brand-purple border-l-brand-orange shadow-lg', sizeStyles[size]) })] }), text && (_jsx(motion.p, { animate: { opacity: [0.6, 1, 0.6] }, transition: { duration: 1.5, repeat: Infinity }, className: "text-sm font-bold text-slate-300 tracking-wide", children: text }))] }));
    if (fullScreen) {
        return (_jsx("div", { className: "fixed inset-0 z-50 bg-brand-darkBg/90 backdrop-blur-md flex items-center justify-center", children: spinnerContent }));
    }
    return spinnerContent;
};
