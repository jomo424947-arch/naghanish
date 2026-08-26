import React from 'react'
import { IQ_QUIZZES } from '@data/games.data'
import { IQQuizCard } from '../components/IQQuizCard'
import { useThemeStore } from '@store/themeStore'

interface IQTestsSectionProps {
  filterCategory?: string
  onStartQuiz: (route: string) => void
}

export const IQTestsSection: React.FC<IQTestsSectionProps> = ({ filterCategory = 'all', onStartQuiz }) => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  const filteredQuizzes = IQ_QUIZZES.filter((q) => {
    if (filterCategory === 'personality') return q.category === 'Personality'
    return true
  })

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-violet-500/20 text-violet-400 flex items-center justify-center text-lg shadow-sm border border-violet-500/30">
            🧪
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isRtl ? 'اختبارات الذكاء وتحليل الشخصية' : 'IQ & Personality Assessments'}
            </h2>
            <p className="text-xs text-slate-300">
              {isRtl ? 'اكتشف نمط تفكيرك، أسلوب اتخاذ القرار، وقدرتك الاستنتاجية' : 'Discover thinking models, leadership agility and deep cognition'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredQuizzes.map((quiz) => (
          <IQQuizCard key={quiz.id} quiz={quiz} onStartQuiz={onStartQuiz} />
        ))}
      </div>
    </section>
  )
}
