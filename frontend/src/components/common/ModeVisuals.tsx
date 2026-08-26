import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@lib/utils'

export type NaghanishModeId = 'shilla' | 'arcade' | 'iqlab' | 'reflex' | 'champions' | 'chaos'

export interface ModeVisualProps {
  mode: NaghanishModeId
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero'
  className?: string
  animated?: boolean
}

export const NAGHANISH_MODES: Record<
  NaghanishModeId,
  {
    id: NaghanishModeId
    titleAr: string
    titleEn: string
    taglineAr: string
    taglineEn: string
    descAr: string
    descEn: string
    color: string
    bgGradient: string
    borderClass: string
    accentColor: string
    glowClass: string
    icon: string
    route: string
  }
> = {
  shilla: {
    id: 'shilla',
    titleAr: 'الشِلّة',
    titleEn: 'SHILLA',
    taglineAr: 'العب وتحدى أصحابك! 🎉',
    taglineEn: 'Play with your crew! 🎉',
    descAr: 'غرف لعب جماعية، تحديات لايف، وضحك للصبح مع أصحابك.',
    descEn: 'Live party multiplayer rooms, real-time challenges & fun.',
    color: '#FF7315',
    bgGradient: 'from-orange-500/20 via-amber-500/10 to-cyan-500/15',
    borderClass: 'mode-border-shilla',
    accentColor: 'text-orange-400',
    glowClass: 'shadow-glow-orange',
    icon: '🎉',
    route: '/party',
  },
  arcade: {
    id: 'arcade',
    titleAr: 'الأركيد',
    titleEn: 'ARCADE',
    taglineAr: 'عالم الألعاب الكلاسيكية والنيون 🕹️',
    taglineEn: 'Retro neon gaming hub 🕹️',
    descAr: 'ألعاب ذاكرة، سرعة، ومغامرات نيون تحطم فيها الأرقام القياسية.',
    descEn: 'Memory, reflex, and retro neon mini-games to break high scores.',
    color: '#00D2FF',
    bgGradient: 'from-purple-600/25 via-blue-600/15 to-cyan-500/20',
    borderClass: 'mode-border-arcade',
    accentColor: 'text-cyan-300',
    glowClass: 'shadow-glow-blue',
    icon: '🕹️',
    route: '/games',
  },
  iqlab: {
    id: 'iqlab',
    titleAr: 'مختبر الذكاء',
    titleEn: 'IQ LAB',
    taglineAr: 'اكتشف قدراتك الخارقة 🧪',
    taglineEn: 'Test your brainpower 🧪',
    descAr: 'اختبارات ذكاء، تحليل شخصية تفاعلي، وألغاز استراتيجية عميقة.',
    descEn: 'Personality analysis, IQ challenges, and mind-bending puzzles.',
    color: '#8B5CF6',
    bgGradient: 'from-violet-600/25 via-pink-600/15 to-blue-500/20',
    borderClass: 'mode-border-iqlab',
    accentColor: 'text-violet-300',
    glowClass: 'shadow-glow',
    icon: '🧠',
    route: '/quizzes',
  },
  reflex: {
    id: 'reflex',
    titleAr: 'ردة الفعل',
    titleEn: 'REFLEX',
    taglineAr: 'السرعة هي السلاح ⚡',
    taglineEn: 'Speed is everything ⚡',
    descAr: 'اختبارات ردة فعل فائقة بالمللي ثانية لتحدي أقصى سرعاتك.',
    descEn: 'Sub-millisecond reaction test arena with high adrenaline rush.',
    color: '#EF4444',
    bgGradient: 'from-red-600/25 via-orange-600/15 to-amber-500/20',
    borderClass: 'mode-border-reflex',
    accentColor: 'text-red-400',
    glowClass: 'shadow-glow-red',
    icon: '⚡',
    route: '/games/g2',
  },
  champions: {
    id: 'champions',
    titleAr: 'الأبطال',
    titleEn: 'CHAMPIONS',
    taglineAr: 'عرش الصدارة والمجد 🏆',
    taglineEn: 'Glory & Prestige leaderboard 🏆',
    descAr: 'لوحات صدارة حية، بطولات أسبوعية، وتتويج نخبة لاعبي نغانيش.',
    descEn: 'Live leaderboards, weekly cups, medals and elite bragging rights.',
    color: '#EAB308',
    bgGradient: 'from-amber-500/25 via-yellow-600/15 to-purple-900/30',
    borderClass: 'mode-border-champions',
    accentColor: 'text-amber-300',
    glowClass: 'shadow-glow-gold',
    icon: '🏆',
    route: '/leaderboard',
  },
  chaos: {
    id: 'chaos',
    titleAr: 'عالم الفوضى',
    titleEn: 'CHAOS',
    taglineAr: 'ضحك ومقالب بلا حدود 🤪',
    taglineEn: 'Pure fun and unpredictable madness 🤪',
    descAr: 'تحديات عشوائية ومضحكة تقلب اللعبة رأساً على عقب مع الشلة.',
    descEn: 'Random hilarious challenges, dares and unpredictable twists.',
    color: '#84CC16',
    bgGradient: 'from-lime-500/25 via-emerald-600/15 to-amber-500/20',
    borderClass: 'mode-border-chaos',
    accentColor: 'text-lime-300',
    glowClass: 'shadow-glow-lime',
    icon: '🤪',
    route: '/challenges',
  },
}

