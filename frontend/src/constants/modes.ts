/**
 * modes.ts
 *
 * The six Naghanish worlds and their presentation metadata.
 * Kept out of component files so Fast Refresh stays intact.
 */

export type NaghanishModeId = 'shilla' | 'arcade' | 'iqlab' | 'reflex' | 'champions' | 'chaos'

export interface NaghanishModeConfig {
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

export const NAGHANISH_MODES: Record<NaghanishModeId, NaghanishModeConfig> = {
  shilla: {
    id: 'shilla',
    titleAr: 'الشِلّة',
    titleEn: 'SHILLA',
    taglineAr: 'العب وتحدى أصحابك! 🎉',
    taglineEn: 'Play with your crew! 🎉',
    descAr: 'غرف لعب جماعية، تحديات لايف، وضحك للصبح مع أصحابك.',
    descEn: 'Live party multiplayer rooms, real-time challenges & fun.',
    color: '#06B6D4',
    bgGradient: 'from-cyan-500/20 via-teal-500/10 to-blue-500/15',
    borderClass: 'mode-border-shilla',
    accentColor: 'text-cyan-300',
    glowClass: 'shadow-glow-teal',
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
    bgGradient: 'from-red-600/25 via-rose-600/15 to-pink-500/20',
    borderClass: 'mode-border-reflex',
    accentColor: 'text-red-400',
    glowClass: 'shadow-glow-red',
    icon: '⚡',
    route: '/games/g-rhythm',
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
