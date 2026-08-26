import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@lib/utils'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'shilla'
  | 'arcade'
  | 'gold'
  | 'reflex'
  | 'chaos'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-gradient-to-r from-brand-purpleDark via-brand-purple to-purple-600 text-white font-extrabold shadow-glow hover:shadow-purple-500/50 border border-purple-400/40 active:translate-y-0.5',
    secondary:
      'bg-gradient-to-r from-cyan-400 via-brand-blue to-sky-400 text-slate-950 font-black shadow-glow-blue hover:shadow-cyan-400/60 border border-cyan-200/50 active:translate-y-0.5',
    accent:
      'bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500 text-slate-950 font-black shadow-glow-orange hover:shadow-amber-500/60 border border-orange-300/50 active:translate-y-0.5',
    shilla:
      'bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400 text-slate-950 font-black shadow-glow-orange hover:shadow-orange-500/60 border border-amber-300/60 active:translate-y-0.5',
    arcade:
      'bg-gradient-to-r from-purple-600 via-brand-blue to-cyan-400 text-white font-black shadow-glow-blue hover:shadow-cyan-400/60 border border-cyan-300/50 active:translate-y-0.5',
    gold:
      'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black shadow-glow-gold hover:shadow-yellow-400/60 border border-amber-200/60 active:translate-y-0.5',
    reflex:
      'bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 text-white font-black shadow-glow-red hover:shadow-red-500/60 border border-rose-300/40 active:translate-y-0.5',
    chaos:
      'bg-gradient-to-r from-lime-500 via-emerald-400 to-teal-400 text-slate-950 font-black shadow-glow-lime hover:shadow-lime-400/60 border border-lime-200/60 active:translate-y-0.5',
    outline:
      'border-2 border-brand-cardBorder bg-brand-card/70 text-slate-200 font-bold hover:bg-brand-card hover:border-brand-purple/70 hover:text-white',
    ghost:
      'bg-transparent text-slate-300 font-bold hover:bg-white/10 hover:text-white',
    danger:
      'bg-gradient-to-r from-red-600 to-rose-500 text-white font-extrabold shadow-md hover:shadow-red-500/40 border border-red-400/30',
  }

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5 font-medium',
    md: 'px-5 py-2.5 text-sm rounded-2xl gap-2 font-semibold',
    lg: 'px-7 py-3.5 text-base rounded-2xl gap-2.5 font-bold',
    xl: 'px-8 py-4 text-lg rounded-3xl gap-3 font-bold',
  }

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.96 }}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center transition-all duration-200 select-none outline-none focus:ring-2 focus:ring-brand-purple/50 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          {children && <span>{children}</span>}
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  )
}
