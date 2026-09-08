import React, { useState } from 'react'
import { RotateCcw, Trophy, Flame, Share2, Check, Users } from 'lucide-react'
import { soundManager } from '@utils/soundManager'

export interface WouldYouRatherProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

interface Dilemma {
  id: number
  catAr: string
  catEn: string
  optA: string
  optB: string
  optAEn: string
  optBEn: string
  percentA: number
  votes: number
}

const DILEMMAS: Dilemma[] = [
  {
    id: 1,
    catAr: 'قوى خارقة ⚡',
    catEn: 'Superpowers ⚡',
    optA: 'تعرف سر كل شخص تقابله ولكن لا تقدر تقول لأحد 🤫',
    optB: 'تقدر تطير ولكن بسرعة السلحفاة 🐢',
    optAEn: 'Know everyone’s deepest secrets but can never share them 🤫',
    optBEn: 'Fly whenever you want, but strictly at turtle speed 🐢',
    percentA: 64,
    votes: 24810,
  },
  {
    id: 2,
    catAr: 'طعام وحياة 🍕',
    catEn: 'Food & Life 🍕',
    optA: 'ما تقدر تأكل غير بيتزا لبقية حياتك بجودة أسطورية 🍕',
    optB: 'تأكل مجاناً في أي مطعم بالعالم لكن وحدك دائماً 🍽️',
    optAEn: 'Eat gourmet pizza exclusively for the rest of your life 🍕',
    optBEn: 'Eat free at any 5-star restaurant on Earth, but always alone 🍽️',
    percentA: 42,
    votes: 31920,
  },
  {
    id: 3,
    catAr: 'ألعاب وجيمينج 🎮',
    catEn: 'Gaming 🎮',
    optA: 'تصير محترف في أي لعبة تلعبها من أول 5 دقائق 🏆',
    optB: 'تمتلك سيت اب خيالي بقيمة 50,000$ بأعلى شاشات في العالم 💻',
    optAEn: 'Instant pro-god aim in every game within 5 minutes 🏆',
    optBEn: 'Own a futuristic $50k NASA-tier dream gaming battlestation 💻',
    percentA: 78,
    votes: 45100,
  },
  {
    id: 4,
    catAr: 'مستقبل وفضاء 🚀',
    catEn: 'Future & Cyber 🚀',
    optA: 'تسافر بالزمن إلى عام 3050 وتكتشف نهاية البشرية 🛸',
    optB: 'ترجع بالزمن للقرون الوسطى وتصير إمبراطور بأحدث التكنولوجيا 👑',
    optAEn: 'Time-travel to year 3050 and explore cyber megacities 🛸',
    optBEn: 'Rule medieval times as a king armed with modern tech 👑',
    percentA: 61,
    votes: 19850,
  },
  {
    id: 5,
    catAr: 'حياة يومية 💤',
    catEn: 'Lifestyle 💤',
    optA: 'تنام ساعتين وتصحى بنشاط خارق 100% بدون أي تعب ⚡',
    optB: 'تأكل ما تشتهي مهما كانت السعرات بدون أي زيادة بالوزن 🍔',
    optAEn: 'Sleep 2 hours daily and wake up at 100% godly energy ⚡',
    optBEn: 'Eat unlimited calories and junk food with zero weight gain 🍔',
    percentA: 49,
    votes: 52140,
  },
  {
    id: 6,
    catAr: 'غرائب ومواقف 🎭',
    catEn: 'Awkward Fun 🎭',
    optA: 'كل ما تتكلم لازم تغني الجملة بصوت أوبرا درامي 🎶',
    optB: 'كل ما تمشي في مكان لازم تسوي خطوات رقص روبوت 🤖',
    optAEn: 'Sing every single spoken sentence in dramatic opera 🎶',
    optBEn: 'Do the robotic pop-lock dance every time you walk 🤖',
    percentA: 38,
    votes: 17290,
  },
  {
    id: 7,
    catAr: 'تكنولوجيا وذكاء 🧠',
    catEn: 'Tech & Brain 🧠',
    optA: 'عقلك متصل بالإنترنت ومحرك بحث جوجل طول الوقت 🌐',
    optB: 'تفهم لغات كل الحيوانات والطيور وتتكلم معهم بطلاقة 🐾',
    optAEn: 'Brain permanently wired to internet with instant Google searches 🌐',
    optBEn: 'Speak fluently and understand all animals & birds 🐾',
    percentA: 55,
    votes: 38700,
  },
  {
    id: 8,
    catAr: 'ثراء ومال 💎',
    catEn: 'Wealth 💎',
    optA: 'تحصل 10,000$ كل يوم لكن لا تقدر تسافر خارج مدينتك 🏙️',
    optB: 'تسافر مجاناً إلى أي وجهة بالعالم على طيارة خاصة لكن ميزانيتك عادية ✈️',
    optAEn: 'Receive $10,000 every morning but never leave your hometown 🏙️',
    optBEn: 'Unlimited free private jet flights anywhere, normal spending budget ✈️',
    percentA: 67,
    votes: 41200,
  },
  {
    id: 9,
    catAr: 'أبطال خارقين 🦸',
    catEn: 'Superheroes 🦸',
    optA: 'تكون الرجل الخفي لكن ملابسك ما تختفي معك 🥷',
    optB: 'تقرأ أفكار الناس فقط لما يكونوا معصبين منك 😡',
    optAEn: 'Invisibility power, but your clothes don’t turn invisible 🥷',
    optBEn: 'Mind reading, but only when people are furious with you 😡',
    percentA: 52,
    votes: 22600,
  },
  {
    id: 10,
    catAr: 'شهرة وإنترنت 📱',
    catEn: 'Social Media 📱',
    optA: 'تصير أشهر صانع محتوى في العالم لكن بدون أي خصوصية 📸',
    optB: 'تكون مجهول تماماً ومحد يعرفك لكنك المبرمج اللي يتحكم في الإنترنت 👨‍💻',
    optAEn: 'World’s most famous creator with zero personal privacy 📸',
    optBEn: 'A complete anonymous ghost who secretly controls the web 👨‍💻',
    percentA: 31,
    votes: 29800,
  },
  {
    id: 11,
    catAr: 'طبيعة ومغامرة 🏕️',
    catEn: 'Adventure 🏕️',
    optA: 'تعيش سنة كاملة في الغابة مع أفضل معدات نجاة وتكسب مليون دولار 🌲',
    optB: 'تعيش سنة في كبسولة تحت أعماق المحيط وتكسب مليوني دولار 🌊',
    optAEn: 'Survive 1 year in a wild forest with top gear for $1M 🌲',
    optBEn: 'Live 1 year in a deep ocean underwater pod for $2M 🌊',
    percentA: 63,
    votes: 18450,
  },
  {
    id: 12,
    catAr: 'ذكاء خارق 🧩',
    catEn: 'Mastermind 🧩',
    optA: 'تتذكر كل كلمة وصورة شفتها من لحظة ولادتك بوضوح 4K 🧠',
    optB: 'تقدر تمسح أي ذكرى سيئة أو حزينة من عقلك بضغطة زر 🗑️',
    optAEn: 'Eidetic memory: recall every 4K frame since birth 🧠',
    optBEn: 'One-click mental delete button for any painful memory 🗑️',
    percentA: 58,
    votes: 35600,
  },
  {
    id: 13,
    catAr: 'جيمينج ورياضة 🕹️',
    catEn: 'Esports 🕹️',
    optA: 'تفوز ببطولة العالم في لعبتك المفضلة مع جائزة 3 ملايين دولار 🥇',
    optB: 'تكون مالك لأنجح فريق eSports في العالم وتحقق أرباح سنوية مستمرة 💼',
    optAEn: 'Win the World Championship trophy & $3M cash prize 🥇',
    optBEn: 'Own the #1 global eSports franchise with perpetual profits 💼',
    percentA: 44,
    votes: 27900,
  },
  {
    id: 14,
    catAr: 'خيال وسحر 🧙‍♂️',
    catEn: 'Fantasy 🧙‍♂️',
    optA: 'تفتح بوابة لأي عالم أنمي أو فيلم تريده وتعيش فيه أسبوعياً 🌀',
    optB: 'تستحضر أي أكلة أو وجبة تخطر في بالك في ثانية واحدة 🍔',
    optAEn: 'Portal to any anime/movie universe for weekend getaways 🌀',
    optBEn: 'Instant matter summoner for any gourmet food on demand 🍔',
    percentA: 71,
    votes: 49200,
  },
  {
    id: 15,
    catAr: 'أصوات وحواس 🎵',
    catEn: 'Senses 🎵',
    optA: 'تسمع موسيقى تصويرية ملحمية تتغير حسب أحداث يومك تلقائياً 🎧',
    optB: 'تشوف شريط صحة (HP) ومستوى طاقة فوق رؤوس كل الناس 📊',
    optAEn: 'Dynamic epic Hans Zimmer background soundtrack for your life 🎧',
    optBEn: 'See RPG health bars & stress meters above everyone’s heads 📊',
    percentA: 65,
    votes: 33400,
  },
]

