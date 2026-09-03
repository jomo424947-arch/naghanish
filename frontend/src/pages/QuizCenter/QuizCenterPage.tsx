import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Search,
  HelpCircle,
  Brain,
  Star,
  Play,
  Clock,
  Award,
  Zap,
  CheckCircle2,
} from 'lucide-react'
import { Input } from '@components/common/Input'
import { Button } from '@components/common/Button'
import { SEO } from '@components/common/SEO'
import { AdSlot } from '@components/common/AdSlot'
import { ModeMascot } from '@components/common/ModeVisuals'
import { ROUTES } from '@constants/routes'
import { useThemeStore } from '@store/themeStore'

const QUIZZES = [
  {
    id: 'q1',
    title: 'اختبار الشخصية القيادية 👑',
    titleEn: 'Leadership Personality Test 👑',
    category: 'Personality',
    questions: 10,
    time: '5m',
    completions: '14.2k',
    rating: 4.9,
    badge: 'Popular',
    color: 'from-amber-500 via-orange-600 to-yellow-600',
    xpReward: 250,
    descAr: 'اكتشف نمط قيادتك وقدرتك على توجيه الفريق وصناعة القرارات.',
    descEn: 'Discover your leadership style and decision-making traits.',
  },
  {
    id: 'q2',
    title: 'تحدي المعرفة الثقافية العامة 🌍',
    titleEn: 'General Knowledge Challenge 🌍',
    category: 'General',
    questions: 15,
    time: '8m',
    completions: '28.9k',
    rating: 4.8,
    badge: 'Trending',
    color: 'from-cyan-500 via-blue-600 to-indigo-700',
    xpReward: 300,
    descAr: 'اختبر حصيلتك المعرفية في الجغرافيا، العلوم، وتاريخ العالم.',
    descEn: 'Test your breadth of knowledge across history and science.',
  },
  {
    id: 'q3',
    title: 'مقياس الذكاء والتحليل النفسي 🧠',
    titleEn: 'IQ & Psychology Scale 🧠',
    category: 'IQ',
    questions: 12,
    time: '6m',
    completions: '9.4k',
    rating: 4.9,
    badge: 'Hot',
    color: 'from-violet-600 via-purple-700 to-pink-600',
    xpReward: 350,
    descAr: 'أسئلة منطقية ونفسية عميقة لقياس مرونة عقلك وقوة الاستنتاج.',
    descEn: 'Logical and psychological puzzles to gauge cognitive agility.',
  },
  {
    id: 'q4',
    title: 'ما هو نمط تفكيرك السائد؟ 💡',
    titleEn: 'What is your Dominant Thinking Style? 💡',
    category: 'Personality',
    questions: 8,
    time: '4m',
    completions: '18.5k',
    rating: 4.7,
    badge: 'New',
    color: 'from-pink-500 via-rose-600 to-purple-600',
    xpReward: 200,
    descAr: 'هل أنت مفكر تحليلي، إبداعي، أم عاطفي؟ اكتشف خريطتك الذهنية.',
    descEn: 'Are you an analytical, creative, or intuitive thinker?',
  },
  {
    id: 'q5',
    title: 'اختبار محبي السينما والأفلام 🎬',
    titleEn: 'Cinema & Movie Buff Quiz 🎬',
    category: 'Entertainment',
    questions: 10,
    time: '5m',
    completions: '11.3k',
    rating: 4.6,
    badge: 'Fun',
    color: 'from-emerald-500 via-teal-600 to-cyan-700',
    xpReward: 220,
    descAr: 'تحدي لخبراء السينما: ميز أشهر الاقتباسات والمشاهد العالمية.',
    descEn: 'Challenge for movie lovers: iconic quotes and famous scenes.',
  },
  {
    id: 'q6',
    title: 'تحدي تاريخ الألفية 🏛️',
    titleEn: 'Millennium History Quiz 🏛️',
    category: 'History',
    questions: 12,
    time: '7m',
    completions: '6.8k',
    rating: 4.8,
    badge: 'Hard',
    color: 'from-amber-600 via-orange-700 to-red-700',
    xpReward: 280,
    descAr: 'أحداث وشخصيات شكلت تاريخ الحضارة الإنسانية عبر القرون.',
    descEn: 'Key events and figures that shaped human civilizational history.',
  },
]

const CATEGORIES = ['All', 'Personality', 'IQ', 'General', 'Entertainment', 'History']

