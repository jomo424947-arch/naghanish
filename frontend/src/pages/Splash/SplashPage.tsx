import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Logo } from '@components/common/Logo'
import { Button } from '@components/common/Button'
import { GamerMascot } from '@components/common/GamerMascot'
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
        <span className="flex items-center gap-1.5 text-orange-400">
          <Sparkles className="w-3.5 h-3.5" /> Naghanish v1.0
        </span>
        <span>ENTERTAINMENT ENGINE</span>
      </div>

      {/* Main Hero Visual matching reference image */}
      <div className="flex flex-col items-center justify-center text-center my-auto max-w-md w-full">
        {/* Animated GamerMascot Hero Container */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="relative mb-8"
        >
          {/* Glowing Orange Aura Ring */}
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-400 rounded-full blur-3xl opacity-40 animate-pulse-subtle" />

          {/* GamerMascot Hero Frame */}
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-4xl bg-gradient-to-b from-[#1A1008] via-brand-card to-[#0E0E12] border-4 border-orange-500/30 flex items-center justify-center shadow-2xl overflow-hidden group">
            <GamerMascot variant="hero" size="lg" animated={true} />

            {/* Glowing Badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-3 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/40 backdrop-blur-md text-[11px] font-extrabold text-orange-300 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-orange-400" /> AI Game Engine
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
          <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-white">
            نغانيش
          </h1>
          <span className="text-orange-400 font-bold tracking-widest text-sm sm:text-base">
            Naghanish
          </span>

          <div className="flex items-center justify-center gap-3 my-3">
            <span className="flex items-center gap-1 text-xs font-bold text-purple-300 bg-purple-900/40 px-3 py-1 rounded-full border border-purple-500/30">
              <Brain className="w-3.5 h-3.5 text-purple-400" /> العب
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-orange-300 bg-orange-900/40 px-3 py-1 rounded-full border border-orange-500/30">
              <Gamepad2 className="w-3.5 h-3.5 text-orange-400" /> تحدّ
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-900/40 px-3 py-1 rounded-full border border-amber-500/30">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> اكتشف
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
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate(ROUTES.ONBOARDING)}
            className="shadow-glow-orange"
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
