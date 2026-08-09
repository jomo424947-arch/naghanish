import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Hash, Users, Crown, CheckCircle2, Play, Share2, MessageSquare, Send, ArrowLeft, ArrowRight } from 'lucide-react'
import { SectionTitle } from '@components/common/SectionTitle'
import { Card } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { Input } from '@components/common/Input'
import { SEO } from '@components/common/SEO'
import { ROUTES } from '@constants/routes'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'

interface Player {
  id: string
  name: string
  avatar: string
  isHost: boolean
  isReady: boolean
}

export function LobbyPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { dir } = useThemeStore()

  const roomCode = id || 'NGAI23'

  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: user?.name || 'أحمد علي (أنت)', avatar: '🧠', isHost: true, isReady: true },
    { id: '2', name: 'ليلى سعيد', avatar: '🌟', isHost: false, isReady: true },
    { id: '3', name: 'يوسف أحمد', avatar: '⚡', isHost: false, isReady: false },
    { id: '4', name: 'سارة خالد', avatar: '🎯', isHost: false, isReady: true },
  ])

  const [messages, setMessages] = useState<string[]>([
    'أهلاً بكم في الغرفة! 👋',
    'جاهزون للبدء؟ 🔥',
  ])
  const [chatInput, setChatInput] = useState('')

  const handleSendMessage = () => {
    if (!chatInput.trim()) return
    setMessages(prev => [...prev, `${user?.name || 'أنت'}: ${chatInput}`])
    setChatInput('')
  }

  const handleStartGame = () => {
    navigate(`${ROUTES.GAMES}/g1`)
  }

  return (
    <div className="flex flex-col gap-6 py-4 max-w-4xl mx-auto">
      <SEO title={`صالة الانتظار #${roomCode} | نغنِش`} description="صالة انتظار مباريات البارتي الحية على منصة نغنِش." />

      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(ROUTES.PARTY)}
        >
          {dir === 'rtl' ? 'مغادرة الغرفة' : 'Leave Room'}
        </Button>
      </div>

      {/* Room Details Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-purple/40 via-brand-card to-brand-blue/30 border-2 border-brand-purple/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-glow">
        <div className="flex items-center gap-4 text-center sm:text-right rtl:sm:text-right sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-purple to-indigo-700 flex items-center justify-center text-3xl shadow-glow">
            🎮
          </div>
          <div>
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              {dir === 'rtl' ? 'صالة الانتظار الجماعية' : 'Party Lobby'}
            </span>
            <h2 className="text-2xl font-black text-white flex items-center gap-2 justify-center sm:justify-start">
              <span>{dir === 'rtl' ? 'كود الغرفة:' : 'Room Code:'}</span>
              <span className="text-gradient-primary tracking-widest">{roomCode}</span>
            </h2>
          </div>
        </div>

        <Button variant="secondary" size="md" leftIcon={<Share2 className="w-4 h-4" />}>
          {dir === 'rtl' ? 'نسخ كود الدعوة' : 'Share Code'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Players Grid (2 Cols on md) */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <SectionTitle
            title={dir === 'rtl' ? 'اللاعبون المكتملون 👥' : 'Connected Players 👥'}
            subtitle={`${players.length}/6 ${dir === 'rtl' ? 'لاعبين في الصالة' : 'players in room'}`}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {players.map(p => (
              <Card
                key={p.id}
                variant={p.isReady ? 'glowing' : 'default'}
                glowColor="cyan"
                className="p-4 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-brand-darkBg border border-brand-cardBorder flex items-center justify-center text-2xl">
                      {p.avatar}
                    </div>
                    {p.isHost && (
                      <div className="absolute -top-1.5 -right-1.5 rtl:-right-auto rtl:-left-1.5 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                        <Crown className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm">{p.name}</h4>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {p.isHost ? (dir === 'rtl' ? 'المضيف' : 'Host') : (dir === 'rtl' ? 'لاعب' : 'Player')}
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black border ${
                  p.isReady
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {p.isReady ? (dir === 'rtl' ? 'جاهز ✓' : 'Ready ✓') : (dir === 'rtl' ? 'ينتظر...' : 'Waiting...')}
                </span>
              </Card>
            ))}
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleStartGame}
            leftIcon={<Play className="w-5 h-5 fill-current" />}
            className="shadow-glow mt-4"
          >
            {dir === 'rtl' ? 'بدء اللعبة الآن 🚀' : 'Start Game Now 🚀'}
          </Button>
        </div>

        {/* Room Live Chat */}
        <Card variant="default" className="p-4 flex flex-col justify-between h-96">
          <div className="flex items-center gap-2 border-b border-brand-cardBorder pb-3">
            <MessageSquare className="w-4 h-4 text-cyan-300" />
            <h4 className="font-extrabold text-white text-sm">{dir === 'rtl' ? 'دردشة الغرفة' : 'Room Chat'}</h4>
          </div>

          <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-2 scrollbar-none">
            {messages.map((msg, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-brand-darkBg text-xs font-medium text-slate-200 border border-white/5">
                {msg}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder={dir === 'rtl' ? 'اكتب رسالة...' : 'Type message...'}
              className="py-1.5 text-xs"
            />
            <button
              onClick={handleSendMessage}
              className="p-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple/80 text-white shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
