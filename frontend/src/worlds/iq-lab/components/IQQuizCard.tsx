import React from 'react'
import { Clock, Star, Play, Award } from 'lucide-react'
import { QuizItem } from '@data/games.data'
import { useThemeStore } from '@store/themeStore'
import { cn } from '@lib/utils'

interface IQQuizCardProps {
  quiz: QuizItem
  onStartQuiz: (route: string) => void
}

export const IQQuizCard: React.FC<IQQuizCardProps> = ({ quiz, onStartQuiz }) => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  return (
    <div
      onClick={() => onStartQuiz(quiz.route)}
      className="p-6 rounded-[2rem] bg-gradient-to-br from-violet-950/40 via-purple-950/20 to-black/60 border-2 border-violet-500/40 hover:border-violet-400 shadow-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all flex flex-col justify-between gap-4 group cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md shrink-0',
              `bg-gradient-to-br ${quiz.color}`
            )}
          >
            🧪
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded-md border border-violet-500/30">
              {quiz.categoryAr}
            </span>
            <h4 className="text-base font-black text-white group-hover:text-violet-300 transition-colors mt-1">
              {isRtl ? quiz.title : quiz.titleEn}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{quiz.rating}</span>
        </div>
      </div>

      <p className="text-xs text-slate-300 font-medium leading-relaxed">
        {isRtl ? quiz.descAr : quiz.descEn}
      </p>

      <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-medium text-slate-300">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{quiz.time}</span>
        </div>
        <span>{quiz.questions} {isRtl ? 'سؤالاً' : 'Questions'}</span>
        <span className="text-violet-400 font-black">+{quiz.xpReward} XP</span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onStartQuiz(quiz.route)
        }}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-violet-700 text-white font-black text-xs shadow-md hover:scale-105 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Play className="w-3.5 h-3.5 fill-white" />
        <span>{isRtl ? 'بدء الاختبار الإدراكي' : 'Start Assessment'}</span>
      </button>
    </div>
  )
}
