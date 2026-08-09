import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Trophy, Users, Zap, Check } from 'lucide-react';
import { AuthLayout } from '@components/layout/AuthLayout';
import { Button } from '@components/common/Button';
import { ROUTES } from '@constants/routes';
import { useAuthStore } from '@store/authStore';
import { useThemeStore } from '@store/themeStore';
export const NotificationPermissionPage = () => {
    const navigate = useNavigate();
    const { completeOnboarding } = useAuthStore();
    const { setNotificationsEnabled, dir } = useThemeStore();
    const handleEnable = () => {
        setNotificationsEnabled(true);
        completeOnboarding();
        navigate(ROUTES.HOME);
    };
    const handleSkip = () => {
        setNotificationsEnabled(false);
        completeOnboarding();
        navigate(ROUTES.HOME);
    };
    return (_jsx(AuthLayout, { title: dir === 'rtl' ? 'التنبيهات والإشعارات 🔔' : 'Stay Updated 🔔', subtitle: dir === 'rtl' ? 'لا تفوّت التحديات اليومية ودعوات الأصدقاء في غرف اللعب!' : 'Never miss daily challenges, rewards and party invites!', showBackButton: true, children: _jsxs("div", { className: "p-6 sm:p-8 rounded-3xl bg-brand-card/90 border border-brand-cardBorder shadow-2xl backdrop-blur-xl flex flex-col items-center gap-6", children: [_jsx(motion.div, { animate: { rotate: [0, -10, 10, -10, 0] }, transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }, className: "w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-purple via-indigo-600 to-brand-blue flex items-center justify-center text-white shadow-glow-blue border-4 border-brand-card", children: _jsx(Bell, { className: "w-12 h-12 text-cyan-300" }) }), _jsxs("div", { className: "w-full flex flex-col gap-3", children: [_jsxs("div", { className: "p-3.5 rounded-2xl bg-brand-darkBg/60 border border-brand-cardBorder flex items-center gap-3", children: [_jsx("div", { className: "p-2 rounded-xl bg-orange-500/20 text-orange-400 shrink-0", children: _jsx(Zap, { className: "w-5 h-5" }) }), _jsxs("div", { className: "text-right rtl:text-right text-left", children: [_jsx("h4", { className: "text-xs font-bold text-white", children: dir === 'rtl' ? 'التحديات اليومية' : 'Daily Challenges' }), _jsx("p", { className: "text-[11px] text-slate-400", children: dir === 'rtl' ? 'تنبيهات فورية عند تجديد التحديات واكتساب XP' : 'Instant notifications for new daily rewards' })] })] }), _jsxs("div", { className: "p-3.5 rounded-2xl bg-brand-darkBg/60 border border-brand-cardBorder flex items-center gap-3", children: [_jsx("div", { className: "p-2 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0", children: _jsx(Users, { className: "w-5 h-5" }) }), _jsxs("div", { className: "text-right rtl:text-right text-left", children: [_jsx("h4", { className: "text-xs font-bold text-white", children: dir === 'rtl' ? 'دعوات بارتي نايت' : 'Party Room Invites' }), _jsx("p", { className: "text-[11px] text-slate-400", children: dir === 'rtl' ? 'إشعارات عند دعوة أصدقائك لك للانضمام للغرف' : 'Get notified when friends invite you to play' })] })] }), _jsxs("div", { className: "p-3.5 rounded-2xl bg-brand-darkBg/60 border border-brand-cardBorder flex items-center gap-3", children: [_jsx("div", { className: "p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0", children: _jsx(Trophy, { className: "w-5 h-5" }) }), _jsxs("div", { className: "text-right rtl:text-right text-left", children: [_jsx("h4", { className: "text-xs font-bold text-white", children: dir === 'rtl' ? 'لائحة المتصدرين' : 'Leaderboard Updates' }), _jsx("p", { className: "text-[11px] text-slate-400", children: dir === 'rtl' ? 'إشعار عند تجاوز أحد المنافسين لترتيبك' : 'Alerts when players beat your high scores' })] })] })] }), _jsxs("div", { className: "w-full flex flex-col gap-3 mt-2", children: [_jsx(Button, { variant: "primary", size: "lg", fullWidth: true, onClick: handleEnable, leftIcon: _jsx(Check, { className: "w-5 h-5" }), className: "shadow-glow", children: dir === 'rtl' ? 'تفعيل الإشعارات 🔔' : 'Enable Notifications 🔔' }), _jsx("button", { type: "button", onClick: handleSkip, className: "text-xs font-bold text-slate-400 hover:text-white transition-colors py-2", children: dir === 'rtl' ? 'ليس الآن' : 'Maybe Later' })] })] }) }));
};
