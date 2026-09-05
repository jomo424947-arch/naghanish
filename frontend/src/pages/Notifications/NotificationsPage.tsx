import React, { useState, useEffect } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { SectionTitle } from '@components/common/SectionTitle'
import { Button } from '@components/common/Button'
import { useThemeStore } from '@store/themeStore'
import { httpClient } from '@api/httpClient'
import { cn } from '@lib/utils'

interface NotificationItem {
  id: string
  titleAr: string
  bodyAr: string
  icon: string
  type: string
  isRead: boolean
  timeAgo: string
  actionUrl: string
}

export const NotificationsPage: React.FC = () => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    httpClient
      .get('/notifications')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setNotifications(res.data)
        }
      })
      .catch(() => {
        setNotifications([])
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleMarkAllRead = async () => {
    try {
      await httpClient.post('/notifications/mark-read')
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch {
      // Ignore
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="flex flex-col gap-8 py-4 max-w-3xl mx-auto pb-24">
      <SectionTitle
        title={isRtl ? 'الإشعارات 🔔' : 'Notifications 🔔'}
        subtitle={isRtl ? `${unreadCount} غير مقروءة` : `${unreadCount} unread`}
        icon={<Bell className="w-5 h-5 text-brand-purple" />}
        action={
          notifications.length > 0 ? (
            <Button variant="ghost" size="sm" onClick={handleMarkAllRead} leftIcon={<CheckCheck className="w-4 h-4" />}>
              {isRtl ? 'قراءة الكل' : 'Mark all read'}
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <div className="p-12 text-center text-slate-400">
          <p className="animate-pulse">{isRtl ? 'جاري تحميل الإشعارات...' : 'Loading notifications...'}</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-brand-card/50 border border-brand-cardBorder flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-brand-darkBg border border-brand-cardBorder flex items-center justify-center text-3xl">
            🔔
          </div>
          <h4 className="text-base font-bold text-white">
            {isRtl ? 'لا توجد إشعارات حالياً' : 'No notifications yet'}
          </h4>
          <p className="text-xs text-slate-400 max-w-sm">
            {isRtl
              ? 'ستصلك هنا إشعارات التحديات، نتائج البطولات، ودعوات الأصدقاء فور حدوثها!'
              : 'You will receive game invites, tournament updates, and rewards here!'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={cn(
                'p-4 rounded-3xl flex items-center gap-4 border transition-all',
                notif.isRead
                  ? 'bg-brand-card/60 border-brand-cardBorder opacity-70'
                  : 'bg-brand-card border-brand-purple/40 shadow-glow'
              )}
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-darkBg border border-brand-cardBorder flex items-center justify-center text-2xl shrink-0">
                {notif.icon || '🔔'}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('font-bold text-sm', notif.isRead ? 'text-slate-400' : 'text-white')}>
                  {notif.titleAr}
                </p>
                <p className="text-xs text-slate-300 mt-0.5">
                  {notif.bodyAr}
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  {notif.timeAgo}
                </p>
              </div>
              {!notif.isRead && (
                <div className="w-2.5 h-2.5 rounded-full bg-brand-blue shadow-glow-blue shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
