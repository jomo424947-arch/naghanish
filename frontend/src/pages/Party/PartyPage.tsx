import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Hash, Users, Shuffle, Play, ArrowRight, ArrowLeft } from 'lucide-react'
import { SectionTitle } from '@components/common/SectionTitle'
import { Card } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { Input } from '@components/common/Input'
import { ROUTES } from '@constants/routes'
import { useThemeStore } from '@store/themeStore'

const ACTIVE_ROOMS = [
  { code: 'AB12CD', name: 'تحدي الأسئلة السريعة', players: 6, max: 8, host: 'أحمد', icon: '⚡' },
  { code: 'XY342Q', name: 'ذاكرة الأبطال', players: 4, max: 6, host: 'ليلى', icon: '🏆' },
  { code: 'MN789R', name: 'اختبار الشخصية الجماعي', players: 3, max: 4, host: 'يوسف', icon: '🧠' },
]

export const PartyPage: React.FC = () => {
  const navigate = useNavigate()
  const { dir } = useThemeStore()
  const [joinCode, setJoinCode] = useState('')
  const [activeTab, setActiveTab] = useState<'browse' | 'join'>('browse')

  return (
    <div className="flex flex-col gap-8 py-4">
      <SectionTitle
        title={dir === 'rtl' ? 'بارتي نايت 🎉' : 'Party Night 🎉'}
        subtitle={dir === 'rtl' ? 'العب مع أصدقائك في غرف لعب جماعية حية' : 'Play with friends in live multiplayer rooms'}
        action={
          <Button
            variant="accent"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate(ROUTES.CREATE_ROOM)}
          >
            {dir === 'rtl' ? 'إنشاء غرفة' : 'Create Room'}
          </Button>
        }
      />

      {/* Room Code banner / Party ID display */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-brand-purple/30 via-brand-card to-brand-blue/20 border border-brand-purple/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-glow">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-brand-purple to-indigo-700 shadow-glow shrink-0">
            <Hash className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">{dir === 'rtl' ? 'كود غرفتك الشخصية' : 'Your Room Code'}</p>
            <h3 className="text-2xl font-black text-white tracking-[0.15em]">NGAI23</h3>
          </div>
        </div>
        <Button variant="secondary" size="md" className="shadow-glow-blue">
          {dir === 'rtl' ? 'مشاركة الكود' : 'Share Code'}
        </Button>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-brand-card border border-brand-cardBorder w-fit">
        {(['browse', 'join'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === tab
                ? 'bg-gradient-to-r from-brand-purple to-indigo-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'browse'
              ? (dir === 'rtl' ? 'الغرف النشطة' : 'Browse Rooms')
              : (dir === 'rtl' ? 'انضم بكود' : 'Join by Code')}
          </button>
        ))}
      </div>

      {/* Browse Rooms List */}
      {activeTab === 'browse' && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {dir === 'rtl' ? `${ACTIVE_ROOMS.length} غرف نشطة الآن` : `${ACTIVE_ROOMS.length} Active Rooms`}
          </p>
          {ACTIVE_ROOMS.map((room, i) => (
            <motion.div
              key={room.code}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-4 rounded-3xl bg-brand-card border border-brand-cardBorder flex items-center justify-between gap-4 hover:border-brand-blue/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-purple/30 to-brand-blue/20 border border-brand-cardBorder flex items-center justify-center text-2xl shrink-0">
                  {room.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{room.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-medium">
                    <span className="font-mono text-brand-blue">#{room.code}</span>
                    <span>•</span>
                    <Users className="w-3 h-3" />
                    <span>{room.players}/{room.max}</span>
                    <span>•</span>
                    <span>{dir === 'rtl' ? `المضيف: ${room.host}` : `Host: ${room.host}`}</span>
                  </div>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                {dir === 'rtl' ? 'انضم' : 'Join'}
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Join by Code */}
      {activeTab === 'join' && (
        <div className="p-6 rounded-3xl bg-brand-card border border-brand-cardBorder flex flex-col gap-5">
          <p className="text-sm text-slate-300 font-medium">
            {dir === 'rtl' ? 'أدخل كود الغرفة المكون من 6 أحرف للانضمام الفوري:' : 'Enter the 6-character room code to join instantly:'}
          </p>
          <Input
            leftIcon={<Hash className="w-4 h-4" />}
            placeholder="AB12CD"
            value={joinCode}
            onChange={e => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
            className="text-center text-lg font-black tracking-[0.3em] uppercase"
          />
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={joinCode.length < 6}
            rightIcon={dir === 'rtl' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            className="shadow-glow"
          >
            {dir === 'rtl' ? 'انضم للغرفة' : 'Join Room'}
          </Button>
        </div>
      )}

      {/* Quick options */}
      <div className="grid grid-cols-2 gap-3">
        <Card variant="glowing" isInteractive className="flex flex-col items-center gap-3 p-5 text-center">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300"><Shuffle className="w-6 h-6" /></div>
          <div>
            <h4 className="font-bold text-white text-sm">{dir === 'rtl' ? 'عشوائي' : 'Random Room'}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">{dir === 'rtl' ? 'انضم لغرفة عشوائية' : 'Join any open room'}</p>
          </div>
        </Card>
        <Card variant="glowing" isInteractive className="flex flex-col items-center gap-3 p-5 text-center">
          <div className="p-3 rounded-2xl bg-brand-purple/20 text-purple-300"><Play className="w-6 h-6 fill-current" /></div>
          <div>
            <h4 className="font-bold text-white text-sm">{dir === 'rtl' ? '5 جولات' : '5 Rounds'}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">{dir === 'rtl' ? 'الإعداد الافتراضي' : 'Default room setting'}</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
