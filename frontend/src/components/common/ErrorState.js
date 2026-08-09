import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@lib/utils';
export const ErrorState = ({ title = 'حدث خطأ غير متوقع', message = 'تعذر تحميل البيانات المطلوب عرضها. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.', onRetry, retryLabel = 'إعادة المحاولة', className, }) => {
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: cn('w-full p-8 sm:p-10 rounded-3xl bg-red-950/20 border border-red-500/40 flex flex-col items-center justify-center text-center gap-4 shadow-xl', className), children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center shadow-lg", children: _jsx(AlertTriangle, { className: "w-8 h-8" }) }), _jsxs("div", { className: "max-w-md", children: [_jsx("h3", { className: "text-lg font-extrabold text-white", children: title }), _jsx("p", { className: "text-xs sm:text-sm text-red-200/80 font-medium mt-1", children: message })] }), onRetry && (_jsx(Button, { variant: "outline", size: "md", onClick: onRetry, leftIcon: _jsx(RefreshCw, { className: "w-4 h-4" }), className: "border-red-500/40 text-red-300 hover:bg-red-500/20 hover:text-white", children: retryLabel }))] }));
};
