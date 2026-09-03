import React, { useState } from 'react'
import { X, Sparkles, Users, Lock, Unlock } from 'lucide-react'
import { useThemeStore } from '@store/themeStore'

interface CreateRoomModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (roomData: { name: string; maxPlayers: number; isPrivate: boolean }) => void
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose, onCreate }) => {
  const { dir } = useThemeStore()
  const [name, setName] = useState('')
  const [maxPlayers, setMaxPlayers] = useState(8)
  const [isPrivate, setIsPrivate] = useState(false)

  if (!isOpen) return null

  const isRtl = dir === 'rtl'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreate({
      name: name.trim() || (isRtl ? 'غرفة الشلة الجديدة 🎉' : 'New Shilla Room 🎉'),
      maxPlayers,
      isPrivate,
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-br from-[#2E160C] via-[#1E0F07] to-[#120803] border-2 border-orange-500/50 shadow-2xl flex flex-col gap-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-2xl border border-orange-500/40">
            🎉
          </div>
          <div>
            <h3 className="text-xl font-black text-white">
              {isRtl ? 'إنشاء غرفة شِلّة جديدة' : 'Create New Shilla Room'}
            </h3>
            <p className="text-xs text-slate-300">
              {isRtl ? 'اجمع أصحابك وابدأ التحدي الحماسي فوراً' : 'Invite friends and start live challenges'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {isRtl ? 'اسم الغرفة' : 'Room Name'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isRtl ? 'مثال: سهرة الخميس والضحك 😂' : 'e.g. Weekend Laughs & Trivia 😂'}
              className="w-full px-4 py-3 rounded-2xl bg-black/50 border border-orange-500/30 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {isRtl ? 'الحد الأقصى للاعبين' : 'Max Players'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[4, 6, 8, 12].map((count) => (
                <button
                  type="button"
                  key={count}
                  onClick={() => setMaxPlayers(count)}
                  className={`py-2 rounded-xl font-black text-xs transition-all ${
                    maxPlayers === count
                      ? 'bg-orange-500 text-slate-950 shadow-md'
                      : 'bg-black/40 text-slate-300 border border-white/10 hover:border-orange-500/40'
                  }`}
                >
                  {count} {isRtl ? 'لاعبين' : 'P'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/10">
            <div className="flex items-center gap-2">
              {isPrivate ? <Lock className="w-4 h-4 text-amber-400" /> : <Unlock className="w-4 h-4 text-cyan-400" />}
              <span className="text-xs font-bold text-slate-200">
                {isRtl ? 'غرفة خاصة برمز سري' : 'Private Room (Code only)'}
              </span>
            </div>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-4 h-4 rounded text-orange-500 focus:ring-orange-400 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-slate-950 font-black text-sm shadow-xl hover:scale-105 transition-all cursor-pointer mt-2"
          >
            {isRtl ? 'إطلاق الغرفة الآن 🚀' : 'Launch Room Now 🚀'}
          </button>
        </form>
      </div>
    </div>
  )
}
