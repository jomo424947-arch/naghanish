import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Gamepad2, Users, Trophy, User, Plus } from 'lucide-react'
import { AnimatedBackground } from '@components/common/AnimatedBackground'
import { Logo } from '@components/common/Logo'
import { ROUTES } from '@constants/routes'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'
import { cn } from '@lib/utils'

const NAV_ITEMS = [
  { to: ROUTES.HOME,       icon: Home,      labelAr: 'الرئيسية',  labelEn: 'Home' },
  { to: ROUTES.GAMES,      icon: Gamepad2,  labelAr: 'الألعاب',   labelEn: 'Games' },
  { to: ROUTES.PARTY,      icon: Users,     labelAr: 'بارتي',     labelEn: 'Party' },
  { to: ROUTES.LEADERBOARD,icon: Trophy,    labelAr: 'الصدارة',   labelEn: 'Rank' },
  { to: ROUTES.SETTINGS,   icon: User,      labelAr: 'الملف',     labelEn: 'Profile' },
]

export function DashboardLayout() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { dir } = useThemeStore()

  return (
    <div className="relative min-h-screen bg-brand-darkBg text-slate-100 flex flex-col overflow-x-hidden">
      <AnimatedBackground variant="minimal" />

      {/* ── Desktop Top Header ──────────────────────────────────── */}
      <header className="hidden md:flex relative z-30 w-full bg-brand-surface/80 border-b border-brand-cardBorder backdrop-blur-xl sticky top-0">
        <div className="w-full max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
          <Logo size="sm" showTagline={false} />

          {/* Desktop Nav Links */}
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map(({ to, icon: Icon, labelAr, labelEn }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-200',
                    isActive
                      ? 'bg-brand-purple/20 text-white border border-brand-purple/50 shadow-glow'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )
                }
              >
                <Icon className="w-4 h-4" />
                <span>{dir === 'rtl' ? labelAr : labelEn}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right: XP + Avatar */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-brand-card border border-brand-cardBorder text-xs font-bold">
              <span className="text-brand-blue">⚡</span>
              <span className="text-slate-100">{user?.coins ?? 2350}</span>
            </div>
            <button
              onClick={() => navigate(ROUTES.SETTINGS)}
              className="w-9 h-9 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-lg shadow-glow hover:scale-105 transition-transform"
            >
              🧠
            </button>
          </div>
        </div>
      </header>

      {/* ── Page Content ────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 pb-28 md:pb-8 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={typeof window !== 'undefined' ? window.location.pathname : ''}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Mobile Bottom Navigation Bar ───────────────────────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-brand-surface/95 backdrop-blur-xl border-t border-brand-cardBorder safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map(({ to, icon: Icon, labelAr, labelEn }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200 min-w-[52px]',
                  isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cn(
                      'w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-br from-brand-purple to-brand-blue shadow-glow'
                        : 'bg-transparent'
                    )}
                  >
                    <Icon className={cn('w-5 h-5', isActive ? 'text-white' : 'text-slate-500')} />
                  </div>
                  <span className={cn('text-[10px] font-bold', isActive ? 'text-brand-blue' : 'text-slate-500')}>
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
