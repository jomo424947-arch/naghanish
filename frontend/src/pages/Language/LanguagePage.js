import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@components/layout/AuthLayout';
import { LanguageCard } from '@components/common/LanguageCard';
import { Button } from '@components/common/Button';
import { useThemeStore } from '@store/themeStore';
export const LanguagePage = () => {
    const navigate = useNavigate();
    const { language, setLanguage, dir } = useThemeStore();
    const handleSelectLanguage = (lang) => {
        setLanguage(lang);
    };
    const handleNext = () => {
        navigate('/theme');
    };
    return (_jsx(AuthLayout, { title: dir === 'rtl' ? 'اختيار اللغة 🌐' : 'Select Language 🌐', subtitle: dir === 'rtl' ? 'اختر لغة التطبيق المفضلة لديك' : 'Choose your preferred language for the application', showBackButton: true, children: _jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("div", { className: "flex flex-col gap-4", children: [_jsx(LanguageCard, { id: "ar", name: "Arabic", nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629", flag: "\uD83C\uDDF8\uD83C\uDDE6", dirText: "\u0645\u0646 \u0627\u0644\u064A\u0645\u064A\u0646 \u0644\u0644\u064A\u0633\u0627\u0631 (RTL)", selected: language === 'ar', onClick: () => handleSelectLanguage('ar') }), _jsx(LanguageCard, { id: "en", name: "English", nativeName: "English (US)", flag: "\uD83C\uDDFA\uD83C\uDDF8", dirText: "Left to Right (LTR)", selected: language === 'en', onClick: () => handleSelectLanguage('en') })] }), _jsx(Button, { variant: "primary", size: "lg", fullWidth: true, onClick: handleNext, className: "shadow-glow mt-2", children: dir === 'rtl' ? 'تأكيد ومتابعة' : 'Confirm & Continue' })] }) }));
};
