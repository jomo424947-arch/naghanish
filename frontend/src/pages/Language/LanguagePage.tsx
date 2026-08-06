import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '@components/layout/AuthLayout'
import { LanguageCard } from '@components/common/LanguageCard'
import { Button } from '@components/common/Button'
import { useThemeStore } from '@store/themeStore'

export const LanguagePage: React.FC = () => {
  const navigate = useNavigate()
  const { language, setLanguage, dir } = useThemeStore()

  const handleSelectLanguage = (lang: 'ar' | 'en') => {
    setLanguage(lang)
  }

  const handleNext = () => {
    navigate('/theme')
  }

  return (
    <AuthLayout
      title={dir === 'rtl' ? 'اختيار اللغة 🌐' : 'Select Language 🌐'}
      subtitle={dir === 'rtl' ? 'اختر لغة التطبيق المفضلة لديك' : 'Choose your preferred language for the application'}
      showBackButton={true}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <LanguageCard
            id="ar"
            name="Arabic"
            nativeName="العربية"
            flag="🇸🇦"
            dirText="من اليمين لليسار (RTL)"
            selected={language === 'ar'}
            onClick={() => handleSelectLanguage('ar')}
          />

          <LanguageCard
            id="en"
            name="English"
            nativeName="English (US)"
            flag="🇺🇸"
            dirText="Left to Right (LTR)"
            selected={language === 'en'}
            onClick={() => handleSelectLanguage('en')}
          />
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleNext}
          className="shadow-glow mt-2"
        >
          {dir === 'rtl' ? 'تأكيد ومتابعة' : 'Confirm & Continue'}
        </Button>
      </div>
    </AuthLayout>
  )
}
