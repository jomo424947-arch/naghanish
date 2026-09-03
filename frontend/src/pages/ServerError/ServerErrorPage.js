import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { SEO } from '@components/common/SEO';
import { ROUTES } from '@constants/routes';
import { useThemeStore } from '@store/themeStore';
export function ServerErrorPage() {
    const navigate = useNavigate();
    const { dir } = useThemeStore();
    return (_jsxs("div", { className: "min-h-[75vh] flex items-center justify-center p-4", children: [_jsx(SEO, { title: "\u062E\u0637\u0623 \u0641\u064A \u0627\u0644\u0633\u064A\u0631\u0641\u0631 500 | \u0646\u063A\u0646\u0650\u0634", description: "\u062D\u062F\u062B \u062E\u0637\u0623 \u063A\u064A\u0631 \u0645\u062A\u0648\u0642\u0639 \u0641\u064A \u0627\u0644\u0633\u064A\u0631\u0641\u0631. \u0642\u0645\u0646\u0627 \u0628\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0644\u0644 \u0648\u062C\u0627\u0631\u064A \u0627\u0644\u0639\u0645\u0644 \u0639\u0644\u0649 \u0625\u0635\u0644\u0627\u062D\u0647." }), _jsxs(Card, { variant: "glowing", glowColor: "orange", className: "p-8 sm:p-12 max-w-lg w-full text-center flex flex-col items-center gap-6", children: [_jsx("div", { className: "w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500 to-amber-600 flex items-center justify-center text-4xl shadow-glow", children: _jsx(AlertTriangle, { className: "w-10 h-10 text-white" }) }), _jsxs("div", { children: [_jsx("span", { className: "px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black uppercase tracking-wider border border-rose-500/30", children: "Error 500" }), _jsx("h1", { className: "text-2xl sm:text-3xl font-black text-white mt-3", children: dir === 'rtl' ? 'عذراً! حدث خطأ في السيرفر 🤖' : 'Oops! Server Error 🤖' }), _jsx("p", { className: "text-sm text-slate-300 font-medium mt-2 leading-relaxed", children: dir === 'rtl'
                                    ? 'واجه النظام مشكلة مؤقتة أثناء معالجة طلبك. تم إبلاغ فريق الدعم وجاري الإصلاح.'
                                    : 'Our system encountered an unexpected issue. Our team has been notified.' })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 w-full", children: [_jsx(Button, { variant: "secondary", size: "md", fullWidth: true, onClick: () => window.location.reload(), leftIcon: _jsx(RotateCcw, { className: "w-4 h-4" }), children: dir === 'rtl' ? 'إعادة المحاولة' : 'Retry' }), _jsx(Button, { variant: "primary", size: "md", fullWidth: true, onClick: () => navigate(ROUTES.HOME), leftIcon: _jsx(Home, { className: "w-4 h-4" }), children: dir === 'rtl' ? 'الرئيسية' : 'Back Home' })] })] })] }));
}
