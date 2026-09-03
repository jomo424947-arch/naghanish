import React from 'react'
import { motion } from 'framer-motion'
import { Button } from './Button'
import { GamerMascot } from './GamerMascot'
import { cn } from '@lib/utils'

export interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'لا توجد بيانات للعرض',
  description = 'جرب تغيير خيارات البحث أو العودة لاحقاً لاستكشاف المزيد!',
  icon,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'w-full p-8 sm:p-12 rounded-[2rem] bg-brand-card/85 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center text-center gap-5 shadow-2xl',
        className
      )}
    >
      {/* Gamer Mascot / Icon */}
      {icon ? (
        <div className="w-24 h-24 rounded-3xl bg-brand-surface/90 border border-white/10 flex items-center justify-center text-cyan-300 shadow-glow-orange">
          {icon}
        </div>
      ) : (
        <GamerMascot variant="empty" size="lg" animated={true} />
      )}

      <div className="max-w-md">
        <h3 className="text-xl sm:text-2xl font-black text-white font-display">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1.5 leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}
