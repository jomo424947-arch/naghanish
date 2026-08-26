import React from 'react'
import { Crown, Trophy } from 'lucide-react'
import { LeaderboardRow, LeaderboardPlayerItem } from '../components/LeaderboardRow'
import { useThemeStore } from '@store/themeStore'

const GLOBAL_LEADERBOARD: LeaderboardPlayerItem[] = [
  { rank: 4, name: 'أحمد السعدني', avatar: '🎮', level: 28, xp: '59,300 XP', wins: 142, badge: 'PRO' },
  { rank: 5, name: 'ليلى التميمي', avatar: '🌸', level: 26, xp: '54,100 XP', wins: 128, badge: 'ELITE' },
  { rank: 6, name: 'يوسف خالد', avatar: '🎯', level: 24, xp: '49,850 XP', wins: 110, badge: 'ACE' },
  { rank: 7, name: 'نور الدين عثمان', avatar: '👾', level: 23, xp: '46,200 XP', wins: 95, badge: 'WARRIOR' },
  { rank: 8, name: 'ريم العبدلي', avatar: '🎨', level: 22, xp: '43,900 XP', wins: 88, badge: 'CHALLENGER' },
]

export const GlobalLeaderboardSection: React.FC = () => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  return (
    <section className="flex flex-col gap-4 p-6 rounded-[2rem] bg-brand-surface/90 border border-amber-500/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-black text-white">
            {isRtl ? 'ترتيب الصدارة العام (Top 100)' : 'Global Leaderboard (Top 100)'}
          </h3>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {GLOBAL_LEADERBOARD.map((player) => (
          <LeaderboardRow key={player.rank} player={player} />
        ))}
      </div>
    </section>
  )
}
