import React from 'react'
import { Zap, Flame, Clock, Trophy } from 'lucide-react'
import { useThemeStore } from '@store/themeStore'

export const SpeedMetricHero: React.FC = () => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Best Reaction */}
      <div className="p-6 rounded-[2rem] bg-gradient-to-br from-red-950/60 via-brand-card to-black/80 border-2 border-red-500/50 shadow-xl flex flex-col justify-between gap-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-red-400 uppercase tracking-widest flex items-center gap-1.5">
            <Zap className="w-4 h-4 fill-red-400 text-red-400" />
            {isRtl ? 'أفضل زمن استجابة' : 'PERSONAL BEST'}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-300 border border-red-500/30">
            TOP 1%
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight text-shadow-red">
            187
          </h2>
          <span className="text-lg font-black text-red-400 font-mono">ms</span>
        </div>
        <p className="text-[11px] text-slate-400 font-medium">
          {isRtl ? 'أسرع من 99% من جميع اللاعبين في المنصة' : 'Faster than 99% of all global players'}
        </p>
      </div>

      {/* 2. Global Record */}
      <div className="p-6 rounded-[2rem] bg-gradient-to-br from-orange-950/50 via-brand-card to-black/80 border-2 border-orange-500/50 shadow-xl flex flex-col justify-between gap-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            {isRtl ? 'الرقم القياسي العالمي' : 'GLOBAL RECORD'}
          </span>
          <span className="text-[11px] font-bold text-slate-400 font-mono">@SpeedKing</span>
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-4xl sm:text-5xl font-black text-amber-300 font-mono tracking-tight">
            142
          </h2>
          <span className="text-lg font-black text-orange-400 font-mono">ms</span>
        </div>
        <p className="text-[11px] text-slate-400 font-medium">
          {isRtl ? 'تم تسجيله في بطولة السرعة الكبرى' : 'Achieved during Reflex Grand Prix'}
        </p>
      </div>

      {/* 3. Average Reaction Speed */}
      <div className="p-6 rounded-[2rem] bg-gradient-to-br from-amber-950/40 via-brand-card to-black/80 border-2 border-amber-500/40 shadow-xl flex flex-col justify-between gap-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            {isRtl ? 'متوسط السرعة اليومي' : 'AVG REACTION'}
          </span>
          <span className="text-[10px] font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full">
            LAST 10 RUNS
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
            0.21
          </h2>
          <span className="text-lg font-black text-amber-400 font-mono">sec</span>
        </div>
        <p className="text-[11px] text-slate-400 font-medium">
          {isRtl ? 'تحسن بنسبة +14% عن الأسبوع الماضي' : '+14% speed increase since last week'}
        </p>
      </div>
    </div>
  )
}
