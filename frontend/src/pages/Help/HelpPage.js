import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, MessageSquare, Mail } from 'lucide-react';
import { SectionTitle } from '@components/common/SectionTitle';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import { useThemeStore } from '@store/themeStore';
const FAQS = [
    {
        id: 'faq-1',
        question: 'How do Party Rooms work?',
        questionArabic: 'كيف تعمل غرف الألعاب الجماعية (بارتي نايت)؟',
        answer: 'You can create a room, share the 6-character room code with friends, and compete in real-time quiz challenges together!',
        answerArabic: 'يمكنك إنشاء غرفة لعب خاصة، ومشاركة كود الغرفة المكون من 6 رموز مع أصدقائك لبدء التحدي التنافسي المباشر!',
    },
    {
        id: 'faq-2',
        question: 'How are XP points and Levels calculated?',
        questionArabic: 'كيف يتم احتساب نقاط XP والمستويات؟',
        answer: 'Playing daily challenges, matching cards fast, and winning party games awards XP points to level up your player profile.',
        answerArabic: 'من خلال إكمال التحديات اليومية والفوز بالألعاب السرية والمنطقية، تكتسب نقاط XP التي ترفع مستواك وفتح جوائز جديدة.',
    },
    {
        id: 'faq-3',
        question: 'Can I change my avatar and nickname later?',
        questionArabic: 'هل يمكنني تغيير شخصيتي الرمزية واسم المستخدم لاحقاً؟',
        answer: 'Yes! Go to Settings -> Profile Setup to change your avatar mascot, bio, display name, and preferences anytime.',
        answerArabic: 'نعم بالتأكيد! يمكنك الدخول لإعدادات الملف الشخصي وتعديل رمزيتك واسمك ونبذتك التعريفية في أي وقت.',
    },
    {
        id: 'faq-4',
        question: 'Is Naghanish completely free to play?',
        questionArabic: 'هل جميع ألعاب وتحديات نغانيش مجانية؟',
        answer: 'Yes! All core games, multiplayer party rooms, daily quizzes, and leaderboards are 100% free.',
        answerArabic: 'نعم، جميع الألعاب الرئيسية وغرف اللعب الجماعي والاختبارات ولوحات الصدارة مجانية بالكامل للجميع.',
    },
];
export const HelpPage = () => {
    const navigate = useNavigate();
    const { dir } = useThemeStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [openId, setOpenId] = useState('faq-1');
    const filteredFaqs = FAQS.filter((f) => f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.questionArabic.includes(searchQuery));
    const toggleAccordion = (id) => {
        setOpenId(openId === id ? null : id);
    };
    return (_jsxs("div", { className: "w-full max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8", children: [_jsx(SectionTitle, { title: dir === 'rtl' ? 'مركز المساعدة ❓' : 'Help & Support ❓', subtitle: dir === 'rtl' ? 'الأسئلة الشائعة وتوجيهات الاستخدام' : 'Frequently asked questions and customer support', action: _jsx(Button, { variant: "outline", size: "sm", onClick: () => navigate(-1), children: dir === 'rtl' ? 'رجوع' : 'Back' }) }), _jsx("div", { className: "w-full", children: _jsx(Input, { placeholder: dir === 'rtl' ? 'ابحث عن إجابة سؤالك...' : 'Search for questions or topics...', leftIcon: _jsx(Search, { className: "w-4 h-4" }), value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }) }), _jsx("div", { className: "flex flex-col gap-3", children: filteredFaqs.map((faq) => {
                    const isOpen = openId === faq.id;
                    return (_jsxs("div", { className: "p-5 rounded-3xl bg-brand-card border border-brand-cardBorder transition-all duration-200", children: [_jsxs("button", { type: "button", onClick: () => toggleAccordion(faq.id), className: "w-full flex items-center justify-between gap-4 text-left rtl:text-right font-bold text-white text-base focus:outline-none cursor-pointer", children: [_jsx("span", { children: dir === 'rtl' ? faq.questionArabic : faq.question }), _jsx(ChevronDown, { className: `w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-blue' : ''}` })] }), isOpen && (_jsx("div", { className: "mt-3 pt-3 border-t border-brand-cardBorder text-sm text-slate-300 font-medium leading-relaxed animate-fadeIn", children: dir === 'rtl' ? faq.answerArabic : faq.answer }))] }, faq.id));
                }) }), _jsxs("div", { className: "p-6 rounded-3xl bg-gradient-to-r from-brand-purple/20 via-brand-card to-brand-blue/20 border border-brand-blue/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl", children: [_jsxs("div", { className: "flex items-center gap-4 text-center sm:text-right rtl:sm:text-right sm:text-left", children: [_jsx("div", { className: "p-3 rounded-2xl bg-brand-blue/20 text-cyan-300 shrink-0 shadow-glow-blue", children: _jsx(MessageSquare, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("h4", { className: "text-base font-bold text-white", children: dir === 'rtl' ? 'لم تجد إجابة لسؤالك؟' : 'Need more help?' }), _jsx("p", { className: "text-xs text-slate-400 font-medium mt-0.5", children: dir === 'rtl' ? 'فريق الدعم متواجد على مدار الساعة لمساعدتك' : 'Our support team is available 24/7' })] })] }), _jsx(Button, { variant: "secondary", size: "md", leftIcon: _jsx(Mail, { className: "w-4 h-4" }), onClick: () => alert('Support email: support@naghanish.com'), className: "shrink-0 shadow-glow-blue", children: dir === 'rtl' ? 'تواصل معنا' : 'Contact Support' })] })] }));
};
