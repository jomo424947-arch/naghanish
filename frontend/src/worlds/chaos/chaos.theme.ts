/**
 * chaos.theme.ts
 *
 * Dedicated visual theme tokens, palette, and navigation for World 06 — CHAOS (عالم الفوضى).
 */

export const chaosTheme = {
  id: 'chaos' as const,
  route: '/world/chaos',
  titleAr: 'عالم الفوضى',
  titleEn: 'CHAOS',
  subtitleAr: 'مش عارف إيه اللي مستنيك؟ ولا إحنا 🤪',
  subtitleEn: 'Unpredictable, crazy, and non-stop fun 🤪',
  icon: '🤪',
  badgeTextAr: 'عالم الفوضى',
  badgeTextEn: 'Chaos World',
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
}
