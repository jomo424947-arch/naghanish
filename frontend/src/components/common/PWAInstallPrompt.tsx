import React, { useState, useEffect } from 'react'
import { Download, X, Smartphone, Sparkles } from 'lucide-react'
import { useThemeStore } from '@store/themeStore'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      const dismissed = localStorage.getItem('naghanish_pwa_dismissed')
      if (!dismissed) {
        setShowPrompt(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowPrompt(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('naghanish_pwa_dismissed', 'true')
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-bounce-in">
      <div className="relative p-4 rounded-2xl bg-gradient-to-r from-[#1E112A] via-brand-card to-[#120F24] border-2 border-orange-500/50 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3">
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -left-2 rtl:-left-auto rtl:-right-2 w-6 h-6 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs border border-white/10"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-2xl shadow-glow-orange shrink-0">
            📱
          </div>
          <div>
            <h4 className="text-xs font-black text-white flex items-center gap-1.5">
              <span>{isRtl ? 'ثبّت تطبيق نغنِش' : 'Install Naghanish App'}</span>
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {isRtl ? 'العب بملء الشاشة بدون متصفح وبسرعة فائقة!' : 'Play fullscreen with instant offline loading!'}
            </p>
          </div>
        </div>

        <button
          onClick={handleInstall}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-xs shadow-glow-orange hover:scale-105 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isRtl ? 'تثبيت' : 'Install'}</span>
        </button>
      </div>
    </div>
  )
}
