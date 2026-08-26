import React from 'react'
import { Flame, Clock, Zap } from 'lucide-react'
import { useThemeStore } from '@store/themeStore'

const RECENT_ATTEMPTS = [
  { test: 'اختبار سرعة ردة الفعل ⚡', time: '187 ms', date: 'منذ 10 دقائق', badge: 'جديد قياسي' },
  { test: 'قناص الأهداف الخاطفة 🎯', time: '0.24s avg', date: 'منذ ساعتين', badge: 'دقة 98%' },
  { test: 'ضربة التوقيت والإيقاع 🥁', time: 'Combo x42', date: 'أمس', badge: 'ممتاز' },
]

export const RecentAttemptsSection: React.FC = () => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  return (
    <section className="flex flex-col gap-4 p-6 rounded-[2rem] bg-gradient-to-br from-[#240808] via-brand-card to-[#100303] border-2 border-red-500/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-black text-white">
            {isRtl ? 'سجل المحاولات والأرقام الأخيرة' : 'Recent Sprint Attempts'}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {RECENT_ATTEMPTS.map((a, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-black/50 border border-red-500/30 flex items-center justify-between gap-3 font-mono"
          >
            <div>
              <span className="text-xs font-black text-white block">{a.test}</span>
              <span className="text-[10px] text-slate-400">{a.date}</span>
            </div>
            <div className="text-end">
              <span className="text-sm font-black text-red-400 block">{a.time}</span>
              <span className="text-[9px] font-black text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded">
                {a.badge}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
