import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Hash, QrCode, ArrowLeft, ArrowRight, Play, Users, Shuffle } from 'lucide-react'
import { SectionTitle } from '@components/common/SectionTitle'
import { Card } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { Input } from '@components/common/Input'
import { SEO } from '@components/common/SEO'
import { ROUTES } from '@constants/routes'
import { useThemeStore } from '@store/themeStore'

export function JoinRoomPage() {
  const navigate = useNavigate()
  const { dir } = useThemeStore()
  const [code, setCode] = useState('')
  const [showQR, setShowQR] = useState(false)

  const handleJoin = () => {
    if (code.length >= 4) {
      navigate(`${ROUTES.PARTY}/lobby/${code.toUpperCase()}`)
    }
  }

  return (
    <div className="flex flex-col gap-6 py-4 max-w-xl mx-auto">
      <SEO title="الانضمام لغرفة بارتي | نغنِش" description="أدخل كود الغرفة المكون من 6 رموز للانضمام الفوري لمباراة البارتي التفاعلية." />

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
        title={dir === 'rtl' ? 'الانضمام لغرفة 🎮' : 'Join Room 🎮'}
        subtitle={dir === 'rtl' ? 'أدخل كود الغرفة أو امسح كود الـ QR' : 'Enter 6-digit room code or scan QR code'}
      />

      <Card variant="glowing" glowColor="cyan" className="p-6 sm:p-8 flex flex-col gap-6 text-center">
        {!showQR ? (
          <>
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-3xl mx-auto shadow-glow">
              <Hash className="w-8 h-8 text-white" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">{dir === 'rtl' ? 'كود الغرفة' : 'Room Code'}</h3>
              <p className="text-xs text-slate-400 mt-1">{dir === 'rtl' ? 'أدخل كود الغرفة المكون من الأحرف والأرقام:' : 'Enter code provided by host:'}</p>
            </div>

            <Input
              leftIcon={<Hash className="w-4 h-4" />}
              placeholder="NGAI23"
              value={code}
              onChange={e => setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6))}
              className="text-center text-xl font-black tracking-[0.2em] uppercase"
              autoFocus
            />

            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={code.length < 4}
                onClick={handleJoin}
                leftIcon={<Play className="w-5 h-5 fill-current" />}
                className="shadow-glow"
              >
                {dir === 'rtl' ? 'دخول الغرفة' : 'Join Room'}
              </Button>

              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => setShowQR(true)}
                leftIcon={<QrCode className="w-4 h-4" />}
              >
                {dir === 'rtl' ? 'مسح QR Code 📷' : 'Scan QR Code 📷'}
              </Button>
            </div>
          </>
        ) : (
          /* QR Camera Simulator */
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-64 h-64 rounded-3xl bg-black border-2 border-cyan-400 overflow-hidden flex flex-col items-center justify-center p-4 shadow-glow-blue">
              <div className="absolute inset-4 border-2 border-dashed border-cyan-300 rounded-2xl animate-pulse" />
              <QrCode className="w-20 h-20 text-cyan-300 animate-bounce" />
              <p className="text-xs font-bold text-white mt-4">{dir === 'rtl' ? 'وجّه الكاميرا نحو كود الـ QR' : 'Point camera at QR Code'}</p>
            </div>

            <Button variant="ghost" size="sm" onClick={() => setShowQR(false)}>
              {dir === 'rtl' ? 'إلغاء والعودة لكتابة الكود' : 'Cancel & Enter Code'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
