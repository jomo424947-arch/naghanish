import React from 'react'
import { ShoppingBag, Star, Zap, Lock } from 'lucide-react'
import { SectionTitle } from '@components/common/SectionTitle'
import { Card } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'

const ITEMS = [
  { id: 'i1', name: 'قفص الذكاء الخارق', nameEn: 'Super Brain Frame', icon: '💎', price: 500, type: 'frame', owned: false },
  { id: 'i2', name: 'تأثير النجوم', nameEn: 'Star Effect', icon: '⭐', price: 300, type: 'effect', owned: true },
  { id: 'i3', name: 'شارة الأسطورة', nameEn: 'Legend Badge', icon: '🏅', price: 800, type: 'badge', owned: false },
  { id: 'i4', name: 'خلفية الكون', nameEn: 'Galaxy Background', icon: '🌌', price: 1200, type: 'bg', owned: false },
  { id: 'i5', name: 'إيموجي مخصص', nameEn: 'Custom Emoji Pack', icon: '🎭', price: 400, type: 'emoji', owned: true },
  { id: 'i6', name: 'درع الانتصار', nameEn: 'Victory Shield', icon: '🛡️', price: 650, type: 'badge', owned: false },
]

export const StorePage: React.FC = () => {
  const { user } = useAuthStore()
  const { dir } = useThemeStore()

  return (
    <div className="flex flex-col gap-8 py-4">
      <SectionTitle
        title={dir === 'rtl' ? 'متجر نغانيش 🛍️' : 'Naghanish Store 🛍️'}
        subtitle={dir === 'rtl' ? 'اشترِ عناصر حصرية وميّز ملفك الشخصي' : 'Get exclusive items and customize your profile'}
        icon={<ShoppingBag className="w-5 h-5" />}
        action={
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-card border border-brand-cardBorder text-sm font-black">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-white">{user?.coins ?? 2350}</span>
            <span className="text-slate-400 text-xs">Coins</span>
          </div>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {ITEMS.map((item) => (
          <Card key={item.id} variant="glowing" glowColor="orange" className="flex flex-col items-center text-center gap-3 p-5">
            <div className="w-16 h-16 rounded-2xl bg-brand-darkBg border border-brand-cardBorder flex items-center justify-center text-3xl">
              {item.icon}
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm leading-tight">{dir === 'rtl' ? item.name : item.nameEn}</h4>
              <p className="text-[10px] text-slate-400 font-medium capitalize mt-0.5">{item.type}</p>
            </div>
            {item.owned ? (
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                {dir === 'rtl' ? 'مملوك ✓' : 'Owned ✓'}
              </span>
            ) : (
              <Button variant="accent" size="sm" leftIcon={<Zap className="w-3.5 h-3.5" />}>
                {item.price}
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
