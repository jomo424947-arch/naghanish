/**
 * ActionButtons.tsx
 *
 * Large primary/secondary action buttons for touch play (jump, shoot, flip).
 * Sized past the 44px minimum touch target and driven by pointer events so
 * they respond on press rather than on release.
 */

import React, { useCallback } from 'react'
import { cn } from '@lib/utils'

export interface ActionButtonProps {
  label: string
  icon?: React.ReactNode
  onPress: () => void
  onRelease?: () => void
  tone?: 'primary' | 'danger' | 'neutral'
  size?: 'md' | 'lg'
  disabled?: boolean
  className?: string
}

const TONE_CLASSES: Record<NonNullable<ActionButtonProps['tone']>, string> = {
  primary: 'bg-gradient-to-br from-brand-purple to-brand-blue border-cyan-400/50 text-white',
  danger: 'bg-gradient-to-br from-rose-500 to-red-600 border-rose-400/50 text-white',
  neutral: 'bg-white/5 border-white/10 text-slate-200',
}

const SIZE_CLASSES: Record<NonNullable<ActionButtonProps['size']>, string> = {
  md: 'min-w-[3.5rem] h-14 px-4 text-sm',
  lg: 'min-w-[5rem] h-20 px-6 text-base',
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  icon,
  onPress,
  onRelease,
  tone = 'primary',
  size = 'md',
  disabled,
  className,
}) => {
  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      event.preventDefault()
      if (!disabled) onPress()
    },
    [disabled, onPress]
  )

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onPointerDown={handlePointerDown}
      onPointerUp={onRelease}
      onPointerCancel={onRelease}
      onPointerLeave={onRelease}
      className={cn(
        'rounded-2xl border-2 font-black flex items-center justify-center gap-2 shadow-lg',
        'cursor-pointer touch-none select-none transition-transform active:scale-95',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        TONE_CLASSES[tone],
        SIZE_CLASSES[size],
        className
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

export interface ActionButtonsProps {
  children: React.ReactNode
  className?: string
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ children, className }) => (
  <div className={cn('flex items-center justify-center gap-4', className)}>{children}</div>
)
