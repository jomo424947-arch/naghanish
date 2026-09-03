/**
 * arcade.theme.ts
 *
 * Dedicated visual theme tokens, palette, and navigation for World 02 — ARCADE (الأركيد).
 */

export const arcadeTheme = {
  id: 'arcade' as const,
  route: '/world/arcade',
  titleAr: 'الأركيد',
  titleEn: 'ARCADE',
  subtitleAr: 'اضرب الرقم القياسي وعش أجواء النيون 🕹️',
  subtitleEn: 'Beat high scores in retro neon atmosphere 🕹️',
  icon: '🕹️',
  badgeTextAr: 'عالم الأركيد',
  badgeTextEn: 'Arcade World',
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
    { id: 'new', labelAr: 'الجديد', labelEn: 'New Hits', icon: '✨' },
    { id: 'retro', labelAr: 'كلاسيك', labelEn: 'Retro Hits', icon: '👾' },
  ],
}
