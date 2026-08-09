import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Camera, Check } from 'lucide-react';
import { cn } from '@lib/utils';
export const AVATAR_OPTIONS = [
    { id: 'mascot-1', name: 'Brainy Mascot', icon: '🧠', color: 'from-purple-500 to-indigo-600' },
    { id: 'mascot-2', name: 'Party Bot', icon: '🤖', color: 'from-cyan-400 to-blue-600' },
    { id: 'mascot-3', name: 'Sparkle Cat', icon: '🐱', color: 'from-orange-400 to-amber-500' },
    { id: 'mascot-4', name: 'Star Winner', icon: '🏆', color: 'from-yellow-400 to-amber-600' },
    { id: 'mascot-5', name: 'Magic Quiz', icon: '🪄', color: 'from-pink-500 to-rose-600' },
    { id: 'mascot-6', name: 'Speed Runner', icon: '⚡', color: 'from-emerald-400 to-teal-600' },
];
export const AvatarPicker = ({ selectedAvatar, onSelectAvatar, onCustomUpload, }) => {
    const currentAvatarObj = AVATAR_OPTIONS.find((a) => a.id === selectedAvatar) || AVATAR_OPTIONS[0];
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0] && onCustomUpload) {
            onCustomUpload(e.target.files[0]);
        }
    };
    return (_jsxs("div", { className: "flex flex-col items-center gap-6 w-full", children: [_jsxs("div", { className: "relative group", children: [_jsx(motion.div, { initial: { scale: 0.8, rotate: -5 }, animate: { scale: 1, rotate: 0 }, transition: { type: 'spring', stiffness: 300, damping: 20 }, className: cn('w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br flex items-center justify-center text-5xl sm:text-6xl shadow-glow-blue border-4 border-brand-card', currentAvatarObj.color), children: currentAvatarObj.icon }, selectedAvatar), _jsxs("label", { htmlFor: "avatar-upload-input", className: "absolute -bottom-2 -right-2 rtl:-right-auto rtl:-left-2 p-2.5 rounded-2xl bg-brand-purple text-white border-2 border-brand-card shadow-lg hover:bg-purple-600 cursor-pointer transition-transform duration-200 active:scale-95", title: "Upload custom avatar", children: [_jsx(Camera, { className: "w-5 h-5" }), _jsx("input", { id: "avatar-upload-input", type: "file", accept: "image/*", className: "sr-only", onChange: handleFileChange })] })] }), _jsx("div", { className: "w-full flex items-center justify-center gap-3 flex-wrap", children: AVATAR_OPTIONS.map((avatar) => {
                    const isSelected = avatar.id === selectedAvatar;
                    return (_jsxs(motion.button, { whileHover: { scale: 1.1, y: -2 }, whileTap: { scale: 0.9 }, type: "button", onClick: () => onSelectAvatar(avatar.id), className: cn('relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl border-2 transition-all duration-200 cursor-pointer', avatar.color, isSelected
                            ? 'border-white shadow-glow ring-2 ring-brand-purple'
                            : 'border-transparent opacity-75 hover:opacity-100'), children: [avatar.icon, isSelected && (_jsx("div", { className: "absolute -top-1 -right-1 rtl:-right-auto rtl:-left-1 w-4 h-4 rounded-full bg-brand-blue text-slate-950 flex items-center justify-center text-[10px] font-bold shadow", children: _jsx(Check, { className: "w-3 h-3 stroke-[3]" }) }))] }, avatar.id));
                }) })] }));
};
