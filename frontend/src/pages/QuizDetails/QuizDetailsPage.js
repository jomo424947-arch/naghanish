import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, ArrowLeft, ArrowRight, RotateCcw, Share2, Sparkles, Trophy } from 'lucide-react';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { ProgressIndicator } from '@components/common/ProgressIndicator';
import { SEO } from '@components/common/SEO';
import { ROUTES } from '@constants/routes';
import { useThemeStore } from '@store/themeStore';
const MOCK_QUESTIONS = [
    {
        id: 1,
        question: 'عندما تواجه قراراً حاسماً في فريق العمل، ما هي ردة فعلك الأولى؟',
        questionEn: 'When facing a critical decision in a team, what is your first reaction?',
        options: [
            { text: 'أتولى القيادة وأضع خطة واضحة ومحددة.', textEn: 'Take charge and set a clear structured plan.', traits: 'Leader' },
            { text: 'أستمع لكافة الآراء وأحاول التوصل لاتفاق جماعي.', textEn: 'Listen to all opinions and seek consensus.', traits: 'Collaborator' },
            { text: 'أحلل البيانات والمعطيات بدقة قبل إبداء أي رأي.', textEn: 'Analyze data thoroughly before giving input.', traits: 'Analyst' },
            { text: 'أقترح أفكاراً مبتكرة وخارجة عن المألوف.', textEn: 'Propose innovative out-of-the-box ideas.', traits: 'Visionary' },
        ]
    },
    {
        id: 2,
        question: 'كيف تقضي وقت فراغك المثالي في عطلة نهاية الأسبوع؟',
        questionEn: 'How do you spend your ideal weekend free time?',
        options: [
            { text: 'تنظيم أنشطة اجتماعية وتجميع الأصدقاء.', textEn: 'Organize social events and bring friends together.', traits: 'Leader' },
            { text: 'قراءة كتاب أو تعلم مهارة جديدة بتركيز.', textEn: 'Read a book or master a new skill.', traits: 'Analyst' },
            { text: 'تنسيق مشروع جديد أو تجربة شيء فني.', textEn: 'Design a new project or try something artistic.', traits: 'Visionary' },
            { text: 'الاسترخاء وقضاء وقت ممتع مع العائلة.', textEn: 'Relax and spend quality time with family.', traits: 'Collaborator' },
        ]
    },
    {
        id: 3,
        question: 'ما هي النقطة التي يعتبرها الآخرون أقوى صفاتك؟',
        questionEn: 'What do others consider your strongest quality?',
        options: [
            { text: 'القدرة على الحسم والتوجيه في الأزمات.', textEn: 'Decisiveness and guidance during crises.', traits: 'Leader' },
            { text: 'الدقة العالية والتفكير المنطقي.', textEn: 'High precision and logical thinking.', traits: 'Analyst' },
            { text: 'الابتكار والحلول الذكية غير التقليدية.', textEn: 'Innovation and clever non-traditional solutions.', traits: 'Visionary' },
            { text: 'التعاطف والقدرة على مساندة أي شخص.', textEn: 'Empathy and ability to support anyone.', traits: 'Collaborator' },
        ]
    }
];
export function QuizDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { dir } = useThemeStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState({});
    const [timer, setTimer] = useState(30);
    const [isFinished, setIsFinished] = useState(false);
    // Timer interval
    useEffect(() => {
        if (isFinished)
            return;
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    handleNextQuestion();
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [currentIndex, isFinished]);
    const handleSelectOption = (index) => {
        setSelectedOption(index);
    };
    const handleNextQuestion = () => {
        if (selectedOption !== null) {
            const trait = MOCK_QUESTIONS[currentIndex].options[selectedOption].traits;
            setScore(prev => ({ ...prev, [trait]: (prev[trait] || 0) + 1 }));
        }
        if (currentIndex < MOCK_QUESTIONS.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setTimer(30);
        }
        else {
            setIsFinished(true);
        }
    };
    const currentQ = MOCK_QUESTIONS[currentIndex];
    // Get top result personality
    const topTrait = Object.entries(score).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Leader';
    const RESULT_DESCS = {
        Leader: { ar: 'أنت قائد طبيعي 👑! تمتاز بالقدرة على الحسم والتوجيه وشحن طاقة الجميع نحو الهدف.', en: 'You are a Natural Leader 👑! Decisive, inspiring, and goal-oriented.', icon: '👑' },
        Collaborator: { ar: 'أنت روح الفريق 🤝! تبني جسور التواصل وتصنع بيئة عمل متناغمة وداعمة.', en: 'You are a Team Player 🤝! Great at bridging gaps and creating harmony.', icon: '🤝' },
        Analyst: { ar: 'أنت مفكر استراتيجي 🧠! تعتمد على المنطق والمعطيات للوصول إلى أدق النتائج.', en: 'You are a Strategic Thinker 🧠! Analytical, precise, and logical.', icon: '🧠' },
        Visionary: { ar: 'أنت مبتكر ومبدع 💡! تمتلك رؤية مستقبلية وحلولاً خارج الصندوق.', en: 'You are a Visionary 💡! Creative, forward-thinking, and innovative.', icon: '💡' },
    };
    const resultInfo = RESULT_DESCS[topTrait];
    return (_jsxs("div", { className: "flex flex-col gap-6 py-4 max-w-3xl mx-auto", children: [_jsx(SEO, { title: isFinished ? `نتيجة الإختبار: ${topTrait}` : `اختبار تفاعلي | نغنِش`, description: "\u062E\u0648\u0636 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631 \u0627\u0644\u062A\u0641\u0627\u0639\u0644\u064A \u0648\u0627\u062D\u0635\u0644 \u0639\u0644\u0649 \u062A\u062D\u0644\u064A\u0644 \u0634\u062E\u0635\u064A\u062A\u0643 \u0627\u0644\u062F\u0642\u064A\u0642 \u0648\u0627\u0643\u0633\u0628 \u0646\u0642\u0627\u0637 XP." }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Button, { variant: "ghost", size: "sm", leftIcon: dir === 'rtl' ? _jsx(ArrowRight, { className: "w-4 h-4" }) : _jsx(ArrowLeft, { className: "w-4 h-4" }), onClick: () => navigate(ROUTES.QUIZ_CENTER), children: dir === 'rtl' ? 'العودة للاختبارات' : 'Back to Quizzes' }), !isFinished && (_jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-brand-card border border-brand-cardBorder text-xs font-bold text-slate-300", children: [_jsx(Clock, { className: "w-4 h-4 text-cyan-300 animate-pulse" }), _jsxs("span", { children: ["00:", timer < 10 ? `0${timer}` : timer] })] }))] }), !isFinished ? (_jsxs(Card, { variant: "glowing", glowColor: "cyan", className: "p-6 sm:p-8 flex flex-col gap-6", children: [_jsxs("div", { className: "flex flex-col gap-2", children: [_jsxs("div", { className: "flex items-center justify-between text-xs font-bold text-slate-400", children: [_jsx("span", { children: dir === 'rtl' ? `السؤال ${currentIndex + 1} من ${MOCK_QUESTIONS.length}` : `Question ${currentIndex + 1} of ${MOCK_QUESTIONS.length}` }), _jsxs("span", { className: "text-cyan-300", children: [Math.round(((currentIndex + 1) / MOCK_QUESTIONS.length) * 100), "%"] })] }), _jsx(ProgressIndicator, { currentStep: currentIndex + 1, totalSteps: MOCK_QUESTIONS.length, variant: "bar" })] }), _jsx("h2", { className: "text-lg sm:text-xl font-black text-white leading-relaxed mt-2", children: dir === 'rtl' ? currentQ.question : currentQ.questionEn }), _jsx("div", { className: "flex flex-col gap-3", children: currentQ.options.map((opt, idx) => {
                            const isSelected = selectedOption === idx;
                            return (_jsxs("button", { onClick: () => handleSelectOption(idx), className: `p-4 rounded-2xl border text-right rtl:text-right text-left text-sm font-bold transition-all duration-200 flex items-center justify-between gap-3 ${isSelected
                                    ? 'bg-gradient-to-r from-brand-purple/40 to-brand-blue/30 border-brand-blue text-white shadow-glow'
                                    : 'bg-brand-darkBg/60 border-brand-cardBorder text-slate-300 hover:border-slate-500 hover:text-white'}`, children: [_jsx("span", { children: dir === 'rtl' ? opt.text : opt.textEn }), _jsx("div", { className: `w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-cyan-300 bg-cyan-400 text-brand-darkBg' : 'border-slate-600'}`, children: isSelected && _jsx(CheckCircle2, { className: "w-4 h-4 stroke-[3]" }) })] }, idx));
                        }) }), _jsx(Button, { variant: "primary", size: "lg", fullWidth: true, disabled: selectedOption === null, onClick: handleNextQuestion, className: "shadow-glow", children: currentIndex < MOCK_QUESTIONS.length - 1
                            ? (dir === 'rtl' ? 'السؤال التالي' : 'Next Question')
                            : (dir === 'rtl' ? 'عرض النتيجة 🎉' : 'See Results 🎉') })] })) : (
            /* Results Card */
            _jsx(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, children: _jsxs(Card, { variant: "glowing", glowColor: "purple", className: "p-8 flex flex-col items-center text-center gap-6", children: [_jsx("div", { className: "w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-purple to-brand-orange flex items-center justify-center text-5xl shadow-glow", children: resultInfo.icon }), _jsxs("div", { children: [_jsx("span", { className: "px-3 py-1 rounded-full bg-brand-purple/30 text-purple-300 text-xs font-black uppercase tracking-wider border border-purple-500/30", children: dir === 'rtl' ? 'النتيجة النهائية' : 'Final Personality Analysis' }), _jsx("h2", { className: "text-2xl sm:text-3xl font-black text-white mt-2", children: topTrait }), _jsx("p", { className: "text-sm text-slate-300 font-medium max-w-md mx-auto mt-2 leading-relaxed", children: dir === 'rtl' ? resultInfo.ar : resultInfo.en })] }), _jsxs("div", { className: "flex items-center gap-4 p-4 rounded-2xl bg-brand-darkBg border border-brand-cardBorder w-full max-w-xs justify-center", children: [_jsxs("div", { className: "flex items-center gap-2 text-amber-300 font-black text-sm", children: [_jsx(Trophy, { className: "w-5 h-5 text-amber-400" }), _jsx("span", { children: "+250 XP" })] }), _jsx("span", { className: "text-slate-600", children: "\u2022" }), _jsxs("div", { className: "flex items-center gap-2 text-cyan-300 font-black text-sm", children: [_jsx(Sparkles, { className: "w-5 h-5 text-cyan-300" }), _jsx("span", { children: "+50 Coins" })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 w-full max-w-md", children: [_jsx(Button, { variant: "secondary", size: "md", fullWidth: true, leftIcon: _jsx(RotateCcw, { className: "w-4 h-4" }), onClick: () => {
                                        setIsFinished(false);
                                        setCurrentIndex(0);
                                        setSelectedOption(null);
                                        setScore({});
                                        setTimer(30);
                                    }, children: dir === 'rtl' ? 'إعادة الإختبار' : 'Retake Quiz' }), _jsx(Button, { variant: "primary", size: "md", fullWidth: true, leftIcon: _jsx(Share2, { className: "w-4 h-4" }), onClick: () => navigate(ROUTES.QUIZ_CENTER), children: dir === 'rtl' ? 'اختبارات أخرى' : 'Explore More' })] })] }) }))] }));
}
