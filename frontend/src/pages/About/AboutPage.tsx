import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Gamepad2, Heart, Shield, Code, ArrowRight, ArrowLeft } from 'lucide-react'
import { Logo } from '@components/common/Logo'
import { SectionTitle } from '@components/common/SectionTitle'
import { Button } from '@components/common/Button'
import { useThemeStore } from '@store/themeStore'

export const AboutPage: React.FC = () => {
  const navigate = useNavigate()
  const { dir } = useThemeStore()

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
      <SectionTitle
        title={dir === 'rtl' ? 'عن نغانيش ℹ️' : 'About Naghanish ℹ️'}
        subtitle={dir === 'rtl' ? 'منصة الترفيه الذكية والتحديات الجماعية' : 'The modern entertainment & brain challenge platform'}
        action={
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            {dir === 'rtl' ? 'رجوع' : 'Back'}
          </Button>
        }
      />

      {/* Hero Branding Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-brand-card via-[#1A1A36] to-[#121226] border border-brand-cardBorder text-center flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />

        <Logo size="xl" animated={true} />

        <div className="max-w-xl">
          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            {dir === 'rtl'
              ? 'نغانيش هي منصة ترفيه حديثة تجمع بين الألعاب الذهنية، اختبارات الشخصية، التحديات الجماعية المباشرة وتوصيات الذكاء الاصطناعي لتمنحك تجربة ممتعة ومحفزة يومياً!'
              : 'Naghanish is a cutting-edge entertainment platform combining brain training games, personality tests, real-time party challenges, and AI recommendations to deliver a vibrant gaming experience everyday.'}
          </p>
        </div>

        {/* Feature Badges */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5">
            <BrainIcon /> Brain Games
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> AI Engine
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-bold flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5" /> Party Multiplayer
          </span>
        </div>
      </div>

      {/* Specs & Tech Specs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-brand-card/80 border border-brand-cardBorder flex flex-col gap-3">
          <div className="flex items-center gap-3 text-brand-blue font-bold text-sm">
            <Code className="w-5 h-5" />
            <span>{dir === 'rtl' ? 'التقنيات المستخدمة' : 'Tech Stack'}</span>
          </div>
          <ul className="text-xs font-medium text-slate-300 flex flex-col gap-2">
            <li>• React 19 & TypeScript</li>
            <li>• Vite & Tailwind CSS</li>
            <li>• Framer Motion & Zustand</li>
            <li>• TanStack Query & Lucide React</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-brand-card/80 border border-brand-cardBorder flex flex-col gap-3">
          <div className="flex items-center gap-3 text-brand-purple font-bold text-sm">
            <Shield className="w-5 h-5" />
            <span>{dir === 'rtl' ? 'إصدار المنصة' : 'Platform Build'}</span>
          </div>
          <div className="text-xs font-medium text-slate-300 flex flex-col gap-2">
            <p><span className="text-slate-500">Version:</span> 1.0.0 (Production Build)</p>
            <p><span className="text-slate-500">Status:</span> Connected & Fully Responsive</p>
            <p><span className="text-slate-500">UI Identity:</span> Official 3D Visual Identity</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function BrainIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    </svg>
  )
}
