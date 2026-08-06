import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@lib/utils'

export type CategoryColor = 'purple' | 'cyan' | 'orange' | 'yellow' | 'green' | 'pink' | 'blue'

export interface InterestCardProps {
  id: string
  title: string
  subtitle?: string
  icon: React.ReactNode
  color: CategoryColor
  selected?: boolean
  onClick?: () => void
}

export const InterestCard: React.FC<InterestCardProps> = ({
  title,
  subtitle,
  icon,
  color,
  selected = false,
  onClick,
}) => {
  const colorVariants: Record<CategoryColor, { card: string; border: string; glow: string; iconBg: string }> = {
    purple: {
      card: 'from-purple-900/30 to-brand-card',
      border: 'border-purple-500',
      glow: 'shadow-[0_0_20px_rgba(147,51,234,0.4)]',
      iconBg: 'bg-purple-500/20 text-purple-300',
    },
    cyan: {
      card: 'from-cyan-900/30 to-brand-card',
      border: 'border-cyan-400',
      glow: 'shadow-[0_0_20px_rgba(0,210,255,0.4)]',
      iconBg: 'bg-cyan-500/20 text-cyan-300',
    },
    blue: {
      card: 'from-blue-900/30 to-brand-card',
      border: 'border-sky-400',
      glow: 'shadow-[0_0_20px_rgba(56,189,248,0.4)]',
      iconBg: 'bg-sky-500/20 text-sky-300',
    },
    orange: {
      card: 'from-orange-900/30 to-brand-card',
      border: 'border-orange-500',
      glow: 'shadow-[0_0_20px_rgba(249,115,22,0.4)]',
      iconBg: 'bg-orange-500/20 text-orange-300',
    },
    yellow: {
      card: 'from-amber-900/30 to-brand-card',
      border: 'border-amber-400',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]',
      iconBg: 'bg-amber-500/20 text-amber-300',
    },
    green: {
      card: 'from-emerald-900/30 to-brand-card',
      border: 'border-emerald-400',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]',
      iconBg: 'bg-emerald-500/20 text-emerald-300',
    },
    pink: {
      card: 'from-pink-900/30 to-brand-card',
      border: 'border-pink-500',
      glow: 'shadow-[0_0_20px_rgba(236,72,153,0.4)]',
      iconBg: 'bg-pink-500/20 text-pink-300',
    },
  }

  const themeStyle = colorVariants[color]

  return (
    <motion.button
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      type="button"
      onClick={onClick}
      className={cn(
        'relative p-5 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center text-center gap-3 cursor-pointer overflow-hidden group select-none',
        selected
          ? `bg-gradient-to-b ${themeStyle.card} ${themeStyle.border} ${themeStyle.glow}`
          : 'bg-brand-card/90 border-brand-cardBorder hover:border-slate-500 hover:bg-brand-card'
      )}
    >
      {/* Selected check badge */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 rtl:right-auto rtl:left-3 w-6 h-6 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue text-white flex items-center justify-center shadow-md"
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </motion.div>
      )}

      {/* Icon with glowing pill */}
      <div
        className={cn(
          'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-inner',
          themeStyle.iconBg
        )}
      >
        <div className="w-7 h-7 flex items-center justify-center">{icon}</div>
      </div>

      <div>
        <h3 className="text-base font-bold text-white tracking-wide">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 font-medium mt-0.5">{subtitle}</p>}
      </div>
    </motion.button>
  )
}
