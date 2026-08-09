import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, RotateCcw, Trophy, Zap, Clock, Play } from 'lucide-react';
import { SectionTitle } from '@components/common/SectionTitle';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { SEO } from '@components/common/SEO';
import { AdSlot } from '@components/common/AdSlot';
import { ROUTES } from '@constants/routes';
import { useThemeStore } from '@store/themeStore';
// Emojis for memory cards game
const EMOJIS = ['🧠', '⚡', '🏆', '🎯', '🎨', '🧮'];
export function GameDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { dir } = useThemeStore();
    // Game selection state based on route param or fallback
    const isSpeedTest = id === 'g2';
    // Memory Game State
    const [cards, setCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [moves, setMoves] = useState(0);
    const [gameWon, setGameWon] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    // Reaction Game State
    const [reactionState, setReactionState] = useState('idle');
    const [startTime, setStartTime] = useState(0);
    const [reactionTime, setReactionTime] = useState(null);
    // Init Memory Cards Game
    const initMemoryGame = () => {
        const deck = [...EMOJIS, ...EMOJIS]
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }));
        setCards(deck);
        setFlippedIndices([]);
        setMoves(0);
        setGameWon(false);
        setElapsedTime(0);
        setGameStarted(true);
    };
    // Memory Game Timer
    useEffect(() => {
        if (!gameStarted || gameWon)
            return;
        const timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
        return () => clearInterval(timer);
    }, [gameStarted, gameWon]);
    // Handle Card Flip
    const handleCardClick = (index) => {
        if (!gameStarted || cards[index].flipped || cards[index].matched || flippedIndices.length === 2)
            return;
        const newCards = [...cards];
        newCards[index].flipped = true;
        setCards(newCards);
        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);
        if (newFlipped.length === 2) {
            setMoves(prev => prev + 1);
            const [first, second] = newFlipped;
            if (newCards[first].emoji === newCards[second].emoji) {
                newCards[first].matched = true;
                newCards[second].matched = true;
                setCards(newCards);
                setFlippedIndices([]);
                // Check if all matched
                if (newCards.every(c => c.matched)) {
                    setGameWon(true);
                }
            }
            else {
                setTimeout(() => {
                    newCards[first].flipped = false;
                    newCards[second].flipped = false;
                    setCards(newCards);
                    setFlippedIndices([]);
                }, 800);
            }
        }
    };
    // Reaction Game Logic
    const startReactionTest = () => {
        setReactionState('waiting');
        const randomDelay = Math.floor(Math.random() * 3000) + 2000;
        setTimeout(() => {
            setReactionState('ready');
            setStartTime(Date.now());
        }, randomDelay);
    };
    const handleReactionClick = () => {
        if (reactionState === 'waiting') {
            alert(dir === 'rtl' ? 'مبكر جداً! انتظر حتى يصبح اللون أخضر.' : 'Too early! Wait for the green screen.');
            setReactionState('idle');
        }
        else if (reactionState === 'ready') {
            const diff = Date.now() - startTime;
            setReactionTime(diff);
            setReactionState('result');
        }
    };
    return (_jsxs("div", { className: "flex flex-col gap-6 py-4 max-w-4xl mx-auto", children: [_jsx(SEO, { title: isSpeedTest ? 'اختبار ردة الفعل والسرعة | نغنِش' : 'لعبة بطاقات الذاكرة | نغنِش', description: "\u0627\u0644\u0639\u0628 \u0627\u0644\u0622\u0646 \u0627\u062E\u062A\u0628\u0631 \u0642\u062F\u0631\u0627\u062A\u0643 \u0627\u0644\u0630\u0647\u0646\u064A\u0629 \u0648\u0633\u0631\u0639\u0629 \u0627\u0644\u0628\u062F\u064A\u0647\u0629 \u0639\u0644\u0649 \u0645\u0646\u0635\u0629 \u0646\u063A\u0646\u0650\u0634." }), _jsx("div", { className: "flex items-center justify-between", children: _jsx(Button, { variant: "ghost", size: "sm", leftIcon: dir === 'rtl' ? _jsx(ArrowRight, { className: "w-4 h-4" }) : _jsx(ArrowLeft, { className: "w-4 h-4" }), onClick: () => navigate(ROUTES.GAMES), children: dir === 'rtl' ? 'العودة للألعاب' : 'Back to Games' }) }), isSpeedTest ? (_jsxs(Card, { variant: "glowing", glowColor: "cyan", className: "p-6 sm:p-8 flex flex-col items-center text-center gap-6", children: [_jsx(SectionTitle, { title: dir === 'rtl' ? 'اختبار ردة الفعل والسرعة ⚡' : 'Reaction Speed Test ⚡', subtitle: dir === 'rtl' ? 'اضغط بأسرع ما يمكنك فور تغير اللون للأخضر' : 'Click as fast as possible when color turns green' }), _jsxs("div", { onClick: reactionState === 'waiting' || reactionState === 'ready' ? handleReactionClick : undefined, className: `w-full h-64 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 shadow-2xl p-6 ${reactionState === 'idle'
                            ? 'bg-brand-darkBg border-2 border-dashed border-slate-600 hover:border-cyan-400'
                            : reactionState === 'waiting'
                                ? 'bg-amber-600 text-white animate-pulse'
                                : reactionState === 'ready'
                                    ? 'bg-emerald-500 text-white scale-105 shadow-glow-blue'
                                    : 'bg-brand-card border-2 border-brand-purple'}`, children: [reactionState === 'idle' && (_jsxs("div", { className: "flex flex-col items-center gap-3", children: [_jsx(Zap, { className: "w-16 h-16 text-cyan-300" }), _jsx(Button, { variant: "primary", size: "lg", onClick: startReactionTest, leftIcon: _jsx(Play, { className: "w-5 h-5 fill-current" }), children: dir === 'rtl' ? 'ابدأ الاختبار' : 'Start Test' })] })), reactionState === 'waiting' && (_jsx("p", { className: "text-xl font-black", children: dir === 'rtl' ? 'استعد... انتظر اللون الأخضر 🟡' : 'Wait for green... 🟡' })), reactionState === 'ready' && (_jsx("p", { className: "text-3xl font-black animate-bounce", children: dir === 'rtl' ? 'اضغط الآن!! 🟢' : 'CLICK NOW!! 🟢' })), reactionState === 'result' && (_jsxs("div", { className: "flex flex-col items-center gap-4", children: [_jsx(Trophy, { className: "w-12 h-12 text-amber-400" }), _jsxs("p", { className: "text-3xl font-black text-gradient-primary", children: [reactionTime, " ms"] }), _jsx("p", { className: "text-sm text-slate-300 font-bold", children: reactionTime && reactionTime < 250
                                            ? (dir === 'rtl' ? 'سرعة خارقة كالفهد! 🐆' : 'Lightning fast! 🐆')
                                            : (dir === 'rtl' ? 'سرعة ممتازة! استمر في التمرين 👍' : 'Great speed! Keep practice 👍') }), _jsx(Button, { variant: "secondary", size: "md", onClick: startReactionTest, leftIcon: _jsx(RotateCcw, { className: "w-4 h-4" }), children: dir === 'rtl' ? 'إعادة المحاولة' : 'Try Again' })] }))] })] })) : (
            /* GAME 2: Memory Cards Game */
            _jsxs(Card, { variant: "glowing", glowColor: "purple", className: "p-6 sm:p-8 flex flex-col gap-6", children: [_jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-black text-white", children: dir === 'rtl' ? 'بطاقات الذاكرة 🃏' : 'Memory Cards 🃏' }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: dir === 'rtl' ? 'طابق كافة الأزواج المتشابهة بأقل المحاولات' : 'Match all pairs in minimum moves' })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-brand-darkBg border border-brand-cardBorder text-xs font-bold text-slate-300", children: [_jsx(Clock, { className: "w-4 h-4 text-cyan-300" }), _jsxs("span", { children: [elapsedTime, "s"] })] }), _jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-brand-darkBg border border-brand-cardBorder text-xs font-bold text-slate-300", children: [_jsx(Zap, { className: "w-4 h-4 text-amber-400" }), _jsxs("span", { children: [moves, " ", dir === 'rtl' ? 'حركات' : 'moves'] })] })] })] }), !gameStarted ? (_jsxs("div", { className: "py-16 flex flex-col items-center justify-center text-center gap-4", children: [_jsx("div", { className: "w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-purple to-indigo-700 flex items-center justify-center text-4xl shadow-glow", children: "\uD83C\uDCCF" }), _jsx("h3", { className: "text-lg font-extrabold text-white", children: dir === 'rtl' ? 'جاهز لتحدي الذاكرة؟' : 'Ready for Memory Challenge?' }), _jsx(Button, { variant: "primary", size: "lg", onClick: initMemoryGame, leftIcon: _jsx(Play, { className: "w-5 h-5 fill-current" }), children: dir === 'rtl' ? 'بدء اللعب' : 'Start Playing' })] })) : (_jsx("div", { className: "grid grid-cols-4 gap-3 sm:gap-4 max-w-md mx-auto w-full my-4", children: cards.map((card, idx) => (_jsx("button", { onClick: () => handleCardClick(idx), className: `h-24 sm:h-28 rounded-2xl border-2 text-3xl sm:text-4xl flex items-center justify-center transition-all duration-300 shadow-lg ${card.flipped || card.matched
                                ? 'bg-gradient-to-br from-brand-purple to-brand-blue border-cyan-300 rotate-y-180 scale-105'
                                : 'bg-brand-card border-brand-cardBorder hover:border-slate-500 hover:scale-102'}`, children: card.flipped || card.matched ? card.emoji : '❓' }, card.id))) })), gameWon && (_jsxs("div", { className: "p-6 rounded-3xl bg-gradient-to-r from-brand-purple/40 to-indigo-900/50 border-2 border-amber-400/60 text-center flex flex-col items-center gap-4 shadow-glow", children: [_jsx("div", { className: "text-5xl", children: "\uD83C\uDFC6" }), _jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-black text-white", children: dir === 'rtl' ? 'مبروك! انتصار ساحق 🎉' : 'Congratulations! You Won 🎉' }), _jsx("p", { className: "text-sm text-slate-300 font-medium mt-1", children: dir === 'rtl' ? `أنهيت اللعبة في ${moves} حركات و ${elapsedTime} ثانية!` : `Completed in ${moves} moves and ${elapsedTime} seconds!` })] }), _jsx(Button, { variant: "accent", size: "md", onClick: initMemoryGame, leftIcon: _jsx(RotateCcw, { className: "w-4 h-4" }), children: dir === 'rtl' ? 'العب مرة أخرى' : 'Play Again' })] }))] })), _jsx(AdSlot, { variant: "banner", slotId: "ad-game-details" })] }));
}
