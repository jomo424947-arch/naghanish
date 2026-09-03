import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Bell, CheckCheck } from 'lucide-react';
import { SectionTitle } from '@components/common/SectionTitle';
import { Button } from '@components/common/Button';
import { useThemeStore } from '@store/themeStore';
import { cn } from '@lib/utils';
const NOTIFICATIONS = [
    { id: 'n1', icon: '🏆', title: 'تجاوزت المرتبة الثانية!', titleEn: 'You passed rank #2!', time: '5 دقائق', timeEn: '5m ago', read: false, color: 'text-amber-400' },
    { id: 'n2', icon: '🎉', title: 'دعوة من ليلى للعب بارتي نايت', titleEn: 'Layla invited you to Party Night', time: '15 دقيقة', timeEn: '15m ago', read: false, color: 'text-brand-blue' },
    { id: 'n3', icon: '⚡', title: 'تحدي اليوم جاهز: +250 XP', titleEn: "Today's challenge ready: +250 XP", time: 'منذ ساعة', timeEn: '1h ago', read: true, color: 'text-orange-400' },
    { id: 'n4', icon: '🧠', title: 'أكملت إنجاز "عقل حاد"!', titleEn: 'Achievement "Sharp Mind" unlocked!', time: 'أمس', timeEn: 'Yesterday', read: true, color: 'text-purple-400' },
];
export const NotificationsPage = () => {
    const { dir } = useThemeStore();
    const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;
    return (_jsxs("div", { className: "flex flex-col gap-8 py-4", children: [_jsx(SectionTitle, { title: dir === 'rtl' ? 'الإشعارات 🔔' : 'Notifications 🔔', subtitle: dir === 'rtl' ? `${unreadCount} غير مقروءة` : `${unreadCount} unread`, icon: _jsx(Bell, { className: "w-5 h-5" }), action: _jsx(Button, { variant: "ghost", size: "sm", leftIcon: _jsx(CheckCheck, { className: "w-4 h-4" }), children: dir === 'rtl' ? 'قراءة الكل' : 'Mark all read' }) }), _jsx("div", { className: "flex flex-col gap-2", children: NOTIFICATIONS.map(notif => (_jsxs("div", { className: cn('p-4 rounded-3xl flex items-center gap-4 border transition-all', notif.read
                        ? 'bg-brand-card/60 border-brand-cardBorder opacity-70'
                        : 'bg-brand-card border-brand-purple/40 shadow-glow'), children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-brand-darkBg border border-brand-cardBorder flex items-center justify-center text-2xl shrink-0", children: notif.icon }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: cn('font-bold text-sm', notif.read ? 'text-slate-400' : 'text-white'), children: dir === 'rtl' ? notif.title : notif.titleEn }), _jsx("p", { className: "text-[11px] text-slate-500 font-medium mt-0.5", children: dir === 'rtl' ? notif.time : notif.timeEn })] }), !notif.read && (_jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-brand-blue shadow-glow-blue shrink-0" }))] }, notif.id))) })] }));
};