export function QuizCenterPage() {
  const navigate = useNavigate()
  const { dir } = useThemeStore()
  const [selectedCat, setSelectedCat] = useState('All')
  const [search, setSearch] = useState('')

  const isRtl = dir === 'rtl'

  const filteredQuizzes = QUIZZES.filter(
    (q) =>
      (selectedCat === 'All' || q.category === selectedCat) &&
      (q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.titleEn.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="flex flex-col gap-8 py-4 max-w-6xl mx-auto">
      <SEO
        title="مختبر الذكاء والإختبارات | نغنِش"
        description="استكشف مئات إختبارات الشخصية وتحديات الذكاء والمعرفة العامة على منصة نغنِش."
        keywords={['مختبر الذكاء', 'اختبارات شخصية', 'تحليل شخصية', 'اختبار IQ', 'نغنش اختبارات']}
      />

      {/* ─────────────────────────────────────────────────────────────
          1. IQ LAB HERO BANNER
      ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#201138] via-brand-card to-[#121E36] border-2 border-violet-500/50 shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-start">
          <ModeMascot mode="iqlab" size="lg" />

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/40 text-violet-300 text-xs font-black mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRtl ? 'مختبر الذكاء • IQ & PERSONALITY LAB' : 'IQ LAB • PERSONALITY & INTELLECT'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {isRtl ? 'اختبارات الشخصية وتحديات الذكاء الخارق 🧪' : 'Interactive Quizzes & Personality Lab 🧪'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-lg mt-1 leading-relaxed">
              {isRtl
                ? 'خُض اختبارات تفاعلية ذكية، احصل على تحليلات دقيقة لشخصيتك، واكسب نقاط XP.'
                : 'Take dynamic quizzes, unlock detailed personality traits, and boost your rank.'}
            </p>
          </div>
        </div>

        {/* Featured Quiz Launch */}
        <div className="relative z-10 p-4 rounded-2xl bg-black/40 border border-violet-400/30 flex items-center gap-4 shrink-0">
          <div className="text-3xl">🧠</div>
          <div>
            <p className="text-[10px] font-black text-pink-400 uppercase">TRENDING QUIZ</p>
            <p className="text-sm font-black text-white">{isRtl ? 'تحليل الشخصية' : 'Personality Test'}</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`${ROUTES.QUIZ_CENTER}/q1`)}
          >
            {isRtl ? 'ابدأ ⚡' : 'Start ⚡'}
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SEARCH & CATEGORY PILLS
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Input
          leftIcon={<Search className="w-4 h-4 text-violet-400" />}
          placeholder={isRtl ? 'ابحث عن اختبار بالاسم أو الموضوع...' : 'Search quizzes by title or topic...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:flex-1 h-12 rounded-2xl"
        />

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black transition-all duration-200 border cursor-pointer ${
                selectedCat === cat
                  ? 'bg-gradient-to-r from-violet-600 to-pink-500 text-white border-pink-400 shadow-glow'
                  : 'bg-brand-card border-brand-cardBorder text-slate-400 hover:text-white hover:border-slate-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Native In-Feed Ad Banner */}
      <AdSlot
        variant="in-feed"
        slotId="ad-quiz-center"
        adText={isRtl ? 'اشترك في نغنِش VIP وافتح كافة الإختبارات الحصرية بلا حدود!' : 'Upgrade to VIP for unlimited quizzes!'}
      />

      {/* ─────────────────────────────────────────────────────────────
          3. QUIZZES GRID
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredQuizzes.map((quiz, i) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="group cursor-pointer"
            onClick={() => navigate(`${ROUTES.QUIZ_CENTER}/${quiz.id}`)}
          >
            <div className="h-full rounded-3xl bg-brand-card/90 border-2 border-brand-cardBorder group-hover:border-violet-400 shadow-xl group-hover:shadow-glow transition-all duration-300 overflow-hidden flex flex-col justify-between">
              {/* Header Cover Banner */}
              <div
                className={`relative h-36 bg-gradient-to-br ${quiz.color} flex items-center justify-center p-4 text-center overflow-hidden`}
              >
                <div className="absolute inset-0 opacity-20 bg-gaming-grid pointer-events-none" />

                <span className="absolute top-3 right-3 rtl:right-auto rtl:left-3 px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-black border border-white/20">
                  {quiz.badge}
                </span>

                <HelpCircle className="w-16 h-16 text-white/20 absolute -bottom-2 -left-2 pointer-events-none" />

                <h3 className="font-black text-white text-base sm:text-lg leading-tight relative z-10 px-2 drop-shadow-md">
                  {isRtl ? quiz.title : quiz.titleEn}
                </h3>

                {/* XP Reward Badge */}
                <div className="absolute bottom-2 right-3 rtl:right-auto rtl:left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-black flex items-center gap-1 border border-amber-400/30">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>+{quiz.xpReward} XP</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col gap-3.5 flex-1 justify-between">
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {isRtl ? quiz.descAr : quiz.descEn}
                </p>

                <div className="flex items-center justify-between text-xs font-bold text-slate-400 pt-2 border-t border-white/5">
                  <span className="flex items-center gap-1 text-cyan-300">
                    <Clock className="w-3.5 h-3.5" />
                    {quiz.time}
                  </span>
                  <span className="flex items-center gap-1 text-amber-300">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    {quiz.questions} {isRtl ? 'أسئلة' : 'Q’s'}
                  </span>
                  <span className="flex items-center gap-1 text-yellow-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {quiz.rating}
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  leftIcon={<Play className="w-4 h-4 fill-current" />}
                >
                  {isRtl ? 'ابدأ الإختبار' : 'Start Quiz'}
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
