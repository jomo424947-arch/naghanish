import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Users, Hash, Lock, Globe, Gamepad2, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { SectionTitle } from '@components/common/SectionTitle'
import { Card } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { Input } from '@components/common/Input'
import { SEO } from '@components/common/SEO'
import { ROUTES } from '@constants/routes'
import { useThemeStore } from '@store/themeStore'

export function CreateRoomPage() {
  const navigate = useNavigate()
  const { dir } = useThemeStore()

  const [roomName, setRoomName] = useState('غرفة الأبطال ⚡')
  const [selectedGame, setSelectedGame] = useState('Quiz')
  const [maxPlayers, setMaxPlayers] = useState(4)
  const [rounds, setRounds] = useState(5)
  const [isPrivate, setIsPrivate] = useState(false)
  const [password, setPassword] = useState('')

  const handleCreate = () => {
    const randomCode = 'NGAI' + Math.floor(100 + Math.random() * 900)
    navigate(`${ROUTES.PARTY}/lobby/${randomCode}`)
  }

  return (
    <div className="flex flex-col gap-6 py-4 max-w-2xl mx-auto">
      <SEO title="إنشاء غرفة لعب جماعية | نغنِش" description="أنشئ غرفتك الشخصية، حدد نوع اللعبة، وادعُ أصدقاءك للعب البارتي التفاعلي." />

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(ROUTES.PARTY)}
        >
          {dir === 'rtl' ? 'العودة للبارتي' : 'Back to Party'}
        </Button>
      </div>

      <SectionTitle
        title={dir === 'rtl' ? 'إنشاء غرفة جديدة 🎉' : 'Create New Room 🎉'}
        subtitle={dir === 'rtl' ? 'خصص إعدادات الغرفة وتحدى أصدقاءك' : 'Customize settings & challenge your friends'}
        icon={<Plus className="w-5 h-5" />}
      />

      <Card variant="glowing" glowColor="purple" className="p-6 sm:p-8 flex flex-col gap-6">
        {/* Room Name */}
        <div>
          <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">
            {dir === 'rtl' ? 'اسم الغرفة' : 'Room Name'}
          </label>
          <Input
            value={roomName}
            onChange={e => setRoomName(e.target.value)}
            placeholder={dir === 'rtl' ? 'أدخل اسم الغرفة...' : 'Enter room name...'}
          />
        </div>

        {/* Game Mode */}
        <div>
          <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">
            {dir === 'rtl' ? 'نوع اللعبة' : 'Game Mode'}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'Quiz', label: dir === 'rtl' ? 'أسئلة سريعة' : 'Speed Quiz', icon: '⚡' },
              { id: 'Memory', label: dir === 'rtl' ? 'ذاكرة جماعية' : 'Memory Party', icon: '🧠' },
              { id: 'Reaction', label: dir === 'rtl' ? 'سباق السرعة' : 'Speed Rush', icon: '🎯' },
            ].map(game => (
              <button
                key={game.id}
                type="button"
                onClick={() => setSelectedGame(game.id)}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all ${
                  selectedGame === game.id
                    ? 'bg-brand-purple/30 border-cyan-300 text-white shadow-glow'
                    : 'bg-brand-darkBg/60 border-brand-cardBorder text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-2xl">{game.icon}</span>
                <span className="text-xs font-bold">{game.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Max Players & Rounds */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">
              {dir === 'rtl' ? 'الحد الأقصى للاعبين' : 'Max Players'}
            </label>
            <div className="flex items-center gap-2">
              {[2, 4, 6, 8].map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setMaxPlayers(count)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-extrabold transition-all ${
                    maxPlayers === count
                      ? 'bg-brand-blue text-white border-cyan-300 shadow-glow-blue'
                      : 'bg-brand-darkBg border-brand-cardBorder text-slate-400'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">
              {dir === 'rtl' ? 'عدد الجولات' : 'Rounds'}
            </label>
            <div className="flex items-center gap-2">
              {[3, 5, 10].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRounds(r)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-extrabold transition-all ${
                    rounds === r
                      ? 'bg-brand-purple text-white border-purple-400 shadow-glow'
                      : 'bg-brand-darkBg border-brand-cardBorder text-slate-400'
                  }`}
                >
                  {r} {dir === 'rtl' ? 'جولات' : 'Rds'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy Switch */}
        <div className="p-4 rounded-2xl bg-brand-darkBg border border-brand-cardBorder flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isPrivate ? <Lock className="w-5 h-5 text-amber-400" /> : <Globe className="w-5 h-5 text-emerald-400" />}
            <div>
              <p className="text-sm font-bold text-white">
                {isPrivate ? (dir === 'rtl' ? 'غرفة خاصة' : 'Private Room') : (dir === 'rtl' ? 'غرفة عامة' : 'Public Room')}
              </p>
              <p className="text-[11px] text-slate-400 font-medium">
                {isPrivate
                  ? (dir === 'rtl' ? 'تتطلب كلمة سر للانضمام' : 'Requires password')
                  : (dir === 'rtl' ? 'يمكن لأي لاعب الانضمام' : 'Open for everyone')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPrivate(!isPrivate)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${isPrivate ? 'bg-amber-500' : 'bg-slate-700'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isPrivate ? 'translate-x-6 rtl:-translate-x-6' : ''}`} />
          </button>
        </div>

        {isPrivate && (
          <Input
            leftIcon={<Lock className="w-4 h-4" />}
            placeholder={dir === 'rtl' ? 'أدخل كلمة سر الغرفة...' : 'Set room password...'}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        )}

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleCreate}
          leftIcon={<Sparkles className="w-5 h-5" />}
          className="shadow-glow mt-2"
        >
          {dir === 'rtl' ? 'إنشاء ودخول الصالة 🚀' : 'Create & Enter Lobby 🚀'}
        </Button>
      </Card>
    </div>
  )
}
