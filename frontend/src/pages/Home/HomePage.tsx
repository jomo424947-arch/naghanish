/**
 * HomePage.tsx
 *
 * NAGHANISH HUB (الرئيسية)
 * The Grand Entrance to the NAGHANISH Entertainment Universe & 6 Worlds.
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Gamepad2,
  Sparkles,
  Users,
  Trophy,
  Flame,
  Zap,
  Play,
  Bell,
  ArrowRight,
  ArrowLeft,
  Crown,
  Shuffle,
  Compass,
  Star,
  Layers,
  Award,
  Radio,
  Clock,
} from 'lucide-react'
import { Card } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { SEO } from '@components/common/SEO'
import { AdSlot } from '@components/common/AdSlot'
import { GamerMascot } from '@components/common/GamerMascot'
import { ModeMascot, NaghanishModeId } from '@components/common/ModeVisuals'
import { WORLD_THEMES } from '@theme/world.theme'
import { getFeaturedGame, LIVE_ROOMS } from '@data/games.data'
import { ROUTES } from '@constants/routes'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'
import { cn } from '@lib/utils'

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { dir } = useThemeStore()
  const [quickCode, setQuickCode] = useState('')

  const isRtl = dir === 'rtl'
  const featuredGame = getFeaturedGame()

  const handleQuickJoin = (e: React.FormEvent) => {
    e.preventDefault()
    if (quickCode.trim()) {
      navigate(`/party/lobby/${quickCode.trim().toUpperCase()}`)
    } else {
      navigate(WORLD_THEMES.shilla.route)
    }
  }

  const worldKeys: NaghanishModeId[] = ['shilla', 'arcade', 'iqlab', 'reflex', 'champions', 'chaos']

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4 flex flex-col gap-10 pb-28">
      <SEO
        title="نغنِش — منصة الألعاب والترفيه الرقمي التفاعلية (HUB)"
        description="نغنِش منصة ألعاب وترفيه تضم 6 عوالم مستقلة: الشلة، الأركيد، مختبر الذكاء، ردة الفعل، الأبطال، وعالم الفوضى."
      />

      {/* ─────────────────────────────────────────────────────────────
          1. TOP GAMER PROGRESSION BAR
      ───────────────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#0E0E12]/90 border border-white/10 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-4">
        {/* Left: Player Avatar, Level & XP */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 p-0.5 shadow-glow-orange flex items-center justify-center">
              <div className="w-full h-full rounded-[14px] bg-brand-darkBg flex items-center justify-center overflow-hidden">
                <GamerMascot variant="avatar" size="avatar" animated={false} className="scale-60" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 rtl:-right-auto rtl:-left-1 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-glow-orange">
              LVL {user?.level || 12}
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-display font-black text-foreground truncate">
                {isRtl ? `أهلاً، ${user?.name || 'يا بطل'}!` : `Welcome, ${user?.name || 'Champion'}!`}
              </h2>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-[10px] font-black bg-orange-500/20 text-orange-400 border border-orange-500/30">
                PRO GAMER
              </span>
            </div>

            {/* XP Bar – Orange brand gradient */}
            <div className="flex items-center gap-2 mt-1">
              <div className="w-28 sm:w-44 h-2 rounded-full bg-brand-card border border-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 rounded-full shadow-glow-orange"
                  style={{ width: '72%' }}
                />
              </div>
              <span className="text-[10px] font-black text-orange-400 shrink-0">
                2,450 / 3,500 XP
              </span>
            </div>
          </div>
        </div>

        {/* Right: Coins & Notifications */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => navigate(ROUTES.STORE)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-brand-card/90 border border-amber-400/40 text-xs font-black text-amber-300 shadow-sm hover:scale-105 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{user?.coins ?? 2450}</span>
          </button>

          <button
            onClick={() => navigate(ROUTES.NOTIFICATIONS)}
            className="p-2.5 sm:p-3 rounded-2xl bg-brand-card/90 border border-white/10 text-slate-300 hover:text-white hover:border-orange-500/60 transition-all shadow-sm cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. GRAND HUB HERO: WELCOME TO NAGHANISH UNIVERSE
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1A1008] via-[#12100E] to-brand-darkBg border-2 border-orange-500/30 shadow-2xl p-6 sm:p-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-start gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/40 text-orange-300 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>{isRtl ? 'بوابة نغنِش الترفيهية الكبرى' : 'NAGHANISH ENTERTAINMENT HUB'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white leading-tight tracking-tight">
              {isRtl ? (
                <>
                  6 عوالم ألعاب فريدة <br />
                  <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">في منصة ترفيه واحدة!</span> 🚀
                </>
              ) : (
                <>
                  6 Distinct Gaming Worlds <br />
                  <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">In One Universe!</span> 🚀
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-lg leading-relaxed">
              {isRtl
                ? 'استكشف غرف الشلة، حطم أرقام الأركيد، اختبر عقلك في مختبر الذكاء، تحدَّ سرعتك في ردة الفعل، وتنافس مع الأبطال في عالم الفوضى.'
                : 'Enter live multiplayer rooms, smash retro arcade records, assess your intellect in IQ Lab, and master sub-ms reflexes.'}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-2">
              <button
                onClick={() => navigate(ROUTES.GAMES)}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-slate-950 font-black text-sm shadow-glow-orange hover:scale-105 transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>{isRtl ? 'دليل الألعاب الشامل (Catalog)' : 'Explore All Games'}</span>
              </button>

              <button
                onClick={() => navigate(WORLD_THEMES.shilla.route)}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-black text-sm transition-all cursor-pointer"
              >
                <Users className="w-4 h-4 text-cyan-400" />
                <span>{isRtl ? 'ادخل عالم الشلة' : 'Enter Shilla'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center gap-4">
            {/* Hero GamerMascot */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/30 via-amber-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />
              <GamerMascot variant="hero" size="hero" animated={true} />
            </motion.div>

            {/* World Mascot Grid Mosaic */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-3xl bg-brand-darkBg/60 border border-white/10 backdrop-blur-md shadow-2xl">
              {worldKeys.map((k) => (
                <div
                  key={k}
                  onClick={() => navigate(WORLD_THEMES[k].route)}
                  className="p-2 rounded-2xl bg-brand-card/80 hover:bg-brand-card border border-white/10 hover:scale-110 transition-all cursor-pointer flex flex-col items-center gap-1 group"
                >
                  <ModeMascot mode={k} size="sm" animated={true} />
                  <span className="text-[9px] font-black text-slate-300 group-hover:text-orange-400">
                    {isRtl ? WORLD_THEMES[k].titleAr : WORLD_THEMES[k].titleEn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. THE 6 WORLDS PORTALS (The Main Experience Discovery)
      ───────────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center text-lg shadow-sm border border-orange-500/30">
              🌌
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-black text-white">
                {isRtl ? 'اختر عالمك المفضل وابدأ اللعب' : 'Choose Your Gaming World'}
              </h2>
              <p className="text-xs text-slate-400">
                {isRtl ? 'كل عالم يتمتع بهوية وبصرية وتجربة ألعاب مستقلة تماماً' : 'Each world offers a distinct personality & gameplay experience'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {worldKeys.map((wId) => {
            const world = WORLD_THEMES[wId]
            return (
              <div
                key={wId}
                onClick={() => navigate(world.route)}
                className={cn(
                  'relative overflow-hidden p-6 rounded-[2rem] border-2 shadow-xl hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between gap-6 group hover:-translate-y-1',
                  `bg-gradient-to-b ${world.gradients.hero}`,
                  world.gradients.border
                )}
                style={{
                  boxShadow: world.colors.glow,
                }}
              >
                {/* Header: Mascot & Icon */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/15 p-1 shadow-md flex items-center justify-center">
                      <ModeMascot mode={wId} size="md" animated={true} />
                    </div>
                    <div>
                      <span className={cn('text-[10px] font-black uppercase tracking-wider block', world.colors.textAccent)}>
                        {isRtl ? world.badgeTextAr : world.badgeTextEn}
                      </span>
                      <h3 className="text-xl font-display font-black text-white group-hover:text-orange-300 transition-colors">
                        {isRtl ? world.titleAr : world.titleEn}
                      </h3>
                    </div>
                  </div>

                  <span className="text-2xl">{world.icon}</span>
                </div>

                {/* Body: Subtitle & Description */}
                <div>
                  <p className="text-sm font-bold text-slate-200">
                    {isRtl ? world.subtitleAr : world.subtitleEn}
                  </p>
                </div>

                {/* Footer: Enter World CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-xs text-slate-400 font-bold">
                    {isRtl ? 'استكشف العالم' : 'Enter World'}
                  </span>

                  <div
                    className={cn(
                      'px-4 py-2 rounded-xl text-slate-950 font-black text-xs shadow-md group-hover:scale-105 transition-all flex items-center gap-1.5',
                      `bg-gradient-to-r ${world.gradients.button}`
                    )}
                  >
                    <span>{isRtl ? 'دخول' : 'Explore'}</span>
                    {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. DAILY FEATURED SPOTLIGHT & QUICK JOIN SHORTCUT
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Daily Featured Game */}
        {featuredGame && (
          <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0E0E12]/90 border border-white/10 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{isRtl ? 'اللعبة الأكثر تميزاً اليوم' : 'Daily Featured Game'}</span>
              </div>
              <span className="text-xs text-cyan-400 font-black">+{featuredGame.xpReward} XP</span>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={cn(
                  'w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-glow shrink-0',
                  `bg-gradient-to-br ${featuredGame.color}`
                )}
              >
                {featuredGame.icon}
              </div>
              <div>
                <h4 className="text-lg font-display font-black text-white">
                  {isRtl ? featuredGame.titleAr : featuredGame.title}
                </h4>
                <p className="text-xs text-slate-300 font-medium mt-1 line-clamp-2">
                  {isRtl ? featuredGame.descAr : featuredGame.descEn}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate(featuredGame.route)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-slate-950 font-black text-xs shadow-glow-orange hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{isRtl ? 'العب الآن مجاناً' : 'Play Featured Game'}</span>
            </button>
          </div>
        )}

        {/* Quick Join Shortcut Box (Rule 4.1: Code Input + Submit only) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-orange-950/40 via-brand-card to-amber-950/30 border border-orange-500/40 flex flex-col justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-lg">
              ⚡
            </div>
            <div>
              <h4 className="text-base font-display font-black text-white">
                {isRtl ? 'الانضمام السريع للغرفة' : 'Quick Join Room'}
              </h4>
              <p className="text-[11px] text-slate-300">
                {isRtl ? 'لديك كود جاهز من أصدقائك؟ ادخل مباشرة' : 'Have a friend\'s room code? Join now'}
              </p>
            </div>
          </div>

          <form onSubmit={handleQuickJoin} className="flex flex-col gap-2.5">
            <input
              type="text"
              value={quickCode}
              onChange={(e) => setQuickCode(e.target.value)}
              placeholder={isRtl ? 'أدخل كود الغرفة (مثال: SH99)' : 'Enter room code (e.g. SH99)'}
              className="w-full px-4 py-2.5 rounded-xl bg-brand-darkBg/90 border border-orange-500/40 text-white placeholder:text-slate-500 font-mono text-center uppercase tracking-widest text-sm focus:outline-none focus:border-orange-400"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-xs shadow-md hover:scale-105 transition-all cursor-pointer"
            >
              {isRtl ? 'دخول الغرفة 🚀' : 'Join Room 🚀'}
            </button>
          </form>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. NEUTRAL AD SLOT
      ───────────────────────────────────────────────────────────── */}
      <AdSlot
        variant="in-feed"
        sponsorName="نغنِش بريميوم VIP 👑"
        adText="احصل على اشتراك نغنِش الفائق لتلعب بدون إعلانات وتكسب ضعف النقاط عبر كل العوالم!"
        adTextEn="Upgrade to Naghanish VIP to play ad-free and earn 2x XP across all 6 worlds!"
      />
    </div>
  )
}
