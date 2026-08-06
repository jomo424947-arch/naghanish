import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Logo } from '@components/common/Logo'
import { Button } from '@components/common/Button'
import { AnimatedBackground } from '@components/common/AnimatedBackground'
import { ROUTES } from '@constants/routes'
import { Sparkles, Gamepad2, Brain, Trophy } from 'lucide-react'

export const SplashPage: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Auto-navigate to onboarding after 3 seconds unless user clicks
    const timer = setTimeout(() => {
      navigate(ROUTES.ONBOARDING)
    }, 3500)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="relative min-h-screen w-full bg-brand-darkBg text-slate-100 flex flex-col items-center justify-between p-6 overflow-hidden select-none">
      <AnimatedBackground variant="hero" />

      {/* Top Bar decoration */}
      <div className="w-full max-w-sm flex items-center justify-between opacity-60 text-xs font-bold text-slate-400">
        <span className="flex items-center gap-1.5 text-brand-blue">
          <Sparkles className="w-3.5 h-3.5" /> Naghanish v1.0
        </span>
        <span>ENTERTAINMENT ENGINE</span>
      </div>

      {/* Main Hero Visual matching reference image */}
      <div className="flex flex-col items-center justify-center text-center my-auto max-w-md w-full">
        {/* Animated Mascot Bot Container */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="relative mb-8"
        >
          {/* Glowing Aura Ring */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple via-brand-blue to-cyan-300 rounded-full blur-2xl opacity-60 animate-pulse-subtle" />

          {/* Cute Purple Mascot Bot Icon Card Frame */}
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-4xl bg-gradient-to-b from-[#2B1754] via-brand-card to-[#121226] border-4 border-brand-purple/40 flex items-center justify-center shadow-2xl overflow-hidden group">
            {/* Mascot SVG */}
            <Logo size="xl" showText={false} animated={true} />

            {/* Glowing Face Smiley Badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-3 px-3 py-1 rounded-full bg-brand-blue/30 border border-cyan-300/40 backdrop-blur-md text-[11px] font-extrabold text-cyan-300 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-cyan-300" /> AI Game Engine
            </motion.div>
          </div>
        </motion.div>

        {/* Title & Arabic Slogan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col items-center gap-2"
        >
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            نغانيش
          </h1>
          <span className="text-brand-blue font-bold tracking-widest text-sm sm:text-base">
            Naghanish
          </span>

          <div className="flex items-center justify-center gap-3 my-3">
            <span className="flex items-center gap-1 text-xs font-bold text-purple-300 bg-purple-900/40 px-3 py-1 rounded-full border border-purple-500/30">
              <Brain className="w-3.5 h-3.5 text-purple-400" /> العب
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-cyan-300 bg-cyan-900/40 px-3 py-1 rounded-full border border-cyan-400/30">
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" /> تحدّ
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-orange-300 bg-orange-900/40 px-3 py-1 rounded-full border border-orange-500/30">
              <Trophy className="w-3.5 h-3.5 text-orange-400" /> اكتشف
            </span>
          </div>

          <p className="text-slate-400 text-xs sm:text-sm font-medium">
            Play. Challenge. Discover.
          </p>
        </motion.div>

        {/* Start / Skip Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full mt-10"
        >
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => navigate(ROUTES.ONBOARDING)}
            className="shadow-glow-blue"
          >
            ابدأ التجربة الآن ✨
          </Button>
        </motion.div>
      </div>

      {/* Bottom Footer */}
      <div className="w-full text-center text-[11px] text-slate-500 font-medium">
        © {new Date().getFullYear()} Naghanish. All rights reserved.
      </div>
    </div>
  )
}
