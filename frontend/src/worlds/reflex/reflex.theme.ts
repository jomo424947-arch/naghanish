/**
 * reflex.theme.ts
 *
 * Dedicated visual theme tokens, palette, and navigation for World 04 — REFLEX (ردة الفعل).
 */

export const reflexTheme = {
  id: 'reflex' as const,
  route: '/world/reflex',
  titleAr: 'ردة الفعل',
  titleEn: 'REFLEX',
  subtitleAr: 'السرعة هي السلاح.. بالمللي ثانية ⚡',
  subtitleEn: 'Speed is everything in sub-milliseconds ⚡',
  icon: '⚡',
  badgeTextAr: 'ردة الفعل',
  badgeTextEn: 'Reflex Speed',
  colors: {
    primary: '#EF4444',
    secondary: '#F97316',
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
    card: 'from-red-950/40 via-orange-950/20 to-black/60',
    button: 'from-red-600 via-orange-500 to-amber-500',
    badge: 'from-red-500/20 to-orange-500/20',
    border: 'border-red-500/50',
    text: 'from-red-400 via-orange-300 to-yellow-200',
  },
  navTabs: [
    { id: 'all', labelAr: 'حلبة السرعة', labelEn: 'Speed Arena', icon: '⚡' },
    { id: 'challenge', labelAr: 'تحدي اليوم', labelEn: 'Daily Sprint', icon: '🔥' },
    { id: 'records', labelAr: 'الأرقام القياسية', labelEn: 'Records', icon: '⏱️' },
    { id: 'history', labelAr: 'محاولاتي', labelEn: 'My Attempts', icon: '📈' },
  ],
}
