import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { cn } from '@lib/utils';
export const AnimatedBackground = ({ variant = 'default', className, }) => {
    return (_jsxs("div", { className: cn('fixed inset-0 pointer-events-none overflow-hidden z-0 select-none', className), children: [_jsx("div", { className: "absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-purple/15 rounded-full blur-[140px]" }), _jsx(motion.div, { animate: {
                    x: [0, 40, -40, 0],
                    y: [0, -30, 30, 0],
                    scale: [1, 1.1, 0.9, 1],
                }, transition: { duration: 18, repeat: Infinity, ease: 'easeInOut' }, className: "absolute -top-20 -right-20 w-[450px] h-[450px] bg-brand-blue/20 rounded-full blur-[130px]" }), _jsx(motion.div, { animate: {
                    x: [0, -30, 30, 0],
                    y: [0, 40, -40, 0],
                    scale: [1, 0.95, 1.05, 1],
                }, transition: { duration: 22, repeat: Infinity, ease: 'easeInOut' }, className: "absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-brand-orange/15 rounded-full blur-[120px]" }), variant !== 'minimal' && (_jsx("div", { className: "absolute inset-0 opacity-[0.03]", style: {
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.8) 1px, transparent 0)`,
                    backgroundSize: '36px 36px',
                } })), variant === 'hero' && (_jsxs(_Fragment, { children: [_jsx(motion.div, { animate: { y: [0, -20, 0], opacity: [0.4, 0.9, 0.4] }, transition: { duration: 4, repeat: Infinity }, className: "absolute top-1/3 left-1/6 w-3 h-3 rounded-full bg-brand-blue shadow-glow-blue" }), _jsx(motion.div, { animate: { y: [0, 20, 0], opacity: [0.3, 0.8, 0.3] }, transition: { duration: 5, repeat: Infinity, delay: 1 }, className: "absolute bottom-1/3 right-1/4 w-4 h-4 rounded-full bg-brand-orange shadow-glow-orange" })] }))] }));
};
