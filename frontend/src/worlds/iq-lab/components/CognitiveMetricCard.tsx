import React from 'react'
import { Activity } from 'lucide-react'
import { useThemeStore } from '@store/themeStore'

export interface CognitiveMetricItem {
  label: string
  labelEn: string
  score: number
  color: string
}

interface CognitiveMetricCardProps {
  metric: CognitiveMetricItem
}

export const CognitiveMetricCard: React.FC<CognitiveMetricCardProps> = ({ metric }) => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  return (
    <div className="p-4 rounded-2xl bg-black/40 border border-violet-500/30 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-300">
          {isRtl ? metric.label : metric.labelEn}
        </span>
        <span className="text-xs font-black text-violet-300">{metric.score}/100</span>
      </div>
      <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-white/10">
        <div
          className={`h-full ${metric.color} rounded-full transition-all duration-500`}
          style={{ width: `${metric.score}%` }}
        />
      </div>
    </div>
  )
}
