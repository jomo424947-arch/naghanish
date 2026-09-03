import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Lock, Globe, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { SectionTitle } from '@components/common/SectionTitle';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { SEO } from '@components/common/SEO';
import { ROUTES } from '@constants/routes';
import { useThemeStore } from '@store/themeStore';
export function CreateRoomPage() {
    const navigate = useNavigate();
    const { dir } = useThemeStore();
    const [roomName, setRoomName] = useState('غرفة الأبطال ⚡');
    const [selectedGame, setSelectedGame] = useState('Quiz');
    const [maxPlayers, setMaxPlayers] = useState(4);
    const [rounds, setRounds] = useState(5);
    const [isPrivate, setIsPrivate] = useState(false);
    const [password, setPassword] = useState('');
    const handleCreate = () => {
        const randomCode = 'NGAI' + Math.floor(100 + Math.random() * 900);
        navigate(`${ROUTES.PARTY}/lobby/${randomCode}`);
    };
    return (_jsxs("div", { className: "flex flex-col gap-6 py-4 max-w-2xl mx-auto", children: [_jsx(SEO, { title: "\u0625\u0646\u0634\u0627\u0621 \u063A\u0631\u0641\u0629 \u0644\u0639\u0628 \u062C\u0645\u0627\u0639\u064A\u0629 | \u0646\u063A\u0646\u0650\u0634", description: "\u0623\u0646\u0634\u0626 \u063A\u0631\u0641\u062A\u0643 \u0627\u0644\u0634\u062E\u0635\u064A\u0629\u060C \u062D\u062F\u062F \u0646\u0648\u0639 \u0627\u0644\u0644\u0639\u0628\u0629\u060C \u0648\u0627\u062F\u0639\u064F \u0623\u0635\u062F\u0642\u0627\u0621\u0643 \u0644\u0644\u0639\u0628 \u0627\u0644\u0628\u0627\u0631\u062A\u064A \u0627\u0644\u062A\u0641\u0627\u0639\u0644\u064A." }), _jsx("div", { className: "flex items-center justify-between", children: _jsx(Button, { variant: "ghost", size: "sm", leftIcon: dir === 'rtl' ? _jsx(ArrowRight, { className: "w-4 h-4" }) : _jsx(ArrowLeft, { className: "w-4 h-4" }), onClick: () => navigate(ROUTES.PARTY), children: dir === 'rtl' ? 'العودة للبارتي' : 'Back to Party' }) }), _jsx(SectionTitle, { title: dir === 'rtl' ? 'إنشاء غرفة جديدة 🎉' : 'Create New Room 🎉', subtitle: dir === 'rtl' ? 'خصص إعدادات الغرفة وتحدى أصدقاءك' : 'Customize settings & challenge your friends', icon: _jsx(Plus, { className: "w-5 h-5" }) }), _jsxs(Card, { variant: "glowing", glowColor: "purple", className: "p-6 sm:p-8 flex flex-col gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2", children: dir === 'rtl' ? 'اسم الغرفة' : 'Room Name' }), _jsx(Input, { value: roomName, onChange: e => setRoomName(e.target.value), placeholder: dir === 'rtl' ? 'أدخل اسم الغرفة...' : 'Enter room name...' })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2", children: dir === 'rtl' ? 'نوع اللعبة' : 'Game Mode' }), _jsx("div", { className: "grid grid-cols-3 gap-3", children: [
                                    { id: 'Quiz', label: dir === 'rtl' ? 'أسئلة سريعة' : 'Speed Quiz', icon: '⚡' },
                                    { id: 'Memory', label: dir === 'rtl' ? 'ذاكرة جماعية' : 'Memory Party', icon: '🧠' },
                                    { id: 'Reaction', label: dir === 'rtl' ? 'سباق السرعة' : 'Speed Rush', icon: '🎯' },
                                ].map(game => (_jsxs("button", { type: "button", onClick: () => setSelectedGame(game.id), className: `p-4 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all ${selectedGame === game.id
                                        ? 'bg-brand-purple/30 border-cyan-300 text-white shadow-glow'
                                        : 'bg-brand-darkBg/60 border-brand-cardBorder text-slate-400 hover:text-white'}`, children: [_jsx("span", { className: "text-2xl", children: game.icon }), _jsx("span", { className: "text-xs font-bold", children: game.label })] }, game.id))) })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2", children: dir === 'rtl' ? 'الحد الأقصى للاعبين' : 'Max Players' }), _jsx("div", { className: "flex items-center gap-2", children: [2, 4, 6, 8].map(count => (_jsx("button", { type: "button", onClick: () => setMaxPlayers(count), className: `flex-1 py-2.5 rounded-xl border text-xs font-extrabold transition-all ${maxPlayers === count
                                                ? 'bg-brand-blue text-white border-cyan-300 shadow-glow-blue'
                                                : 'bg-brand-darkBg border-brand-cardBorder text-slate-400'}`, children: count }, count))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2", children: dir === 'rtl' ? 'عدد الجولات' : 'Rounds' }), _jsx("div", { className: "flex items-center gap-2", children: [3, 5, 10].map(r => (_jsxs("button", { type: "button", onClick: () => setRounds(r), className: `flex-1 py-2.5 rounded-xl border text-xs font-extrabold transition-all ${rounds === r
                                                ? 'bg-brand-purple text-white border-purple-400 shadow-glow'
                                                : 'bg-brand-darkBg border-brand-cardBorder text-slate-400'}`, children: [r, " ", dir === 'rtl' ? 'جولات' : 'Rds'] }, r))) })] })] }), _jsxs("div", { className: "p-4 rounded-2xl bg-brand-darkBg border border-brand-cardBorder flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [isPrivate ? _jsx(Lock, { className: "w-5 h-5 text-amber-400" }) : _jsx(Globe, { className: "w-5 h-5 text-emerald-400" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-bold text-white", children: isPrivate ? (dir === 'rtl' ? 'غرفة خاصة' : 'Private Room') : (dir === 'rtl' ? 'غرفة عامة' : 'Public Room') }), _jsx("p", { className: "text-[11px] text-slate-400 font-medium", children: isPrivate
                                                    ? (dir === 'rtl' ? 'تتطلب كلمة سر للانضمام' : 'Requires password')
                                                    : (dir === 'rtl' ? 'يمكن لأي لاعب الانضمام' : 'Open for everyone') })] })] }), _jsx("button", { type: "button", onClick: () => setIsPrivate(!isPrivate), className: `w-12 h-6 rounded-full p-1 transition-colors ${isPrivate ? 'bg-amber-500' : 'bg-slate-700'}`, children: _jsx("div", { className: `w-4 h-4 rounded-full bg-white transition-transform ${isPrivate ? 'translate-x-6 rtl:-translate-x-6' : ''}` }) })] }), isPrivate && (_jsx(Input, { leftIcon: _jsx(Lock, { className: "w-4 h-4" }), placeholder: dir === 'rtl' ? 'أدخل كلمة سر الغرفة...' : 'Set room password...', value: password, onChange: e => setPassword(e.target.value) })), _jsx(Button, { variant: "primary", size: "lg", fullWidth: true, onClick: handleCreate, leftIcon: _jsx(Sparkles, { className: "w-5 h-5" }), className: "shadow-glow mt-2", children: dir === 'rtl' ? 'إنشاء ودخول الصالة 🚀' : 'Create & Enter Lobby 🚀' })] })] }));
}
