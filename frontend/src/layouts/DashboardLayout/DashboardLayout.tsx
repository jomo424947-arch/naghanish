import React from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Gamepad2, Sparkles, Users, Trophy, User, Bell, Zap } from 'lucide-react'
import { AnimatedBackground } from '@components/common/AnimatedBackground'
import { Logo } from '@components/common/Logo'
import { GamerMascot } from '@components/common/GamerMascot'
import { ROUTES } from '@constants/routes'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'
import { cn } from '@lib/utils'

const NAV_ITEMS = [
  { to: ROUTES.HOME, icon: Home, labelAr: 'الرئيسية', labelEn: 'Hub', badgeColor: 'hover:text-orange-400' },
  { to: ROUTES.GAMES, icon: Gamepad2, labelAr: 'الألعاب', labelEn: 'Catalog', badgeColor: 'hover:text-cyan-400' },
  { to: ROUTES.WORLD_SHILLA, icon: Users, labelAr: 'الشِلّة', labelEn: 'Shilla', badgeColor: 'hover:text-cyan-400' },
  { to: ROUTES.WORLD_ARCADE, icon: Gamepad2, labelAr: 'الأركيد', labelEn: 'Arcade', badgeColor: 'hover:text-blue-400' },
  { to: ROUTES.WORLD_IQ_LAB, icon: Sparkles, labelAr: 'المختبر', labelEn: 'IQ Lab', badgeColor: 'hover:text-violet-400' },
  { to: ROUTES.WORLD_CHAMPIONS, icon: Trophy, labelAr: 'الصدارة', labelEn: 'Champions', badgeColor: 'hover:text-amber-400' },
  { to: ROUTES.PROFILE, icon: User, labelAr: 'الملف', labelEn: 'Profile', badgeColor: 'hover:text-orange-400' },
]

export function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()
  const { dir } = useThemeStore()

  return (
    <div className="relative min-h-screen bg-brand-darkBg text-foreground flex flex-col overflow-x-hidden">
      <AnimatedBackground variant="minimal" />

      {/* ── Desktop Top Gaming Navigation Bar ─────────────────────────── */}
      <header className="hidden md:flex relative z-30 w-full bg-[#0E0E12]/90 border-b border-white/10 backdrop-blur-2xl sticky top-0 shadow-2xl">
        <div className="w-full max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
          <Logo size="sm" showTagline={false} />

          {/* Desktop Nav Links */}
          <nav className="flex items-center gap-1.5 p-1 rounded-2xl bg-brand-darkBg/80 border border-white/10">
            {NAV_ITEMS.map(({ to, icon: Icon, labelAr, labelEn }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer',
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-slate-950 shadow-glow-orange border border-amber-300/60'
                      : 'text-slate-400 hover:text-white hover:bg-brand-card'
                  )
                }
              >
                <Icon className="w-4 h-4" />
                <span>{dir === 'rtl' ? labelAr : labelEn}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right: Coins + Level + Avatar */}
          <div className="flex items-center gap-3">
            {/* Coins */}
            <button
              onClick={() => navigate(ROUTES.STORE)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-brand-card/90 border border-amber-400/40 text-xs font-black text-amber-300 shadow-glow-gold hover:scale-105 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{user?.coins ?? 2450}</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => navigate(ROUTES.NOTIFICATIONS)}
              className="p-2 rounded-2xl bg-brand-card/90 border border-white/10 text-slate-300 hover:text-white hover:border-orange-500/60 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Avatar Pill */}
            <button
              onClick={() => navigate(ROUTES.PROFILE)}
              className="flex items-center gap-2 p-1 pl-2.5 rtl:pl-1 rtl:pr-2.5 rounded-2xl bg-brand-card/90 border border-white/10 hover:border-orange-500/80 transition-all cursor-pointer"
            >
              <span className="text-[11px] font-black text-orange-400 hidden lg:inline">
                LVL {user?.level ?? 12}
              </span>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-glow-orange overflow-hidden">
                <GamerMascot variant="avatar" size="avatar" animated={false} className="scale-60" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ── Page Content ────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 pb-28 md:pb-10 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Mobile Bottom Navigation Bar (Tactile Gaming Dock) ──────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0E0E12]/95 backdrop-blur-2xl border-t border-white/10 safe-area-inset-bottom shadow-2xl">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map(({ to, icon: Icon, labelAr, labelEn }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 px-2 py-1 rounded-2xl transition-all duration-200 min-w-[50px]',
                  isActive ? 'text-white scale-105' : 'text-slate-500 hover:text-slate-300'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cn(
                      'w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-br from-orange-500 to-amber-500 shadow-glow-orange text-slate-950'
                        : 'bg-brand-darkBg/70 text-slate-400 border border-white/10'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={cn(
                      'text-[9px] font-black',
                      isActive ? 'text-orange-400' : 'text-slate-400'
                    )}
                  >
                    {dir === 'rtl' ? labelAr : labelEn}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
