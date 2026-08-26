/**
 * shilla.theme.ts
 *
 * Dedicated visual theme tokens, palette, and navigation for World 01 — SHILLA (الشلة).
 */

export const shillaTheme = {
  id: 'shilla' as const,
  route: '/world/shilla',
  titleAr: 'الشِلّة',
  titleEn: 'SHILLA',
  subtitleAr: 'اللعب أحلى لما تكونوا سوا 🎉',
  subtitleEn: 'Play, laugh & compete with your crew 🎉',
  icon: '🎉',
  badgeTextAr: 'عالم الشلة',
  badgeTextEn: 'Shilla World',
  colors: {
    primary: '#FF7315',
    secondary: '#FACC15',
    accent: '#00D2FF',
    darkBg: '#1A0E08',
    surface: '#26140A',
    cardBg: 'rgba(38, 20, 10, 0.75)',
    border: 'rgba(255, 115, 21, 0.4)',
    glow: '0 0 30px rgba(255, 115, 21, 0.35)',
    textAccent: 'text-orange-400',
  },
  gradients: {
    hero: 'from-[#381503] via-[#241008] to-[#120803]',
    card: 'from-orange-950/40 via-amber-950/20 to-black/60',
    button: 'from-orange-500 via-amber-500 to-orange-600',
    badge: 'from-orange-500/20 to-amber-500/20',
    border: 'border-orange-500/50',
    text: 'from-orange-400 via-amber-300 to-yellow-200',
  },
  navTabs: [
    { id: 'all', labelAr: 'الرئيسية', labelEn: 'Overview', icon: '🏠' },
    { id: 'rooms', labelAr: 'الغرف الحية', labelEn: 'Live Rooms', icon: '🚪' },
    { id: 'friends', labelAr: 'الأصدقاء', labelEn: 'Friends', icon: '👥' },
    { id: 'games', labelAr: 'ألعاب الشلة', labelEn: 'Party Games', icon: '🎮' },
  ],
}
