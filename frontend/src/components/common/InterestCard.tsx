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
      card: 'from-purple-500/20 via-purple-500/10 to-brand-card',
      border: 'border-purple-500',
      glow: 'shadow-[0_0_20px_rgba(147,51,234,0.3)]',
      iconBg: 'bg-brand-purple/20 text-brand-purple',
    },
    cyan: {
      card: 'from-cyan-500/20 via-cyan-500/10 to-brand-card',
      border: 'border-cyan-500',
      glow: 'shadow-[0_0_20px_rgba(0,210,255,0.3)]',
      iconBg: 'bg-brand-blue/20 text-brand-blue',
    },
    blue: {
      card: 'from-blue-500/20 via-blue-500/10 to-brand-card',
      border: 'border-sky-500',
      glow: 'shadow-[0_0_20px_rgba(56,189,248,0.3)]',
      iconBg: 'bg-brand-blue/20 text-brand-blue',
    },
    orange: {
      card: 'from-orange-500/20 via-orange-500/10 to-brand-card',
      border: 'border-orange-500',
      glow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]',
      iconBg: 'bg-brand-orange/20 text-brand-orange',
    },
    yellow: {
      card: 'from-amber-500/20 via-amber-500/10 to-brand-card',
      border: 'border-amber-500',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
      iconBg: 'bg-brand-gold/20 text-brand-gold',
    },
    green: {
      card: 'from-emerald-500/20 via-emerald-500/10 to-brand-card',
      border: 'border-emerald-500',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
      iconBg: 'bg-brand-green/20 text-brand-green',
    },
    pink: {
      card: 'from-pink-500/20 via-pink-500/10 to-brand-card',
      border: 'border-pink-500',
      glow: 'shadow-[0_0_20px_rgba(236,72,153,0.3)]',
      iconBg: 'bg-brand-pink/20 text-brand-pink',
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
          : 'bg-brand-card border-brand-cardBorder hover:border-brand-purple/60 shadow-sm'
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
        <h3 className="text-base font-bold text-foreground tracking-wide">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground font-medium mt-0.5">{subtitle}</p>}
      </div>
    </motion.button>
  )
}
