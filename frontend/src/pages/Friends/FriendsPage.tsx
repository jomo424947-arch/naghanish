import React from 'react'
import { Users, UserPlus, Search } from 'lucide-react'
import { SectionTitle } from '@components/common/SectionTitle'
import { Input } from '@components/common/Input'
import { Button } from '@components/common/Button'
import { EmptyState } from '@components/common/EmptyState'
import { useThemeStore } from '@store/themeStore'

const FRIENDS = [
  { id: 'f1', name: 'ليلى سعيد', nameEn: 'Layla Said', avatar: '🌟', level: 8, online: true },
  { id: 'f2', name: 'يوسف أحمد', nameEn: 'Yousef Ahmed', avatar: '⚡', level: 15, online: true },
  { id: 'f3', name: 'سارة خالد', nameEn: 'Sara Khaled', avatar: '🎯', level: 6, online: false },
]

export const FriendsPage: React.FC = () => {
  const { dir } = useThemeStore()

  return (
    <div className="flex flex-col gap-8 py-4">
      <SectionTitle
        title={dir === 'rtl' ? 'الأصدقاء 👥' : 'Friends 👥'}
        subtitle={dir === 'rtl' ? `${FRIENDS.filter(f => f.online).length} متصلون الآن` : `${FRIENDS.filter(f => f.online).length} online now`}
        icon={<Users className="w-5 h-5" />}
        action={
          <Button variant="secondary" size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>
            {dir === 'rtl' ? 'إضافة صديق' : 'Add Friend'}
          </Button>
        }
      />

      <Input
        leftIcon={<Search className="w-4 h-4" />}
        placeholder={dir === 'rtl' ? 'ابحث عن أصدقائك...' : 'Search friends...'}
      />

      <div className="flex flex-col gap-3">
        {FRIENDS.map(friend => (
          <div key={friend.id} className="p-4 rounded-3xl bg-brand-card border border-brand-cardBorder flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-brand-darkBg border border-brand-cardBorder flex items-center justify-center text-2xl">
                  {friend.avatar}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-brand-card ${friend.online ? 'bg-emerald-400' : 'bg-slate-500'}`} />
              </div>
              <div>
                <p className="font-bold text-white text-sm">{dir === 'rtl' ? friend.name : friend.nameEn}</p>
                <p className="text-[11px] text-slate-400 font-medium">
                  Level {friend.level} • {friend.online ? (dir === 'rtl' ? 'متصل الآن' : 'Online') : (dir === 'rtl' ? 'غير متصل' : 'Offline')}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              {dir === 'rtl' ? 'تحدّ' : 'Challenge'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
