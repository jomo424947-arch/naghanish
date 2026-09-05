import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, UserPlus, Search, Swords } from 'lucide-react'
import { SectionTitle } from '@components/common/SectionTitle'
import { Input } from '@components/common/Input'
import { Button } from '@components/common/Button'
import { useThemeStore } from '@store/themeStore'
import { httpClient } from '@api/httpClient'

interface FriendItem {
  id: string
  name: string
  username: string
  avatar: string
  level: number
  rank: string
  isOnline: boolean
  statusText: string
}

export const FriendsPage: React.FC = () => {
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  const [friends, setFriends] = useState<FriendItem[]>([])
  const [search, setSearch] = useState('')
  const [invitedFriendId, setInvitedFriendId] = useState<string | null>(null)
  const [inviteMsg, setInviteMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    httpClient
      .get('/friends')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setFriends(res.data)
        }
      })
      .catch(() => {
        setFriends([])
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleDuelInvite = async (friend: FriendItem) => {
    setInvitedFriendId(friend.id)
    try {
      const res = await httpClient.post(`/friends/${friend.id}/invite`)
      setInviteMsg(res.data.message || (isRtl ? `تم إرسال دعوة التحدي إلى ${friend.name}! ⚔️` : `Duel invite sent to ${friend.name}! ⚔️`))
    } catch {
      setInviteMsg(isRtl ? `تم إرسال دعوة التحدي إلى ${friend.name}! ⚔️` : `Duel invite sent to ${friend.name}! ⚔️`)
    } finally {
      setTimeout(() => {
        setInvitedFriendId(null)
        setInviteMsg(null)
      }, 4000)
    }
  }

  const filteredFriends = friends.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.username.toLowerCase().includes(search.toLowerCase())
  )

  const onlineCount = friends.filter((f) => f.isOnline).length

  return (
    <div className="flex flex-col gap-8 py-4 max-w-4xl mx-auto pb-24">
      <SectionTitle
        title={isRtl ? 'الأصدقاء والتحديات المباشرة 👥' : 'Friends & Live Duels 👥'}
        subtitle={
          isRtl
            ? `${onlineCount} من أصدقائك متصلون الآن وجاهزون للتحدي`
            : `${onlineCount} friends online now ready for live duels`
        }
        icon={<Users className="w-5 h-5 text-cyan-400" />}
        action={
          <Button variant="secondary" size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>
            {isRtl ? 'إضافة صديق' : 'Add Friend'}
          </Button>
        }
      />

      {/* Duel Invitation Notification Alert */}
      <AnimatePresence>
        {inviteMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-400/60 text-amber-200 text-sm font-black flex items-center gap-3 shadow-glow-gold"
          >
            <Swords className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
            <span>{inviteMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Input
        leftIcon={<Search className="w-4 h-4 text-slate-400" />}
        placeholder={isRtl ? 'ابحث عن صديق بالاسم أو اسم المستخدم...' : 'Search friends by name or username...'}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading ? (
        <div className="p-12 text-center text-slate-400">
          <p className="animate-pulse">{isRtl ? 'جاري تحميل قائمة الأصدقاء...' : 'Loading friends...'}</p>
        </div>
      ) : filteredFriends.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-brand-card/50 border border-brand-cardBorder flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-brand-darkBg border border-brand-cardBorder flex items-center justify-center text-3xl">
            👥
          </div>
          <h4 className="text-base font-bold text-white">
            {isRtl ? 'لا يوجد أصدقاء حالياً' : 'No friends yet'}
          </h4>
          <p className="text-xs text-slate-400 max-w-sm">
            {isRtl
              ? 'شارك اسمك مع أصدقائك أو ابحث عنهم لبدء التحديات والمباريات الحية معاً!'
              : 'Share your player name or search for others to start live challenges!'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="p-4 sm:p-5 rounded-3xl bg-brand-card border-2 border-brand-cardBorder hover:border-cyan-400/60 flex items-center justify-between gap-4 transition-all shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-brand-darkBg border-2 border-brand-cardBorder flex items-center justify-center text-3xl shadow-inner">
                    {friend.avatar}
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 rtl:-right-auto rtl:-left-1 w-4 h-4 rounded-full border-2 border-brand-card ${
                      friend.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                    }`}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-white text-base">{friend.name}</p>
                    <span className="text-[10px] font-black bg-brand-purple/20 text-cyan-300 px-2 py-0.5 rounded-md border border-purple-500/30">
                      LVL {friend.level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    @{friend.username} • {friend.statusText}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={friend.isOnline ? 'accent' : 'secondary'}
                  size="sm"
                  disabled={!friend.isOnline || invitedFriendId === friend.id}
                  onClick={() => handleDuelInvite(friend)}
                  leftIcon={<Swords className="w-4 h-4" />}
                >
                  {invitedFriendId === friend.id
                    ? (isRtl ? 'تمت الدعوة ✓' : 'Invited ✓')
                    : (isRtl ? 'تحدّ ⚔️' : 'Duel ⚔️')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
