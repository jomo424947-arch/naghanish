import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  CheckCircle2,
  Award,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Share2,
  Sparkles,
  Trophy,
  Brain,
  Zap,
} from 'lucide-react'
import { Card } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { ProgressIndicator } from '@components/common/ProgressIndicator'
import { SEO } from '@components/common/SEO'
import { AdSlot } from '@components/common/AdSlot'
import { ModeMascot } from '@components/common/ModeVisuals'
import { ROUTES } from '@constants/routes'
import { useThemeStore } from '@store/themeStore'

const MOCK_QUESTIONS = [
  {
    id: 1,
    question: 'عندما تواجه قراراً حاسماً في فريق العمل، ما هي ردة فعلك الأولى؟',
    questionEn: 'When facing a critical decision in a team, what is your first reaction?',
    options: [
      { text: 'أتولى القيادة وأضع خطة واضحة ومحددة.', textEn: 'Take charge and set a clear structured plan.', traits: 'Leader' },
      { text: 'أستمع لكافة الآراء وأحاول التوصل لاتفاق جماعي.', textEn: 'Listen to all opinions and seek consensus.', traits: 'Collaborator' },
      { text: 'أحلل البيانات والمعطيات بدقة قبل إبداء أي رأي.', textEn: 'Analyze data thoroughly before giving input.', traits: 'Analyst' },
      { text: 'أقترح أفكاراً مبتكرة وخارجة عن المألوف.', textEn: 'Propose innovative out-of-the-box ideas.', traits: 'Visionary' },
    ],
  },
  {
    id: 2,
    question: 'كيف تقضي وقت فراغك المثالي في عطلة نهاية الأسبوع؟',
    questionEn: 'How do you spend your ideal weekend free time?',
    options: [
      { text: 'تنظيم أنشطة اجتماعية وتجميع الأصدقاء.', textEn: 'Organize social events and bring friends together.', traits: 'Leader' },
      { text: 'قراءة كتاب أو تعلم مهارة جديدة بتركيز.', textEn: 'Read a book or master a new skill.', traits: 'Analyst' },
      { text: 'تنسيق مشروع جديد أو تجربة شيء فني.', textEn: 'Design a new project or try something artistic.', traits: 'Visionary' },
      { text: 'الاسترخاء وقضاء وقت ممتع مع العائلة.', textEn: 'Relax and spend quality time with family.', traits: 'Collaborator' },
    ],
  },
  {
    id: 3,
    question: 'ما هي النقطة التي يعتبرها الآخرون أقوى صفاتك؟',
    questionEn: 'What do others consider your strongest quality?',
    options: [
      { text: 'القدرة على الحسم والتوجيه في الأزمات.', textEn: 'Decisiveness and guidance during crises.', traits: 'Leader' },
      { text: 'الدقة العالية والتفكير المنطقي.', textEn: 'High precision and logical thinking.', traits: 'Analyst' },
      { text: 'الابتكار والحلول الذكية غير التقليدية.', textEn: 'Innovation and clever non-traditional solutions.', traits: 'Visionary' },
      { text: 'التعاطف والقدرة على مساندة أي شخص.', textEn: 'Empathy and ability to support anyone.', traits: 'Collaborator' },
    ],
  },
]

