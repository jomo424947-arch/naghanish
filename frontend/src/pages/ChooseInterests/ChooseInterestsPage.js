import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles, Users, Cpu, Layers, Zap, Palette, Smile, Heart, Award, ArrowRight, ArrowLeft } from 'lucide-react';
import { AuthLayout } from '@components/layout/AuthLayout';
import { InterestCard } from '@components/common/InterestCard';
import { Button } from '@components/common/Button';
import { useAuthStore } from '@store/authStore';
import { useThemeStore } from '@store/themeStore';
const INTEREST_CATEGORIES = [
    {
        id: 'brain',
        title: 'Brain Games',
        titleArabic: 'ألعاب ذهنية',
        subtitle: 'Train your brain',
        subtitleArabic: 'تحديات ذكاء',
        icon: _jsx(Brain, { className: "w-6 h-6 text-purple-300" }),
        color: 'purple',
    },
    {
        id: 'personality',
        title: 'Personality',
        titleArabic: 'اختبارات شخصية',
        subtitle: 'Discover yourself',
        subtitleArabic: 'حلل شخصيتك',
        icon: _jsx(Sparkles, { className: "w-6 h-6 text-cyan-300" }),
        color: 'cyan',
    },
    {
        id: 'party',
        title: 'Party Games',
        titleArabic: 'بارتي نايت',
        subtitle: 'Multiplayer fun',
        subtitleArabic: 'لعب مع الأصدقاء',
        icon: _jsx(Users, { className: "w-6 h-6 text-orange-300" }),
        color: 'orange',
    },
    {
        id: 'logic',
        title: 'Logic Puzzles',
        titleArabic: 'تحديات المنطق',
        subtitle: 'Solve & win',
        subtitleArabic: 'ألغاز منطقية',
        icon: _jsx(Cpu, { className: "w-6 h-6 text-amber-300" }),
        color: 'yellow',
    },
    {
        id: 'memory',
        title: 'Memory Cards',
        titleArabic: 'اختبار الذاكرة',
        subtitle: 'Match cards',
        subtitleArabic: 'قوة الملاحظة',
        icon: _jsx(Layers, { className: "w-6 h-6 text-emerald-300" }),
        color: 'green',
    },
    {
        id: 'speed',
        title: 'Speed Reflex',
        titleArabic: 'سرعة البديهة',
        subtitle: 'Fast reactions',
        subtitleArabic: 'رد فعل سريع',
        icon: _jsx(Zap, { className: "w-6 h-6 text-cyan-300" }),
        color: 'blue',
    },
    {
        id: 'creativity',
        title: 'Creativity',
        titleArabic: 'الابتكار والفن',
        subtitle: 'Draw & guess',
        subtitleArabic: 'إبداع ورسم',
        icon: _jsx(Palette, { className: "w-6 h-6 text-pink-300" }),
        color: 'pink',
    },
    {
        id: 'fun',
        title: 'Fun & Trivia',
        titleArabic: 'مرح وتسلية',
        subtitle: 'Pop culture',
        subtitleArabic: 'معلومات عامة',
        icon: _jsx(Smile, { className: "w-6 h-6 text-orange-300" }),
        color: 'orange',
    },
    {
        id: 'relationships',
        title: 'Relationships',
        titleArabic: 'العلاقات والأصدقاء',
        subtitle: 'Match test',
        subtitleArabic: 'توافق واختبارات',
        icon: _jsx(Heart, { className: "w-6 h-6 text-pink-300" }),
        color: 'pink',
    },
    {
        id: 'achievements',
        title: 'Challenges',
        titleArabic: 'التحديات اليومية',
        subtitle: 'Daily XP',
        subtitleArabic: 'نقاط وجوائز',
        icon: _jsx(Award, { className: "w-6 h-6 text-amber-300" }),
        color: 'yellow',
    },
];
export const ChooseInterestsPage = () => {
    const navigate = useNavigate();
    const { selectedInterests, toggleInterest } = useAuthStore();
    const { dir } = useThemeStore();
    const count = selectedInterests.length;
    const handleContinue = () => {
        navigate('/profile-setup');
    };
    return (_jsx(AuthLayout, { title: dir === 'rtl' ? 'اختر اهتماماتك 🎯' : 'Choose Your Interests 🎯', subtitle: dir === 'rtl'
            ? 'اختر المواضيع التي تفضلها لنخصص تجربتك وألعابك'
            : "Select the topics you love, we'll personalize your experience", showBackButton: true, children: _jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3 rounded-2xl bg-brand-card/90 border border-brand-cardBorder text-xs font-bold", children: [_jsx("span", { className: "text-slate-300", children: dir === 'rtl' ? 'الاهتمامات المختارة:' : 'Selected Topics:' }), _jsxs("span", { className: "px-3 py-1 rounded-full bg-brand-purple/20 text-brand-blue border border-cyan-400/30", children: [count, " / ", INTEREST_CATEGORIES.length] })] }), _jsx("div", { className: "grid grid-cols-2 gap-3.5 sm:gap-4 max-h-[420px] overflow-y-auto pr-1", children: INTEREST_CATEGORIES.map((cat) => {
                        const isSelected = selectedInterests.includes(cat.id);
                        return (_jsx(InterestCard, { id: cat.id, title: dir === 'rtl' ? cat.titleArabic : cat.title, subtitle: dir === 'rtl' ? cat.subtitleArabic : cat.subtitle, icon: cat.icon, color: cat.color, selected: isSelected, onClick: () => toggleInterest(cat.id) }, cat.id));
                    }) }), _jsx(Button, { variant: "primary", size: "lg", fullWidth: true, onClick: handleContinue, disabled: count === 0, rightIcon: dir === 'rtl' ? _jsx(ArrowLeft, { className: "w-5 h-5" }) : _jsx(ArrowRight, { className: "w-5 h-5" }), className: "shadow-glow", children: dir === 'rtl' ? 'متابعة' : 'Continue' })] }) }));
};
