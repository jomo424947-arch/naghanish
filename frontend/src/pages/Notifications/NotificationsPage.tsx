import React from 'react'
import { Bell, Trophy, Users, Zap, CheckCheck } from 'lucide-react'
import { SectionTitle } from '@components/common/SectionTitle'
import { Button } from '@components/common/Button'
import { useThemeStore } from '@store/themeStore'
import { cn } from '@lib/utils'

const NOTIFICATIONS = [
  { id: 'n1', icon: '🏆', title: 'تجاوزت المرتبة الثانية!', titleEn: 'You passed rank #2!', time: '5 دقائق', timeEn: '5m ago', read: false, color: 'text-amber-400' },
  { id: 'n2', icon: '🎉', title: 'دعوة من ليلى للعب بارتي نايت', titleEn: 'Layla invited you to Party Night', time: '15 دقيقة', timeEn: '15m ago', read: false, color: 'text-brand-blue' },
  { id: 'n3', icon: '⚡', title: 'تحدي اليوم جاهز: +250 XP', titleEn: "Today's challenge ready: +250 XP", time: 'منذ ساعة', timeEn: '1h ago', read: true, color: 'text-orange-400' },
  { id: 'n4', icon: '🧠', title: 'أكملت إنجاز "عقل حاد"!', titleEn: 'Achievement "Sharp Mind" unlocked!', time: 'أمس', timeEn: 'Yesterday', read: true, color: 'text-purple-400' },
]

export const NotificationsPage: React.FC = () => {
  const { dir } = useThemeStore()
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length

  return (
    <div className="flex flex-col gap-8 py-4">
      <SectionTitle
        title={dir === 'rtl' ? 'الإشعارات 🔔' : 'Notifications 🔔'}
        subtitle={dir === 'rtl' ? `${unreadCount} غير مقروءة` : `${unreadCount} unread`}
        icon={<Bell className="w-5 h-5" />}
        action={
          <Button variant="ghost" size="sm" leftIcon={<CheckCheck className="w-4 h-4" />}>
            {dir === 'rtl' ? 'قراءة الكل' : 'Mark all read'}
          </Button>
        }
      />

      <div className="flex flex-col gap-2">
        {NOTIFICATIONS.map(notif => (
          <div
            key={notif.id}
            className={cn(
              'p-4 rounded-3xl flex items-center gap-4 border transition-all',
              notif.read
                ? 'bg-brand-card/60 border-brand-cardBorder opacity-70'
                : 'bg-brand-card border-brand-purple/40 shadow-glow'
            )}
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-darkBg border border-brand-cardBorder flex items-center justify-center text-2xl shrink-0">
              {notif.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn('font-bold text-sm', notif.read ? 'text-slate-400' : 'text-white')}>
                {dir === 'rtl' ? notif.title : notif.titleEn}
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {dir === 'rtl' ? notif.time : notif.timeEn}
              </p>
            </div>
            {!notif.read && (
              <div className="w-2.5 h-2.5 rounded-full bg-brand-blue shadow-glow-blue shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
