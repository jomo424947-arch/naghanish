import React from 'react'
import { cn } from '@lib/utils'

export interface SectionTitleProps {
  title: string
  subtitle?: string
  badgeText?: string
  badgeColor?: 'purple' | 'blue' | 'orange' | 'green' | 'pink'
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  badgeText,
  badgeColor = 'purple',
  icon,
  action,
  className,
}) => {
  const badgeColorStyles = {
    purple: 'bg-brand-purple/20 text-purple-300 border-purple-500/30',
    blue: 'bg-brand-blue/20 text-cyan-300 border-cyan-400/30',
    orange: 'bg-brand-orange/20 text-orange-300 border-orange-500/30',
    green: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    pink: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  }

  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6', className)}>
      <div className="flex items-start gap-3">
        {icon && (
          <div className="p-3 rounded-2xl bg-brand-card border border-brand-cardBorder text-brand-blue shrink-0 shadow-md">
            {icon}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{title}</h2>
            {badgeText && (
              <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-bold border', badgeColorStyles[badgeColor])}>
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">{subtitle}</p>}
        </div>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
