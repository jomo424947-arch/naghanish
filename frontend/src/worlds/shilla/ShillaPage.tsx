/**
 * ShillaPage.tsx
 *
 * WORLD 01 — SHILLA (الشلة)
 * Social, Friends, Multiplayer Live Rooms & Party Lounge.
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Radio, Users } from 'lucide-react'
import { WorldShell } from '@components/world/WorldShell'
import { WorldHero } from '@components/world/WorldHero'
import { SEO } from '@components/common/SEO'
import { AdSlot } from '@components/common/AdSlot'
import { LIVE_ROOMS } from '@data/games.data'
import { LiveRoomsSection } from './sections/LiveRoomsSection'
import { ShillaFriendsSection } from './sections/ShillaFriendsSection'
import { ShillaGamesSection } from './sections/ShillaGamesSection'
import { CreateRoomModal } from './components/CreateRoomModal'
import { useThemeStore } from '@store/themeStore'

export const ShillaPage: React.FC = () => {
  const navigate = useNavigate()
  const { dir } = useThemeStore()
  const [activeTab, setActiveTab] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const isRtl = dir === 'rtl'

  const handleJoinRoom = (code: string) => {
    navigate(`/party/lobby/${code.toUpperCase()}`)
  }

  const handleCreateRoomSubmit = (roomData: { name: string; maxPlayers: number; isPrivate: boolean }) => {
    const generatedCode = 'SH' + Math.floor(1000 + Math.random() * 9000)
    setShowCreateModal(false)
    navigate(`/party/lobby/${generatedCode}`)
  }

  return (
    <WorldShell worldId="shilla" activeTab={activeTab} onTabChange={setActiveTab}>
      <SEO
        title="عالم الشِلّة | نغنِش — غرف اللعب الجماعية والوناسة"
        description="ادخل مع أصحابك في غرف لعب تفاعلية حية، تحديات أسئلة سريعة وضحك لا ينتهي في عالم الشلة."
        keywords={['عالم الشلة', 'العاب جماعية', 'غرف لايف', 'تحديات اونلاين']}
      />

      {/* 1. Shilla Hero */}
      <WorldHero
        worldId="shilla"
        title={isRtl ? 'عالم الشِلّة' : 'SHILLA WORLD'}
        subtitle={isRtl ? 'اللعب أحلى لما تكونوا سوا! ادخل مع أصحابك أو أنشئ غرفتكم' : 'Gaming is better together! Join your crew or create a room'}
        description={
          isRtl
            ? 'صالة ألعاب جماعية حية، غرف تفاعلية فورية، وتحديات صوتية وسريعة مصممة للضحك والمنافسة الودية.'
            : 'Live party multiplayer rooms, real-time interactive challenges built for endless fun.'
        }
        primaryActionLabel={isRtl ? 'أنشئ غرفة جديدة ✨' : 'Create Room ✨'}
        onPrimaryAction={() => setShowCreateModal(true)}
        secondaryActionLabel={isRtl ? 'العب عشوائي 🎲' : 'Quick Match 🎲'}
        onSecondaryAction={() => handleJoinRoom(LIVE_ROOMS[0]?.code || 'SHILLA99')}
        stats={[
          {
            label: isRtl ? 'غرف نشطة الآن' : 'Active Rooms',
            value: '42 غرفة',
            icon: <Radio className="w-3.5 h-3.5 text-orange-400 animate-pulse" />,
          },
          {
            label: isRtl ? 'لاعبين أونلاين' : 'Online Players',
            value: '1,420+',
            icon: <Users className="w-3.5 h-3.5 text-cyan-400" />,
          },
        ]}
      />

      {/* 2. Friends Online Section */}
      {(activeTab === 'all' || activeTab === 'friends') && (
        <ShillaFriendsSection onJoinRoom={handleJoinRoom} />
      )}

      {/* 3. Live Rooms Section */}
      {(activeTab === 'all' || activeTab === 'rooms') && (
        <LiveRoomsSection onJoinRoom={handleJoinRoom} onCreateRoom={() => setShowCreateModal(true)} />
      )}

      {/* 4. Party Games Section */}
      {(activeTab === 'all' || activeTab === 'games') && <ShillaGamesSection />}

      {/* 5. World Themed Ad Slot */}
      <AdSlot
        worldId="shilla"
        variant="in-feed"
        sponsorName="نغنِش شِلّة VIP 🎉"
        adText="أنشئ غرفاً خاصة غير محدودة حتى 30 لاعباً مع ميزات الصوت الحصري!"
        adTextEn="Create unlimited private rooms for up to 30 players with exclusive voice perks!"
      />

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateRoomSubmit}
      />
    </WorldShell>
  )
}
