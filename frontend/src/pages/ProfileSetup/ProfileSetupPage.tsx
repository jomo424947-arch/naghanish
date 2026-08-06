import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Sparkles, Heart } from 'lucide-react'
import { AuthLayout } from '@components/layout/AuthLayout'
import { AvatarPicker, AVATAR_OPTIONS } from '@components/common/AvatarPicker'
import { TextField } from '@components/common/TextField'
import { Button } from '@components/common/Button'
import { ROUTES } from '@constants/routes'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'

export const ProfileSetupPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuthStore()
  const { dir } = useThemeStore()

  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || AVATAR_OPTIONS[0].id)
  const [displayName, setDisplayName] = useState(user?.name || '')
  const [username, setUsername] = useState(user?.username || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [favoriteCategory, setFavoriteCategory] = useState(user?.favoriteCategory || 'Brain Games')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      updateProfile({
        avatar: selectedAvatar,
        name: displayName,
        username,
        bio,
        favoriteCategory,
        hasCompletedProfileSetup: true,
      })
      setIsLoading(false)
      navigate('/language')
    }, 800)
  }

  return (
    <AuthLayout
      title={dir === 'rtl' ? 'إعداد الملف الشخصي 👤' : 'Profile Setup 👤'}
      subtitle={dir === 'rtl' ? 'اختر شخصيتك الرمزية واسم العرض الخاص بك' : 'Choose your avatar mascot and customize your profile'}
      showBackButton={true}
    >
      <div className="p-6 sm:p-8 rounded-3xl bg-brand-card/90 border border-brand-cardBorder shadow-2xl backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Avatar Selector Component */}
          <AvatarPicker
            selectedAvatar={selectedAvatar}
            onSelectAvatar={setSelectedAvatar}
          />

          <div className="flex flex-col gap-4 mt-2">
            <TextField
              label={dir === 'rtl' ? 'اسم العرض' : 'Display Name'}
              placeholder={dir === 'rtl' ? 'أدخل اسمك المستعار' : 'Your Nickname'}
              leftIcon={<User className="w-4 h-4" />}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />

            <TextField
              label={dir === 'rtl' ? 'اسم المستخدم الفريد' : 'Unique Username'}
              placeholder="username"
              leftIcon={<Sparkles className="w-4 h-4" />}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-200">
                {dir === 'rtl' ? 'نبذة قصيرة (Bio)' : 'Bio / About You'}
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={dir === 'rtl' ? 'اكتب عبارة مميزة تظهر في ملفك الشخصي...' : 'Write something cool about yourself...'}
                className="w-full bg-brand-darkBg border border-brand-cardBorder rounded-2xl p-3.5 text-sm font-medium text-slate-100 placeholder-slate-500 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 resize-none transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="secondary"
            size="lg"
            isLoading={isLoading}
            fullWidth
            className="shadow-glow-blue mt-2"
          >
            {dir === 'rtl' ? 'حفظ ومتابعة' : 'Save & Continue'}
          </Button>
        </form>
      </div>
    </AuthLayout>
  )
}