export function QuizDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dir } = useThemeStore()

  const isRtl = dir === 'rtl'

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [score, setScore] = useState<Record<string, number>>({})
  const [timer, setTimer] = useState(30)
  const [isFinished, setIsFinished] = useState(false)

  // Timer interval
  useEffect(() => {
    if (isFinished) return
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          handleNextQuestion()
          return 30
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [currentIndex, isFinished])

  const handleSelectOption = (index: number) => {
    setSelectedOption(index)
  }

  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      const trait = MOCK_QUESTIONS[currentIndex].options[selectedOption].traits
      setScore((prev) => ({ ...prev, [trait]: (prev[trait] || 0) + 1 }))
    }

    if (currentIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedOption(null)
      setTimer(30)
    } else {
      setIsFinished(true)
    }
  }

  const currentQ = MOCK_QUESTIONS[currentIndex]

  // Get top result personality
  const topTrait = Object.entries(score).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Leader'

  const RESULT_DESCS: Record<string, { ar: string; en: string; icon: string; badge: string }> = {
    Leader: {
      ar: 'أنت قائد بالفطرة 👑! تمتاز بالقدرة على الحسم والتوجيه وشحن طاقة الجميع نحو الهدف.',
      en: 'You are a Natural Leader 👑! Decisive, inspiring, and goal-oriented.',
      icon: '👑',
      badge: 'THE STRATEGIST',
    },
    Collaborator: {
      ar: 'أنت روح الفريق 🤝! تبني جسور التواصل وتصنع بيئة عمل متناغمة وداعمة.',
      en: 'You are a Team Player 🤝! Great at bridging gaps and creating harmony.',
      icon: '🤝',
      badge: 'THE DIPLOMAT',
    },
    Analyst: {
      ar: 'أنت مفكر استراتيجي 🧠! تعتمد على المنطق والمعطيات للوصول إلى أدق النتائج.',
      en: 'You are a Strategic Thinker 🧠! Analytical, precise, and logical.',
      icon: '🧠',
      badge: 'THE MASTERMIND',
    },
    Visionary: {
      ar: 'أنت مبتكر ومبدع 💡! تمتلك رؤية مستقبلية وحلولاً خارج الصندوق.',
      en: 'You are a Visionary 💡! Creative, forward-thinking, and innovative.',
      icon: '💡',
      badge: 'THE INNOVATOR',
    },
  }

  const resultInfo = RESULT_DESCS[topTrait]

  return (
    <div className="flex flex-col gap-6 py-4 max-w-3xl mx-auto">
      <SEO
        title={isFinished ? `نتيجة الإختبار: ${topTrait}` : `اختبار تفاعلي | مختبر نغنِش`}
        description="خوض الاختبار التفاعلي واحصل على تحليل شخصيتك الدقيق واكسب نقاط XP."
      />

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(ROUTES.QUIZ_CENTER)}
        >
          {isRtl ? 'العودة للاختبارات' : 'Back to Quizzes'}
        </Button>

        {!isFinished && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-brand-darkBg border border-cyan-400/40 text-xs font-black text-cyan-300 shadow-glow-blue">
            <Clock className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span>00:{timer < 10 ? `0${timer}` : timer}</span>
          </div>
        )}
      </div>

      {!isFinished ? (
        <Card
          variant="glowing"
          glowColor="pink"
          className="p-6 sm:p-8 flex flex-col gap-6 border-2 border-violet-500/40"
        >
          {/* Progress Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-black text-slate-300">
              <span className="flex items-center gap-1.5 text-violet-300">
                <Brain className="w-4 h-4" />
                {isRtl
                  ? `السؤال ${currentIndex + 1} من ${MOCK_QUESTIONS.length}`
                  : `Question ${currentIndex + 1} of ${MOCK_QUESTIONS.length}`}
              </span>
              <span className="text-cyan-300 font-mono">
                {Math.round(((currentIndex + 1) / MOCK_QUESTIONS.length) * 100)}%
              </span>
            </div>
            <ProgressIndicator
              currentStep={currentIndex + 1}
              totalSteps={MOCK_QUESTIONS.length}
              variant="bar"
            />
          </div>

          {/* Question Text */}
          <h2 className="text-xl sm:text-2xl font-black text-white leading-relaxed mt-2">
            {isRtl ? currentQ.question : currentQ.questionEn}
          </h2>

          {/* Options Grid */}
          <div className="flex flex-col gap-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 text-right rtl:text-right text-left text-sm sm:text-base font-black transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer select-none ${
                    isSelected
                      ? 'bg-gradient-to-r from-violet-600/40 to-pink-600/40 border-pink-400 text-white shadow-glow'
                      : 'bg-brand-darkBg/80 border-brand-cardBorder text-slate-300 hover:border-violet-400 hover:text-white'
                  }`}
                >
                  <span className="leading-snug">{isRtl ? opt.text : opt.textEn}</span>
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'border-pink-300 bg-pink-500 text-white shadow-glow-pink'
                        : 'border-slate-600 bg-brand-card'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                  </div>
                </button>
              )
            })}
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={selectedOption === null}
            onClick={handleNextQuestion}
            className="shadow-glow mt-2"
          >
            {currentIndex < MOCK_QUESTIONS.length - 1
              ? isRtl
                ? 'السؤال التالي ⚡'
                : 'Next Question ⚡'
              : isRtl
              ? 'عرض النتيجة النهائية 🎉'
              : 'See Final Results 🎉'}
          </Button>
        </Card>
      ) : (
        /* Results Card */
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card
            variant="glowing"
            glowColor="gold"
            className="p-8 sm:p-10 flex flex-col items-center text-center gap-6 border-2 border-amber-400/60 shadow-2xl"
          >
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-violet-600 via-pink-600 to-amber-500 flex items-center justify-center text-6xl shadow-glow-gold">
              {resultInfo.icon}
            </div>

            <div>
              <span className="px-3.5 py-1 rounded-full bg-violet-500/20 text-pink-300 text-xs font-black uppercase tracking-wider border border-pink-400/30">
                {resultInfo.badge}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-3">
                {topTrait}
              </h2>
              <p className="text-sm sm:text-base text-slate-200 font-medium max-w-md mx-auto mt-2 leading-relaxed">
                {isRtl ? resultInfo.ar : resultInfo.en}
              </p>
            </div>

            {/* Rewards Card */}
            <div className="flex items-center gap-5 p-4 rounded-2xl bg-brand-darkBg border border-brand-cardBorder w-full max-w-xs justify-center shadow-inner">
              <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>+250 XP</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-2 text-cyan-300 font-black text-sm">
                <Sparkles className="w-5 h-5 text-cyan-300" />
                <span>+50 Coins</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <Button
                variant="secondary"
                size="md"
                fullWidth
                leftIcon={<RotateCcw className="w-4 h-4" />}
                onClick={() => {
                  setIsFinished(false)
                  setCurrentIndex(0)
                  setSelectedOption(null)
                  setScore({})
                  setTimer(30)
                }}
              >
                {isRtl ? 'إعادة الإختبار' : 'Retake Quiz'}
              </Button>
              <Button
                variant="primary"
                size="md"
                fullWidth
                leftIcon={<Share2 className="w-4 h-4" />}
                onClick={() => navigate(ROUTES.QUIZ_CENTER)}
              >
                {isRtl ? 'استكشف اختبارات أخرى' : 'Explore More'}
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
