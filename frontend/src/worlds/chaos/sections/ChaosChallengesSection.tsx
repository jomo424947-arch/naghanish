import React from 'react'
import { TiltedChaosCard, ChaosChallengeItem } from '../components/TiltedChaosCard'
import { useThemeStore } from '@store/themeStore'

const CHAOS_CHALLENGES: ChaosChallengeItem[] = [
  {
    id: 'c1',
    title: 'تحدي الذاكرة بالألوان العكسية 🎨',
    titleEn: 'Inverted Color Memory Blitz 🎨',
    modifier: 'الألوان تتبدل كل 5 ثوانٍ',
    modifierEn: 'Colors invert every 5 seconds',
    xp: '+350 XP',
    tilt: 'left',
    icon: '🃏',
  },
  {
    id: 'c2',
    title: 'الحساب السريع مع أصوات التشتيت 🧮',
    titleEn: 'Math Rush with Distraction Buzzers 🧮',
    modifier: 'تتغير إشارات الجمع والطرح عشوائياً',
    modifierEn: 'Plus and minus flip randomly',
    xp: '+400 XP',
    tilt: 'right',
    icon: '🧮',
  },
  {
    id: 'c3',
    title: 'سرعة ردة الفعل بالعين الواحدة 👁️',
    titleEn: 'One-Eye Reflex Strike 👁️',
    modifier: 'الأهداف تومض لمدة 0.1 ثانية فقط',
    modifierEn: 'Targets flash for only 0.1s',
    xp: '+500 XP',
    tilt: 'none',
    icon: '⚡',
  },
]

interface ChaosChallengesSectionProps {
  onPlayChallenge: (challenge: ChaosChallengeItem) => void
}

export const ChaosChallengesSection: React.FC<ChaosChallengesSectionProps> = ({ onPlayChallenge }) => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-lime-500/20 text-lime-400 flex items-center justify-center text-lg shadow-sm border border-lime-500/30">
            🎲
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isRtl ? 'التحديات والمعدلات المجنونة' : 'Chaotic Challenges & Modifiers'}
            </h2>
            <p className="text-xs text-slate-300">
              {isRtl ? 'ألعاب عادية مضاف إليها قواعد فوضوية غير منطقية ومضحكة' : 'Classic games supercharged with ridiculous and crazy conditions'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CHAOS_CHALLENGES.map((challenge) => (
          <TiltedChaosCard key={challenge.id} challenge={challenge} onPlay={() => onPlayChallenge(challenge)} />
        ))}
      </div>
    </section>
  )
}
