import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Home, RotateCcw } from 'lucide-react'
import { Card } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { SEO } from '@components/common/SEO'
import { ROUTES } from '@constants/routes'
import { useThemeStore } from '@store/themeStore'

export function ServerErrorPage() {
  const navigate = useNavigate()
  const { dir } = useThemeStore()

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <SEO title="خطأ في السيرفر 500 | نغنِش" description="حدث خطأ غير متوقع في السيرفر. قمنا بتسجيل الخلل وجاري العمل على إصلاحه." />

      <Card variant="glowing" glowColor="orange" className="p-8 sm:p-12 max-w-lg w-full text-center flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500 to-amber-600 flex items-center justify-center text-4xl shadow-glow">
          <AlertTriangle className="w-10 h-10 text-white" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black uppercase tracking-wider border border-rose-500/30">
            Error 500
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-3">
            {dir === 'rtl' ? 'عذراً! حدث خطأ في السيرفر 🤖' : 'Oops! Server Error 🤖'}
          </h1>
          <p className="text-sm text-slate-300 font-medium mt-2 leading-relaxed">
            {dir === 'rtl'
              ? 'واجه النظام مشكلة مؤقتة أثناء معالجة طلبك. تم إبلاغ فريق الدعم وجاري الإصلاح.'
              : 'Our system encountered an unexpected issue. Our team has been notified.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => window.location.reload()}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            {dir === 'rtl' ? 'إعادة المحاولة' : 'Retry'}
          </Button>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => navigate(ROUTES.HOME)}
            leftIcon={<Home className="w-4 h-4" />}
          >
            {dir === 'rtl' ? 'الرئيسية' : 'Back Home'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
