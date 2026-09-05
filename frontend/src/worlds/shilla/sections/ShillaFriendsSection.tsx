import React from 'react'
import { Users } from 'lucide-react'
import { ShillaFriendCard, ShillaFriendItem } from '../components/ShillaFriendCard'
import { useThemeStore } from '@store/themeStore'

const FRIENDS_ONLINE: ShillaFriendItem[] = [
  { id: 'f1', name: 'سارة عبد الله', avatar: '🌸', status: 'يلعب تحدي الأسئلة', roomCode: 'SHILLA99' },
  { id: 'f2', name: 'عمر التميمي', avatar: '😎', status: 'في صالة الانتظار', roomCode: 'WARRIOR' },
  { id: 'f3', name: 'نور الدين', avatar: '⚡', status: 'متصل الآن', roomCode: null },
  { id: 'f4', name: 'مريم فاروق', avatar: '🎨', status: 'متصل الآن', roomCode: null },
]

interface ShillaFriendsSectionProps {
  onJoinRoom: (code: string) => void
}

export const ShillaFriendsSection: React.FC<ShillaFriendsSectionProps> = ({ onJoinRoom }) => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  return (
    <section className="flex flex-col gap-4 p-6 rounded-[2rem] bg-brand-surface/90 border border-cyan-500/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-black text-white">
            {isRtl ? 'أصدقائي المتواجدين الآن' : 'Friends Playing Now'}
          </h3>
        </div>
        <span className="text-xs font-black text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
          {FRIENDS_ONLINE.length} {isRtl ? 'متصل' : 'Online'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {FRIENDS_ONLINE.map((friend) => (
          <ShillaFriendCard key={friend.id} friend={friend} onJoinRoom={onJoinRoom} />
        ))}
      </div>
    </section>
  )
}
