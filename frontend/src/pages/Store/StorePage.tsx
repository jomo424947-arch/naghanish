import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Star, Zap, Lock, Sparkles, CheckCircle2, Shield, Crown, AlertCircle } from 'lucide-react'
import { Button } from '@components/common/Button'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'

interface StoreItem {
  id: string
  name: string
  nameEn: string
  icon: string
  price: number
  category: 'avatar' | 'frame' | 'effect' | 'badge' | 'sound'
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  rarityColor: string
  owned: boolean
  isEquipped?: boolean
}

const INITIAL_STORE_ITEMS: StoreItem[] = [
  {
    id: 'i1',
    name: 'إطار العقل الخارق النيوني',
    nameEn: 'Cyber Brain Neon Frame',
    icon: '💎',
    price: 500,
    category: 'frame',
    rarity: 'EPIC',
    rarityColor: 'text-violet-400 border-violet-500/40 bg-violet-500/20',
    owned: false,
  },
  {
    id: 'i2',
    name: 'تأثير شهاب النجوم والبرق',
    nameEn: 'Starfall Lightning Trail',
    icon: '⭐',
    price: 300,
    category: 'effect',
    rarity: 'RARE',
    rarityColor: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/20',
    owned: false,
    isEquipped: false,
  },
  {
    id: 'i3',
    name: 'شارة بطل الأساطير الذهبية',
    nameEn: 'Mythic Legend Gold Badge',
    icon: '🏅',
    price: 800,
    category: 'badge',
    rarity: 'LEGENDARY',
    rarityColor: 'text-amber-300 border-amber-500/40 bg-amber-500/20',
    owned: false,
  },
  {
    id: 'i4',
    name: 'أفاتار النمر السايبربانك',
    nameEn: 'Cyber Tiger Avatar',
    icon: '🐯',
    price: 650,
    category: 'avatar',
    rarity: 'EPIC',
    rarityColor: 'text-pink-300 border-pink-500/40 bg-pink-500/20',
    owned: false,
  },
  {
    id: 'i5',
    name: 'حزمة إيموجي ومؤثرات الشلة',
    nameEn: 'Shilla Live Emoji Pack',
    icon: '🎭',
    price: 400,
    category: 'sound',
    rarity: 'RARE',
    rarityColor: 'text-orange-400 border-orange-500/40 bg-orange-500/20',
    owned: false,
    isEquipped: false,
  },
  {
    id: 'i6',
    name: 'تاج العرش الذهبي الملكي',
    nameEn: 'Royal Golden Crown',
    icon: '👑',
    price: 1500,
    category: 'frame',
    rarity: 'LEGENDARY',
    rarityColor: 'text-amber-400 border-amber-500/40 bg-amber-500/20',
    owned: false,
  },
  {
    id: 'i7',
    name: 'أفاتار الروبوت الذكي نغنِش AI',
    nameEn: 'Naghanish AI Bot Avatar',
    icon: '🤖',
    price: 450,
    category: 'avatar',
    rarity: 'RARE',
    rarityColor: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/20',
    owned: false,
  },
  {
    id: 'i8',
    name: 'درع الحماية والتحدي الأسطوري',
    nameEn: 'Mythic Victory Aegis',
    icon: '🛡️',
    price: 900,
    category: 'badge',
    rarity: 'EPIC',
    rarityColor: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/20',
    owned: false,
  },
]

