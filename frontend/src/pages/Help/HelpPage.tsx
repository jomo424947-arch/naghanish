import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronDown, HelpCircle, MessageSquare, Mail, Phone, ExternalLink } from 'lucide-react'
import { SectionTitle } from '@components/common/SectionTitle'
import { Input } from '@components/common/Input'
import { Button } from '@components/common/Button'
import { useThemeStore } from '@store/themeStore'

interface FAQItem {
  id: string
  question: string
  questionArabic: string
  answer: string
  answerArabic: string
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do Party Rooms work?',
    questionArabic: 'كيف تعمل غرف الألعاب الجماعية (بارتي نايت)؟',
    answer: 'You can create a room, share the 6-character room code with friends, and compete in real-time quiz challenges together!',
    answerArabic: 'يمكنك إنشاء غرفة لعب خاصة، ومشاركة كود الغرفة المكون من 6 رموز مع أصدقائك لبدء التحدي التنافسي المباشر!',
  },
  {
    id: 'faq-2',
    question: 'How are XP points and Levels calculated?',
    questionArabic: 'كيف يتم احتساب نقاط XP والمستويات؟',
    answer: 'Playing daily challenges, matching cards fast, and winning party games awards XP points to level up your player profile.',
    answerArabic: 'من خلال إكمال التحديات اليومية والفوز بالألعاب السرية والمنطقية، تكتسب نقاط XP التي ترفع مستواك وفتح جوائز جديدة.',
  },
  {
    id: 'faq-3',
    question: 'Can I change my avatar and nickname later?',
    questionArabic: 'هل يمكنني تغيير شخصيتي الرمزية واسم المستخدم لاحقاً؟',
    answer: 'Yes! Go to Settings -> Profile Setup to change your avatar mascot, bio, display name, and preferences anytime.',
    answerArabic: 'نعم بالتأكيد! يمكنك الدخول لإعدادات الملف الشخصي وتعديل رمزيتك واسمك ونبذتك التعريفية في أي وقت.',
  },
  {
    id: 'faq-4',
    question: 'Is Naghanish completely free to play?',
    questionArabic: 'هل جميع ألعاب وتحديات نغانيش مجانية؟',
    answer: 'Yes! All core games, multiplayer party rooms, daily quizzes, and leaderboards are 100% free.',
    answerArabic: 'نعم، جميع الألعاب الرئيسية وغرف اللعب الجماعي والاختبارات ولوحات الصدارة مجانية بالكامل للجميع.',
  },
]

export const HelpPage: React.FC = () => {
  const navigate = useNavigate()
  const { dir } = useThemeStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>('faq-1')

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.questionArabic.includes(searchQuery)
  )

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
      <SectionTitle
        title={dir === 'rtl' ? 'مركز المساعدة ❓' : 'Help & Support ❓'}
        subtitle={dir === 'rtl' ? 'الأسئلة الشائعة وتوجيهات الاستخدام' : 'Frequently asked questions and customer support'}
        action={
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            {dir === 'rtl' ? 'رجوع' : 'Back'}
          </Button>
        }
      />

      {/* Search Input Box */}
      <div className="w-full">
        <Input
          placeholder={dir === 'rtl' ? 'ابحث عن إجابة سؤالك...' : 'Search for questions or topics...'}
          leftIcon={<Search className="w-4 h-4" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* FAQ Accordion List */}
      <div className="flex flex-col gap-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id
          return (
            <div
              key={faq.id}
              className="p-5 rounded-3xl bg-brand-card border border-brand-cardBorder transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggleAccordion(faq.id)}
                className="w-full flex items-center justify-between gap-4 text-left rtl:text-right font-bold text-white text-base focus:outline-none cursor-pointer"
              >
                <span>{dir === 'rtl' ? faq.questionArabic : faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-brand-blue' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="mt-3 pt-3 border-t border-brand-cardBorder text-sm text-slate-300 font-medium leading-relaxed animate-fadeIn">
                  {dir === 'rtl' ? faq.answerArabic : faq.answer}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Direct Support Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-purple/20 via-brand-card to-brand-blue/20 border border-brand-blue/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-right rtl:sm:text-right sm:text-left">
          <div className="p-3 rounded-2xl bg-brand-blue/20 text-cyan-300 shrink-0 shadow-glow-blue">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">
              {dir === 'rtl' ? 'لم تجد إجابة لسؤالك؟' : 'Need more help?'}
            </h4>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {dir === 'rtl' ? 'فريق الدعم متواجد على مدار الساعة لمساعدتك' : 'Our support team is available 24/7'}
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="md"
          leftIcon={<Mail className="w-4 h-4" />}
          onClick={() => alert('Support email: support@naghanish.com')}
          className="shrink-0 shadow-glow-blue"
        >
          {dir === 'rtl' ? 'تواصل معنا' : 'Contact Support'}
        </Button>
      </div>
    </div>
  )
}
