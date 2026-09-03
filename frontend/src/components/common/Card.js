import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { cn } from '@lib/utils';
export const Card = ({ children, variant = 'default', glowColor = 'purple', isInteractive = false, className, padding = 'md', ...props }) => {
    const paddingStyles = {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };
    const variantStyles = {
        default: 'bg-brand-card/95 border border-brand-cardBorder text-slate-100 shadow-xl',
        glowing: `bg-brand-card border border-slate-700/60 shadow-lg ${glowColor === 'purple'
            ? 'hover:border-brand-purple/60 hover:shadow-glow'
            : glowColor === 'blue' || glowColor === 'cyan'
                ? 'hover:border-brand-blue/70 hover:shadow-glow-blue'
                : 'hover:border-brand-orange/70 hover:shadow-glow-orange'}`,
        glass: 'glass-panel text-slate-100 shadow-2xl backdrop-blur-xl border border-white/10',
        gradient: 'bg-gradient-to-br from-brand-card via-[#1E1E3D] to-[#14142B] border border-purple-500/20 text-slate-100',
        bordered: 'bg-brand-surface border-2 border-brand-cardBorder hover:border-slate-500 text-slate-100',
    };
    return (_jsx(motion.div, { whileHover: isInteractive ? { y: -5, scale: 1.015 } : undefined, whileTap: isInteractive ? { scale: 0.98 } : undefined, transition: { type: 'spring', stiffness: 350, damping: 25 }, className: cn('rounded-3xl transition-all duration-300 relative overflow-hidden', paddingStyles[padding], variantStyles[variant], isInteractive && 'cursor-pointer select-none', className), ...props, children: children }));
};
