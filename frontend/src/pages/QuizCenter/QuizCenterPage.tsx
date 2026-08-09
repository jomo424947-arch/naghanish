import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Search, Filter, HelpCircle, Brain, Star, Play, Clock, Award } from 'lucide-react'
import { SectionTitle } from '@components/common/SectionTitle'
import { Card } from '@components/common/Card'
import { Input } from '@components/common/Input'
import { Button } from '@components/common/Button'
import { SEO } from '@components/common/SEO'
import { AdSlot } from '@components/common/AdSlot'
import { ROUTES } from '@constants/routes'
import { useThemeStore } from '@store/themeStore'

const QUIZZES = [
  { id: 'q1', title: 'اختبار الشخصية القيادية 👑', titleEn: 'Leadership Personality Test 👑', category: 'Personality', questions: 10, time: '5m', completions: '14.2k', rating: 4.9, badge: 'Popular', color: 'from-amber-500 to-orange-600' },
  { id: 'q2', title: 'تحدي المعرفة الثقافية العامة 🌍', titleEn: 'General Knowledge Challenge 🌍', category: 'General', questions: 15, time: '8m', completions: '28.9k', rating: 4.8, badge: 'Trending', color: 'from-cyan-500 to-blue-600' },
  { id: 'q3', title: 'مقياس الذكاء والتحليل النفسي 🧠', titleEn: 'IQ & Psychology Scale 🧠', category: 'IQ', questions: 12, time: '6m', completions: '9.4k', rating: 4.9, badge: 'Hot', color: 'from-purple-600 to-indigo-700' },
  { id: 'q4', title: 'ما هو نمط تفكيرك السائد؟ 💡', titleEn: 'What is your Dominant Thinking Style? 💡', category: 'Personality', questions: 8, time: '4m', completions: '18.5k', rating: 4.7, badge: 'New', color: 'from-pink-500 to-rose-600' },
  { id: 'q5', title: 'اختبار محبي السينما والأفلام 🎬', titleEn: 'Cinema & Movie Buff Quiz 🎬', category: 'Entertainment', questions: 10, time: '5m', completions: '11.3k', rating: 4.6, badge: 'Fun', color: 'from-emerald-500 to-teal-700' },
  { id: 'q6', title: 'تحدي تاريخ الألفية 🏛️', titleEn: 'Millennium History Quiz 🏛️', category: 'History', questions: 12, time: '7m', completions: '6.8k', rating: 4.8, badge: 'Hard', color: 'from-amber-600 to-yellow-700' },
]

const CATEGORIES = ['All', 'Personality', 'IQ', 'General', 'Entertainment', 'History']

export function QuizCenterPage() {
  const navigate = useNavigate()
  const { dir } = useThemeStore()
  const [selectedCat, setSelectedCat] = useState('All')
  const [search, setSearch] = useState('')

  const filteredQuizzes = QUIZZES.filter(q =>
    (selectedCat === 'All' || q.category === selectedCat) &&
    (q.title.toLowerCase().includes(search.toLowerCase()) || q.titleEn.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="flex flex-col gap-8 py-4">
      <SEO
        title="مركز الإختبارات | نغنِش"
        description="استكشف مئات إختبارات الشخصية وتحديات الذكاء والمعرفة العامة على منصة نغنِش."
        keywords={['اختبارات شخصية', 'تحليل شخصية', 'اختبار IQ', 'نغنش اختبارات']}
      />

      <SectionTitle
        title={dir === 'rtl' ? 'مركز الإختبارات 📝' : 'Quiz Center 📝'}
        subtitle={dir === 'rtl' ? 'اكتشف شخصيتك واختبر معلوماتك العامة' : 'Discover your personality & test your knowledge'}
        badgeText={`${QUIZZES.length}`}
        badgeColor="purple"
        icon={<Sparkles className="w-5 h-5 text-cyan-300" />}
      />

      {/* Search Bar */}
      <Input
        leftIcon={<Search className="w-4 h-4" />}
        placeholder={dir === 'rtl' ? 'ابحث عن اختبار...' : 'Search quizzes...'}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Categories Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 border ${
              selectedCat === cat
                ? 'bg-brand-purple/20 border-brand-purple text-white shadow-glow'
                : 'bg-brand-card border-brand-cardBorder text-slate-400 hover:text-white hover:border-slate-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Native In-Feed Ad Banner */}
      <AdSlot variant="in-feed" slotId="ad-quiz-center" adText="اشترك الآن في نغنِش VIP وافتح الإختبارات الحصرية بلا حدود!" />

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuizzes.map((quiz, i) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card variant="glowing" isInteractive padding="none" className="overflow-hidden group flex flex-col h-full">
              <div className={`relative h-32 bg-gradient-to-br ${quiz.color} flex items-center justify-center p-4 text-center`}>
                <span className="absolute top-3 right-3 rtl:right-auto rtl:left-3 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-black border border-white/20">
                  {quiz.badge}
                </span>
                <HelpCircle className="w-12 h-12 text-white/30 absolute -bottom-2 -left-2" />
                <h3 className="font-black text-white text-base leading-tight relative z-10">
                  {dir === 'rtl' ? quiz.title : quiz.titleEn}
                </h3>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1 gap-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-300" />
                    {quiz.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    {quiz.questions} {dir === 'rtl' ? 'أسئلة' : 'Q’s'}
                  </span>
                  <span className="flex items-center gap-1 text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {quiz.rating}
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                  onClick={() => navigate(`${ROUTES.QUIZ_CENTER}/${quiz.id}`)}
                >
                  {dir === 'rtl' ? 'ابدأ الإختبار' : 'Start Quiz'}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
