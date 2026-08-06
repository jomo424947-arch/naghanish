import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowRight, ArrowLeft } from 'lucide-react'
import { AuthLayout } from '@components/layout/AuthLayout'
import { Button } from '@components/common/Button'
import { ROUTES } from '@constants/routes'
import { useThemeStore } from '@store/themeStore'

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()
  const { dir } = useThemeStore()

  return (
    <AuthLayout>
      <div className="p-8 rounded-3xl bg-brand-card/90 border border-brand-cardBorder shadow-2xl backdrop-blur-xl text-center flex flex-col items-center gap-6">
        {/* Animated 404 Mascot Graphic Frame */}
        <motion.div
          initial={{ scale: 0.8, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="relative"
        >
          <div className="w-36 h-36 rounded-4xl bg-gradient-to-br from-brand-purple via-brand-card to-brand-blue border-4 border-brand-purple/40 flex items-center justify-center shadow-2xl">
            <span className="text-5xl font-black bg-gradient-to-r from-amber-400 via-white to-cyan-300 bg-clip-text text-transparent">
              404
            </span>
          </div>
          <div className="absolute -bottom-2 px-4 py-1 rounded-full bg-brand-orange text-white text-xs font-black shadow-md">
            Lost In Game Zone!
          </div>
        </motion.div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {dir === 'rtl' ? 'عذراً! الصفحة غير موجودة' : 'Oops! Page Not Found'}
          </h2>
          <p className="text-sm text-slate-300 font-medium mt-2 max-w-sm">
            {dir === 'rtl'
              ? 'يبدو أن الصفحة التي تحاول الوصول إليها قد تم نقلها أو غير موجودة في الخريطة.'
              : 'The page you are looking for does not exist or has been moved.'}
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate(ROUTES.HOME)}
          leftIcon={<Home className="w-5 h-5" />}
          className="shadow-glow mt-2"
        >
          {dir === 'rtl' ? 'العودة للصفحة الرئيسية' : 'Back to Home'}
        </Button>
      </div>
    </AuthLayout>
  )
}
