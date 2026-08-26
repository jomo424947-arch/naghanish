/**
 * ChaosPage.tsx
 *
 * WORLD 06 — CHAOS (عالم الفوضى)
 * Random Challenge Button, Daily Madness, Crazy Modifiers & Roulette.
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shuffle, Sparkles, Flame } from 'lucide-react'
import { WorldShell } from '@components/world/WorldShell'
import { WorldHero } from '@components/world/WorldHero'
import { SEO } from '@components/common/SEO'
import { AdSlot } from '@components/common/AdSlot'
import { GiantRandomButton } from './components/GiantRandomButton'
import { RouletteWheelModal } from './components/RouletteWheelModal'
import { DailyMadnessSection } from './sections/DailyMadnessSection'
import { ChaosChallengesSection } from './sections/ChaosChallengesSection'
import { useThemeStore } from '@store/themeStore'

export const ChaosPage: React.FC = () => {
  const navigate = useNavigate()
  const { dir } = useThemeStore()
  const [activeTab, setActiveTab] = useState('all')
  const [showRoulette, setShowRoulette] = useState(false)

  const isRtl = dir === 'rtl'

  const handleLaunchGame = (route: string) => {
    navigate(route)
  }

  return (
    <WorldShell worldId="chaos" activeTab={activeTab} onTabChange={setActiveTab}>
      <SEO
        title="عالم الفوضى | نغنِش — تحديات مجنونة، روليت عشوائي وجنون يومي"
        description="مش عارف إيه اللي مستنيك؟ ولا إحنا! ادخل عالم الفوضى، اضغط الزر العشوائي واقبل أغرب التحديات."
        keywords={['عالم الفوضى', 'تحديات عشوائية', 'العاب مجنونة', 'روليت']}
      />

      {/* 1. Chaos Hero */}
      <WorldHero
        worldId="chaos"
        title={isRtl ? 'عالم الفوضى' : 'CHAOS UNIVERSE'}
        subtitle={isRtl ? 'مش عارف إيه اللي مستنيك؟ ولا إحنا 🤪' : 'Unpredictable, crazy, and non-stop madness 🤪'}
        description={
          isRtl
            ? 'القاعدة الوحيدة هنا هي أنه لا توجد قواعد! تحديات غير متوقعة، معدلات مجنونة تقلب الشاشة وتغير مسار اللعب في كل ثانية.'
            : 'Embrace total randomness with crazy gameplay twists and hilarious surprise conditions.'
        }
        primaryActionLabel={isRtl ? '؟ ماذا ستلعب؟ (روليت) 🎲' : 'Spin Chaos Roulette 🎲'}
        onPrimaryAction={() => setShowRoulette(true)}
        secondaryActionLabel={isRtl ? 'جنون اليوم 🔥' : 'Daily Madness 🔥'}
        onSecondaryAction={() => setActiveTab('madness')}
        stats={[
          {
            label: isRtl ? 'تحديات مجنونة' : 'Chaotic Streaks',
            value: '39.5k+',
            icon: <Flame className="w-3.5 h-3.5 text-lime-400" />,
          },
          {
            label: isRtl ? 'نسبة المفاجأة' : 'Randomness Level',
            value: '100% 🤪',
            icon: <Sparkles className="w-3.5 h-3.5 text-yellow-400" />,
          },
        ]}
      />

      {/* 2. GIANT RANDOM BUTTON (Hero Core Feature) */}
      <GiantRandomButton onSpin={() => setShowRoulette(true)} />

      {/* 3. Daily Madness Event Banner */}
      {(activeTab === 'all' || activeTab === 'madness') && <DailyMadnessSection />}

      {/* 4. Chaos Challenges Grid with Tilted Cards */}
      <ChaosChallengesSection onPlayChallenge={() => setShowRoulette(true)} />

      {/* 5. World Themed Ad Slot */}
      <AdSlot
        worldId="chaos"
        variant="in-feed"
        sponsorName="نغنِش فوضى VIP 🤪"
        adText="افتح جميع معدلات الفوضى السرية واصنع تحدياتك المجنونة الخاصة وشاركها مع أصحابك!"
        adTextEn="Unlock secret chaos modifiers and create custom wacky challenges for your friends!"
      />

      {/* Roulette Wheel Modal */}
      <RouletteWheelModal
        isOpen={showRoulette}
        onClose={() => setShowRoulette(false)}
        onLaunchGame={handleLaunchGame}
      />
    </WorldShell>
  )
}
