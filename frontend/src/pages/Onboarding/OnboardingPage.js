import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Users, Brain, Trophy, Sparkles } from 'lucide-react';
import { Button } from '@components/common/Button';
import { ProgressIndicator } from '@components/common/ProgressIndicator';
import { AnimatedBackground } from '@components/common/AnimatedBackground';
import { ROUTES } from '@constants/routes';
import { useThemeStore } from '@store/themeStore';
const SLIDES = [
    {
        id: 1,
        title: 'Play Together',
        titleArabic: 'العب مع أصدقائك',
        description: 'Play fun games with your friends and the community in real-time party rooms.',
        descriptionArabic: 'انضم لغرف اللعب الجماعية وتحدّ أصدقائك في أجواء مليئة بالحماس والمرح!',
        icon: _jsx(Users, { className: "w-16 h-16 text-cyan-300" }),
        color: 'from-purple-600 via-indigo-600 to-brand-blue',
        badge: '1/3',
    },
    {
        id: 2,
        title: 'Challenge Your Brain',
        titleArabic: 'تحدّ عقلك وذكائك',
        description: 'Sharpen your mind with hundreds of interactive games, logic puzzles and quizzes.',
        descriptionArabic: 'طوّر مهاراتك الذهنية والمنطقية مع مئات التحديات والاختبارات الممتعة يومياً.',
        icon: _jsx(Brain, { className: "w-16 h-16 text-purple-300" }),
        color: 'from-indigo-600 via-brand-purple to-purple-800',
        badge: '2/3',
    },
    {
        id: 3,
        title: 'Grow Every Day',
        titleArabic: 'تطور وتصدر الصدارة',
        description: 'Earn XP, unlock rare achievements, climb leaderboards and become the ultimate champion.',
        descriptionArabic: 'اكسب النقاط والجوائز، افتح الإنجازات النادرة وتصدّر لائحة المتصدرين!',
        icon: _jsx(Trophy, { className: "w-16 h-16 text-amber-300" }),
        color: 'from-amber-500 via-brand-orange to-purple-700',
        badge: '3/3',
    },
];
export const OnboardingPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    const { dir } = useThemeStore();
    const currentSlide = SLIDES[currentIndex];
    const isLast = currentIndex === SLIDES.length - 1;
    const handleNext = () => {
        if (isLast) {
            navigate(ROUTES.LOGIN);
        }
        else {
            setCurrentIndex((prev) => prev + 1);
        }
    };
    const handleSkip = () => {
        navigate(ROUTES.LOGIN);
    };
    return (_jsxs("div", { className: "relative min-h-screen w-full bg-brand-darkBg text-slate-100 flex flex-col justify-between p-6 overflow-hidden select-none", children: [_jsx(AnimatedBackground, { variant: "hero" }), _jsxs("header", { className: "relative z-20 w-full max-w-md mx-auto flex items-center justify-between py-2", children: [_jsx("span", { className: "px-3 py-1 rounded-full bg-brand-card/80 border border-brand-cardBorder text-xs font-bold text-slate-400", children: currentSlide.badge }), _jsx("button", { onClick: handleSkip, className: "text-xs font-bold text-slate-400 hover:text-white transition-colors py-1.5 px-3 rounded-xl hover:bg-white/5", children: dir === 'rtl' ? 'تخطي' : 'Skip' })] }), _jsxs("main", { className: "relative z-10 w-full max-w-md mx-auto my-auto flex flex-col items-center text-center", children: [_jsx(AnimatePresence, { mode: "wait", children: _jsxs(motion.div, { initial: { opacity: 0, x: dir === 'rtl' ? -40 : 40, scale: 0.95 }, animate: { opacity: 1, x: 0, scale: 1 }, exit: { opacity: 0, x: dir === 'rtl' ? 40 : -40, scale: 0.95 }, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }, className: "flex flex-col items-center w-full", children: [_jsxs("div", { className: "relative mb-10 group", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-tr from-brand-purple via-brand-blue to-cyan-300 rounded-4xl blur-3xl opacity-50 group-hover:opacity-75 transition-opacity" }), _jsxs("div", { className: "relative w-56 h-56 sm:w-64 sm:h-64 rounded-4xl bg-gradient-to-br from-brand-card via-[#1A1A36] to-[#121226] border-4 border-brand-cardBorder flex items-center justify-center shadow-2xl overflow-hidden", children: [_jsx(motion.div, { animate: { y: [0, -10, 0] }, transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }, className: `p-8 rounded-3xl bg-gradient-to-br ${currentSlide.color} shadow-2xl border border-white/20`, children: currentSlide.icon }), _jsx("div", { className: "absolute top-4 right-4 p-2 rounded-xl bg-white/10 backdrop-blur-md", children: _jsx(Sparkles, { className: "w-4 h-4 text-cyan-300" }) })] })] }), _jsx("h2", { className: "text-2xl sm:text-3xl font-black text-white tracking-tight mb-2", children: dir === 'rtl' ? currentSlide.titleArabic : currentSlide.title }), _jsx("p", { className: "text-sm sm:text-base text-slate-300 font-medium max-w-sm leading-relaxed mb-6", children: dir === 'rtl' ? currentSlide.descriptionArabic : currentSlide.description })] }, currentSlide.id) }), _jsx(ProgressIndicator, { currentStep: currentIndex + 1, totalSteps: SLIDES.length, variant: "dots", className: "mb-8" })] }), _jsxs("footer", { className: "relative z-20 w-full max-w-md mx-auto py-2 flex items-center justify-between gap-4", children: [currentIndex > 0 ? (_jsx("button", { onClick: () => setCurrentIndex((prev) => prev - 1), className: "p-3.5 rounded-2xl bg-brand-card/80 border border-brand-cardBorder text-slate-300 hover:text-white hover:border-slate-500 transition-colors", children: dir === 'rtl' ? _jsx(ArrowRight, { className: "w-5 h-5" }) : _jsx(ArrowLeft, { className: "w-5 h-5" }) })) : (_jsx("div", { className: "w-12" })), _jsx(Button, { variant: "primary", size: "lg", fullWidth: true, onClick: handleNext, className: "shadow-glow", children: isLast ? (dir === 'rtl' ? 'ابدأ الآن 🎉' : 'Get Started') : (dir === 'rtl' ? 'التالي' : 'Next') })] })] }));
};
