import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@lib/utils'

export interface LanguageCardProps {
  id: 'ar' | 'en'
  name: string
  nativeName: string
  flag: string
  dirText: string
  selected?: boolean
  onClick?: () => void
}

export const LanguageCard: React.FC<LanguageCardProps> = ({
  name,
  nativeName,
  flag,
  dirText,
  selected = false,
  onClick,
}) => {
  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={onClick}
      className={cn(
        'w-full p-5 rounded-3xl transition-all duration-300 flex items-center justify-between text-left rtl:text-right border cursor-pointer',
        selected
          ? 'bg-gradient-to-r from-brand-purple/30 via-brand-card to-brand-blue/20 border-brand-blue shadow-glow-blue'
          : 'bg-brand-card/80 border-brand-cardBorder hover:border-slate-500 hover:bg-brand-card'
      )}
    >
      <div className="flex items-center gap-4">
        <span className="text-4xl shrink-0 drop-shadow-md select-none">{flag}</span>
        <div>
          <h3 className="text-lg font-bold text-white">{nativeName}</h3>
          <p className="text-xs text-slate-400 font-medium">
            {name} • <span className="text-brand-blue">{dirText}</span>
          </p>
        </div>
      </div>

      <div
        className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-200',
          selected
            ? 'bg-gradient-to-r from-brand-blue to-cyan-400 border-cyan-300 text-slate-950 shadow-glow-blue'
            : 'border-slate-600 bg-transparent'
        )}
      >
        {selected && <Check className="w-4 h-4 stroke-[3]" />}
      </div>
    </motion.button>
  )
}
