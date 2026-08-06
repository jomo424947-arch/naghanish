import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@lib/utils'

export interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  variant?: 'dots' | 'bar'
  showLabels?: boolean
  className?: string
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  variant = 'dots',
  showLabels = false,
  className,
}) => {
  const percentage = Math.min(Math.max((currentStep / totalSteps) * 100, 0), 100)

  if (variant === 'bar') {
    return (
      <div className={cn('w-full flex flex-col gap-2', className)}>
        {showLabels && (
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Progress</span>
            <span className="text-brand-blue">{currentStep} / {totalSteps}</span>
          </div>
        )}
        <div className="w-full h-3 rounded-full bg-brand-cardBorder overflow-hidden p-0.5 border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-brand-purple via-brand-blue to-cyan-400 shadow-glow-blue"
          />
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center justify-center gap-2 select-none', className)}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index === currentStep - 1
        const isCompleted = index < currentStep - 1

        return (
          <motion.div
            key={index}
            animate={{
              width: isActive ? 28 : 10,
              backgroundColor: isActive
                ? '#00D2FF'
                : isCompleted
                ? '#7C3AED'
                : '#2E2E54',
            }}
            transition={{ duration: 0.3 }}
            className="h-2.5 rounded-full cursor-pointer shadow-sm"
          />
        )
      })}
    </div>
  )
}
