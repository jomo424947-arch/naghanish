/**
 * WorldShell.tsx
 *
 * Dedicated World Layout Shell container providing:
 * - App Shell separation (Back to Hub bar)
 * - World-specific Navigation tabs
 * - Dynamic ambient particle/grid background per world
 * - World context injection for themed AdSlots and components
 */

import React, { createContext, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { NaghanishModeId, ModeMascot } from '@components/common/ModeVisuals'
import { WORLD_THEMES, WorldThemeConfig } from '@theme/world.theme'
import { ROUTES } from '@constants/routes'
import { useThemeStore } from '@store/themeStore'
import { cn } from '@lib/utils'

interface WorldContextType {
  world: WorldThemeConfig
  activeTab: string
  setActiveTab: (tabId: string) => void
}

const WorldContext = createContext<WorldContextType | null>(null)

export const useWorld = () => {
  const context = useContext(WorldContext)
  if (!context) {
    throw new Error('useWorld must be used within a WorldShell')
  }
  return context
}

export interface WorldShellProps {
  worldId: NaghanishModeId
  activeTab: string
  onTabChange: (tabId: string) => void
  children: React.ReactNode
  className?: string
}

export const WorldShell: React.FC<WorldShellProps> = ({
  worldId,
  activeTab,
  onTabChange,
  children,
  className = '',
}) => {
  const navigate = useNavigate()
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'
  const world = WORLD_THEMES[worldId]

  return (
    <WorldContext.Provider value={{ world, activeTab, setActiveTab: onTabChange }}>
      <div className={cn('relative w-full flex flex-col gap-6 pb-20', className)}>
        {/* ── Ambient Background Layer Tailored Per World ────────────────── */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {worldId === 'shilla' && (
            <>
              <div className="absolute top-10 right-10 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl" />
              <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
            </>
          )}

          {worldId === 'arcade' && (
            <>
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #00D2FF 1px, transparent 1px), linear-gradient(to bottom, #9333EA 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              />
              <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-3xl" />
              <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl" />
            </>
          )}

          {worldId === 'iqlab' && (
            <>
              <div className="absolute top-10 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl" />
              <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
            </>
          )}

          {worldId === 'reflex' && (
            <>
              <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-red-600/15 to-transparent" />
              <div className="absolute top-20 right-10 w-[450px] h-[450px] bg-red-600/20 rounded-full blur-3xl" />
              <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-orange-600/15 rounded-full blur-3xl" />
            </>
          )}

          {worldId === 'champions' && (
            <>
              <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-600/15 rounded-full blur-3xl" />
              <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-800/20 rounded-full blur-3xl" />
            </>
          )}

          {worldId === 'chaos' && (
            <>
              <div className="absolute top-10 right-10 w-96 h-96 bg-lime-500/15 rounded-full blur-3xl" />
              <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl" />
            </>
          )}
        </div>

        {/* ── Top Bar: Mandatory Back to Hub Button & World Identity ───── */}
        <div className="relative z-10 flex items-center justify-between gap-4 p-2 sm:p-3 rounded-2xl bg-brand-surface/90 border border-brand-cardBorder backdrop-blur-xl shadow-lg">
          {/* Back to Hub Button */}
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-card hover:bg-brand-card/90 border border-brand-cardBorder hover:border-cyan-400 text-xs sm:text-sm font-black text-slate-200 hover:text-white transition-all cursor-pointer group shadow-sm"
          >
            {isRtl ? (
              <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
            ) : (
              <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
            )}
            <span>{isRtl ? 'الرئيسية • HUB' : 'NAGHANISH HUB'}</span>
          </button>

          {/* Active World Badge Pill */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-brand-darkBg/80 border border-brand-cardBorder">
            <ModeMascot mode={worldId} size="sm" animated={false} />
            <div className="flex flex-col text-start leading-tight">
              <span className="text-[10px] font-bold text-slate-400">
                {isRtl ? 'أنت الآن في' : 'Active World'}
              </span>
              <span className={cn('text-xs font-black', world.colors.textAccent)}>
                {isRtl ? world.titleAr : world.titleEn}
              </span>
            </div>
          </div>

          {/* Quick World Switcher Dropdown Shortcut */}
          <div className="hidden sm:flex items-center gap-1.5">
            {(['shilla', 'arcade', 'iqlab', 'reflex', 'champions', 'chaos'] as NaghanishModeId[]).map(
              (mId) => {
                const isCurrent = mId === worldId
                const targetWorld = WORLD_THEMES[mId]
                return (
                  <button
                    key={mId}
                    onClick={() => navigate(targetWorld.route)}
                    title={isRtl ? targetWorld.titleAr : targetWorld.titleEn}
                    className={cn(
                      'w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all cursor-pointer',
                      isCurrent
                        ? 'bg-brand-card border-2 shadow-sm scale-110'
                        : 'bg-brand-darkBg/60 text-slate-400 hover:text-white hover:bg-brand-card border border-brand-cardBorder opacity-70 hover:opacity-100'
                    )}
                    style={{
                      borderColor: isCurrent ? targetWorld.colors.primary : undefined,
                    }}
                  >
                    <span>{targetWorld.icon}</span>
                  </button>
                )
              }
            )}
          </div>
        </div>

        {/* ── World-Specific Sub Navigation Tabs ─────────────────────── */}
        <div className="relative z-10 flex items-center gap-2 overflow-x-auto py-1 px-1 no-scrollbar">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-brand-surface/80 border border-brand-cardBorder backdrop-blur-md">
            {world.navTabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'relative px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap',
                    isActive
                      ? 'text-white shadow-lg'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-brand-card/50'
                  )}
                  style={{
                    backgroundColor: isActive ? world.colors.primary : undefined,
                    boxShadow: isActive ? world.colors.glow : undefined,
                  }}
                >
                  {tab.icon && <span>{tab.icon}</span>}
                  <span>{isRtl ? tab.labelAr : tab.labelEn}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Main World Page Content ─────────────────────────────────── */}
        <div className="relative z-10 w-full flex flex-col gap-8">{children}</div>
      </div>
    </WorldContext.Provider>
  )
}
