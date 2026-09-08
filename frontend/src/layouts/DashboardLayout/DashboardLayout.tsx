import React, { useState, useRef } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Gamepad2, Globe, Trophy, User, Bell, Zap, ChevronDown, Sparkles, ArrowLeft, ArrowRight, Volume2, VolumeX, Music } from 'lucide-react'
import { sound } from '@/utils/soundManager'
import { AnimatedBackground } from '@components/common/AnimatedBackground'
import { Logo } from '@components/common/Logo'
import { ModeMascot, NaghanishModeId } from '@components/common/ModeVisuals'
import { WORLD_THEMES } from '@theme/world.theme'
import { ROUTES } from '@constants/routes'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'
import { cn } from '@lib/utils'

interface NavItemConfig {
  to: string
  icon: React.ComponentType<{ className?: string }>
  labelAr: string
  labelEn: string
  isWorldsHub?: boolean
}

const NAV_ITEMS: NavItemConfig[] = [
  { to: ROUTES.HOME, icon: Home, labelAr: 'الرئيسية', labelEn: 'Hub' },
  { to: ROUTES.GAMES, icon: Gamepad2, labelAr: 'الألعاب', labelEn: 'Catalog' },
  { to: ROUTES.WORLDS, icon: Globe, labelAr: 'العوالم', labelEn: 'Worlds', isWorldsHub: true },
  { to: ROUTES.WORLD_CHAMPIONS, icon: Trophy, labelAr: 'الصدارة', labelEn: 'Champions' },
  { to: ROUTES.PROFILE, icon: User, labelAr: 'الملف', labelEn: 'Profile' },
]

const QUICK_WORLDS: NaghanishModeId[] = ['shilla', 'arcade', 'iqlab', 'reflex', 'champions', 'chaos']

