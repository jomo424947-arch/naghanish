import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@lib/utils';
export const Skeleton = ({ variant = 'rectangular', width, height, className, style, ...props }) => {
    const variantStyles = {
        text: 'h-4 w-full rounded-md',
        circular: 'rounded-full shrink-0',
        card: 'rounded-3xl h-48 w-full',
        rectangular: 'rounded-2xl w-full',
    };
    return (_jsx("div", { className: cn('relative overflow-hidden bg-brand-cardBorder/40 animate-pulse', variantStyles[variant], className), style: {
            width,
            height,
            ...style,
        }, ...props, children: _jsx("div", { className: "absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" }) }));
};
