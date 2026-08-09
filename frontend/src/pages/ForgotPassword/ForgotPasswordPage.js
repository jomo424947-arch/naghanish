import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, KeyRound } from 'lucide-react';
import { AuthLayout } from '@components/layout/AuthLayout';
import { TextField } from '@components/common/TextField';
import { Button } from '@components/common/Button';
import { ROUTES } from '@constants/routes';
import { useAuthStore } from '@store/authStore';
import { useThemeStore } from '@store/themeStore';
export const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const { setPendingEmail } = useAuthStore();
    const { dir } = useThemeStore();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setError(dir === 'rtl' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email');
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setPendingEmail(email);
            setIsLoading(false);
            navigate('/otp');
        }, 1000);
    };
    return (_jsx(AuthLayout, { title: dir === 'rtl' ? 'استعادة كلمة المرور 🔐' : 'Forgot Password 🔐', subtitle: dir === 'rtl' ? 'أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق' : 'Enter your email to receive a verification code', showBackButton: true, children: _jsx("div", { className: "p-6 sm:p-8 rounded-3xl bg-brand-card/90 border border-brand-cardBorder shadow-2xl backdrop-blur-xl", children: _jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-5", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-brand-purple/20 border border-purple-500/30 text-brand-purple flex items-center justify-center mx-auto mb-1 shadow-glow", children: _jsx(KeyRound, { className: "w-7 h-7" }) }), error && (_jsx("div", { className: "p-3 rounded-2xl bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-300 text-center", children: error })), _jsx(TextField, { label: dir === 'rtl' ? 'البريد الإلكتروني' : 'Email Address', type: "email", placeholder: "example@mail.com", leftIcon: _jsx(Mail, { className: "w-4 h-4" }), value: email, onChange: (e) => setEmail(e.target.value), required: true }), _jsx(Button, { type: "submit", variant: "primary", size: "lg", isLoading: isLoading, fullWidth: true, className: "shadow-glow", children: dir === 'rtl' ? 'إرسال رمز التحقق' : 'Send Verification Code' }), _jsx("div", { className: "text-center mt-2", children: _jsxs(Link, { to: ROUTES.LOGIN, className: "inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors", children: [dir === 'rtl' ? _jsx(ArrowRight, { className: "w-4 h-4" }) : _jsx(ArrowLeft, { className: "w-4 h-4" }), _jsx("span", { children: dir === 'rtl' ? 'العودة لتسجيل الدخول' : 'Back to Login' })] }) })] }) }) }));
};
