import React, { useState } from 'react'
import { Sparkles, X, ExternalLink } from 'lucide-react'
import { useThemeStore } from '@store/themeStore'
import { cn } from '@lib/utils'

import { NaghanishModeId } from '@components/common/ModeVisuals'
import { WORLD_THEMES } from '@theme/world.theme'

export interface AdSlotProps {
  variant?: 'banner' | 'in-feed' | 'sidebar' | 'interstitial'
  slotId?: string
  className?: string
  sponsorName?: string
  sponsorLogo?: string
  adText?: string
  adTextEn?: string
  targetUrl?: string
  worldId?: NaghanishModeId
}

export const AdSlot: React.FC<AdSlotProps> = ({
  variant = 'banner',
  slotId = 'ad-slot-default',
  className = '',
  sponsorName = 'نغنِش VIP 👑',
  adText = 'احصل على اشتراك نغنِش الفائق لتلعب بدون إعلانات وتكسب ضعف النقاط!',
  adTextEn = 'Upgrade to Naghanish VIP to play ad-free and earn 2x XP!',
  targetUrl = '#',
  worldId,
}) => {
  const { dir } = useThemeStore()
  const [dismissed, setDismissed] = useState(false)
  const theme = worldId ? WORLD_THEMES[worldId] : null

  if (dismissed) return null

  if (variant === 'in-feed') {
    return (
      <div
        id={slotId}
        className={cn(
          'relative p-5 rounded-3xl border shadow-xl overflow-hidden my-4 group',
          theme
            ? `bg-gradient-to-r ${theme.gradients.card} ${theme.gradients.border}`
            : 'bg-gradient-to-r from-purple-950/40 via-brand-card to-indigo-950/40 border-brand-purple/40',
          className
        )}
        style={{ boxShadow: theme ? theme.colors.glow : undefined }}
      >
        <div className="flex items-center justify-between gap-3 mb-2">
          <span
            className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border flex items-center gap-1"
            style={{
              backgroundColor: theme ? `${theme.colors.primary}25` : undefined,
              borderColor: theme ? `${theme.colors.primary}40` : undefined,
              color: theme ? theme.colors.primary : '#FCD34D',
            }}
          >
            <Sparkles className="w-3 h-3" />
            {dir === 'rtl' ? 'إعلان مميز' : 'Sponsored'}
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-500 hover:text-white rounded-lg transition-colors"
            title={dir === 'rtl' ? 'إغلاق الإعلان' : 'Dismiss Ad'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-glow',
              theme ? `bg-gradient-to-br ${theme.gradients.button}` : 'bg-gradient-to-br from-brand-purple to-brand-orange'
            )}
          >
            🎁
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
              {sponsorName}
              <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-xs text-slate-300 font-medium mt-0.5 line-clamp-2">
              {dir === 'rtl' ? adText : adTextEn}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'sidebar') {
    return (
      <div
        id={slotId}
        className={cn(
          'relative p-6 rounded-3xl border text-center flex flex-col items-center gap-4 my-4 shadow-xl',
          theme
            ? `bg-gradient-to-b ${theme.gradients.card} ${theme.gradients.border}`
            : 'bg-gradient-to-b from-brand-card via-brand-surface to-[#12182F] border-brand-cardBorder',
          className
        )}
      >
        <div className="w-full flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <span>{dir === 'rtl' ? 'إعلان' : 'Ad'}</span>
          <button onClick={() => setDismissed(true)} className="text-slate-500 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div
          className={cn(
            'w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-glow',
            theme ? `bg-gradient-to-br ${theme.gradients.button}` : 'bg-gradient-to-br from-amber-400 to-orange-600'
          )}
        >
          ⚡
        </div>

        <div>
          <h4 className="font-black text-white text-base">{sponsorName}</h4>
          <p className="text-xs text-slate-300 font-medium mt-1">
            {dir === 'rtl' ? adText : adTextEn}
          </p>
        </div>

        <a
          href={targetUrl}
          className={cn(
            'w-full py-2.5 rounded-2xl text-white font-bold text-xs shadow-glow hover:opacity-90 transition-opacity',
            theme ? `bg-gradient-to-r ${theme.gradients.button} text-slate-950 font-black` : 'bg-gradient-to-r from-brand-purple to-brand-blue'
          )}
        >
          {dir === 'rtl' ? 'اكتشف المزيد' : 'Learn More'}
        </a>
      </div>
    )
  }

  if (variant === 'interstitial') {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div
          className={cn(
            'relative w-full max-w-md p-6 rounded-3xl border-2 shadow-2xl flex flex-col items-center text-center gap-5',
            theme
              ? `bg-gradient-to-b ${theme.gradients.card} ${theme.gradients.border}`
              : 'bg-gradient-to-b from-[#1A1A36] to-brand-card border-brand-purple/50'
          )}
        >
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-xl bg-brand-darkBg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <span
            className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border"
            style={{
              backgroundColor: theme ? `${theme.colors.primary}25` : undefined,
              borderColor: theme ? `${theme.colors.primary}40` : undefined,
              color: theme ? theme.colors.primary : '#FCD34D',
            }}
          >
            {dir === 'rtl' ? 'إعلان رعاية' : 'Sponsored Content'}
          </span>

          <div
            className={cn(
              'w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-glow',
              theme ? `bg-gradient-to-br ${theme.gradients.button}` : 'bg-gradient-to-br from-brand-purple via-indigo-600 to-brand-blue'
            )}
          >
            🚀
          </div>

          <div>
            <h3 className="text-xl font-black text-white">{sponsorName}</h3>
            <p className="text-sm text-slate-300 mt-2 font-medium">
              {dir === 'rtl' ? adText : adTextEn}
            </p>
          </div>

          <button
            onClick={() => setDismissed(true)}
            className={cn(
              'w-full py-3 rounded-2xl text-white font-black text-sm shadow-glow hover:scale-105 transition-transform',
              theme ? `bg-gradient-to-r ${theme.gradients.button} text-slate-950 font-black` : 'bg-gradient-to-r from-brand-purple to-brand-blue'
            )}
          >
            {dir === 'rtl' ? 'متابعة إلى اللعبة 🎮' : 'Continue to Game 🎮'}
          </button>
        </div>
      </div>
    )
  }

  // Default Banner Ad (Horizontal Top/Bottom)
  return (
    <div
      id={slotId}
      className={cn(
        'relative w-full p-4 rounded-2xl border flex items-center justify-between gap-4 shadow-md my-3',
        theme
          ? `bg-brand-card/90 ${theme.gradients.border}`
          : 'bg-brand-card border-brand-cardBorder',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase border"
          style={{
            backgroundColor: theme ? `${theme.colors.primary}20` : undefined,
            borderColor: theme ? `${theme.colors.primary}40` : undefined,
            color: theme ? theme.colors.primary : undefined,
          }}
        >
          {dir === 'rtl' ? 'إعلان' : 'Ad'}
        </span>
        <p className="text-xs font-bold text-foreground">
          {dir === 'rtl' ? adText : adTextEn}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <a
          href={targetUrl}
          className={cn(
            'px-3.5 py-1.5 rounded-xl text-white font-bold text-xs transition-all shrink-0 shadow-sm',
            theme ? `bg-gradient-to-r ${theme.gradients.button} text-slate-950 font-black` : 'bg-brand-purple hover:bg-brand-purple/90'
          )}
        >
          {dir === 'rtl' ? 'عرض' : 'View'}
        </a>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