export const StorePage: React.FC = () => {
  const { user, updateProfile } = useAuthStore()
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  const [items, setItems] = useState<StoreItem[]>(INITIAL_STORE_ITEMS)
  const [selectedCat, setSelectedCat] = useState<string>('all')
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const currentCoins = user?.coins ?? 100

  const handleBuyItem = (item: StoreItem) => {
    if (currentCoins < item.price) {
      setMsg({
        type: 'error',
        text: isRtl ? 'رصيد الكوينز غير كافٍ! العب واكسب المزيد من التحديات 🎮' : 'Not enough coins! Play more to earn coins 🎮',
      })
      setTimeout(() => setMsg(null), 3500)
      return
    }

    // Deduct coins
    updateProfile({
      coins: currentCoins - item.price,
    })

    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, owned: true, isEquipped: true } : i))
    )

    setMsg({
      type: 'success',
      text: isRtl ? `مبروك! تم شراء "${item.name}" وتجهيزها في حسابك 🎉` : `Purchased & equipped "${item.nameEn}"! 🎉`,
    })
    setTimeout(() => setMsg(null), 3500)
  }

  const handleToggleEquip = (item: StoreItem) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, isEquipped: !i.isEquipped } : i
      )
    )
  }

  const filteredItems = items.filter(
    (i) => selectedCat === 'all' || i.category === selectedCat
  )

  return (
    <div className="flex flex-col gap-8 py-4 max-w-5xl mx-auto pb-24">
      {/* 1. STORE BANNER */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#22102B] via-brand-card to-[#0F1E33] border-2 border-brand-purple/50 shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-brand-purple via-pink-600 to-amber-500 flex items-center justify-center text-4xl shadow-glow text-white shrink-0">
            🛍️
          </div>
          <div>
            <span className="px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-cyan-300 text-xs font-black">
              {isRtl ? 'المتجر والعناصر الحصرية • EXCLUSIVE LOOT' : 'LOOT STORE • EXCLUSIVE'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
              {isRtl ? 'متجر عناصر ومقتنيات نغنِش 🛍️' : 'Naghanish Gamer Store 🛍️'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-lg mt-1">
              {isRtl
                ? 'استبدل الكوينز بإطارات أسطورية، أفاتارات حصرية، وميِّز ملفك الشخصي بين اللاعبين.'
                : 'Trade your earned coins for legendary frames, effects, and custom avatar cosmetics.'}
            </p>
          </div>
        </div>

        {/* User coins display */}
        <div className="px-5 py-3 rounded-2xl bg-black/60 border-2 border-amber-400/50 text-sm font-black text-amber-300 flex items-center gap-2.5 shadow-glow-gold shrink-0">
          <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
          <span className="text-xl text-white font-black">{currentCoins.toLocaleString()}</span>
          <span className="text-xs text-amber-300 uppercase font-black">{isRtl ? 'عملة' : 'COINS'}</span>
        </div>
      </div>

      {/* Message notification */}
      <AnimatePresence>
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl border-2 text-sm font-black flex items-center gap-3 ${
              msg.type === 'success'
                ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-200'
                : 'bg-red-500/20 border-red-400/60 text-red-200'
            }`}
          >
            {msg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span>{msg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
        {[
          { id: 'all', labelAr: 'الكل 🛍️', labelEn: 'All' },
          { id: 'avatar', labelAr: 'الأفاتارات 👤', labelEn: 'Avatars' },
          { id: 'frame', labelAr: 'الإطارات والتاج 👑', labelEn: 'Frames' },
          { id: 'effect', labelAr: 'المؤثرات ⭐', labelEn: 'Effects' },
          { id: 'badge', labelAr: 'الأوسمة 🏅', labelEn: 'Badges' },
          { id: 'sound', labelAr: 'الحزم والأصوات 🎭', labelEn: 'Packs' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCat(tab.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 ${
              selectedCat === tab.id
                ? 'bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-glow'
                : 'bg-brand-card text-slate-400 hover:text-white border border-brand-cardBorder'
            }`}
          >
            {isRtl ? tab.labelAr : tab.labelEn}
          </button>
        ))}
      </div>

      {/* 3. LOOT ITEMS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl p-5 bg-brand-card/90 border-2 border-brand-cardBorder hover:border-brand-purple shadow-xl hover:shadow-glow transition-all duration-300 flex flex-col justify-between items-center text-center gap-4 group"
          >
            {/* Top Rarity Badge */}
            <div className="w-full flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black border ${item.rarityColor}`}>
                {item.rarity}
              </span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                {item.category}
              </span>
            </div>

            {/* Item Artwork Showcase */}
            <div className="w-20 h-20 rounded-3xl bg-brand-darkBg border-2 border-white/10 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">
              {item.icon}
            </div>

            <div>
              <h4 className="font-black text-white text-sm group-hover:text-cyan-300 transition-colors">
                {isRtl ? item.name : item.nameEn}
              </h4>
            </div>

            {/* Action State */}
            {item.owned ? (
              <Button
                variant={item.isEquipped ? 'primary' : 'secondary'}
                size="sm"
                fullWidth
                onClick={() => handleToggleEquip(item)}
              >
                {item.isEquipped
                  ? (isRtl ? 'مُجهّز حالياً ✓' : 'Equipped ✓')
                  : (isRtl ? 'تجهيز العنصر' : 'Equip')}
              </Button>
            ) : (
              <Button
                variant="gold"
                size="sm"
                fullWidth
                onClick={() => handleBuyItem(item)}
                leftIcon={<Zap className="w-3.5 h-3.5 fill-current" />}
              >
                <span>{item.price} {isRtl ? 'عملة' : 'Coins'}</span>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
