import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hash, QrCode, ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { SectionTitle } from '@components/common/SectionTitle';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { SEO } from '@components/common/SEO';
import { ROUTES } from '@constants/routes';
import { useThemeStore } from '@store/themeStore';
export function JoinRoomPage() {
    const navigate = useNavigate();
    const { dir } = useThemeStore();
    const [code, setCode] = useState('');
    const [showQR, setShowQR] = useState(false);
    const handleJoin = () => {
        if (code.length >= 4) {
            navigate(`${ROUTES.PARTY}/lobby/${code.toUpperCase()}`);
        }
    };
    return (_jsxs("div", { className: "flex flex-col gap-6 py-4 max-w-xl mx-auto", children: [_jsx(SEO, { title: "\u0627\u0644\u0627\u0646\u0636\u0645\u0627\u0645 \u0644\u063A\u0631\u0641\u0629 \u0628\u0627\u0631\u062A\u064A | \u0646\u063A\u0646\u0650\u0634", description: "\u0623\u062F\u062E\u0644 \u0643\u0648\u062F \u0627\u0644\u063A\u0631\u0641\u0629 \u0627\u0644\u0645\u0643\u0648\u0646 \u0645\u0646 6 \u0631\u0645\u0648\u0632 \u0644\u0644\u0627\u0646\u0636\u0645\u0627\u0645 \u0627\u0644\u0641\u0648\u0631\u064A \u0644\u0645\u0628\u0627\u0631\u0627\u0629 \u0627\u0644\u0628\u0627\u0631\u062A\u064A \u0627\u0644\u062A\u0641\u0627\u0639\u0644\u064A\u0629." }), _jsx("div", { className: "flex items-center justify-between", children: _jsx(Button, { variant: "ghost", size: "sm", leftIcon: dir === 'rtl' ? _jsx(ArrowRight, { className: "w-4 h-4" }) : _jsx(ArrowLeft, { className: "w-4 h-4" }), onClick: () => navigate(ROUTES.PARTY), children: dir === 'rtl' ? 'العودة للبارتي' : 'Back to Party' }) }), _jsx(SectionTitle, { title: dir === 'rtl' ? 'الانضمام لغرفة 🎮' : 'Join Room 🎮', subtitle: dir === 'rtl' ? 'أدخل كود الغرفة أو امسح كود الـ QR' : 'Enter 6-digit room code or scan QR code' }), _jsx(Card, { variant: "glowing", glowColor: "cyan", className: "p-6 sm:p-8 flex flex-col gap-6 text-center", children: !showQR ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-16 h-16 rounded-3xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-3xl mx-auto shadow-glow", children: _jsx(Hash, { className: "w-8 h-8 text-white" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-black text-white", children: dir === 'rtl' ? 'كود الغرفة' : 'Room Code' }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: dir === 'rtl' ? 'أدخل كود الغرفة المكون من الأحرف والأرقام:' : 'Enter code provided by host:' })] }), _jsx(Input, { leftIcon: _jsx(Hash, { className: "w-4 h-4" }), placeholder: "NGAI23", value: code, onChange: e => setCode(e.target.value.toUpperCase().slice(0, 6)), className: "text-center text-xl font-black tracking-[0.2em] uppercase", autoFocus: true }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx(Button, { variant: "primary", size: "lg", fullWidth: true, disabled: code.length < 4, onClick: handleJoin, leftIcon: _jsx(Play, { className: "w-5 h-5 fill-current" }), className: "shadow-glow", children: dir === 'rtl' ? 'دخول الغرفة' : 'Join Room' }), _jsx(Button, { variant: "secondary", size: "md", fullWidth: true, onClick: () => setShowQR(true), leftIcon: _jsx(QrCode, { className: "w-4 h-4" }), children: dir === 'rtl' ? 'مسح QR Code 📷' : 'Scan QR Code 📷' })] })] })) : (
                /* QR Camera Simulator */
                _jsxs("div", { className: "flex flex-col items-center gap-4", children: [_jsxs("div", { className: "relative w-64 h-64 rounded-3xl bg-black border-2 border-cyan-400 overflow-hidden flex flex-col items-center justify-center p-4 shadow-glow-blue", children: [_jsx("div", { className: "absolute inset-4 border-2 border-dashed border-cyan-300 rounded-2xl animate-pulse" }), _jsx(QrCode, { className: "w-20 h-20 text-cyan-300 animate-bounce" }), _jsx("p", { className: "text-xs font-bold text-white mt-4", children: dir === 'rtl' ? 'وجّه الكاميرا نحو كود الـ QR' : 'Point camera at QR Code' })] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setShowQR(false), children: dir === 'rtl' ? 'إلغاء والعودة لكتابة الكود' : 'Cancel & Enter Code' })] })) })] }));
}
