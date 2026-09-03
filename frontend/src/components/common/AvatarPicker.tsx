import React from 'react'
import { motion } from 'framer-motion'
import { Camera, Check } from 'lucide-react'
import { GamerMascot } from './GamerMascot'
import { cn } from '@lib/utils'

export const AVATAR_OPTIONS = [
  { id: 'mascot-gamer', name: 'Naghanish Gamer', isMascot: true, color: 'from-orange-500 to-amber-600' },
  { id: 'mascot-1', name: 'Brainy Mascot', icon: '🧠', color: 'from-purple-500 to-indigo-600' },
  { id: 'mascot-2', name: 'Party Bot', icon: '🤖', color: 'from-cyan-400 to-blue-600' },
  { id: 'mascot-3', name: 'Speed Champion', icon: '⚡', color: 'from-orange-400 to-amber-500' },
  { id: 'mascot-4', name: 'Star Winner', icon: '🏆', color: 'from-yellow-400 to-amber-600' },
  { id: 'mascot-5', name: 'Magic Quiz', icon: '🪄', color: 'from-pink-500 to-rose-600' },
  { id: 'mascot-6', name: 'Arcade Master', icon: '🕹️', color: 'from-emerald-400 to-teal-600' },
]

export interface AvatarPickerProps {
  selectedAvatar: string
  onSelectAvatar: (avatarId: string) => void
  onCustomUpload?: (file: File) => void
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  selectedAvatar,
  onSelectAvatar,
  onCustomUpload,
}) => {
  const currentAvatarObj = AVATAR_OPTIONS.find((a) => a.id === selectedAvatar) || AVATAR_OPTIONS[0]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onCustomUpload) {
      onCustomUpload(e.target.files[0])
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Active Selected Avatar Hero */}
      <div className="relative group">
        <motion.div
          key={selectedAvatar}
          initial={{ scale: 0.8, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={cn(
            'w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br flex items-center justify-center text-5xl sm:text-6xl shadow-glow-orange border-4 border-brand-card overflow-hidden',
            currentAvatarObj.color
          )}
        >
          {currentAvatarObj.isMascot ? (
            <GamerMascot variant="avatar" size="avatar" animated={false} />
          ) : (
            currentAvatarObj.icon
          )}
        </motion.div>

        {/* Upload Overlay Button */}
        <label
          htmlFor="avatar-upload-input"
          className="absolute -bottom-2 -right-2 rtl:-right-auto rtl:-left-2 p-2.5 rounded-2xl bg-orange-500 text-slate-950 border-2 border-brand-card shadow-lg hover:bg-orange-400 cursor-pointer transition-transform duration-200 active:scale-95"
          title="Upload custom avatar"
        >
          <Camera className="w-5 h-5" />
          <input
            id="avatar-upload-input"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* Grid of preset avatars */}
      <div className="w-full flex items-center justify-center gap-3 flex-wrap">
        {AVATAR_OPTIONS.map((avatar) => {
          const isSelected = avatar.id === selectedAvatar
          return (
            <motion.button
              key={avatar.id}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => onSelectAvatar(avatar.id)}
              className={cn(
                'relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl border-2 transition-all duration-200 cursor-pointer overflow-hidden',
                avatar.color,
                isSelected
                  ? 'border-orange-400 shadow-glow-orange ring-2 ring-orange-500'
                  : 'border-transparent opacity-75 hover:opacity-100'
              )}
            >
              {avatar.isMascot ? (
                <GamerMascot variant="avatar" size="avatar" animated={false} className="scale-75" />
              ) : (
                avatar.icon
              )}
              {isSelected && (
                <div className="absolute -top-1 -right-1 rtl:-right-auto rtl:-left-1 w-4 h-4 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center text-[10px] font-bold shadow">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
