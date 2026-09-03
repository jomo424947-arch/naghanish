import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus,
  Hash,
  Users,
  Shuffle,
  Play,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Flame,
  Swords,
  Radio,
} from 'lucide-react'
import { SectionTitle } from '@components/common/SectionTitle'
import { Card } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { Input } from '@components/common/Input'
import { SEO } from '@components/common/SEO'
import { AdSlot } from '@components/common/AdSlot'
import { ModeMascot } from '@components/common/ModeVisuals'
import { ROUTES } from '@constants/routes'
import { useThemeStore } from '@store/themeStore'

const ACTIVE_ROOMS = [
  {
    code: 'AB12CD',
    name: 'تحدي الأسئلة السريعة ⚡',
    nameEn: 'Speed Trivia Challenge ⚡',
    players: 6,
    max: 8,
    host: 'أحمد',
    icon: '⚡',
    category: 'Trivia & Speed',
    badge: 'LIVE MATCH',
    badgeColor: 'bg-orange-500',
  },
  {
    code: 'XY342Q',
    name: 'ذاكرة الأبطال الخارقة 🃏',
    nameEn: 'Champions Memory 🃏',
    players: 4,
    max: 6,
    host: 'ليلى',
    icon: '🏆',
    category: 'Memory Battle',
    badge: 'FIERCE',
    badgeColor: 'bg-amber-500',
  },
  {
    code: 'MN789R',
    name: 'اختبار الشخصية والضحك 🎭',
    nameEn: 'Personality & Dares 🎭',
    players: 3,
    max: 4,
    host: 'يوسف',
    icon: '🧠',
    category: 'Social Quiz',
    badge: 'CHILL',
    badgeColor: 'bg-cyan-500',
  },
]

