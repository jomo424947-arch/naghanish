/**
 * ArcadePage.tsx
 *
 * WORLD 02 — ARCADE (الأركيد)
 * Retro Arcade Cabinets, High Scores, Pixel Atmosphere & Competitive Solos.
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy, Zap } from 'lucide-react'
import { WorldShell } from '@components/world/WorldShell'
import { WorldHero } from '@components/world/WorldHero'
import { SEO } from '@components/common/SEO'
import { AdSlot } from '@components/common/AdSlot'
import { getGamesByWorld } from '@data/games.data'
import { ArcadeCabinetGrid } from './sections/ArcadeCabinetGrid'
import { HighScoresSection } from './sections/HighScoresSection'
import { useThemeStore } from '@store/themeStore'

export const ArcadePage: React.FC = () => {
  const navigate = useNavigate()
  const { dir } = useThemeStore()
  const [activeTab, setActiveTab] = useState('all')

  const isRtl = dir === 'rtl'
  const arcadeGames = getGamesByWorld('arcade')
  const featuredArcade = arcadeGames[0]

  const handlePlayGame = (route: string) => {
    navigate(route)
  }

  return (
    <WorldShell worldId="arcade" activeTab={activeTab} onTabChange={setActiveTab}>
      <SEO
        title="عالم الأركيد | نغنِش — كابينات ألعاب النيون والأرقام القياسية"
        description="عش أجواء كابينات الأركيد الكلاسيكية، حطم الأرقام القياسية واجمع أعلى نقاط الـ XP في عالم الأركيد."
        keywords={['عالم الأركيد', 'العاب اركيد', 'العاب كلاسيكية', 'ارقام قياسية']}
      />

      {/* 1. Arcade Hero */}
      <WorldHero
        worldId="arcade"
        title={isRtl ? 'عالم الأركيد' : 'ARCADE WORLD'}
        subtitle={isRtl ? 'اضرب الرقم القياسي وعش حماس كابينات النيون 🕹️' : 'Beat legendary high scores in neon retro cabinets 🕹️'}
        description={
          isRtl
            ? 'كابينات ألعاب كلاسيكية وتحديات فردية مصممة لاختبار مهارتك، سرعتك الذهنية، وكسر الأرقام القياسية العالمية.'
            : 'Retro pixel arcade machines engineered for high score chasers and competitive gaming masters.'
        }
        primaryActionLabel={isRtl ? 'العب الكابينة المميزة 🕹️' : 'Play Featured Cabinet 🕹️'}
        onPrimaryAction={() => handlePlayGame(featuredArcade?.route || '/games/g1')}
        secondaryActionLabel={isRtl ? 'لوحة الأرقام القياسية ⚡' : 'High Scores ⚡'}
        onSecondaryAction={() => setActiveTab('high-scores')}
        stats={[
          {
            label: isRtl ? 'كابينات جاهزة' : 'Active Cabinets',
            value: `${arcadeGames.length} ألعاب`,
            icon: <Zap className="w-3.5 h-3.5 text-cyan-400" />,
          },
          {
            label: isRtl ? 'أعلى رقم مسجل' : 'Global Hi-Score',
            value: '9,450 PTS',
            icon: <Trophy className="w-3.5 h-3.5 text-amber-400" />,
          },
        ]}
      />

      {/* 2. High Scores Section */}
      {(activeTab === 'all' || activeTab === 'high-scores') && <HighScoresSection />}

      {/* 3. Arcade Cabinet Grid */}
      <ArcadeCabinetGrid filterType={activeTab} onPlayGame={handlePlayGame} />

      {/* 4. Themed Ad Unit */}
      <AdSlot
        worldId="arcade"
        variant="in-feed"
        sponsorName="نغنِش أركيد Pass 🕹️"
        adText="العب في جميع كابينات الأركيد بدون انتظار واكسب 2x من كوينز الأركيد!"
        adTextEn="Unlimited tokens on all arcade cabinets plus 2x Coin multipliers!"
      />
    </WorldShell>
  )
}
