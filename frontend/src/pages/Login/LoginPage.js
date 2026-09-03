import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@components/layout/AuthLayout';
import { SocialLoginButton } from '@components/common/SocialLoginButton';
import { ROUTES } from '@constants/routes';
import { useAuthStore } from '@store/authStore';
import { useThemeStore } from '@store/themeStore';
export const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const { dir } = useThemeStore();
    const [isLoading, setIsLoading] = useState(null);
    const handleSocialLogin = (provider) => {
        setIsLoading(provider);
        setTimeout(() => {
            login({
                name: provider === 'google' ? 'مستخدم Google' : 'مستخدم Apple',
                email: provider === 'google' ? 'user@gmail.com' : 'user@apple.com',
                username: provider === 'google' ? 'google_player' : 'apple_player',
            });
            setIsLoading(null);
            navigate(ROUTES.WELCOME);
        }, 800);
    };
    return (_jsx(AuthLayout, { title: dir === 'rtl' ? 'مرحباً بك مجدداً! 👋' : 'Welcome Back! 👋', subtitle: dir === 'rtl' ? 'سجل دخولك بنقرة واحدة لمتابعة اللعب والمنافسة' : 'Login with one click to continue playing', children: _jsxs("div", { className: "p-6 sm:p-8 rounded-3xl bg-brand-card/90 border border-brand-cardBorder shadow-2xl backdrop-blur-xl flex flex-col gap-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-brand-purple/20 border border-purple-500/30 text-brand-purple flex items-center justify-center mx-auto mb-3 shadow-glow text-2xl", children: "\uD83D\uDD10" }), _jsx("h3", { className: "text-lg font-bold text-foreground", children: dir === 'rtl' ? 'اختر طريقة تسجيل الدخول' : 'Choose Login Method' }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: dir === 'rtl' ? 'تسجيل السريع والآمن عبر حساباتك المعتمدة' : 'Fast and secure login via verified accounts' })] }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx(SocialLoginButton, { provider: "google", label: dir === 'rtl' ? 'المتابعة باستخدام Google' : 'Continue with Google', isLoading: isLoading === 'google', onClick: () => handleSocialLogin('google'), className: "w-full py-4 text-base font-bold shadow-glow-blue" }), _jsx(SocialLoginButton, { provider: "apple", label: dir === 'rtl' ? 'المتابعة باستخدام Apple' : 'Continue with Apple', isLoading: isLoading === 'apple', onClick: () => handleSocialLogin('apple'), className: "w-full py-4 text-base font-bold" })] }), _jsx("div", { className: "p-4 rounded-2xl bg-brand-surface/60 border border-brand-cardBorder/60 text-center", children: _jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: dir === 'rtl'
                            ? 'تسجيل الدخول متاح حنياً حصرياً عبر Google و Apple لضمان أمان حسابك وتجربة سريعة'
                            : 'Sign in is currently available via Google & Apple for speed and security' }) })] }) }));
};