export const PartyPage: React.FC = () => {
  const navigate = useNavigate()
  const { dir } = useThemeStore()
  const [joinCode, setJoinCode] = useState('')
  const [activeTab, setActiveTab] = useState<'browse' | 'join'>('browse')

  const isRtl = dir === 'rtl'

  const handleJoin = (codeToJoin: string) => {
    navigate(`/party/lobby/${codeToJoin}`)
  }

  return (
    <div className="flex flex-col gap-8 py-4 max-w-5xl mx-auto">
      <SEO
        title="عالم الشِلّة | نغنِش — غرف اللعب الجماعية التفاعلية"
        description="أنشئ غرفتك الخاصة أو انضم إلى غرف اللعب الجماعية التفاعلية الحية مع أصدقائك في عالم الشلة."
        keywords={['عالم الشلة', 'العاب جماعية', 'غرف لعب', 'نغنش بارتي']}
      />

      {/* ─────────────────────────────────────────────────────────────
          1. SHILLA MODE HERO BANNER
      ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#2A1608] via-brand-card to-[#152028] border-2 border-orange-500/50 shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-start">
          <ModeMascot mode="shilla" size="lg" />

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-black mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRtl ? 'عالم الشِلّة • PLAY WITH YOUR FRIENDS' : 'SHILLA WORLD • PLAY WITH FRIENDS'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {isRtl ? 'العب وتحدى أصحابك لايف! 🎉' : 'Play & Challenge Your Crew Live! 🎉'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-lg mt-1 leading-relaxed">
              {isRtl
                ? 'أنشئ غرفتك الخاصة، شارك الكود مع الشلة، وتنافسوا في ألعاب السرعة والذكاء والضحك.'
                : 'Create your private room, share your room code, and battle in real-time speed and trivia.'}
            </p>
          </div>
        </div>

        <Button
          variant="shilla"
          size="lg"
          leftIcon={<Plus className="w-5 h-5" />}
          onClick={() => navigate(ROUTES.CREATE_ROOM)}
          className="relative z-10 w-full md:w-auto shrink-0"
        >
          {isRtl ? 'إنشاء غرفة جديدة' : 'Create Room'}
        </Button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. QUICK PERSONAL ROOM CODE DISPLAY
      ───────────────────────────────────────────────────────────── */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-orange-950/40 via-brand-card to-amber-950/30 border-2 border-orange-400/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-glow-orange">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-slate-950 shadow-glow-orange shrink-0">
            <Hash className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-xs font-black text-orange-300 uppercase tracking-wider">
              {isRtl ? 'كود غرفتك السريعة' : 'Your Quick Room Code'}
            </p>
            <h3 className="text-2xl font-black text-white tracking-[0.2em]">NGAI23</h3>
          </div>
        </div>
        <Button
          variant="secondary"
          size="md"
          className="shadow-glow-blue"
          onClick={() => handleJoin('NGAI23')}
        >
          {isRtl ? 'دخول غرفتك' : 'Enter My Lobby'}
        </Button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. TAB SWITCHER (Active Rooms vs Join by Code)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-brand-card border border-brand-cardBorder w-fit">
        {(['browse', 'join'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer ${
              activeTab === tab
                ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 shadow-glow-orange'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'browse'
              ? isRtl
                ? 'الغرف النشطة الآن'
                : 'Active Rooms'
              : isRtl
              ? 'انضمام بكود'
              : 'Join by Code'}
          </button>
        ))}
      </div>

      {/* Native Ad Slot */}
      <AdSlot variant="in-feed" slotId="ad-party-page" />

      {/* ─────────────────────────────────────────────────────────────
          4. TAB CONTENT
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'browse' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <p className="text-xs font-black text-slate-300 uppercase tracking-wider">
                {isRtl
                  ? `${ACTIVE_ROOMS.length} غرف لعب جماعية مفتوحة الآن`
                  : `${ACTIVE_ROOMS.length} Live Multiplayer Rooms`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {ACTIVE_ROOMS.map((room, i) => (
              <motion.div
                key={room.code}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-5 rounded-3xl bg-brand-card/90 border-2 border-brand-cardBorder hover:border-orange-400/80 transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg hover:shadow-glow-orange group"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 via-brand-card to-cyan-500/20 border border-orange-500/30 flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform">
                    {room.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-white text-base truncate">
                        {isRtl ? room.name : room.nameEn}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[9px] font-black text-white ${room.badgeColor}`}
                      >
                        {room.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-bold flex-wrap">
                      <span className="font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-400/30">
                        #{room.code}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <Users className="w-3.5 h-3.5 text-orange-400" />
                        {room.players}/{room.max} {isRtl ? 'لاعبين' : 'players'}
                      </span>
                      <span>•</span>
                      <span className="text-amber-300">
                        {isRtl ? `المضيف: ${room.host}` : `Host: ${room.host}`}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="shilla"
                  size="md"
                  className="w-full sm:w-auto shrink-0"
                  onClick={() => handleJoin(room.code)}
                >
                  {isRtl ? 'انضم للغرفة ⚡' : 'Join Room ⚡'}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Join by Code Form */}
      {activeTab === 'join' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-brand-card border-2 border-orange-500/40 flex flex-col gap-5 max-w-md mx-auto w-full shadow-2xl">
          <div className="text-center">
            <h3 className="text-xl font-black text-white">
              {isRtl ? 'انضمام إلى غرفة بكود' : 'Join with Room Code'}
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-1">
              {isRtl
                ? 'أدخل كود الغرفة المكون من 6 رموز للانضمام الفوري'
                : 'Enter the 6-character room code to join instantly'}
            </p>
          </div>

          <Input
            leftIcon={<Hash className="w-4 h-4 text-orange-400" />}
            placeholder="AB12CD"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
            className="text-center text-xl font-black tracking-[0.3em] uppercase h-14"
          />

          <Button
            variant="shilla"
            size="lg"
            fullWidth
            disabled={joinCode.length < 4}
            onClick={() => handleJoin(joinCode)}
            rightIcon={isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          >
            {isRtl ? 'دخول الغرفة' : 'Join Lobby'}
          </Button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. QUICK ACTION CARDS (Random Match / Create Match)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          variant="glowing"
          glowColor="cyan"
          isInteractive
          onClick={() => handleJoin('RANDOM')}
          className="flex items-center gap-4 p-6 group cursor-pointer border-2 border-cyan-500/30"
        >
          <div className="p-4 rounded-2xl bg-cyan-500/20 text-cyan-300 group-hover:scale-110 transition-transform">
            <Shuffle className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-black text-white text-base">
              {isRtl ? 'مطابقة عشوائية 🎲' : 'Random Match 🎲'}
            </h4>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {isRtl ? 'انضم لأي غرفة مفتوحة بضغطة واحدة' : 'Instantly join any open public room'}
            </p>
          </div>
        </Card>

        <Card
          variant="glowing"
          glowColor="orange"
          isInteractive
          onClick={() => navigate(ROUTES.CREATE_ROOM)}
          className="flex items-center gap-4 p-6 group cursor-pointer border-2 border-orange-500/30"
        >
          <div className="p-4 rounded-2xl bg-orange-500/20 text-orange-400 group-hover:scale-110 transition-transform">
            <Swords className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-black text-white text-base">
              {isRtl ? 'تحدي مخصص ⚔️' : 'Custom Challenge ⚔️'}
            </h4>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {isRtl ? 'حدد عدد اللاعبين ونوع الأسئلة' : 'Configure players count & quiz categories'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
