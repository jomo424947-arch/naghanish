/**
 * WorldsPage.tsx
 *
 * Dedicated Gaming Worlds Hub (/worlds)
 * Allows players to discover and jump into any of the 6 distinct Naghanish worlds:
 * - Shilla (الشلة)
 * - Arcade (الأركيد)
 * - IQ Lab (المختبر)
 * - Reflex (ردة الفعل)
 * - Champions (الصدارة)
 * - Chaos (عالم الفوضى)
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Globe,
  Sparkles,
  Users,
  Gamepad2,
  Brain,
  Zap,
  Trophy,
  Flame,
  ArrowRight,
  ArrowLeft,
  Play,
  Layers,
  Star,
  Compass,
} from 'lucide-react'
import { SEO } from '@components/common/SEO'
import { ModeMascot, NaghanishModeId } from '@components/common/ModeVisuals'
import { WORLD_THEMES } from '@theme/world.theme'
import { getGamesByWorld } from '@data/games.data'
import { useThemeStore } from '@store/themeStore'
import { cn } from '@lib/utils'

interface WorldExtendedInfo {
  id: NaghanishModeId
  highlightsAr: string[]
  highlightsEn: string[]
  tagAr: string
  tagEn: string
}

const WORLDS_INFO: Record<NaghanishModeId, WorldExtendedInfo> = {
  shilla: {
    id: 'shilla',
    tagAr: 'اجتماعي وحفلات 👥',
    tagEn: 'Social & Party 👥',
    highlightsAr: ['غرف حية متزامنة', 'تحديات أصحاب وسهرات', 'ألعاب جماعية ومنافسة'],
    highlightsEn: ['Live Sync Lounges', 'Friends & Crew Battles', 'Multiplayer Party Games'],
  },
  arcade: {
    id: 'arcade',
    tagAr: 'نوستالجيا ونيون 🕹️',
    tagEn: 'Retro Neon 🕹️',
    highlightsAr: ['ألعاب كلاسيكية سريعة', 'أرقام قياسية ونقاط', 'أجواء النيون والآركيد'],
    highlightsEn: ['Fast-Paced Classics', 'High-Score Chasing', 'Cyber Neon Atmosphere'],
  },
  iqlab: {
    id: 'iqlab',
    tagAr: 'عقل واختبارات 🧠',
    tagEn: 'Mind & Quizzes 🧠',
    highlightsAr: ['اختبارات ذكاء وتحليل', 'ألغاز منطقية وهندسية', 'تقارير شخصية فورية'],
    highlightsEn: ['IQ & Deduction Tests', 'Logic & Spatial Puzzles', 'Instant Mind Analytics'],
  },
  reflex: {
    id: 'reflex',
    tagAr: 'سرعة ردة الفعل ⚡',
    tagEn: 'Pure Reflex ⚡',
    highlightsAr: ['قياس السرعة بالميلي ثانية', 'تحديات تصويب ونقر', 'اختبار اليقظة والتركيز'],
    highlightsEn: ['Sub-Millisecond Speed', 'Aim & Tap Rush', 'Pure Agility Reflexes'],
  },
  champions: {
    id: 'champions',
    tagAr: 'بطولات وصدارة 👑',
    tagEn: 'Championships 👑',
    highlightsAr: ['لوائح متصدرين عالمية', 'دوري المواسم والجوائز', 'كؤوس وتتويج الأساطير'],
    highlightsEn: ['Global Leaderboards', 'Seasonal Ranked Cups', 'Legendary Trophies'],
  },
  chaos: {
    id: 'chaos',
    tagAr: 'فوضى ومفاجآت 🌪️',
    tagEn: 'Unpredictable Chaos 🌪️',
    highlightsAr: ['قوانين تتغير أثناء اللعب', 'عجلة الحظ والأفخاخ', 'تحديات مجنونة ومرح لا ينتهي'],
    highlightsEn: ['Shifting Game Rules', 'Mystery Traps & Wheel', 'Unstoppable Random Fun'],
  },
}

export const WorldsPage: React.FC = () => {
  const navigate = useNavigate()
  const { dir } = useThemeStore()
  const isRtl = dir === 'rtl'

  const worldKeys: NaghanishModeId[] = ['shilla', 'arcade', 'iqlab', 'reflex', 'champions', 'chaos']

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4 flex flex-col gap-10 pb-28">
      <SEO
        title="عوالم نغنِش — استكشف العوالم الترفيهية الستة"
        description="اختر عالمك المفضل في نغنِش: الشلة للألعاب الجماعية، الأركيد للنيون، مختبر الذكاء، ردة الفعل، صدارة الأبطال، وعالم الفوضى."
        keywords={['عوالم نغنش', 'عالم الشلة', 'عالم الاركيد', 'مختبر الذكاء', 'ردة الفعل', 'الابطال', 'الفوضى']}
      />

      {/* ─────────────────────────────────────────────────────────────
          1. HERO BANNER: 6 GAMING WORLDS GATEWAY
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0E131F] via-[#0A0D17] to-brand-darkBg border-2 border-cyan-500/30 shadow-2xl p-6 sm:p-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-start gap-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-black">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isRtl ? 'بوابة العوالم الستة في نغنِش' : 'NAGHANISH 6 WORLDS GATEWAY'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white leading-tight tracking-tight">
              {isRtl ? (
                <>
                  اختر عالمك المفضل <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
                    وعش تجربة ألعاب مستقلة بالكامل!
                  </span> 🌌
                </>
              ) : (
                <>
                  Choose Your World <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
                    And Experience Pure Immersion!
                  </span> 🌌
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              {isRtl
                ? 'تم تصميم كل عالم في نغنِش ليكون فضاءً متكاملاً يمتلك أسلوبه البصري الخاص، تميمته الحصرية، وألعابه وتحدياته المصممة لتناسب مختلف أذواق اللاعبين.'
                : 'Every world in Naghanish is a complete standalone ecosystem with its own aesthetics, mascots, live mechanics, and tailored game catalog.'}
            </p>

            {/* Quick Stats Bar */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-surface/90 border border-white/10 text-xs font-black text-slate-200">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>{isRtl ? '6 عوالم حية' : '6 Live Worlds'}</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-surface/90 border border-white/10 text-xs font-black text-slate-200">
                <Gamepad2 className="w-4 h-4 text-purple-400" />
                <span>{isRtl ? '58+ لعبة حصرية' : '58+ Games'}</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-surface/90 border border-white/10 text-xs font-black text-slate-200">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>{isRtl ? 'غرف لعب متزامنة' : 'Real-time Rooms'}</span>
              </div>
            </div>
          </div>

          {/* Right Mascot Cluster */}
          <div className="flex items-center justify-center">
            <div className="grid grid-cols-3 gap-3 p-4 rounded-3xl bg-brand-darkBg/80 border border-white/15 backdrop-blur-xl shadow-2xl">
              {worldKeys.map((wId) => (
                <motion.div
                  key={wId}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  onClick={() => navigate(WORLD_THEMES[wId].route)}
                  className="p-3 rounded-2xl bg-brand-card/90 border border-white/10 hover:border-cyan-400 cursor-pointer flex flex-col items-center gap-1 transition-all group"
                  title={isRtl ? WORLD_THEMES[wId].titleAr : WORLD_THEMES[wId].titleEn}
                >
                  <ModeMascot mode={wId} size="md" animated={true} />
                  <span className="text-[10px] font-black text-slate-300 group-hover:text-cyan-300">
                    {isRtl ? WORLD_THEMES[wId].titleAr : WORLD_THEMES[wId].titleEn}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. THE 6 WORLDS FULL SHOWCASE GRID
      ───────────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center text-xl shadow-sm border border-cyan-500/30">
              🌌
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-black text-white">
                {isRtl ? 'استكشف العوالم واختر وجهتك' : 'Explore All Worlds'}
              </h2>
              <p className="text-xs text-slate-400">
                {isRtl ? 'انقر على أي عالم للدخول والاستمتاع بتجربته' : 'Click on any world to dive straight into its action'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {worldKeys.map((wId) => {
            const world = WORLD_THEMES[wId]
            const info = WORLDS_INFO[wId]
            const gamesCount = getGamesByWorld(wId).length

            return (
              <motion.div
                key={wId}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate(world.route)}
                className={cn(
                  'relative overflow-hidden p-6 rounded-[2.25rem] border-2 shadow-xl hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between gap-5 group',
                  `bg-gradient-to-b ${world.gradients.hero}`,
                  world.gradients.border
                )}
                style={{
                  boxShadow: world.colors.glow,
                }}
              >
                {/* Ambient glow inside card */}
                <div
                  className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-2xl opacity-25 pointer-events-none"
                  style={{ backgroundColor: world.colors.primary }}
                />

                {/* Card Top: Mascot + Title + Tag */}
                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/15 p-1 shadow-lg flex items-center justify-center shrink-0">
                      <ModeMascot mode={wId} size="lg" animated={true} />
                    </div>
                    <div>
                      <span className={cn('text-[10px] font-black uppercase tracking-wider block', world.colors.textAccent)}>
                        {isRtl ? info.tagAr : info.tagEn}
                      </span>
                      <h3 className="text-2xl font-display font-black text-white group-hover:text-cyan-200 transition-colors">
                        {isRtl ? world.titleAr : world.titleEn}
                      </h3>
                      <span className="text-xs text-slate-400 font-bold">
                        {gamesCount} {isRtl ? 'ألعاب وتحديات' : 'Games'}
                      </span>
                    </div>
                  </div>

                  <span className="text-3xl p-2 rounded-2xl bg-black/30 border border-white/10 shrink-0">
                    {world.icon}
                  </span>
                </div>

                {/* Card Middle: Subtitle & Highlights */}
                <div className="relative z-10 flex flex-col gap-3">
                  <p className="text-sm font-extrabold text-slate-200 leading-snug">
                    {isRtl ? world.subtitleAr : world.subtitleEn}
                  </p>

                  <div className="flex flex-col gap-1.5 pt-1">
                    {(isRtl ? info.highlightsAr : info.highlightsEn).map((hl, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: world.colors.primary }}
                        />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Bottom: Navigation Button */}
                <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 mt-1">
                  <span className="text-xs font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
                    {isRtl ? 'استكشف العالم' : 'Enter World'}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(world.route)
                    }}
                    className={cn(
                      'px-5 py-2.5 rounded-xl text-slate-950 font-black text-xs shadow-lg group-hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer',
                      `bg-gradient-to-r ${world.gradients.button}`
                    )}
                  >
                    <span>{isRtl ? 'ادخل الآن' : 'Launch'}</span>
                    {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
