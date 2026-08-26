import React from 'react'
import { Play, Sparkles } from 'lucide-react'
import { useThemeStore } from '@store/themeStore'

export interface ShillaFriendItem {
  id: string
  name: string
  avatar: string
  status: string
  roomCode: string | null
}

interface ShillaFriendCardProps {
  friend: ShillaFriendItem
  onJoinRoom?: (code: string) => void
}

export const ShillaFriendCard: React.FC<ShillaFriendCardProps> = ({ friend, onJoinRoom }) => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  return (
    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-brand-card/90 border border-orange-500/30 hover:border-orange-400/60 shadow-md hover:shadow-glow transition-all">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-xl">
            {friend.avatar}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-brand-card" />
        </div>
        <div>
          <h5 className="text-sm font-black text-white">{friend.name}</h5>
          <p className="text-[11px] text-slate-300 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            {friend.status}
          </p>
        </div>
      </div>

      {friend.roomCode && onJoinRoom && (
        <button
          onClick={() => onJoinRoom(friend.roomCode!)}
          className="px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 hover:text-white text-xs font-black transition-all flex items-center gap-1 cursor-pointer"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>{isRtl ? 'الحق صاحبك' : 'Join'}</span>
        </button>
      )}
    </div>
  )
}
