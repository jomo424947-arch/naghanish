/**
 * iqLab.theme.ts
 *
 * Dedicated visual theme tokens, palette, and navigation for World 03 — IQ LAB (مختبر الذكاء).
 */

export const iqLabTheme = {
  id: 'iqlab' as const,
  route: '/world/iq-lab',
  titleAr: 'مختبر الذكاء',
  titleEn: 'IQ LAB',
  subtitleAr: 'اختبر عقلك واكتشف خريطتك الذهنية 🧪',
  subtitleEn: 'Unlock cognitive prowess and mind maps 🧪',
  icon: '🧠',
  badgeTextAr: 'مختبر الذكاء',
  badgeTextEn: 'IQ Lab',
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
    { id: 'games', labelAr: 'ألعاب الذكاء', labelEn: 'Brain Games', icon: '🧩' },
    { id: 'personality', labelAr: 'الشخصية', labelEn: 'Personality', icon: '💡' },
    { id: 'stats', labelAr: 'خريطتي الذهنية', labelEn: 'My Mind Map', icon: '📊' },
  ],
}
