import React from 'react'
import { Trophy } from 'lucide-react'
import { PodiumDisplay, PodiumPlayer } from '../components/PodiumDisplay'
import { useThemeStore } from '@store/themeStore'

const TOP_3_CHAMPIONS: PodiumPlayer[] = [
  {
    rank: 1,
    name: 'فيصل القحطاني',
    avatar: '👑',
    xp: '84,920 XP',
    title: 'سيد العوالم 👑',
    titleEn: 'Universe Master 👑',
    badge: 'GRAND CHAMPION',
  },
  {
    rank: 2,
    name: 'سارة عبد الله',
    avatar: '⚡',
    xp: '72,450 XP',
    title: 'فارسة السرعة',
    titleEn: 'Speed Empress',
    badge: 'DIAMOND ELITE',
  },
  {
    rank: 3,
    name: 'كريم المنصور',
    avatar: '🧠',
    xp: '68,120 XP',
    title: 'عقل المختبر',
    titleEn: 'Mind Architect',
    badge: 'MASTER TIER',
  },
]

export const TopPodiumSection: React.FC = () => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  return (
    <section className="p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-b from-[#2E2007] via-brand-card to-[#0F0B02] border-2 border-amber-500/50 shadow-2xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl border border-amber-500/40">
            🏆
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isRtl ? 'منصة التتويج: أبطال الأسبوع الحالي' : 'Weekly Champions Podium'}
            </h2>
            <p className="text-xs text-slate-300">
              {isRtl ? 'الثلاثة المتصدرين عرش نغنِش لأعلى نقاط وتحديات هذا الأسبوع' : 'Top 3 legends leading the universal tournament leaderboard'}
            </p>
          </div>
        </div>
      </div>

      <PodiumDisplay players={TOP_3_CHAMPIONS} />
    </section>
  )
}