export function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'
  const [isWorldsMenuOpen, setIsWorldsMenuOpen] = useState(false)
  const [isSfxOn, setIsSfxOn] = useState(sound.isEnabled())
  const [isBgmOn, setIsBgmOn] = useState(sound.isBgmEnabled())
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isShilla = location.pathname.includes('shilla')

  const handleMouseEnter = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current)
    setIsWorldsMenuOpen(true)
  }

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setIsWorldsMenuOpen(false)
    }, 200)
  }

  const isNavActive = (item: NavItemConfig) => {
    if (item.isWorldsHub) {
      return (
        location.pathname === ROUTES.WORLDS ||
        location.pathname === '/world' ||
        (location.pathname.startsWith('/world/') && location.pathname !== ROUTES.WORLD_CHAMPIONS) ||
        (location.pathname.startsWith('/worlds/') && location.pathname !== '/worlds/champions')
      )
    }
    if (item.to === ROUTES.WORLD_CHAMPIONS) {
      return (
        location.pathname === ROUTES.WORLD_CHAMPIONS ||
        location.pathname === '/worlds/champions' ||
        location.pathname === ROUTES.LEADERBOARD
      )
    }
    return location.pathname === item.to
  }

  return (
    <div className="relative min-h-screen bg-brand-darkBg text-foreground flex flex-col overflow-x-hidden">
      <AnimatedBackground variant="minimal" />

      {/* ── Desktop Top Gaming Navigation Bar ─────────────────────────── */}
      <header className="hidden md:flex relative z-30 w-full bg-[#0E0E12]/90 border-b border-white/10 backdrop-blur-2xl sticky top-0 shadow-2xl">
        <div className="w-full max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
          <Logo size="sm" showTagline={false} />

          {/* Desktop Nav Links */}
          <nav className="flex items-center gap-1.5 p-1 rounded-2xl bg-brand-darkBg/80 border border-white/10">
            {NAV_ITEMS.map((item) => {
              const active = isNavActive(item)
              const Icon = item.icon

              if (item.isWorldsHub) {
                return (
                  <div
                    key={item.to}
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() => navigate(ROUTES.WORLDS)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer',
                        active
                          ? isShilla
                            ? 'bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.45)] border border-cyan-300/60'
                            : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-teal-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-300/60'
                          : 'text-slate-400 hover:text-white hover:bg-brand-card'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{isRtl ? item.labelAr : item.labelEn}</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                    </button>

                    {/* Quick Worlds Flyout Dropdown */}
                    <AnimatePresence>
                      {isWorldsMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-80 p-3 rounded-2xl bg-[#0E0E14]/95 border border-white/15 backdrop-blur-2xl shadow-2xl z-50 flex flex-col gap-2"
                        >
                          <div className="flex items-center justify-between px-2 py-1 border-b border-white/10">
                            <span className="text-[11px] font-black text-slate-400">
                              {isRtl ? 'عوالم نغنِش الستة' : 'Naghanish Worlds'}
                            </span>
                            <button
                              onClick={() => {
                                setIsWorldsMenuOpen(false)
                                navigate(ROUTES.WORLDS)
                              }}
                              className="text-[10px] font-black text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <span>{isRtl ? 'عرض الكل' : 'All Worlds'}</span>
                              {isRtl ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5">
                            {QUICK_WORLDS.map((wId) => {
                              const w = WORLD_THEMES[wId]
                              const isCurrentWorld = location.pathname.includes(wId)

                              return (
                                <button
                                  key={wId}
                                  onClick={() => {
                                    setIsWorldsMenuOpen(false)
                                    navigate(w.route)
                                  }}
                                  className={cn(
                                    'flex items-center gap-2 p-2 rounded-xl text-start transition-all cursor-pointer border',
                                    isCurrentWorld
                                      ? 'bg-brand-card/90 border-cyan-500/60 shadow-sm'
                                      : 'bg-black/30 hover:bg-brand-card/70 border-white/5 hover:border-white/20'
                                  )}
                                >
                                  <div className="w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center shrink-0">
                                    <ModeMascot mode={wId} size="sm" animated={false} />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-black text-white truncate">
                                      {isRtl ? w.titleAr : w.titleEn}
                                    </div>
                                    <div className="text-[9px] text-slate-400 truncate">
                                      {w.icon} {isRtl ? w.badgeTextAr : w.badgeTextEn}
                                    </div>
                                  </div>
                                </button>
                              )
                            })}
                          </div>

                          <button
                            onClick={() => {
                              setIsWorldsMenuOpen(false)
                              navigate(ROUTES.WORLDS)
                            }}
                            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-black text-xs text-center shadow-md hover:scale-[1.02] transition-transform cursor-pointer mt-1"
                          >
                            {isRtl ? 'صفحة العوالم الكاملة 🚀' : 'Browse All Worlds 🚀'}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              }

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer',
                    active
                      ? isShilla
                        ? 'bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.45)] border border-cyan-300/60'
                        : 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-slate-950 shadow-glow-orange border border-amber-300/60'
                      : 'text-slate-400 hover:text-white hover:bg-brand-card'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{isRtl ? item.labelAr : item.labelEn}</span>
                </NavLink>
              )
            })}
          </nav>

          {/* Right: Coins + Level + Avatar */}
          <div className="flex items-center gap-3">
            {/* Sound & Music Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => setIsSfxOn(sound.toggleSound())}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  isSfxOn
                    ? 'text-emerald-400 bg-emerald-500/15 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title={isSfxOn ? (isRtl ? 'كتم المؤثرات الصوتية' : 'Mute SFX') : (isRtl ? 'تشغيل المؤثرات' : 'Unmute SFX')}
              >
                {isSfxOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsBgmOn(sound.toggleBgm())}
                className={`p-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                  isBgmOn
                    ? 'text-cyan-400 bg-cyan-500/15 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title={isBgmOn ? (isRtl ? 'إيقاف موسيقى الخلفية' : 'Stop Music') : (isRtl ? 'تشغيل موسيقى الخلفية' : 'Play Music')}
              >
                <Music className={`w-3.5 h-3.5 ${isBgmOn ? 'animate-bounce' : ''}`} />
              </button>
            </div>

            {/* Coins */}
            <button
              onClick={() => navigate(ROUTES.STORE)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-brand-card/90 border border-amber-400/40 text-xs font-black text-amber-300 shadow-glow-gold hover:scale-105 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{user?.coins ?? 100}</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => navigate(ROUTES.NOTIFICATIONS)}
              className={cn(
                'p-2 rounded-2xl bg-brand-card/90 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer',
                isShilla ? 'hover:border-cyan-500/60' : 'hover:border-orange-500/60'
              )}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Avatar Pill */}
            <button
              onClick={() => navigate(ROUTES.PROFILE)}
              className={cn(
                'flex items-center gap-2 p-1 pl-2.5 rtl:pl-1 rtl:pr-2.5 rounded-2xl bg-brand-card/90 border border-white/10 transition-all cursor-pointer',
                isShilla ? 'hover:border-cyan-500/80' : 'hover:border-orange-500/80'
              )}
            >
              <span
                className={cn(
                  'text-[11px] font-black hidden lg:inline',
                  isShilla ? 'text-cyan-400' : 'text-orange-400'
                )}
              >
                LVL {user?.level ?? 1}
              </span>
              <div
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden text-lg shadow-md',
                  isShilla
                    ? 'bg-gradient-to-br from-cyan-500 to-teal-600 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'bg-gradient-to-br from-orange-500 to-amber-600 shadow-glow-orange'
                )}
              >
                {user?.avatar || '🧠'}
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
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(item)
            const Icon = item.icon

            return (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-2 py-1 rounded-2xl transition-all duration-200 min-w-[50px] cursor-pointer',
                  active ? 'text-white scale-105' : 'text-slate-500 hover:text-slate-300'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200',
                    active
                      ? isShilla
                        ? 'bg-gradient-to-br from-cyan-500 to-teal-500 shadow-[0_0_20px_rgba(6,182,212,0.45)] text-slate-950'
                        : item.isWorldsHub
                        ? 'bg-gradient-to-br from-cyan-500 to-teal-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] text-slate-950'
                        : 'bg-gradient-to-br from-orange-500 to-amber-500 shadow-glow-orange text-slate-950'
                      : 'bg-brand-darkBg/70 text-slate-400 border border-white/10'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={cn(
                    'text-[9px] font-black',
                    active
                      ? isShilla || item.isWorldsHub
                        ? 'text-cyan-400'
                        : 'text-orange-400'
                      : 'text-slate-400'
                  )}
                >
                  {isRtl ? item.labelAr : item.labelEn}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

