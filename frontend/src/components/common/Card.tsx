import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@lib/utils'

export type CardVariant = 'default' | 'glowing' | 'glass' | 'gradient' | 'bordered' | 'feature' | 'mode'
export type CardGlowColor =
  | 'purple'
  | 'blue'
  | 'orange'
  | 'cyan'
  | 'teal'
  | 'green'
  | 'gold'
  | 'yellow'
  | 'lime'
  | 'red'
  | 'pink'

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: React.ReactNode
  variant?: CardVariant
  glowColor?: CardGlowColor
  isInteractive?: boolean
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  glowColor = 'orange',
  isInteractive = false,
  className,
  padding = 'md',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const glowStyles: Record<CardGlowColor, string> = {
    orange: 'hover:border-orange-500/80 hover:shadow-glow-orange',
    teal: 'hover:border-cyan-400/80 hover:shadow-glow-teal',
    cyan: 'hover:border-cyan-400/80 hover:shadow-glow-cyan',
    blue: 'hover:border-sky-400/80 hover:shadow-glow-blue',
    purple: 'hover:border-purple-500/70 hover:shadow-glow-purple',
    gold: 'hover:border-amber-400/80 hover:shadow-glow-gold',
    yellow: 'hover:border-yellow-400/80 hover:shadow-glow-gold',
    green: 'hover:border-emerald-400/80 hover:shadow-glow-lime',
    lime: 'hover:border-lime-400/80 hover:shadow-glow-lime',
    red: 'hover:border-red-500/80 hover:shadow-glow-red',
    pink: 'hover:border-pink-500/80 hover:shadow-glow-pink',
  }

  const variantStyles: Record<CardVariant, string> = {
    default: 'bg-brand-card/90 backdrop-blur-xl border border-white/10 text-foreground shadow-xl',
    glowing: `bg-brand-card/90 backdrop-blur-xl border border-white/10 text-foreground shadow-lg transition-all duration-300 ${glowStyles[glowColor]}`,
    feature: 'bg-gradient-to-br from-brand-card via-brand-surface to-brand-darkBg border-2 border-orange-500/30 text-foreground shadow-2xl hover:border-orange-500/70 hover:shadow-glow-orange',
    mode: 'bg-brand-card/90 backdrop-blur-xl border border-white/10 text-foreground shadow-xl transition-all duration-300',
    glass: 'glass-panel text-foreground shadow-2xl backdrop-blur-2xl border border-white/10',
    gradient: 'bg-brand-card/90 backdrop-blur-xl border border-white/10 text-foreground shadow-xl',
    bordered: 'bg-brand-surface/90 border border-brand-cardBorder hover:border-orange-500/60 text-foreground',
  }

  return (
    <motion.div
      whileHover={isInteractive ? { y: -4, scale: 1.012 } : undefined}
      whileTap={isInteractive ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={cn(
        'rounded-3xl transition-all duration-300 relative overflow-hidden',
        paddingStyles[padding],
        variantStyles[variant],
        isInteractive && 'cursor-pointer select-none',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
