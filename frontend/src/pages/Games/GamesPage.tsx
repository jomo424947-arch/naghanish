/**
 * GamesPage.tsx
 *
 * GLOBAL GAMES CATALOG & SEARCH
 * Search & explore all games across the 6 Worlds with color-coded World Badges.
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Gamepad2,
  Search,
  Star,
  Play,
  Zap,
  Sparkles,
  Flame,
  Layers,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Filter,
} from 'lucide-react'
import { Input } from '@components/common/Input'
import { Button } from '@components/common/Button'
import { SEO } from '@components/common/SEO'
import { AdSlot } from '@components/common/AdSlot'
import { ModeMascot, NaghanishModeId } from '@components/common/ModeVisuals'
import { ALL_GAMES, GameItem } from '@data/games.data'
import { WORLD_THEMES } from '@theme/world.theme'
import { ROUTES } from '@constants/routes'
import { useThemeStore } from '@store/themeStore'
import { cn } from '@lib/utils'

const WORLD_FILTERS: { id: 'all' | NaghanishModeId; labelAr: string; labelEn: string; icon?: string }[] = [
  { id: 'all', labelAr: 'الكل (جميع العوالم)', labelEn: 'All Worlds', icon: '🌌' },
  { id: 'shilla', labelAr: 'الشِلّة', labelEn: 'Shilla', icon: '🎉' },
  { id: 'arcade', labelAr: 'الأركيد', labelEn: 'Arcade', icon: '🕹️' },
  { id: 'iqlab', labelAr: 'مختبر الذكاء', labelEn: 'IQ Lab', icon: '🧠' },
  { id: 'reflex', labelAr: 'ردة الفعل', labelEn: 'Reflex', icon: '⚡' },
  { id: 'champions', labelAr: 'الأبطال', labelEn: 'Champions', icon: '🏆' },
  { id: 'chaos', labelAr: 'عالم الفوضى', labelEn: 'Chaos', icon: '🤪' },
]

export const GamesPage: React.FC = () => {
  const navigate = useNavigate()
  const { dir } = useThemeStore()
  const [selectedWorld, setSelectedWorld] = useState<'all' | NaghanishModeId>('all')
  const [search, setSearch] = useState('')

  const isRtl = dir === 'rtl'

  const filteredGames = ALL_GAMES.filter((g) => {
    const matchesWorld = selectedWorld === 'all' || g.world === selectedWorld
    const matchesSearch =
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.titleAr.includes(search) ||
      g.categoryAr.includes(search)
    return matchesWorld && matchesSearch
  })

  return (
    <div className="flex flex-col gap-8 py-4 max-w-6xl mx-auto pb-24">
      <SEO
        title="دليل الألعاب الشامل | نغنِش — كل الألعاب والعوالم"
        description="ابحث وتصفح جميع ألعاب منصة نغنِش عبر عوالم الشلة، الأركيد، مختبر الذكاء، ردة الفعل، الأبطال، وعالم الفوضى."
        keywords={['العاب نغنش', 'دليل الالعاب', 'العاب اونلاين', 'العاب ذكاء']}
      />

      {/* ─────────────────────────────────────────────────────────────
          1. GLOBAL CATALOG HERO HEADER
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#17122B] via-brand-card to-[#0F172A] border-2 border-brand-purple/40 shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-start gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-cyan-300 text-xs font-black">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>{isRtl ? 'دليل الألعاب الشامل • GLOBAL CATALOG' : 'GLOBAL GAMES CATALOG'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white">
            {isRtl ? 'جميع ألعاب عوالم نغنِش' : 'All Naghanish Universe Games'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md">
            {isRtl
              ? 'ابحث بالاسم أو اختر العالم الذي ترغب في استكشافه وتحدي أصدقائك فيه.'
              : 'Search games by name or filter by their dedicated gaming world.'}
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="relative z-10 w-full md:w-80">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isRtl ? 'ابحث عن لعبة أو تصنيف...' : 'Search games or categories...'}
              className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-3 rounded-2xl bg-brand-darkBg/90 border border-brand-cardBorder text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 shadow-inner"
            />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. WORLD SELECTOR FILTER TABS
      ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 px-1 no-scrollbar">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-brand-surface/90 border border-brand-cardBorder backdrop-blur-md">
          {WORLD_FILTERS.map((wf) => {
            const isActive = selectedWorld === wf.id
            const worldConfig = wf.id !== 'all' ? WORLD_THEMES[wf.id] : null
            return (
              <button
                key={wf.id}
                onClick={() => setSelectedWorld(wf.id)}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap',
                  isActive
                    ? 'bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-glow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-brand-card/60'
                )}
                style={{
                  backgroundColor: isActive && worldConfig ? worldConfig.colors.primary : undefined,
                  boxShadow: isActive && worldConfig ? worldConfig.colors.glow : undefined,
                }}
              >
                {wf.icon && <span>{wf.icon}</span>}
                <span>{isRtl ? wf.labelAr : wf.labelEn}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. GAMES CATALOG GRID WITH WORLD BADGES
      ───────────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-bold">
            {isRtl ? `عرض ${filteredGames.length} لعبة` : `Showing ${filteredGames.length} games`}
          </span>
        </div>

        {filteredGames.length === 0 ? (
          <div className="p-12 rounded-3xl bg-brand-surface/60 border border-brand-cardBorder text-center flex flex-col items-center justify-center gap-3">
            <span className="text-4xl">🔍</span>
            <h4 className="text-base font-black text-white">
              {isRtl ? 'لم نجد ألعاباً مطابقة لبحثك' : 'No matching games found'}
            </h4>
            <p className="text-xs text-slate-400">
              {isRtl ? 'جرب البحث باسم آخر أو اختر تصنيفاً مختلفاً' : 'Try another search term or world filter'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGames.map((game) => {
              const worldConfig = WORLD_THEMES[game.world]
              return (
                <div
                  key={game.id}
                  className="relative overflow-hidden p-6 rounded-[2rem] bg-brand-card/90 border border-brand-cardBorder hover:border-cyan-400/60 shadow-lg hover:shadow-glow-blue transition-all flex flex-col justify-between gap-4 group cursor-pointer"
                  onClick={() => navigate(game.route)}
                >
                  {/* Top Bar: Icon + Prominent World Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={cn(
                        'w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-glow shrink-0',
                        `bg-gradient-to-br ${game.color}`
                      )}
                    >
                      {game.icon}
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      {/* Prominent Color-Coded World Badge */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(worldConfig.route)
                        }}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-black border flex items-center gap-1 hover:scale-105 transition-transform"
                        style={{
                          backgroundColor: `${worldConfig.colors.primary}20`,
                          borderColor: `${worldConfig.colors.primary}50`,
                          color: worldConfig.colors.primary,
                        }}
                      >
                        <span>{worldConfig.icon}</span>
                        <span>{isRtl ? worldConfig.titleAr : worldConfig.titleEn}</span>
                      </button>

                      <span className="text-[10px] font-bold text-slate-400">
                        {game.categoryAr}
                      </span>
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                      {isRtl ? game.titleAr : game.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium mt-1 line-clamp-2">
                      {isRtl ? game.descAr : game.descEn}
                    </p>
                  </div>

                  {/* Stats & Play Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{game.stars}</span>
                      </div>
                      <span className="text-[10px] text-cyan-400 font-black">
                        +{game.xpReward} XP
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(game.route)
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white text-xs font-black shadow-md hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{isRtl ? 'العب' : 'Play'}</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. NEUTRAL AD SLOT
      ───────────────────────────────────────────────────────────── */}
      <AdSlot
        variant="in-feed"
        sponsorName="نغنِش VIP Pass 👑"
        adText="استمتع بجميع ألعاب منصة نغنِش بدون أي إعلانات مع مضاعفة نقاط الـ XP والكوينز!"
        adTextEn="Enjoy all Naghanish games ad-free with 2x XP and Coin multipliers!"
      />
    </div>
  )
}
