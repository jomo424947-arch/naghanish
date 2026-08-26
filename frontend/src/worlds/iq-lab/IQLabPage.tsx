/**
 * IQLabPage.tsx
 *
 * WORLD 03 — IQ LAB (مختبر الذكاء)
 * Brain Tests, Cognitive Agility, Personality Analysis & Mind Map.
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, Activity } from 'lucide-react'
import { WorldShell } from '@components/world/WorldShell'
import { WorldHero } from '@components/world/WorldHero'
import { SEO } from '@components/common/SEO'
import { AdSlot } from '@components/common/AdSlot'
import { IQ_QUIZZES } from '@data/games.data'
import { CognitiveJourneySection } from './sections/CognitiveJourneySection'
import { IQTestsSection } from './sections/IQTestsSection'
import { IQBrainGamesSection } from './sections/IQBrainGamesSection'
import { useThemeStore } from '@store/themeStore'

export const IQLabPage: React.FC = () => {
  const navigate = useNavigate()
  const { dir } = useThemeStore()
  const [activeTab, setActiveTab] = useState('all')

  const isRtl = dir === 'rtl'
  const featuredQuiz = IQ_QUIZZES[1] // Executive scale or IQ

  const handleStartQuiz = (route: string) => {
    navigate(route)
  }

  return (
    <WorldShell worldId="iqlab" activeTab={activeTab} onTabChange={setActiveTab}>
      <SEO
        title="مختبر الذكاء | نغنِش — اختبارات الذكاء، الشخصية والخريطة الذهنية"
        description="اختبر قدرات عقلك، اكتشف نمط تفكيرك وشخصيتك القيادية، وحل ألغاز المنطق في مختبر الذكاء."
        keywords={['مختبر الذكاء', 'اختبار ذكاء', 'اختبار شخصية', 'العاب منطق']}
      />

      {/* 1. IQ Lab Hero */}
      <WorldHero
        worldId="iqlab"
        title={isRtl ? 'مختبر الذكاء' : 'IQ LAB WORLD'}
        subtitle={isRtl ? 'اختبر عقلك واكتشف خريطتك الذهنية الحقيقية 🧪' : 'Unlock cognitive prowess and discover your dominant mind map 🧪'}
        description={
          isRtl
            ? 'مختبر تفاعلي للقياس الإدراكي، اختبارات دقيقة للشخصية وأنماط التفكير، وألعاب منطقية تحفز سرعة المعالجة والذكاء التحليلي.'
            : 'Scientific cognitive assessments, neuro-agility challenges, and personality mapping built for sharp minds.'
        }
        primaryActionLabel={isRtl ? 'بدء الاختبار الشامل 🧠' : 'Start Assessment 🧠'}
        onPrimaryAction={() => handleStartQuiz(featuredQuiz?.route || '/quizzes/q1')}
        secondaryActionLabel={isRtl ? 'استعراض الخريطة الذهنية 📊' : 'Mind Map 📊'}
        onSecondaryAction={() => setActiveTab('stats')}
        stats={[
          {
            label: isRtl ? 'اختبارات منجزة' : 'Tests Completed',
            value: '28.9k+',
            icon: <Activity className="w-3.5 h-3.5 text-violet-400" />,
          },
          {
            label: isRtl ? 'دقة التحليل' : 'Cognitive Precision',
            value: '98.6%',
            icon: <Brain className="w-3.5 h-3.5 text-pink-400" />,
          },
        ]}
      />

      {/* 2. Cognitive Journey & Mind Map */}
      {(activeTab === 'all' || activeTab === 'stats') && <CognitiveJourneySection />}

      {/* 3. Brain Games Section */}
      {(activeTab === 'all' || activeTab === 'games') && <IQBrainGamesSection />}

      {/* 4. IQ & Personality Tests */}
      {(activeTab === 'all' || activeTab === 'tests' || activeTab === 'personality') && (
        <IQTestsSection filterCategory={activeTab} onStartQuiz={handleStartQuiz} />
      )}

      {/* 5. World Themed Ad Slot */}
      <AdSlot
        worldId="iqlab"
        variant="in-feed"
        sponsorName="نغنِش مايند برو 🧪"
        adText="احصل على تقرير إدراكي متكامل لخريطتك الذهنية مع شهادة معتمدة بنقاط الـ IQ!"
        adTextEn="Unlock detailed cognitive breakdown and certified IQ achievement badges!"
      />
    </WorldShell>
  )
}
