import React from 'react'
import { Radio, Plus } from 'lucide-react'
import { LIVE_ROOMS } from '@data/games.data'
import { ShillaRoomCard } from '../components/ShillaRoomCard'
import { useThemeStore } from '@store/themeStore'

interface LiveRoomsSectionProps {
  onJoinRoom: (code: string) => void
  onCreateRoom: () => void
}

export const LiveRoomsSection: React.FC<LiveRoomsSectionProps> = ({ onJoinRoom, onCreateRoom }) => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-lg shadow-sm border border-orange-500/30">
            🚪
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isRtl ? 'صالة الغرف الحية المفتوحة' : 'Live Party Lounges'}
            </h2>
            <p className="text-xs text-slate-300">
              {isRtl ? 'غرف نشطة الآن يمكنك الدخول إليها واللعب مع المتواجدين' : 'Active public lobbies currently taking challengers'}
            </p>
          </div>
        </div>

        <button
          onClick={onCreateRoom}
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 hover:text-white font-black text-xs transition-all cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isRtl ? 'غرفة جديدة' : 'New Room'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {LIVE_ROOMS.map((room) => (
          <ShillaRoomCard key={room.code} room={room} onJoin={onJoinRoom} />
        ))}
      </div>
    </section>
  )
}
