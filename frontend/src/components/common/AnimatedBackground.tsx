import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@lib/utils'

export interface AnimatedBackgroundProps {
  variant?: 'default' | 'auth' | 'hero' | 'minimal'
  className?: string
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  variant = 'default',
  className,
}) => {
  return (
    <div className={cn('fixed inset-0 pointer-events-none overflow-hidden z-0 select-none transition-all duration-300', className)}>
      {/* Radial Gradient Glow Center */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-purple/15 light:bg-purple-200/40 rounded-full blur-[140px]" />

      {/* Floating Ambient Blob (Top-Right / Left) */}
      <motion.div
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -30, 30, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-20 -right-20 w-[450px] h-[450px] bg-brand-blue/20 light:bg-sky-200/50 rounded-full blur-[130px]"
      />

      {/* Floating Accent Blob (Bottom-Left) */}
      <motion.div
        animate={{
          x: [0, -30, 30, 0],
          y: [0, 40, -40, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-brand-orange/15 light:bg-amber-200/40 rounded-full blur-[120px]"
      />

      {/* Grid Pattern Overlay */}
      {variant !== 'minimal' && (
        <div
          className="absolute inset-0 opacity-[0.03] light:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '36px 36px',
          }}
        />
      )}

      {/* Ambient Floating Sparkles for Auth/Hero */}
      {variant === 'hero' && (
        <>
          <motion.div
            animate={{ y: [0, -20, 0], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/3 left-1/6 w-3 h-3 rounded-full bg-brand-blue shadow-glow-blue"
          />
          <motion.div
            animate={{ y: [0, 20, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute bottom-1/3 right-1/4 w-4 h-4 rounded-full bg-brand-orange shadow-glow-orange"
          />
        </>
      )}
    </div>
  )
}

