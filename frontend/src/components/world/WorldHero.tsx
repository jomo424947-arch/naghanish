/**
 * WorldHero.tsx
 *
 * Distinct Hero component customized for each of the 6 Worlds.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Play, Plus, Zap, Trophy, Shuffle, Swords, Users } from 'lucide-react'
import { NaghanishModeId, ModeMascot } from '@components/common/ModeVisuals'
import { WORLD_THEMES } from '@theme/world.theme'
import { useThemeStore } from '@store/themeStore'
import { cn } from '@lib/utils'

export interface WorldHeroProps {
  worldId: NaghanishModeId
  title?: string
  subtitle?: string
  description?: string
  primaryActionLabel?: string
  onPrimaryAction?: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
  extraBadge?: string
  stats?: { label: string; value: string; icon?: React.ReactNode }[]
}

export const WorldHero: React.FC<WorldHeroProps> = ({
  worldId,
  title,
  subtitle,
  description,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  extraBadge,
  stats,
}) => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'
  const world = WORLD_THEMES[worldId]

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-[2.5rem] border-2 shadow-2xl p-6 sm:p-10 transition-all',
        `bg-gradient-to-br ${world.gradients.hero}`,
        world.gradients.border
      )}
      style={{
        boxShadow: world.colors.glow,
      }}
    >
      {/* Ambient background glows */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ backgroundColor: world.colors.primary }}
      />
      <div
        className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: world.colors.accent }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Content & Actions */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-start gap-4">
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/10 text-xs font-black">
            <span className="text-base">{world.icon}</span>
            <span className={world.colors.textAccent}>
              {extraBadge || (isRtl ? world.badgeTextAr : world.badgeTextEn)}
            </span>
          </div>

          {/* World Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
            {title || (isRtl ? world.titleAr : world.titleEn)}
          </h1>

          {/* Subtitle / Punchline */}
          <h2 className="text-base sm:text-lg lg:text-xl font-extrabold text-slate-200">
            {subtitle || (isRtl ? world.subtitleAr : world.subtitleEn)}
          </h2>

          {/* Description */}
          {description && (
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-lg leading-relaxed">
              {description}
            </p>
          )}

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-2">
            {primaryActionLabel && (
              <button
                onClick={onPrimaryAction}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black text-slate-950 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg',
                  `bg-gradient-to-r ${world.gradients.button}`
                )}
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{primaryActionLabel}</span>
              </button>
            )}

            {secondaryActionLabel && (
              <button
                onClick={onSecondaryAction}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/15 text-sm font-black text-white hover:border-white/30 transition-all cursor-pointer"
              >
                <span>{secondaryActionLabel}</span>
              </button>
            )}
          </div>

          {/* Optional Stats Bar */}
          {stats && stats.length > 0 && (
            <div className="flex items-center gap-6 mt-3 pt-3 border-t border-white/10">
              {stats.map((s, i) => (
                <div key={i} className="flex flex-col items-center lg:items-start">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                    {s.icon}
                    <span>{s.label}</span>
                  </div>
                  <span className="text-base font-black text-white">{s.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Mascot Spotlight */}
        <div className="lg:col-span-5 flex items-center justify-center relative">
          <div
            className="w-56 h-56 sm:w-64 sm:h-64 rounded-full flex items-center justify-center relative p-4"
            style={{
              background: `radial-gradient(circle, ${world.colors.primary}25 0%, transparent 70%)`,
            }}
          >
            <ModeMascot mode={worldId} size="hero" animated={true} />
          </div>
        </div>
      </div>
    </section>
  )
}
