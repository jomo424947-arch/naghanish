import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, CheckCircle2, Award, ArrowLeft, ArrowRight, RotateCcw, Share2, Sparkles, Trophy } from 'lucide-react'
import { SectionTitle } from '@components/common/SectionTitle'
import { Card } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { ProgressIndicator } from '@components/common/ProgressIndicator'
import { SEO } from '@components/common/SEO'
import { AdSlot } from '@components/common/AdSlot'
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
    ]
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
    ]
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
    ]
  }
]

export function QuizDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dir } = useThemeStore()

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
      setScore(prev => ({ ...prev, [trait]: (prev[trait] || 0) + 1 }))
    }

    if (currentIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedOption(null)
      setTimer(30)
    } else {
      setIsFinished(true)
    }
  }

  const currentQ = MOCK_QUESTIONS[currentIndex]

  // Get top result personality
  const topTrait = Object.entries(score).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Leader'

  const RESULT_DESCS: Record<string, { ar: string; en: string; icon: string }> = {
    Leader: { ar: 'أنت قائد طبيعي 👑! تمتاز بالقدرة على الحسم والتوجيه وشحن طاقة الجميع نحو الهدف.', en: 'You are a Natural Leader 👑! Decisive, inspiring, and goal-oriented.', icon: '👑' },
    Collaborator: { ar: 'أنت روح الفريق 🤝! تبني جسور التواصل وتصنع بيئة عمل متناغمة وداعمة.', en: 'You are a Team Player 🤝! Great at bridging gaps and creating harmony.', icon: '🤝' },
    Analyst: { ar: 'أنت مفكر استراتيجي 🧠! تعتمد على المنطق والمعطيات للوصول إلى أدق النتائج.', en: 'You are a Strategic Thinker 🧠! Analytical, precise, and logical.', icon: '🧠' },
    Visionary: { ar: 'أنت مبتكر ومبدع 💡! تمتلك رؤية مستقبلية وحلولاً خارج الصندوق.', en: 'You are a Visionary 💡! Creative, forward-thinking, and innovative.', icon: '💡' },
  }

  const resultInfo = RESULT_DESCS[topTrait]

  return (
    <div className="flex flex-col gap-6 py-4 max-w-3xl mx-auto">
      <SEO
        title={isFinished ? `نتيجة الإختبار: ${topTrait}` : `اختبار تفاعلي | نغنِش`}
        description="خوض الاختبار التفاعلي واحصل على تحليل شخصيتك الدقيق واكسب نقاط XP."
      />

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(ROUTES.QUIZ_CENTER)}
        >
          {dir === 'rtl' ? 'العودة للاختبارات' : 'Back to Quizzes'}
        </Button>

        {!isFinished && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-brand-card border border-brand-cardBorder text-xs font-bold text-slate-300">
            <Clock className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span>00:{timer < 10 ? `0${timer}` : timer}</span>
          </div>
        )}
      </div>

      {!isFinished ? (
        <Card variant="glowing" glowColor="cyan" className="p-6 sm:p-8 flex flex-col gap-6">
          {/* Progress */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>{dir === 'rtl' ? `السؤال ${currentIndex + 1} من ${MOCK_QUESTIONS.length}` : `Question ${currentIndex + 1} of ${MOCK_QUESTIONS.length}`}</span>
              <span className="text-cyan-300">{Math.round(((currentIndex + 1) / MOCK_QUESTIONS.length) * 100)}%</span>
            </div>
            <ProgressIndicator currentStep={currentIndex + 1} totalSteps={MOCK_QUESTIONS.length} variant="bar" />
          </div>

          {/* Question Text */}
          <h2 className="text-lg sm:text-xl font-black text-white leading-relaxed mt-2">
            {dir === 'rtl' ? currentQ.question : currentQ.questionEn}
          </h2>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border text-right rtl:text-right text-left text-sm font-bold transition-all duration-200 flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-brand-purple/40 to-brand-blue/30 border-brand-blue text-white shadow-glow'
                      : 'bg-brand-darkBg/60 border-brand-cardBorder text-slate-300 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  <span>{dir === 'rtl' ? opt.text : opt.textEn}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-cyan-300 bg-cyan-400 text-brand-darkBg' : 'border-slate-600'
                  }`}>
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
            className="shadow-glow"
          >
            {currentIndex < MOCK_QUESTIONS.length - 1
              ? (dir === 'rtl' ? 'السؤال التالي' : 'Next Question')
              : (dir === 'rtl' ? 'عرض النتيجة 🎉' : 'See Results 🎉')}
          </Button>
        </Card>
      ) : (
        /* Results Card */
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card variant="glowing" glowColor="purple" className="p-8 flex flex-col items-center text-center gap-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-purple to-brand-orange flex items-center justify-center text-5xl shadow-glow">
              {resultInfo.icon}
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-brand-purple/30 text-purple-300 text-xs font-black uppercase tracking-wider border border-purple-500/30">
                {dir === 'rtl' ? 'النتيجة النهائية' : 'Final Personality Analysis'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                {topTrait}
              </h2>
              <p className="text-sm text-slate-300 font-medium max-w-md mx-auto mt-2 leading-relaxed">
                {dir === 'rtl' ? resultInfo.ar : resultInfo.en}
              </p>
            </div>

            {/* Rewards */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-brand-darkBg border border-brand-cardBorder w-full max-w-xs justify-center">
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
                {dir === 'rtl' ? 'إعادة الإختبار' : 'Retake Quiz'}
              </Button>
              <Button
                variant="primary"
                size="md"
                fullWidth
                leftIcon={<Share2 className="w-4 h-4" />}
                onClick={() => navigate(ROUTES.QUIZ_CENTER)}
              >
                {dir === 'rtl' ? 'اختبارات أخرى' : 'Explore More'}
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
