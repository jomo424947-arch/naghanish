import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Crown, Play, Share2, MessageSquare, Send, ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionTitle } from '@components/common/SectionTitle';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { SEO } from '@components/common/SEO';
import { ROUTES } from '@constants/routes';
import { useAuthStore } from '@store/authStore';
import { useThemeStore } from '@store/themeStore';
export function LobbyPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { dir } = useThemeStore();
    const roomCode = id || 'NGAI23';
    const [players, setPlayers] = useState([
        { id: '1', name: user?.name || 'أحمد علي (أنت)', avatar: '🧠', isHost: true, isReady: true },
        { id: '2', name: 'ليلى سعيد', avatar: '🌟', isHost: false, isReady: true },
        { id: '3', name: 'يوسف أحمد', avatar: '⚡', isHost: false, isReady: false },
        { id: '4', name: 'سارة خالد', avatar: '🎯', isHost: false, isReady: true },
    ]);
    const [messages, setMessages] = useState([
        'أهلاً بكم في الغرفة! 👋',
        'جاهزون للبدء؟ 🔥',
    ]);
    const [chatInput, setChatInput] = useState('');
    const handleSendMessage = () => {
        if (!chatInput.trim())
            return;
        setMessages(prev => [...prev, `${user?.name || 'أنت'}: ${chatInput}`]);
        setChatInput('');
    };
    const handleStartGame = () => {
        navigate(`${ROUTES.GAMES}/g1`);
    };
    return (_jsxs("div", { className: "flex flex-col gap-6 py-4 max-w-4xl mx-auto", children: [_jsx(SEO, { title: `صالة الانتظار #${roomCode} | نغنِش`, description: "\u0635\u0627\u0644\u0629 \u0627\u0646\u062A\u0638\u0627\u0631 \u0645\u0628\u0627\u0631\u064A\u0627\u062A \u0627\u0644\u0628\u0627\u0631\u062A\u064A \u0627\u0644\u062D\u064A\u0629 \u0639\u0644\u0649 \u0645\u0646\u0635\u0629 \u0646\u063A\u0646\u0650\u0634." }), _jsx("div", { className: "flex items-center justify-between", children: _jsx(Button, { variant: "ghost", size: "sm", leftIcon: dir === 'rtl' ? _jsx(ArrowRight, { className: "w-4 h-4" }) : _jsx(ArrowLeft, { className: "w-4 h-4" }), onClick: () => navigate(ROUTES.PARTY), children: dir === 'rtl' ? 'مغادرة الغرفة' : 'Leave Room' }) }), _jsxs("div", { className: "p-6 rounded-3xl bg-gradient-to-r from-brand-purple/40 via-brand-card to-brand-blue/30 border-2 border-brand-purple/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-glow", children: [_jsxs("div", { className: "flex items-center gap-4 text-center sm:text-right rtl:sm:text-right sm:text-left", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-purple to-indigo-700 flex items-center justify-center text-3xl shadow-glow", children: "\uD83C\uDFAE" }), _jsxs("div", { children: [_jsx("span", { className: "text-xs font-bold text-cyan-300 uppercase tracking-wider", children: dir === 'rtl' ? 'صالة الانتظار الجماعية' : 'Party Lobby' }), _jsxs("h2", { className: "text-2xl font-black text-white flex items-center gap-2 justify-center sm:justify-start", children: [_jsx("span", { children: dir === 'rtl' ? 'كود الغرفة:' : 'Room Code:' }), _jsx("span", { className: "text-gradient-primary tracking-widest", children: roomCode })] })] })] }), _jsx(Button, { variant: "secondary", size: "md", leftIcon: _jsx(Share2, { className: "w-4 h-4" }), children: dir === 'rtl' ? 'نسخ كود الدعوة' : 'Share Code' })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "md:col-span-2 flex flex-col gap-4", children: [_jsx(SectionTitle, { title: dir === 'rtl' ? 'اللاعبون المكتملون 👥' : 'Connected Players 👥', subtitle: `${players.length}/6 ${dir === 'rtl' ? 'لاعبين في الصالة' : 'players in room'}` }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: players.map(p => (_jsxs(Card, { variant: p.isReady ? 'glowing' : 'default', glowColor: "cyan", className: "p-4 flex items-center justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-brand-darkBg border border-brand-cardBorder flex items-center justify-center text-2xl", children: p.avatar }), p.isHost && (_jsx("div", { className: "absolute -top-1.5 -right-1.5 rtl:-right-auto rtl:-left-1.5 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center", children: _jsx(Crown, { className: "w-3 h-3 text-white" }) }))] }), _jsxs("div", { children: [_jsx("h4", { className: "font-extrabold text-white text-sm", children: p.name }), _jsx("p", { className: "text-[11px] text-slate-400 font-medium", children: p.isHost ? (dir === 'rtl' ? 'المضيف' : 'Host') : (dir === 'rtl' ? 'لاعب' : 'Player') })] })] }), _jsx("span", { className: `px-2.5 py-1 rounded-xl text-[10px] font-black border ${p.isReady
                                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'}`, children: p.isReady ? (dir === 'rtl' ? 'جاهز ✓' : 'Ready ✓') : (dir === 'rtl' ? 'ينتظر...' : 'Waiting...') })] }, p.id))) }), _jsx(Button, { variant: "primary", size: "lg", fullWidth: true, onClick: handleStartGame, leftIcon: _jsx(Play, { className: "w-5 h-5 fill-current" }), className: "shadow-glow mt-4", children: dir === 'rtl' ? 'بدء اللعبة الآن 🚀' : 'Start Game Now 🚀' })] }), _jsxs(Card, { variant: "default", className: "p-4 flex flex-col justify-between h-96", children: [_jsxs("div", { className: "flex items-center gap-2 border-b border-brand-cardBorder pb-3", children: [_jsx(MessageSquare, { className: "w-4 h-4 text-cyan-300" }), _jsx("h4", { className: "font-extrabold text-white text-sm", children: dir === 'rtl' ? 'دردشة الغرفة' : 'Room Chat' })] }), _jsx("div", { className: "flex-1 overflow-y-auto py-3 flex flex-col gap-2 scrollbar-none", children: messages.map((msg, i) => (_jsx("div", { className: "p-2.5 rounded-xl bg-brand-darkBg text-xs font-medium text-slate-200 border border-white/5", children: msg }, i))) }), _jsxs("div", { className: "flex items-center gap-2 pt-2", children: [_jsx(Input, { value: chatInput, onChange: e => setChatInput(e.target.value), onKeyDown: e => e.key === 'Enter' && handleSendMessage(), placeholder: dir === 'rtl' ? 'اكتب رسالة...' : 'Type message...', className: "py-1.5 text-xs" }), _jsx("button", { onClick: handleSendMessage, className: "p-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple/80 text-white shrink-0", children: _jsx(Send, { className: "w-4 h-4" }) })] })] })] })] }));
}
