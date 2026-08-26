import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@lib/utils'

export type CardVariant = 'default' | 'glowing' | 'glass' | 'gradient' | 'bordered' | 'feature' | 'mode'
export type CardGlowColor =
  | 'purple'
  | 'blue'
  | 'orange'
  | 'cyan'
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
  glowColor = 'purple',
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
    purple: 'hover:border-purple-500/70 hover:shadow-glow',
    blue: 'hover:border-sky-400/80 hover:shadow-glow-blue',
    cyan: 'hover:border-cyan-400/80 hover:shadow-glow-cyan',
    orange: 'hover:border-orange-500/80 hover:shadow-glow-orange',
    green: 'hover:border-emerald-400/80 hover:shadow-glow-lime',
    gold: 'hover:border-amber-400/80 hover:shadow-glow-gold',
    yellow: 'hover:border-yellow-400/80 hover:shadow-glow-gold',
    lime: 'hover:border-lime-400/80 hover:shadow-glow-lime',
    red: 'hover:border-red-500/80 hover:shadow-glow-red',
    pink: 'hover:border-pink-500/80 hover:shadow-glow-pink',
  }

  const variantStyles: Record<CardVariant, string> = {
    default: 'bg-brand-card border border-brand-cardBorder text-foreground shadow-xl',
    glowing: `bg-brand-card border border-brand-cardBorder text-foreground shadow-lg transition-all duration-300 ${glowStyles[glowColor]}`,
    feature: 'bg-gradient-to-br from-brand-card via-brand-surface to-brand-card border-2 border-brand-purple/40 text-foreground shadow-2xl hover:border-brand-purple/80 hover:shadow-glow',
    mode: 'bg-brand-card/90 backdrop-blur-md border-2 border-brand-cardBorder text-foreground shadow-xl transition-all duration-300',
    glass: 'glass-panel text-foreground shadow-2xl backdrop-blur-xl border border-brand-cardBorder',
    gradient: 'bg-brand-card border border-brand-cardBorder text-foreground shadow-xl',
    bordered: 'bg-brand-surface border-2 border-brand-cardBorder hover:border-brand-purple text-foreground',
  }

  return (
    <motion.div
      whileHover={isInteractive ? { y: -5, scale: 1.015 } : undefined}
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
