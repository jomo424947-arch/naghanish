import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Moon, Sun, Monitor, Check } from 'lucide-react'
import { AuthLayout } from '@components/layout/AuthLayout'
import { Button } from '@components/common/Button'
import { useThemeStore, ThemeMode } from '@store/themeStore'
import { cn } from '@lib/utils'

export const ThemePage: React.FC = () => {
  const navigate = useNavigate()
  const { theme, setTheme, dir } = useThemeStore()

  const THEMES: { id: ThemeMode; title: string; titleArabic: string; icon: React.ReactNode; previewBg: string }[] = [
    {
      id: 'dark',
      title: 'Dark Theme (Official)',
      titleArabic: 'الوضع الداكن (الرسمي)',
      icon: <Moon className="w-6 h-6 text-purple-300" />,
      previewBg: 'bg-[#0B0B18] border-brand-purple/50',
    },
    {
      id: 'light',
      title: 'Light Theme',
      titleArabic: 'الوضع الفاتح',
      icon: <Sun className="w-6 h-6 text-amber-400" />,
      previewBg: 'bg-slate-100 border-slate-300 text-slate-900',
    },
    {
      id: 'system',
      title: 'System Default',
      titleArabic: 'تلقائي حسب الجهاز',
      icon: <Monitor className="w-6 h-6 text-cyan-300" />,
      previewBg: 'bg-gradient-to-r from-[#0B0B18] to-slate-200 border-cyan-400/40',
    },
  ]

  const handleNext = () => {
    navigate('/notifications-permission')
  }

  return (
    <AuthLayout
      title={dir === 'rtl' ? 'مظهر التطبيق 🎨' : 'Theme Selection 🎨'}
      subtitle={dir === 'rtl' ? 'اختر مظهر الألوان المفضلة لديك (الوضع الداكن هو الموصى به)' : 'Choose your preferred visual theme (Dark mode recommended)'}
      showBackButton={true}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          {THEMES.map((item) => {
            const isSelected = theme === item.id
            return (
              <motion.button
                key={item.id}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setTheme(item.id)}
                className={cn(
                  'w-full p-5 rounded-3xl transition-all duration-300 flex items-center justify-between text-left rtl:text-right border cursor-pointer',
                  isSelected
                    ? 'bg-brand-card border-brand-purple shadow-glow ring-2 ring-brand-purple/40'
                    : 'bg-brand-card/80 border-brand-cardBorder hover:border-slate-500'
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-brand-darkBg border border-brand-cardBorder shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {dir === 'rtl' ? item.titleArabic : item.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {item.id === 'dark' ? (dir === 'rtl' ? 'الهوية الرسمية لنغانيش' : 'Official Naghanish Look') : (dir === 'rtl' ? 'مظهر ساطع ومريح' : 'Bright interface')}
                    </p>
                  </div>
                </div>

                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-200',
                    isSelected
                      ? 'bg-brand-purple border-purple-300 text-white shadow-glow'
                      : 'border-slate-600 bg-transparent'
                  )}
                >
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </motion.button>
            )
          })}
        </div>

        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={handleNext}
          className="shadow-glow-blue mt-2"
        >
          {dir === 'rtl' ? 'تأكيد ومتابعة' : 'Confirm & Continue'}
        </Button>
      </div>
    </AuthLayout>
  )
}
