import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Users, Brain, Trophy, Sparkles } from 'lucide-react'
import { Button } from '@components/common/Button'
import { ProgressIndicator } from '@components/common/ProgressIndicator'
import { AnimatedBackground } from '@components/common/AnimatedBackground'
import { ROUTES } from '@constants/routes'
import { useThemeStore } from '@store/themeStore'

const SLIDES = [
  {
    id: 1,
    title: 'Play Together',
    titleArabic: 'العب مع أصدقائك',
    description: 'Play fun games with your friends and the community in real-time party rooms.',
    descriptionArabic: 'انضم لغرف اللعب الجماعية وتحدّ أصدقائك في أجواء مليئة بالحماس والمرح!',
    icon: <Users className="w-16 h-16 text-cyan-300" />,
    color: 'from-purple-600 via-indigo-600 to-brand-blue',
    badge: '1/3',
  },
  {
    id: 2,
    title: 'Challenge Your Brain',
    titleArabic: 'تحدّ عقلك وذكائك',
    description: 'Sharpen your mind with hundreds of interactive games, logic puzzles and quizzes.',
    descriptionArabic: 'طوّر مهاراتك الذهنية والمنطقية مع مئات التحديات والاختبارات الممتعة يومياً.',
    icon: <Brain className="w-16 h-16 text-purple-300" />,
    color: 'from-indigo-600 via-brand-purple to-purple-800',
    badge: '2/3',
  },
  {
    id: 3,
    title: 'Grow Every Day',
    titleArabic: 'تطور وتصدر الصدارة',
    description: 'Earn XP, unlock rare achievements, climb leaderboards and become the ultimate champion.',
    descriptionArabic: 'اكسب النقاط والجوائز، افتح الإنجازات النادرة وتصدّر لائحة المتصدرين!',
    icon: <Trophy className="w-16 h-16 text-amber-300" />,
    color: 'from-amber-500 via-brand-orange to-purple-700',
    badge: '3/3',
  },
]

export const OnboardingPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const navigate = useNavigate()
  const { dir } = useThemeStore()

  const currentSlide = SLIDES[currentIndex]
  const isLast = currentIndex === SLIDES.length - 1

  const handleNext = () => {
    if (isLast) {
      navigate(ROUTES.LOGIN)
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handleSkip = () => {
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className="relative min-h-screen w-full bg-brand-darkBg text-slate-100 flex flex-col justify-between p-6 overflow-hidden select-none">
      <AnimatedBackground variant="hero" />

      {/* Top Header */}
      <header className="relative z-20 w-full max-w-md mx-auto flex items-center justify-between py-2">
        <span className="px-3 py-1 rounded-full bg-brand-card/80 border border-brand-cardBorder text-xs font-bold text-slate-400">
          {currentSlide.badge}
        </span>

        <button
          onClick={handleSkip}
          className="text-xs font-bold text-slate-400 hover:text-white transition-colors py-1.5 px-3 rounded-xl hover:bg-white/5"
        >
          {dir === 'rtl' ? 'تخطي' : 'Skip'}
        </button>
      </header>

      {/* Main Slide Carousel Area */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, x: dir === 'rtl' ? -40 : 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: dir === 'rtl' ? 40 : -40, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center w-full"
          >
            {/* 3D Illustration Frame */}
            <div className="relative mb-10 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple via-brand-blue to-cyan-300 rounded-4xl blur-3xl opacity-50 group-hover:opacity-75 transition-opacity" />

              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-4xl bg-gradient-to-br from-brand-card via-[#1A1A36] to-[#121226] border-4 border-brand-cardBorder flex items-center justify-center shadow-2xl overflow-hidden">
                {/* Visual Icon */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className={`p-8 rounded-3xl bg-gradient-to-br ${currentSlide.color} shadow-2xl border border-white/20`}
                >
                  {currentSlide.icon}
                </motion.div>

                {/* Decorative sparkles */}
                <div className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                </div>
              </div>
            </div>

            {/* Slide Titles */}
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              {dir === 'rtl' ? currentSlide.titleArabic : currentSlide.title}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-medium max-w-sm leading-relaxed mb-6">
              {dir === 'rtl' ? currentSlide.descriptionArabic : currentSlide.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Step Indicator Dots */}
        <ProgressIndicator currentStep={currentIndex + 1} totalSteps={SLIDES.length} variant="dots" className="mb-8" />
      </main>

      {/* Bottom Action CTA */}
      <footer className="relative z-20 w-full max-w-md mx-auto py-2 flex items-center justify-between gap-4">
        {currentIndex > 0 ? (
          <button
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            className="p-3.5 rounded-2xl bg-brand-card/80 border border-brand-cardBorder text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
          >
            {dir === 'rtl' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>
        ) : (
          <div className="w-12" />
        )}

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleNext}
          className="shadow-glow"
        >
          {isLast ? (dir === 'rtl' ? 'ابدأ الآن 🎉' : 'Get Started') : (dir === 'rtl' ? 'التالي' : 'Next')}
        </Button>
      </footer>
    </div>
  )
}
