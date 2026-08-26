import React from 'react'
import { ShoppingBag, Star, Zap, Lock, Sparkles, CheckCircle2, Shield, Crown } from 'lucide-react'
import { Card } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'

const ITEMS = [
  {
    id: 'i1',
    name: 'إطار العقل الخارق',
    nameEn: 'Cyber Brain Frame',
    icon: '💎',
    price: 500,
    type: 'frame',
    rarity: 'EPIC',
    rarityColor: 'text-violet-400 border-violet-500/40 bg-violet-500/20',
    owned: false,
  },
  {
    id: 'i2',
    name: 'تأثير شهاب النجوم',
    nameEn: 'Starfall Trail',
    icon: '⭐',
    price: 300,
    type: 'effect',
    rarity: 'RARE',
    rarityColor: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/20',
    owned: true,
  },
  {
    id: 'i3',
    name: 'شارة بطل الأساطير',
    nameEn: 'Mythic Legend Badge',
    icon: '🏅',
    price: 800,
    type: 'badge',
    rarity: 'LEGENDARY',
    rarityColor: 'text-amber-300 border-amber-500/40 bg-amber-500/20',
    owned: false,
  },
  {
    id: 'i4',
    name: 'خلفية المجرة النيونية',
    nameEn: 'Neon Galaxy Background',
    icon: '🌌',
    price: 1200,
    type: 'bg',
    rarity: 'MYTHIC',
    rarityColor: 'text-pink-300 border-pink-500/40 bg-pink-500/20',
    owned: false,
  },
  {
    id: 'i5',
    name: 'حزمة إيموجي الشلة',
    nameEn: 'Shilla Emoji Pack',
    icon: '🎭',
    price: 400,
    type: 'emoji',
    rarity: 'RARE',
    rarityColor: 'text-orange-400 border-orange-500/40 bg-orange-500/20',
    owned: true,
  },
  {
    id: 'i6',
    name: 'درع الانتصار الذهبي',
    nameEn: 'Victory Shield',
    icon: '🛡️',
    price: 650,
    type: 'badge',
    rarity: 'EPIC',
    rarityColor: 'text-amber-400 border-amber-500/40 bg-amber-500/20',
    owned: false,
  },
]

export const StorePage: React.FC = () => {
  const { user } = useAuthStore()
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  return (
    <div className="flex flex-col gap-8 py-4 max-w-5xl mx-auto">
      {/* ─────────────────────────────────────────────────────────────
          1. STORE BANNER
      ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#22102B] via-brand-card to-[#0F1E33] border-2 border-brand-purple/50 shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-brand-purple via-pink-600 to-amber-500 flex items-center justify-center text-4xl shadow-glow text-white shrink-0">
            🛍️
          </div>
          <div>
            <span className="px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-cyan-300 text-xs font-black">
              {isRtl ? 'المتجر الرقمي • EXCLUSIVE LOOT' : 'LOOT STORE • EXCLUSIVE'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
              {isRtl ? 'متجر عناصر نغانيش الحصرية 🛍️' : 'Naghanish Gamer Store 🛍️'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-lg mt-1">
              {isRtl
                ? 'استبدل الكوينز بإطارات أسطورية، تأثيرات حصرية، وميِّز ملفك الشخصي بين اللاعبين.'
                : 'Trade your earned coins for legendary frames, effects, and custom avatar cosmetics.'}
            </p>
          </div>
        </div>

        {/* User coins display */}
        <div className="px-5 py-3 rounded-2xl bg-black/60 border-2 border-amber-400/50 text-sm font-black text-amber-300 flex items-center gap-2.5 shadow-glow-gold shrink-0">
          <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
          <span className="text-xl text-white font-black">{user?.coins ?? 2450}</span>
          <span className="text-xs text-amber-300 uppercase font-black">COINS</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. LOOT ITEMS GRID
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ITEMS.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl p-6 bg-brand-card/90 border-2 border-brand-cardBorder hover:border-brand-purple shadow-xl hover:shadow-glow transition-all duration-300 flex flex-col justify-between items-center text-center gap-4 group"
          >
            {/* Top Rarity Badge */}
            <div className="w-full flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border ${item.rarityColor}`}>
                {item.rarity}
              </span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                {item.type}
              </span>
            </div>

            {/* Item Artwork Showcase */}
            <div className="w-20 h-20 rounded-3xl bg-brand-darkBg border-2 border-white/10 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">
              {item.icon}
            </div>

            <div>
              <h4 className="font-black text-white text-base group-hover:text-cyan-300 transition-colors">
                {isRtl ? item.name : item.nameEn}
              </h4>
            </div>

            {/* Action State */}
            {item.owned ? (
              <span className="w-full py-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/40 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isRtl ? 'عنصر مملوك ✓' : 'Owned in Inventory ✓'}</span>
              </span>
            ) : (
              <Button
                variant="accent"
                size="md"
                fullWidth
                leftIcon={<Zap className="w-4 h-4 fill-current" />}
              >
                <span>{item.price} {isRtl ? 'كوينز' : 'Coins'}</span>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