export const WouldYouRatherGame: React.FC<WouldYouRatherProps> = ({ onFinish, isRtl }) => {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOpt, setSelectedOpt] = useState<'A' | 'B' | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [copied, setCopied] = useState(false)
  const [majorityPicks, setMajorityPicks] = useState(0)

  const currentDilemma = DILEMMAS[currentIdx]
  const percentB = 100 - currentDilemma.percentA

  const handlePick = (choice: 'A' | 'B') => {
    if (selectedOpt) return
    setSelectedOpt(choice)

    const isMajority = (choice === 'A' && currentDilemma.percentA >= 50) ||
                       (choice === 'B' && percentB >= 50)

    if (isMajority) {
      soundManager.playPerfectHit()
      const newStreak = streak + 1
      setStreak(newStreak)
      if (newStreak > maxStreak) setMaxStreak(newStreak)
      setMajorityPicks((m) => m + 1)
      const points = 250 + newStreak * 50
      setScore((s) => s + points)
    } else {
      soundManager.playShieldUp()
      setStreak(0)
      setScore((s) => s + 120)
    }

    setTimeout(() => {
      if (currentIdx + 1 < DILEMMAS.length) {
        setCurrentIdx((i) => i + 1)
        setSelectedOpt(null)
      } else {
        soundManager.playPowerUp()
        setIsFinished(true)
        onFinish(score + 500)
      }
    }, 2400)
  }

  const restart = () => {
    setCurrentIdx(0)
    setSelectedOpt(null)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setMajorityPicks(0)
    setIsFinished(false)
  }

  const copyDilemma = () => {
    const text = isRtl
      ? `معضلة لو خيّروك:\n1️⃣ ${currentDilemma.optA}\nأم\n2️⃣ ${currentDilemma.optB}\nالعبها على منصة نغنّش!`
      : `Would You Rather:\n1️⃣ ${currentDilemma.optAEn}\nOR\n2️⃣ ${currentDilemma.optBEn}\nPlay on Naghanish!`
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-2xl mx-auto text-center select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between w-full px-5 py-3 rounded-2xl bg-black/60 border border-brand-cardBorder backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
            {isRtl ? currentDilemma.catAr : currentDilemma.catEn}
          </span>
          <span className="text-xs font-mono text-gray-400">
            {currentIdx + 1} / {DILEMMAS.length}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {streak > 1 && (
            <div className="flex items-center gap-1 text-xs font-black text-amber-400 animate-bounce">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{streak}x {isRtl ? 'إجماع!' : 'STREAK'}</span>
            </div>
          )}
          <div className="text-sm font-black font-mono text-cyan-300">
            {score} <span className="text-[10px] text-gray-400">XP</span>
          </div>
        </div>
      </div>

      {!isFinished ? (
        <div className="flex flex-col gap-5 w-full">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-400">
              {isRtl ? 'لو خيّروك.. ماذا تختار؟ 🤔' : 'Would You Rather? 🤔'}
            </h3>
            <button
              onClick={copyDilemma}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all active:scale-95"
              title="Share Dilemma"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? (isRtl ? 'تم النسخ' : 'Copied!') : (isRtl ? 'مشاركة' : 'Share')}</span>
            </button>
          </div>

          {/* Cards Split Screen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* OPTION A */}
            <button
              disabled={selectedOpt !== null}
              onClick={() => handlePick('A')}
              className={`relative overflow-hidden group flex flex-col justify-between p-6 rounded-3xl border text-left transition-all duration-300 transform active:scale-98 ${
                selectedOpt === 'A'
                  ? 'border-cyan-400 bg-cyan-950/40 shadow-2xl shadow-cyan-500/30 scale-[1.02]'
                  : selectedOpt === 'B'
                  ? 'border-gray-800 bg-black/30 opacity-40'
                  : 'border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 via-black/40 to-black hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1'
              }`}
            >
              {/* Option badge */}
              <div className="flex items-center justify-between w-full mb-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-black text-sm">
                  A
                </span>
                {selectedOpt && (
                  <span className="text-xl font-black font-mono text-cyan-300 animate-pulse">
                    {currentDilemma.percentA}%
                  </span>
                )}
              </div>

              {/* Text content */}
              <p className="text-base md:text-lg font-bold text-white mb-6 leading-relaxed">
                {isRtl ? currentDilemma.optA : currentDilemma.optAEn}
              </p>

              {/* Percentage bar & consensus */}
              {selectedOpt ? (
                <div className="w-full">
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000 ease-out"
                      style={{ width: `${currentDilemma.percentA}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                    <span>
                      {currentDilemma.percentA >= 50
                        ? (isRtl ? '🔥 خيار الأغلبية الساحقة' : '🔥 Popular Consensus')
                        : (isRtl ? '⚡ خيار المتمردين النادر' : '⚡ Rebel Choice')}
                    </span>
                    <span>{Math.round(currentDilemma.votes * (currentDilemma.percentA / 100)).toLocaleString()} {isRtl ? 'صوت' : 'votes'}</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs font-mono text-cyan-400/80 group-hover:text-cyan-300 transition-colors">
                  {isRtl ? 'اضغط لاختيار أ' : 'Click to select Option A'} →
                </div>
              )}
            </button>

            {/* OPTION B */}
            <button
              disabled={selectedOpt !== null}
              onClick={() => handlePick('B')}
              className={`relative overflow-hidden group flex flex-col justify-between p-6 rounded-3xl border text-left transition-all duration-300 transform active:scale-98 ${
                selectedOpt === 'B'
                  ? 'border-pink-400 bg-pink-950/40 shadow-2xl shadow-pink-500/30 scale-[1.02]'
                  : selectedOpt === 'A'
                  ? 'border-gray-800 bg-black/30 opacity-40'
                  : 'border-pink-500/30 bg-gradient-to-br from-pink-950/20 via-black/40 to-black hover:border-pink-400 hover:shadow-xl hover:shadow-pink-500/10 hover:-translate-y-1'
              }`}
            >
              {/* Option badge */}
              <div className="flex items-center justify-between w-full mb-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/40 text-pink-300 font-black text-sm">
                  B
                </span>
                {selectedOpt && (
                  <span className="text-xl font-black font-mono text-pink-300 animate-pulse">
                    {percentB}%
                  </span>
                )}
              </div>

              {/* Text content */}
              <p className="text-base md:text-lg font-bold text-white mb-6 leading-relaxed">
                {isRtl ? currentDilemma.optB : currentDilemma.optBEn}
              </p>

              {/* Percentage bar & consensus */}
              {selectedOpt ? (
                <div className="w-full">
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-1000 ease-out"
                      style={{ width: `${percentB}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                    <span>
                      {percentB >= 50
                        ? (isRtl ? '🔥 خيار الأغلبية الساحقة' : '🔥 Popular Consensus')
                        : (isRtl ? '⚡ خيار المتمردين النادر' : '⚡ Rebel Choice')}
                    </span>
                    <span>{Math.round(currentDilemma.votes * (percentB / 100)).toLocaleString()} {isRtl ? 'صوت' : 'votes'}</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs font-mono text-pink-400/80 group-hover:text-pink-300 transition-colors">
                  {isRtl ? 'اضغط لاختيار ب' : 'Click to select Option B'} →
                </div>
              )}
            </button>
          </div>

          {/* Bottom Live Community Status */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 bg-black/40 py-2.5 px-4 rounded-xl border border-white/5">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>
              {isRtl
                ? `أكثر من ${currentDilemma.votes.toLocaleString()} لاعب صوتوا على هذه المعضلة عالمياً`
                : `Over ${currentDilemma.votes.toLocaleString()} players globally answered this dilemma`}
            </span>
          </div>
        </div>
      ) : (
        /* GAME OVER / RESULTS */
        <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-gradient-to-b from-brand-cardBg to-black border border-brand-cardBorder shadow-2xl w-full">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 animate-bounce">
            <Trophy className="w-9 h-9" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-white mb-2">
              {isRtl ? 'أنهيت جميع المعضلات بنجاح! 🎉' : 'All Dilemmas Conquered! 🎉'}
            </h3>
            <p className="text-sm text-gray-400">
              {isRtl
                ? 'تحليلك الفكري والقرارات الحاسمة حددت شخصيتك الاجتماعية الفريدة!'
                : 'Your psychological insight & choices shaped your gaming profile!'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full max-w-md">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
              <span className="text-xs text-gray-400">{isRtl ? 'النقاط' : 'Score'}</span>
              <span className="text-xl font-black text-cyan-400 font-mono">{score}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
              <span className="text-xs text-gray-400">{isRtl ? 'مطابقة الأغلبية' : 'Majority'}</span>
              <span className="text-xl font-black text-green-400 font-mono">{majorityPicks}/{DILEMMAS.length}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
              <span className="text-xs text-gray-400">{isRtl ? 'أعلى سلسلة' : 'Streak'}</span>
              <span className="text-xl font-black text-amber-400 font-mono">{maxStreak}x</span>
            </div>
          </div>

          <button
            onClick={restart}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black hover:opacity-90 transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{isRtl ? 'العب مرة أخرى' : 'Play Again'}</span>
          </button>
        </div>
      )}
    </div>
  )
}

