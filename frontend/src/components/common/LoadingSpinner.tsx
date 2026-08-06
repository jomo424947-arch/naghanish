import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@lib/utils'

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  fullScreen?: boolean
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  fullScreen = false,
  className,
}) => {
  const sizeStyles = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
    xl: 'w-24 h-24 border-4',
  }

  const spinnerContent = (
    <div className={cn('flex flex-col items-center justify-center gap-4 select-none', className)}>
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className={cn(
            'absolute rounded-full bg-gradient-to-tr from-brand-purple via-brand-blue to-cyan-300 blur-md',
            sizeStyles[size]
          )}
        />

        {/* Spinning Gradient Arc */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className={cn(
            'rounded-full border-t-transparent border-r-brand-blue border-b-brand-purple border-l-brand-orange shadow-lg',
            sizeStyles[size]
          )}
        />
      </div>

      {text && (
        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-sm font-bold text-slate-300 tracking-wide"
        >
          {text}
        </motion.p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-brand-darkBg/90 backdrop-blur-md flex items-center justify-center">
        {spinnerContent}
      </div>
    )
  }

  return spinnerContent
}
