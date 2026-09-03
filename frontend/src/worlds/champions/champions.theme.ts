/**
 * champions.theme.ts
 *
 * Dedicated visual theme tokens, palette, and navigation for World 05 — CHAMPIONS (الأبطال).
 */

export const championsTheme = {
  id: 'champions' as const,
  route: '/world/champions',
  titleAr: 'الأبطال',
  titleEn: 'CHAMPIONS',
  subtitleAr: 'عرش الصدارة والمجد للأفضل فقط 🏆',
  subtitleEn: 'The throne of prestige and tournament glory 🏆',
  icon: '🏆',
  badgeTextAr: 'عالم الأبطال',
  badgeTextEn: 'Champions',
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
}
