import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@lib/utils'

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  showTagline?: boolean
  className?: string
  animated?: boolean
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = true,
  className,
  animated = true,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl',
  }

  const taglineSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base',
  }

  return (
    <div className={cn('inline-flex items-center gap-3 select-none', className)}>
      <motion.div
        animate={animated ? { rotate: [0, -3, 3, -3, 0], scale: [1, 1.03, 1] } : undefined}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className={cn('relative flex items-center justify-center shrink-0', iconSizes[size])}
      >
        {/* Playful 'N' Mascot Icon SVG matching Naghanish identity */}
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_10px_20px_rgba(124,58,237,0.5)]"
        >
          <defs>
            <linearGradient id="nGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF7315" />
              <stop offset="35%" stopColor="#7C3AED" />
              <stop offset="70%" stopColor="#9333EA" />
              <stop offset="100%" stopColor="#00D2FF" />
            </linearGradient>
            <linearGradient id="smileGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00D2FF" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Card Icon Frame */}
          <rect width="120" height="120" rx="32" fill="#15152A" />
          <rect width="118" height="118" x="1" y="1" rx="31" stroke="url(#nGradient)" strokeWidth="2" strokeOpacity="0.4" />

          {/* Confetti Sparks around 'N' */}
          <circle cx="28" cy="28" r="4" fill="#FF7315" />
          <polygon points="102,24 107,32 97,32" fill="#00D2FF" />
          <circle cx="106" cy="76" r="4.5" fill="#EAB308" />
          <polygon points="16,84 22,92 12,92" fill="#EC4899" />

          {/* Main 'N' Body */}
          <path
            d="M 40 90 C 28 90 26 75 32 50 C 38 25 50 20 62 26 C 68 30 76 50 82 70 C 86 50 86 35 94 35 C 100 35 102 44 98 60 C 94 76 86 92 70 88 C 58 84 50 60 46 46 C 42 62 48 90 40 90 Z"
            fill="url(#nGradient)"
            filter="url(#glow)"
          />

          {/* Mascot Winking Eyes */}
          <circle cx="85" cy="46" r="3.5" fill="#FFFFFF" />
          <path d="M 68 44 Q 72 40 76 44" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Mascot Smile Curve */}
          <path
            d="M 45 74 Q 65 92 85 74"
            stroke="url(#smileGradient)"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </motion.div>

      {showText && (
        <div className="flex flex-col">
          <div className={cn('font-extrabold tracking-tight flex items-center gap-1', textSizes[size])}>
            <span className="bg-gradient-to-r from-white via-purple-100 to-cyan-300 bg-clip-text text-transparent">
              نغانيش
            </span>
            <span className="text-brand-blue font-bold text-sm tracking-widest hidden sm:inline">
              NAGHANISH
            </span>
          </div>

          {showTagline && (
            <span
              className={cn(
                'font-bold bg-gradient-to-r from-brand-orange via-amber-400 to-brand-blue bg-clip-text text-transparent',
                taglineSizes[size]
              )}
            >
              يلا نغتش! ✨
            </span>
          )}
        </div>
      )}
    </div>
  )
}
