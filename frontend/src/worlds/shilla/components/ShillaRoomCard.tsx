import React from 'react'
import { Users, Play, ShieldCheck, Flame } from 'lucide-react'
import { LiveRoomItem } from '@data/games.data'
import { useThemeStore } from '@store/themeStore'
import { cn } from '@lib/utils'

interface ShillaRoomCardProps {
  room: LiveRoomItem
  onJoin: (code: string) => void
}

export const ShillaRoomCard: React.FC<ShillaRoomCardProps> = ({ room, onJoin }) => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'
  const isFull = room.players >= room.max

  return (
    <div className="relative overflow-hidden p-6 rounded-[2rem] bg-gradient-to-br from-[#0C242B] via-[#08181D] to-[#040C0E] border-2 border-cyan-500/40 hover:border-cyan-400 shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all flex flex-col justify-between gap-5 group">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-2xl shadow-md shrink-0">
            {room.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded-md border border-cyan-500/30">
                #{room.code}
              </span>
              <span className={cn('text-[10px] font-black text-white px-2 py-0.5 rounded-full shadow-sm', room.badgeColor)}>
                {room.badge}
              </span>
            </div>
            <h4 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors mt-1">
              {isRtl ? room.name : room.nameEn}
            </h4>
          </div>
        </div>
      </div>

      {/* Host & Category Info */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/10 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="text-slate-400">{isRtl ? 'المضيف:' : 'Host:'}</span>
          <span className="font-bold text-teal-300">{room.host}</span>
        </div>
        <span className="text-[11px] font-bold text-cyan-300">{room.category}</span>
      </div>

      {/* Players Progress Bar & Join Button */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-black text-slate-200">
            {room.players}/{room.max} {isRtl ? 'لاعبين' : 'Players'}
          </span>
        </div>

        <button
          onClick={() => onJoin(room.code)}
          disabled={isFull}
          className={cn(
            'px-5 py-2.5 rounded-xl font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer',
            isFull
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 hover:scale-105'
          )}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isFull ? (isRtl ? 'الغرفة ممتلئة' : 'Room Full') : (isRtl ? 'انضم الآن' : 'Join Room')}</span>
        </button>
      </div>
    </div>
  )
}
