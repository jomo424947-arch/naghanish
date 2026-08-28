/**
 * world.theme.ts
 *
 * Theme configuration and visual tokens for the 6 NAGHANISH Gaming Worlds.
 */

import { NaghanishModeId } from '@components/common/ModeVisuals'

export interface WorldThemeConfig {
  id: NaghanishModeId
  route: string
  titleAr: string
  titleEn: string
  subtitleAr: string
  subtitleEn: string
  icon: string
  colors: {
    primary: string
    secondary: string
    accent: string
    darkBg: string
    surface: string
    cardBg: string
    border: string
    glow: string
    textAccent: string
  }
  gradients: {
    hero: string
    card: string
    button: string
    badge: string
    border: string
    text: string
  }
  navTabs: {
    id: string
    labelAr: string
    labelEn: string
    icon?: string
  }[]
  badgeTextAr: string
  badgeTextEn: string
}

export const WORLD_THEMES: Record<NaghanishModeId, WorldThemeConfig> = {
  shilla: {
    id: 'shilla',
    route: '/world/shilla',
    titleAr: 'الشِلّة',
    titleEn: 'SHILLA',
    subtitleAr: 'اللعب أحلى لما تكونوا سوا 🎉',
    subtitleEn: 'Play, laugh & compete with your crew 🎉',
    icon: '🎉',
    colors: {
      primary: '#06B6D4',
      secondary: '#0EA5E9',
      accent: '#14B8A6',
      darkBg: '#08161A',
      surface: '#0C2025',
      cardBg: 'rgba(12, 32, 37, 0.75)',
      border: 'rgba(6, 182, 212, 0.4)',
      glow: '0 0 30px rgba(6, 182, 212, 0.35)',
      textAccent: 'text-cyan-400',
    },
    gradients: {
      hero: 'from-[#08242A] via-[#091B22] to-[#040C0E]',
      card: 'from-cyan-950/40 via-teal-950/20 to-black/60',
      button: 'from-cyan-500 via-teal-500 to-emerald-500',
      badge: 'from-cyan-500/20 to-teal-500/20',
      border: 'border-cyan-500/50',
      text: 'from-cyan-300 via-teal-200 to-emerald-300',
    },
    navTabs: [
      { id: 'all', labelAr: 'الرئيسية', labelEn: 'Home', icon: '🏠' },
      { id: 'rooms', labelAr: 'الغرف الحية', labelEn: 'Live Rooms', icon: '🚪' },
      { id: 'friends', labelAr: 'الأصدقاء', labelEn: 'Friends', icon: '👥' },
      { id: 'games', labelAr: 'ألعاب الشلة', labelEn: 'Party Games', icon: '🎮' },
    ],
    badgeTextAr: 'عالم الشلة',
    badgeTextEn: 'Shilla World',
  },

  arcade: {
    id: 'arcade',
    route: '/world/arcade',
    titleAr: 'الأركيد',
    titleEn: 'ARCADE',
    subtitleAr: 'اضرب الرقم القياسي وعش أجواء النيون 🕹️',
    subtitleEn: 'Beat high scores in retro neon atmosphere 🕹️',
    icon: '🕹️',
    colors: {
      primary: '#00D2FF',
      secondary: '#9333EA',
      accent: '#EC4899',
      darkBg: '#09081E',
      surface: '#120F35',
      cardBg: 'rgba(18, 15, 53, 0.75)',
      border: 'rgba(0, 210, 255, 0.4)',
      glow: '0 0 30px rgba(0, 210, 255, 0.35)',
      textAccent: 'text-cyan-400',
    },
    gradients: {
      hero: 'from-[#1B0B3B] via-[#0D1236] to-[#06081A]',
      card: 'from-purple-950/40 via-blue-950/30 to-black/70',
      button: 'from-cyan-500 via-blue-600 to-purple-600',
      badge: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/50',
      text: 'from-cyan-300 via-blue-300 to-purple-300',
    },
    navTabs: [
      { id: 'all', labelAr: 'الكابينات', labelEn: 'All Cabinets', icon: '🕹️' },
      { id: 'high-scores', labelAr: 'أعلى النقاط', labelEn: 'High Scores', icon: '⚡' },
      { id: 'new', labelAr: 'الجديد', labelEn: 'New Games', icon: '✨' },
      { id: 'retro', labelAr: 'كلاسيك', labelEn: 'Retro Hits', icon: '👾' },
    ],
    badgeTextAr: 'عالم الأركيد',
    badgeTextEn: 'Arcade World',
  },

  iqlab: {
    id: 'iqlab',
    route: '/world/iq-lab',
    titleAr: 'مختبر الذكاء',
    titleEn: 'IQ LAB',
    subtitleAr: 'اختبر عقلك واكتشف خريطتك الذهنية 🧪',
    subtitleEn: 'Unlock cognitive prowess and mind maps 🧪',
    icon: '🧠',
    colors: {
      primary: '#A855F7',
      secondary: '#EC4899',
      accent: '#06B6D4',
      darkBg: '#120B24',
      surface: '#1D1238',
      cardBg: 'rgba(29, 18, 56, 0.75)',
      border: 'rgba(168, 85, 247, 0.4)',
      glow: '0 0 30px rgba(168, 85, 247, 0.35)',
      textAccent: 'text-violet-400',
    },
    gradients: {
      hero: 'from-[#2A0E4E] via-[#1A0B33] to-[#0A0517]',
      card: 'from-violet-950/40 via-purple-950/20 to-black/60',
      button: 'from-purple-600 via-pink-600 to-violet-700',
      badge: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/50',
      text: 'from-violet-300 via-pink-300 to-cyan-300',
    },
    navTabs: [
      { id: 'all', labelAr: 'المختبر', labelEn: 'Overview', icon: '🧠' },
      { id: 'tests', labelAr: 'الاختبارات', labelEn: 'IQ Tests', icon: '🧪' },
      { id: 'personality', labelAr: 'الشخصية', labelEn: 'Personality', icon: '💡' },
      { id: 'stats', labelAr: 'خريطتي الذهنية', labelEn: 'My Mind Map', icon: '📊' },
    ],
    badgeTextAr: 'مختبر الذكاء',
    badgeTextEn: 'IQ Lab',
  },

  reflex: {
    id: 'reflex',
    route: '/world/reflex',
    titleAr: 'ردة الفعل',
    titleEn: 'REFLEX',
    subtitleAr: 'السرعة هي السلاح.. بالمللي ثانية ⚡',
    subtitleEn: 'Speed is everything in sub-milliseconds ⚡',
    icon: '⚡',
    colors: {
      primary: '#EF4444',
      secondary: '#F43F5E',
      accent: '#FACC15',
      darkBg: '#1A0808',
      surface: '#2A0E0E',
      cardBg: 'rgba(42, 14, 14, 0.75)',
      border: 'rgba(239, 68, 68, 0.4)',
      glow: '0 0 30px rgba(239, 68, 68, 0.35)',
      textAccent: 'text-red-400',
    },
    gradients: {
      hero: 'from-[#3D0A0A] via-[#240808] to-[#120404]',
      card: 'from-red-950/40 via-rose-950/20 to-black/60',
      button: 'from-red-600 via-rose-500 to-pink-500',
      badge: 'from-red-500/20 to-rose-500/20',
      border: 'border-red-500/50',
      text: 'from-red-400 via-rose-300 to-yellow-200',
    },
    navTabs: [
      { id: 'all', labelAr: 'حلبة السرعة', labelEn: 'Speed Arena', icon: '⚡' },
      { id: 'challenge', labelAr: 'تحدي اليوم', labelEn: 'Daily Sprint', icon: '🔥' },
      { id: 'records', labelAr: 'الأرقام القياسية', labelEn: 'Records', icon: '⏱️' },
      { id: 'history', labelAr: 'محاولاتي', labelEn: 'My Attempts', icon: '📈' },
    ],
    badgeTextAr: 'ردة الفعل',
    badgeTextEn: 'Reflex Speed',
  },

  champions: {
    id: 'champions',
    route: '/world/champions',
    titleAr: 'الأبطال',
    titleEn: 'CHAMPIONS',
    subtitleAr: 'عرش الصدارة والمجد للأفضل فقط 🏆',
    subtitleEn: 'The throne of prestige and glory 🏆',
    icon: '🏆',
    colors: {
      primary: '#EAB308',
      secondary: '#F59E0B',
      accent: '#A855F7',
      darkBg: '#1A1405',
      surface: '#281F08',
      cardBg: 'rgba(40, 31, 8, 0.75)',
      border: 'rgba(234, 179, 8, 0.4)',
      glow: '0 0 30px rgba(234, 179, 8, 0.35)',
      textAccent: 'text-amber-400',
    },
    gradients: {
      hero: 'from-[#382805] via-[#211703] to-[#0F0B02]',
      card: 'from-amber-950/40 via-yellow-950/20 to-black/60',
      button: 'from-amber-500 via-yellow-400 to-amber-600',
      badge: 'from-amber-500/20 to-yellow-500/20',
      border: 'border-amber-500/50',
      text: 'from-amber-300 via-yellow-200 to-yellow-400',
    },
    navTabs: [
      { id: 'all', labelAr: 'منصة التتويج', labelEn: 'Podium', icon: '🏆' },
      { id: 'global', labelAr: 'الصدارة العامة', labelEn: 'Leaderboard', icon: '👑' },
      { id: 'tournaments', labelAr: 'البطولات', labelEn: 'Tournaments', icon: '⚔️' },
      { id: 'trophies', labelAr: 'كؤوسي', labelEn: 'My Trophies', icon: '🎖️' },
    ],
    badgeTextAr: 'عالم الأبطال',
    badgeTextEn: 'Champions',
  },

  chaos: {
    id: 'chaos',
    route: '/world/chaos',
    titleAr: 'عالم الفوضى',
    titleEn: 'CHAOS',
    subtitleAr: 'مش عارف إيه اللي مستنيك؟ ولا إحنا 🤪',
    subtitleEn: 'Unpredictable, crazy, and non-stop fun 🤪',
    icon: '🤪',
    colors: {
      primary: '#84CC16',
      secondary: '#10B981',
      accent: '#FACC15',
      darkBg: '#0A180E',
      surface: '#112918',
      cardBg: 'rgba(17, 41, 24, 0.75)',
      border: 'rgba(132, 204, 22, 0.4)',
      glow: '0 0 30px rgba(132, 204, 22, 0.35)',
      textAccent: 'text-lime-400',
    },
    gradients: {
      hero: 'from-[#17381E] via-[#0E2313] to-[#061008]',
      card: 'from-lime-950/40 via-emerald-950/20 to-black/60',
      button: 'from-lime-500 via-emerald-500 to-yellow-500',
      badge: 'from-lime-500/20 to-emerald-500/20',
      border: 'border-lime-500/50',
      text: 'from-lime-300 via-emerald-300 to-yellow-200',
    },
    navTabs: [
      { id: 'all', labelAr: 'التحدي العشوائي', labelEn: 'Random Challenge', icon: '🎲' },
      { id: 'madness', labelAr: 'جنون اليوم', labelEn: 'Daily Madness', icon: '🤪' },
      { id: 'roulette', labelAr: 'روليت التحديات', labelEn: 'Roulette', icon: '🎯' },
      { id: 'streaks', labelAr: 'سجل الفوضى', labelEn: 'Chaos History', icon: '⚡' },
    ],
    badgeTextAr: 'عالم الفوضى',
    badgeTextEn: 'Chaos World',
  },
}
