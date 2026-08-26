import React from 'react'
import { Brain, TrendingUp, Sparkles } from 'lucide-react'
import { CognitiveMetricCard, CognitiveMetricItem } from '../components/CognitiveMetricCard'
import { useThemeStore } from '@store/themeStore'

const COGNITIVE_METRICS: CognitiveMetricItem[] = [
  { label: 'المرونة الذهنية', labelEn: 'Mental Agility', score: 88, color: 'bg-violet-500' },
  { label: 'الاستنتاج المنطقي', labelEn: 'Logic Deduction', score: 94, color: 'bg-pink-500' },
  { label: 'سرعة المعالجة', labelEn: 'Processing Speed', score: 82, color: 'bg-cyan-500' },
  { label: 'الذاكرة العاملة', labelEn: 'Working Memory', score: 90, color: 'bg-purple-500' },
]

export const CognitiveJourneySection: React.FC = () => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  return (
    <section className="p-6 rounded-[2.5rem] bg-gradient-to-br from-[#1D1238] via-brand-card to-[#0F0820] border-2 border-violet-500/40 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/20 text-violet-300 flex items-center justify-center text-xl border border-violet-500/30">
            🧬
          </div>
          <div>
            <h3 className="text-lg font-black text-white">
              {isRtl ? 'خريطتك الذهنية ومؤشرات الذكاء الحية' : 'Your Cognitive Mind Map'}
            </h3>
            <p className="text-xs text-slate-300">
              {isRtl ? 'تحليل ديناميكي لأداء عقلك بناءً على نتائج الاختبارات الأخيرة' : 'Real-time performance analytics calculated across mind challenges'}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/20 text-violet-300 text-xs font-black border border-violet-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>IQ SCORE: 128 (Top 4%)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {COGNITIVE_METRICS.map((m, idx) => (
          <CognitiveMetricCard key={idx} metric={m} />
        ))}
      </div>
    </section>
  )
}
