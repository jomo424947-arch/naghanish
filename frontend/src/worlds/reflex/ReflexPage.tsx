/**
 * ReflexPage.tsx
 *
 * WORLD 04 — REFLEX (ردة الفعل)
 * Speed Arena, Sub-Millisecond Precision, Timing Challenges & Personal Bests.
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Flame } from 'lucide-react'
import { WorldShell } from '@components/world/WorldShell'
import { WorldHero } from '@components/world/WorldHero'
import { SEO } from '@components/common/SEO'
import { AdSlot } from '@components/common/AdSlot'
import { getGamesByWorld } from '@data/games.data'
import { SpeedMetricHero } from './components/SpeedMetricHero'
import { SpeedChallengeSection } from './sections/SpeedChallengeSection'
import { RecentAttemptsSection } from './sections/RecentAttemptsSection'
import { useThemeStore } from '@store/themeStore'

export const ReflexPage: React.FC = () => {
  const navigate = useNavigate()
  const { dir } = useThemeStore()
  const [activeTab, setActiveTab] = useState('all')

  const isRtl = dir === 'rtl'
  const reflexGames = getGamesByWorld('reflex')
  const featuredReflex = reflexGames[0]

  const handlePlayTest = (route: string) => {
    navigate(route)
  }

  return (
    <WorldShell worldId="reflex" activeTab={activeTab} onTabChange={setActiveTab}>
      <SEO
        title="عالم ردة الفعل | نغنِش — اختبارات السرعة الخاطفة بالمللي ثانية"
        description="هل أنت أسرع من أصحابك؟ اختبر سرعة استجابتك بالمللي ثانية، نافس على الأرقام القياسية في حلبة ردة الفعل."
        keywords={['ردة الفعل', 'سرعة الاستجابة', 'اختبار سرعة', 'مللي ثانية']}
      />

      {/* 1. Reflex Speed Hero */}
      <WorldHero
        worldId="reflex"
        title={isRtl ? 'حلبة ردة الفعل' : 'REFLEX SPEED ARENA'}
        subtitle={isRtl ? 'السرعة هي السلاح.. بالمللي ثانية ⚡' : 'Pure sub-millisecond reaction speed against time ⚡'}
        description={
          isRtl
            ? 'اضغط، تحرك، واستجب في أجزاء من الثانية! حلبة تنافسية شرسة لا مجال فيها للتردد أو التأخير.'
            : 'Uncompromising reaction timing challenges measuring split-second instincts.'
        }
        primaryActionLabel={isRtl ? 'بدء سباق السرعة الخاطف ⚡' : 'Launch Speed Test ⚡'}
        onPrimaryAction={() => handlePlayTest(featuredReflex?.route || '/games/g2')}
        secondaryActionLabel={isRtl ? 'أرقامك القياسية ⏱️' : 'My Records ⏱️'}
        onSecondaryAction={() => setActiveTab('records')}
        stats={[
          {
            label: isRtl ? 'أفضل زمن شخصي' : 'Personal Best',
            value: '187 ms',
            icon: <Zap className="w-3.5 h-3.5 text-red-400" />,
          },
          {
            label: isRtl ? 'المحاولات اليومية' : 'Daily Sprints',
            value: '52.1k',
            icon: <Flame className="w-3.5 h-3.5 text-orange-400" />,
          },
        ]}
      />

      {/* 2. Hero Millisecond Counters */}
      <SpeedMetricHero />

      {/* 3. Speed Reaction Challenges Grid */}
      <SpeedChallengeSection onPlayTest={handlePlayTest} />

      {/* 4. Recent Attempts History */}
      {(activeTab === 'all' || activeTab === 'history') && <RecentAttemptsSection />}

      {/* 5. World Themed Ad Slot */}
      <AdSlot
        worldId="reflex"
        variant="in-feed"
        sponsorName="نغنِش نيترو سبيد ⚡"
        adText="ضاعف سرعة محاولاتك بدون أي زمن انتظار بين الجولات واكسب أوسمة السرعة النارية!"
        adTextEn="Zero cooldown retry passes and fire reflex multiplier bonuses!"
      />
    </WorldShell>
  )
}
