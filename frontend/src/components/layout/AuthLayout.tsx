import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Globe, Moon, Sun, ArrowLeft, ArrowRight } from 'lucide-react'
import { Logo } from '@components/common/Logo'
import { AnimatedBackground } from '@components/common/AnimatedBackground'
import { useThemeStore } from '@store/themeStore'

export interface AuthLayoutProps {
  children?: React.ReactNode
  title?: string
  subtitle?: string
  showBackButton?: boolean
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackButton = false,
}) => {
  const navigate = useNavigate()
  const { theme, toggleTheme, language, setLanguage, dir } = useThemeStore()

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar')
  }

  return (
    <div className="relative min-h-screen w-full bg-brand-darkBg text-foreground flex flex-col justify-between overflow-x-hidden selection:bg-brand-purple/40">
      {/* Background Animated Blobs & Mesh Grid */}
      <AnimatedBackground variant="auth" />

      {/* Top Navigation Bar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-2xl bg-brand-card/80 border border-brand-cardBorder text-slate-300 hover:text-white hover:border-brand-purple transition-all duration-200"
              aria-label="Back"
            >
              {dir === 'rtl' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </button>
          )}
          <Logo size="md" />
        </div>

        {/* Action controls (Theme switcher & Language switcher) */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-brand-card/80 border border-brand-cardBorder text-xs font-semibold text-slate-300 hover:text-white hover:border-brand-blue/60 transition-all duration-200"
          >
            <Globe className="w-4 h-4 text-brand-blue" />
            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl bg-brand-card/80 border border-brand-cardBorder text-slate-300 hover:text-white hover:border-brand-purple transition-all duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-brand-blue" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content Card Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md sm:max-w-lg"
        >
          {(title || subtitle) && (
            <div className="text-center mb-8">
              {title && (
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm sm:text-base text-slate-400 font-medium">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {children || <Outlet />}
        </motion.div>
      </main>

      {/* Footer Copyright */}
      <footer className="relative z-20 w-full py-6 text-center text-xs text-slate-500 font-medium">
        © {new Date().getFullYear()} Naghanish. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
      </footer>
    </div>
  )
}