export const ModeMascot: React.FC<ModeVisualProps> = ({
  mode,
  size = 'md',
  className,
  animated = true,
}) => {
  const sizeStyles = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
    hero: 'w-48 h-48 sm:w-64 sm:h-64',
  }

  const renderSVG = () => {
    switch (mode) {
      case 'shilla':
        return (
          <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="shillaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF7315" />
                <stop offset="60%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#00D2FF" />
              </linearGradient>
              <filter id="shillaGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Background disc */}
            <circle cx="80" cy="80" r="68" fill="#1C1A2E" stroke="url(#shillaGrad)" strokeWidth="3" />
            {/* Party confetti sparks */}
            <circle cx="34" cy="38" r="5" fill="#00D2FF" />
            <polygon points="125,30 132,42 118,42" fill="#FF7315" />
            <polygon points="135,115 142,125 128,125" fill="#84CC16" />
            <circle cx="28" cy="115" r="4.5" fill="#FACC15" />
            {/* Mascot Head (Smiling Party Dude) */}
            <circle cx="80" cy="85" r="44" fill="url(#shillaGrad)" filter="url(#shillaGlow)" />
            {/* Party Cap */}
            <polygon points="80,18 56,58 104,58" fill="#FF7315" stroke="#FACC15" strokeWidth="3" />
            <circle cx="80" cy="16" r="6" fill="#00D2FF" />
            {/* Big Expressive Cartoon Eyes */}
            <ellipse cx="64" cy="80" rx="9" ry="12" fill="#FFFFFF" />
            <circle cx="67" cy="80" r="5" fill="#0F0F1A" />
            <circle cx="69" cy="77" r="2" fill="#FFFFFF" />
            <ellipse cx="96" cy="80" rx="9" ry="12" fill="#FFFFFF" />
            <circle cx="93" cy="80" r="5" fill="#0F0F1A" />
            <circle cx="95" cy="77" r="2" fill="#FFFFFF" />
            {/* Big Happy Mouth */}
            <path d="M 58 98 Q 80 120 102 98" stroke="#0F0F1A" strokeWidth="5" strokeLinecap="round" fill="#EF4444" />
            {/* Rosy Cheeks */}
            <circle cx="50" cy="94" r="6" fill="#FF7315" opacity="0.6" />
            <circle cx="110" cy="94" r="6" fill="#FF7315" opacity="0.6" />
          </svg>
        )

      case 'arcade':
        return (
          <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="arcadeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="50%" stopColor="#00D2FF" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
            {/* Arcade Frame */}
            <rect x="20" y="24" width="120" height="112" rx="28" fill="#14142B" stroke="url(#arcadeGrad)" strokeWidth="3.5" />
            {/* Visor Screen */}
            <rect x="34" y="44" width="92" height="48" rx="14" fill="#090914" stroke="#00D2FF" strokeWidth="2" />
            {/* Pixel Neon Eyes */}
            <rect x="48" y="58" width="18" height="18" rx="4" fill="#00D2FF" />
            <rect x="94" y="58" width="18" height="18" rx="4" fill="#00D2FF" />
            {/* Arcade Buttons & Joystick */}
            <circle cx="52" cy="112" r="7" fill="#EC4899" />
            <circle cx="72" cy="112" r="7" fill="#FACC15" />
            <circle cx="108" cy="112" r="8" fill="#00D2FF" />
            {/* Antenna with glowing beacon */}
            <line x1="80" y1="24" x2="80" y2="10" stroke="#00D2FF" strokeWidth="3" strokeLinecap="round" />
            <circle cx="80" cy="8" r="5" fill="#7C3AED" stroke="#00D2FF" strokeWidth="2" />
          </svg>
        )

      case 'iqlab':
        return (
          <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="iqlabGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="60%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#00D2FF" />
              </linearGradient>
            </defs>
            <circle cx="80" cy="80" r="68" fill="#15122B" stroke="url(#iqlabGrad)" strokeWidth="3" />
            {/* Orbiting Quantum Electrons */}
            <ellipse cx="80" cy="80" rx="60" ry="24" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="4 4" transform="rotate(-30 80 80)" />
            <ellipse cx="80" cy="80" rx="60" ry="24" stroke="#00D2FF" strokeWidth="1.5" strokeDasharray="4 4" transform="rotate(30 80 80)" />
            <circle cx="128" cy="60" r="4" fill="#EC4899" />
            <circle cx="36" cy="104" r="4" fill="#00D2FF" />
            {/* Futuristic Glowing Brain Motif */}
            <path
              d="M 60 92 C 46 88 44 68 56 56 C 66 46 76 52 80 58 C 84 52 94 46 104 56 C 116 68 114 88 100 92 C 94 104 84 108 80 108 C 76 108 66 104 60 92 Z"
              fill="url(#iqlabGrad)"
            />
            {/* Futuristic Scientist Goggles */}
            <rect x="52" y="68" width="24" height="16" rx="8" fill="#090914" stroke="#00D2FF" strokeWidth="2.5" />
            <rect x="84" y="68" width="24" height="16" rx="8" fill="#090914" stroke="#00D2FF" strokeWidth="2.5" />
            <line x1="76" y1="76" x2="84" y2="76" stroke="#00D2FF" strokeWidth="2.5" />
            <circle cx="64" cy="76" r="3" fill="#00D2FF" />
            <circle cx="96" cy="76" r="3" fill="#00D2FF" />
          </svg>
        )

      case 'reflex':
        return (
          <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="reflexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="60%" stopColor="#FF7315" />
                <stop offset="100%" stopColor="#FACC15" />
              </linearGradient>
            </defs>
            <polygon points="80,12 148,80 80,148 12,80" fill="#201015" stroke="url(#reflexGrad)" strokeWidth="3" />
            {/* Speed Lines */}
            <line x1="24" y1="44" x2="48" y2="44" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="18" y1="80" x2="44" y2="80" stroke="#FF7315" strokeWidth="3" strokeLinecap="round" />
            <line x1="24" y1="116" x2="52" y2="116" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
            {/* Giant Lightning Bolt */}
            <path
              d="M 92 24 L 54 84 L 84 84 L 68 136 L 112 72 L 82 72 Z"
              fill="url(#reflexGrad)"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
          </svg>
        )

      case 'champions':
        return (
          <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="champGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
            </defs>
            <circle cx="80" cy="80" r="68" fill="#1C142A" stroke="url(#champGrad)" strokeWidth="3" />
            {/* Laurel Wreath */}
            <path d="M 38 96 Q 34 60 52 40" stroke="#EAB308" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 122 96 Q 126 60 108 40" stroke="#EAB308" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Golden Trophy Body */}
            <path d="M 52 48 L 108 48 L 100 94 Q 80 110 60 94 Z" fill="url(#champGrad)" stroke="#FFFFFF" strokeWidth="2" />
            {/* Handles */}
            <path d="M 52 56 Q 32 64 54 80" stroke="#EAB308" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 108 56 Q 128 64 106 80" stroke="#EAB308" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Base */}
            <rect x="68" y="106" width="24" height="14" fill="#EAB308" />
            <rect x="56" y="120" width="48" height="10" rx="4" fill="#FDE047" />
            {/* Crown At Top */}
            <polygon points="62,42 70,30 80,42 90,30 98,42" fill="#FDE047" stroke="#EAB308" strokeWidth="1.5" />
            {/* Star badge on trophy */}
            <polygon points="80,64 83,72 92,72 85,78 87,86 80,81 73,86 75,78 68,72 77,72" fill="#FFFFFF" />
          </svg>
        )

      case 'chaos':
        return (
          <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="chaosGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#84CC16" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#FACC15" />
              </linearGradient>
            </defs>
            <rect x="20" y="20" width="120" height="120" rx="36" fill="#12241A" stroke="url(#chaosGrad)" strokeWidth="3" transform="rotate(4 80 80)" />
            {/* Chaos Horns */}
            <path d="M 50 46 Q 34 20 42 16 Q 58 24 58 42" fill="#84CC16" />
            <path d="M 110 46 Q 126 20 118 16 Q 102 24 102 42" fill="#84CC16" />
            {/* Silly Mascot Face */}
            <circle cx="80" cy="84" r="42" fill="url(#chaosGrad)" />
            {/* Googly Eyes */}
            <circle cx="64" cy="74" r="14" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <circle cx="67" cy="76" r="7" fill="#0F172A" />
            <circle cx="96" cy="74" r="11" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <circle cx="94" cy="72" r="5" fill="#0F172A" />
            {/* Tongue out mouth */}
            <path d="M 60 96 Q 80 116 100 96" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 72 102 C 72 118 88 118 88 102 Z" fill="#EF4444" stroke="#0F172A" strokeWidth="2" />
          </svg>
        )
    }
  }

  return (
    <motion.div
      animate={
        animated
          ? {
              y: [0, -6, 0],
              rotate: [0, 1.5, -1.5, 0],
            }
          : undefined
      }
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      className={cn('relative select-none shrink-0 flex items-center justify-center', sizeStyles[size], className)}
    >
      {renderSVG()}
    </motion.div>
  )
}
