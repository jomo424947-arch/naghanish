import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@lib/utils';
export const EmptyState = ({ title = 'لا توجد بيانات للعرض', description = 'جرب تغيير خيارات البحث أو العودة لاحقاً لاستكشاف المزيد!', icon, actionLabel, onAction, className, }) => {
    return (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: cn('w-full p-8 sm:p-12 rounded-3xl bg-brand-card/70 border border-brand-cardBorder flex flex-col items-center justify-center text-center gap-4', className), children: [_jsx("div", { className: "w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-purple/20 via-brand-card to-brand-blue/20 border border-brand-purple/30 flex items-center justify-center text-brand-blue shadow-glow-blue", children: icon || _jsx(Inbox, { className: "w-10 h-10 text-brand-blue" }) }), _jsxs("div", { className: "max-w-md", children: [_jsx("h3", { className: "text-lg sm:text-xl font-extrabold text-white", children: title }), _jsx("p", { className: "text-xs sm:text-sm text-slate-400 font-medium mt-1", children: description })] }), actionLabel && onAction && (_jsx(Button, { variant: "secondary", size: "md", onClick: onAction, className: "mt-2", children: actionLabel }))] }));
};
