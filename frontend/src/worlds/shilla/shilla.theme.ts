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
    { id: 'all', labelAr: 'الرئيسية', labelEn: 'Overview', icon: '🏠' },
    { id: 'rooms', labelAr: 'الغرف الحية', labelEn: 'Live Rooms', icon: '🚪' },
    { id: 'friends', labelAr: 'الأصدقاء', labelEn: 'Friends', icon: '👥' },
    { id: 'games', labelAr: 'ألعاب الشلة', labelEn: 'Party Games', icon: '🎮' },
  ],
}
