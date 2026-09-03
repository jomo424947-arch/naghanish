/**
 * ChampionsPage.tsx
 *
 * WORLD 05 — CHAMPIONS (الأبطال)
 * Prestige, Top 3 Visual Podium, Leaderboards, Cups & Trophy Glory.
 */

import React, { useState } from 'react'
import { Trophy, Crown, Swords } from 'lucide-react'
import { WorldShell } from '@components/world/WorldShell'
import { WorldHero } from '@components/world/WorldHero'
import { SEO } from '@components/common/SEO'
import { AdSlot } from '@components/common/AdSlot'
import { TopPodiumSection } from './sections/TopPodiumSection'
import { GlobalLeaderboardSection } from './sections/GlobalLeaderboardSection'
import { TournamentSection } from './sections/TournamentSection'
import { useThemeStore } from '@store/themeStore'

export const ChampionsPage: React.FC = () => {
  const { dir } = useThemeStore()
  const [activeTab, setActiveTab] = useState('all')

  const isRtl = dir === 'rtl'

  return (
    <WorldShell worldId="champions" activeTab={activeTab} onTabChange={setActiveTab}>
      <SEO
        title="عالم الأبطال | نغنِش — منصة التتويج، لوحة الصدارة والبطولات"
        description="مين هيكون رقم 1؟ نافس، ارفع ترتيبك وخذ مكانك على منصة تتويج الأبطال في نغنِش."
        keywords={['عالم الابطال', 'لوحة الصدارة', 'بطولات', 'ترتيب اللاعبين']}
      />

      {/* 1. Champions Hero */}
      <WorldHero
        worldId="champions"
        title={isRtl ? 'عرش الأبطال' : 'CHAMPIONS THRONE'}
        subtitle={isRtl ? 'مين هيكون رقم 1؟ نافس وخذ مكانك على المنصة الذهبية 🏆' : 'Who will claim #1? Rise through ranks and claim the golden podium 🏆'}
        description={
          isRtl
            ? 'ساحة المنافسة المفتوحة لكبار اللاعبين، بطولات أسبوعية كبرى، وجوائز نقدية وأوسمة فخرية تخلد اسمك في تاريخ نغنِش.'
            : 'Prestige brackets, global leaderboard showdowns and championship trophies for elite gamers.'
        }
        primaryActionLabel={isRtl ? 'نافس على المنصة 🏆' : 'Join Championship 🏆'}
        onPrimaryAction={() => setActiveTab('tournaments')}
        secondaryActionLabel={isRtl ? 'لوحة الصدارة العامة 👑' : 'Leaderboard 👑'}
        onSecondaryAction={() => setActiveTab('global')}
        stats={[
          {
            label: isRtl ? 'المتنافسين هذا الأسبوع' : 'Active Contenders',
            value: '18,400+',
            icon: <Swords className="w-3.5 h-3.5 text-amber-400" />,
          },
          {
            label: isRtl ? 'مجموع جوائز الكأس' : 'Prize Pool',
            value: '100,000 XP',
            icon: <Trophy className="w-3.5 h-3.5 text-yellow-400" />,
          },
        ]}
      />

      {/* 2. Top 3 Visual Podium */}
      {(activeTab === 'all' || activeTab === 'all') && <TopPodiumSection />}

      {/* 3. Tournament Highlight */}
      {(activeTab === 'all' || activeTab === 'tournaments') && <TournamentSection />}

      {/* 4. Global Leaderboard */}
      {(activeTab === 'all' || activeTab === 'global') && <GlobalLeaderboardSection />}

      {/* 5. World Themed Ad Slot */}
      <AdSlot
        worldId="champions"
        variant="in-feed"
        sponsorName="نغنِش شامبيون باس VIP 👑"
        adText="ضاعف نقاط الـ XP في تصفيات البطولات واحصل على شارة ذهبية متوهجة بجانب اسمك في لوحة الصدارة!"
        adTextEn="Double Tournament XP multipliers and permanent glowing crown badge on leaderboards!"
      />
    </WorldShell>
  )
}
