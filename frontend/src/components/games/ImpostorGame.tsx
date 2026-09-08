import React, { useState, useEffect } from 'react'
import { Shield, Skull, Eye, EyeOff, CheckCircle, AlertTriangle, RotateCcw, Trophy, Users, Send } from 'lucide-react'
import { soundManager } from '@utils/soundManager'

export interface ImpostorGameProps {
  onFinish: (score: number) => void
  isRtl?: boolean
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

interface WordLocation {
  id: string
  wordAr: string
  wordEn: string
  categoryAr: string
  categoryEn: string
  crewCluesAr: string[]
  crewCluesEn: string[]
  impostorBluffsAr: string[]
  impostorBluffsEn: string[]
}

const LOCATIONS: WordLocation[] = [
  {
    id: 'space_station',
    wordAr: 'محطة الفضاء الدولية 🛰️',
    wordEn: 'Space Station 🛰️',
    categoryAr: 'مركبات وفضاء',
    categoryEn: 'Space & Vehicles',
    crewCluesAr: ['انعدام الجاذبية يخلي الأكل يطير هنا', 'نشوف الأرض كأنها كرة زرقاء صغيرة', 'الأكسجين محسوب بالجرام'],
    crewCluesEn: ['Food literally floats here with zero G', 'Earth looks like a tiny blue marble below', 'Oxygen supply is strictly monitored'],
    impostorBluffsAr: ['المكان هادئ جداً والناس هنا مركزين في شغلهم', 'الدخول له يحتاج تدريب طويل ومعدات معقدة', 'الحرارة هنا مضبوطة بعناية فائقة'],
    impostorBluffsEn: ['Very quiet place and everyone is focused on tasks', 'Getting in requires serious training and gear', 'Temperature is controlled very strictly here'],
  },
  {
    id: 'cyber_cafe',
    wordAr: 'مقهى السيبربنك ☕🕹️',
    wordEn: 'Cyberpunk Cafe ☕🕹️',
    categoryAr: 'أماكن ترفيهية',
    categoryEn: 'Social & Leisure',
    crewCluesAr: ['صوت الكيبوردات الميكانيكية ورائحة القهوة بكل زاوية', 'إضاءات النيون البنفسجية مغطية المكان', 'سرعة الإنترنت هنا تفوق الخيال'],
    crewCluesEn: ['Mechanical keyboard clatter mixed with roasted beans', 'Neon violet ambient lighting covers the walls', 'Fiber internet speed is off the charts'],
    impostorBluffsAr: ['مكان مليان ناس تحب السهر وتدفع فلوس', 'أحب أجي هنا عشان أغير جو مع الأصدقاء', 'المشروبات هنا أسعارها أغلى من العادي'],
    impostorBluffsEn: ['Crowded spot where night owls spend cash', 'I love hanging out here with buddies', 'Drinks are definitely overpriced here'],
  },
  {
    id: 'hacker_bunker',
    wordAr: 'مخبأ الهاكرز السري 💻🕶️',
    wordEn: 'Secret Hacker Bunker 💻🕶️',
    categoryAr: 'مواقع عسكرية وتقنية',
    categoryEn: 'Military & Tech',
    crewCluesAr: ['شاشات سوداء وسطور كود خضراء تلمع في الظلام', 'تحت الأرض ومحمي بتشفير كمومي', 'ممنوع دخول أي هاتف ذكي بكاميرا'],
    crewCluesEn: ['Black monitors with green cascading terminal code', 'Subterranean facility shielded by quantum encryption', 'No smartphones or cameras permitted past the gate'],
    impostorBluffsAr: ['المكان بارد جداً بسبب أجهزة التبريد القوية', 'تحتاج بصمة يد وبطاقة أمنية عشان تفتح الباب', 'العمل هنا يستمر 24 ساعة بدون انقطاع'],
    impostorBluffsEn: ['Freezing cold due to industrial air conditioning', 'You need fingerprint and keycard clearance', 'Operations run 24/7 without interruption'],
  },
  {
    id: 'ancient_pyramid',
    wordAr: 'الأهرامات والآثار 🏜️👑',
    wordEn: 'Ancient Pyramids 🏜️👑',
    categoryAr: 'معالم تاريخية',
    categoryEn: 'Historical Wonders',
    crewCluesAr: ['أحجار عملاقة صمدت لآلاف السنين في قلب الصحراء', 'نقوش هيروغليفية وألغاز فلكية عجيبة', 'السياح من كل دول العالم يلتقطون صور'],
    crewCluesEn: ['Massive stone blocks standing for thousands of years', 'Hieroglyphic carvings and cosmic alignments', 'Global tourists taking endless selfies under the sun'],
    impostorBluffsAr: ['الجو هنا حار جداً والشمس قوية طوال اليوم', 'المكان له هيبة وتاريخ ضخم الكل يفتخر فيه', 'فيه مرشدين يشرحون تفاصيل قديمة'],
    impostorBluffsEn: ['Extremely hot with scorching sunshine', 'Grand historical atmosphere admired by everyone', 'Guides explaining ancient lore and secrets'],
  },
  {
    id: 'submarine',
    wordAr: 'غواصة الأعماق النووية 🌊⚓',
    wordEn: 'Deep Sea Submarine 🌊⚓',
    categoryAr: 'مركبات وبحار',
    categoryEn: 'Naval & Ocean',
    crewCluesAr: ['صوت الرادار (البينغ) يتكرر كل دقيقة في الأعماق', 'الضغط الخارجي كفيل بسحق أي معدن عادي', 'ما فيه ولا نافذة تطل على الخارج غير البريسكوب'],
    crewCluesEn: ['Sonar ping echoes regularly through the steel hull', 'Hydrostatic pressure outside would crush regular metal', 'No windows to the outside world except the periscope'],
    impostorBluffsAr: ['المساحة ضيقة جداً والسرائر فوق بعضها', 'نظام تهوية معقد ولا وجود لأشعة الشمس', 'كل فرد له دور محدد ومهم جداً في الفريق'],
    impostorBluffsEn: ['Extremely tight quarters and stacked bunks', 'Complex air ventilation with zero natural sunlight', 'Every crew member has a critical assigned role'],
  },
]

interface BotPlayer {
  id: number
  name: string
  avatar: string
  color: string
  isImpostor: boolean
  clue: string
  votesReceived: number
}

export const ImpostorGame: React.FC<ImpostorGameProps> = ({ onFinish, isRtl }) => {
  const [phase, setPhase] = useState<'briefing' | 'clues' | 'voting' | 'verdict'>('briefing')
  const [location, setLocation] = useState<WordLocation>(LOCATIONS[0])
  const [isPlayerImpostor, setIsPlayerImpostor] = useState(false)
  const [impostorBotId, setImpostorBotId] = useState<number | null>(null)
  const [bots, setBots] = useState<BotPlayer[]>([])
  const [playerClue, setPlayerClue] = useState('')
  const [userVotedId, setUserVotedId] = useState<number | 'player' | null>(null)
  const [verdictResult, setVerdictResult] = useState<'crew_win' | 'impostor_win' | 'player_caught' | 'player_survived'>('crew_win')
  const [score, setScore] = useState(0)

  // Start new game
  const initGame = () => {
    const randomLoc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]
    setLocation(randomLoc)

    // 25% chance player is impostor
    const playerIsImp = Math.random() < 0.25
    setIsPlayerImpostor(playerIsImp)

    const botTemplates = [
      { id: 1, name: 'Nova', avatar: '🤖', color: 'from-cyan-500 to-blue-500' },
      { id: 2, name: 'Cipher', avatar: '🕶️', color: 'from-purple-500 to-indigo-500' },
      { id: 3, name: 'Echo', avatar: '⚡', color: 'from-amber-500 to-orange-500' },
      { id: 4, name: 'Matrix', avatar: '👾', color: 'from-emerald-500 to-teal-500' },
    ]

    let chosenImpBotId: number | null = null
    if (!playerIsImp) {
      chosenImpBotId = botTemplates[Math.floor(Math.random() * botTemplates.length)].id
    }
    setImpostorBotId(chosenImpBotId)

    const generatedBots: BotPlayer[] = botTemplates.map((b) => {
      const isImp = b.id === chosenImpBotId
      let botClue = ''
      if (isImp) {
        const bluffs = isRtl ? randomLoc.impostorBluffsAr : randomLoc.impostorBluffsEn
        botClue = bluffs[Math.floor(Math.random() * bluffs.length)]
      } else {
        const crewClues = isRtl ? randomLoc.crewCluesAr : randomLoc.crewCluesEn
        botClue = crewClues[Math.floor(Math.random() * crewClues.length)]
      }

      return {
        id: b.id,
        name: b.name,
        avatar: b.avatar,
        color: b.color,
        isImpostor: isImp,
        clue: botClue,
        votesReceived: 0,
      }
    })

    setBots(generatedBots)
    setPlayerClue('')
    setUserVotedId(null)
    setPhase('briefing')
    soundManager.playPowerUp()
  }

  useEffect(() => {
    initGame()
  }, [])

  // Options for player clues
  const playerClueOptions = isPlayerImpostor
    ? isRtl ? location.impostorBluffsAr : location.impostorBluffsEn
    : isRtl ? location.crewCluesAr : location.crewCluesEn

  const handleSelectClue = (clue: string) => {
    setPlayerClue(clue)
    soundManager.playMove()
    setPhase('clues')
  }

  const handleProceedToVoting = () => {
    soundManager.playBossAlert()
    setPhase('voting')
  }

  const handleCastVote = (targetId: number | 'player') => {
    if (userVotedId !== null) return
    setUserVotedId(targetId)
    soundManager.playLineClear()

    // Simulate bot votes
    setTimeout(() => {
      const updatedBots = [...bots]
      let playerVotes = 0

      updatedBots.forEach((bot) => {
        // Bots vote smartly: If bot is impostor, votes randomly on crew or player
        // If bot is crew, has 60% chance of voting real impostor (or player if suspicious)
        if (bot.isImpostor) {
          // Impostor bot tries to frame player or random crew
          if (Math.random() < 0.5) playerVotes++
          else {
            const innocent = updatedBots.filter((b) => b.id !== bot.id)
            innocent[Math.floor(Math.random() * innocent.length)].votesReceived++
          }
        } else {
          // Crew bot
          if (isPlayerImpostor) {
            // Player is the real impostor!
            if (Math.random() < 0.65) playerVotes++
            else {
              const innocent = updatedBots.filter((b) => b.id !== bot.id)
              innocent[Math.floor(Math.random() * innocent.length)].votesReceived++
            }
          } else {
            // Bot impostor is the target!
            if (Math.random() < 0.6) {
              const realImp = updatedBots.find((b) => b.id === impostorBotId)
              if (realImp) realImp.votesReceived++
            } else {
              if (Math.random() < 0.3) playerVotes++
              else {
                const innocent = updatedBots.filter((b) => b.id !== bot.id && b.id !== impostorBotId)
                if (innocent.length > 0) innocent[0].votesReceived++
              }
            }
          }
        }
      })

      // Add user's vote
      if (targetId === 'player') playerVotes++
      else {
        const votedBot = updatedBots.find((b) => b.id === targetId)
        if (votedBot) votedBot.votesReceived++
      }

      setBots(updatedBots)

      // Find who got the most votes
      let highestVotes = playerVotes
      let eliminated: 'player' | number = 'player'

      updatedBots.forEach((b) => {
        if (b.votesReceived > highestVotes) {
          highestVotes = b.votesReceived
          eliminated = b.id
        }
      })

      // Evaluate outcome
      if (isPlayerImpostor) {
        if (eliminated === 'player') {
          soundManager.playExplosion()
          setVerdictResult('player_caught')
          setScore(100)
          onFinish(100)
        } else {
          soundManager.playPerfectHit()
          setVerdictResult('player_survived')
          setScore(800)
          onFinish(800)
        }
      } else {
        if (typeof eliminated === 'number' && eliminated === impostorBotId) {
          soundManager.playPerfectHit()
          setVerdictResult('crew_win')
          setScore(500)
          onFinish(500)
        } else {
          soundManager.playMiss()
          setVerdictResult('impostor_win')
          setScore(150)
          onFinish(150)
        }
      }

      setPhase('verdict')
    }, 1200)
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-2xl mx-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between w-full px-5 py-3 rounded-2xl bg-black/60 border border-brand-cardBorder backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span className="text-sm font-black text-white">
            {isRtl ? 'بروتوكول الجاسوس السيبراني' : 'CYBER IMPOSTOR PROTOCOL'}
          </span>
        </div>
        <div className="text-xs font-mono px-3 py-1 rounded-full bg-white/10 text-gray-300">
          {isRtl ? `التصنيف: ${location.categoryAr}` : `Category: ${location.categoryEn}`}
        </div>
      </div>

      {/* PHASE 1: BRIEFING */}
      {phase === 'briefing' && (
        <div className="flex flex-col items-center gap-6 p-6 rounded-3xl bg-gradient-to-b from-brand-cardBg to-black border border-brand-cardBorder w-full shadow-2xl">
          <div className={`p-4 rounded-3xl border ${isPlayerImpostor ? 'border-red-500 bg-red-950/30' : 'border-cyan-500 bg-cyan-950/30'} flex flex-col items-center text-center gap-3 w-full`}>
            {isPlayerImpostor ? (
              <>
                <Skull className="w-12 h-12 text-red-400 animate-pulse" />
                <h3 className="text-2xl font-black text-red-400">
                  {isRtl ? 'أنت الجاسوس المتخفي! 🕶️' : 'YOU ARE THE IMPOSTOR! 🕶️'}
                </h3>
                <p className="text-sm text-gray-300 max-w-md">
                  {isRtl
                    ? 'أنت لا تعرف الكلمة السرية! هدفك تقديم إجابة ذكية تبدو مقنعة وخداع الآخرين بدون أن يكشفوك.'
                    : 'You DO NOT know the secret word! Bluff convincingly, blend in, and survive the voting council.'}
                </p>
                <div className="text-xs px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 font-mono">
                  {isRtl ? `تلميح التصنيف: ${location.categoryAr}` : `Category Hint: ${location.categoryEn}`}
                </div>
              </>
            ) : (
              <>
                <Shield className="w-12 h-12 text-cyan-400" />
                <h3 className="text-2xl font-black text-cyan-400">
                  {isRtl ? 'أنت من أفراد الطاقم! 🛡️' : 'YOU ARE CREW! 🛡️'}
                </h3>
                <div className="text-2xl md:text-3xl font-black text-white px-6 py-2 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 font-mono">
                  {isRtl ? location.wordAr : location.wordEn}
                </div>
                <p className="text-sm text-gray-300 max-w-md">
                  {isRtl
                    ? 'الجميع يعرفون هذه الكلمة ما عدا الجاسوس! اختر تلميحاً ذكياً يفهمه الطاقم ولا يكشف المكان للجاسوس.'
                    : 'Everyone knows this secret word except the Impostor! Give a smart clue to signal your innocence.'}
                </p>
              </>
            )}
          </div>

          {/* Clue selection */}
          <div className="flex flex-col gap-3 w-full">
            <h4 className="text-sm font-bold text-gray-300 text-left">
              {isRtl ? 'اختر تلميحك الذي ستقوله للمجموعة:' : 'Select your clue for the group:'}
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {playerClueOptions.map((c, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectClue(c)}
                  className="p-3.5 rounded-2xl text-left text-sm font-medium bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-400 border border-white/10 text-white transition-all active:scale-98"
                >
                  💬 "{c}"
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: CLUES REVEALED */}
      {phase === 'clues' && (
        <div className="flex flex-col items-center gap-5 w-full p-6 rounded-3xl bg-gradient-to-b from-brand-cardBg to-black border border-brand-cardBorder shadow-2xl">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-lg font-black text-white">
              {isRtl ? 'تلميحات اللاعبين في الجلسة 🎙️' : 'Player Clues Discussion 🎙️'}
            </h3>
            <span className="text-xs font-mono text-cyan-400">
              {isRtl ? 'استمع وحلل بدقة' : 'Analyze carefully'}
            </span>
          </div>

          <div className="flex flex-col gap-3 w-full">
            {/* Player's own clue */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/40">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/30 flex items-center justify-center text-lg font-black text-cyan-300 shrink-0">
                👤
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-cyan-300">{isRtl ? 'أنت (أنت)' : 'You (Player)'}</span>
                <p className="text-sm text-white mt-1">"{playerClue}"</p>
              </div>
            </div>

            {/* Bots' clues */}
            {bots.map((bot) => (
              <div key={bot.id} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bot.color} flex items-center justify-center text-lg shrink-0 shadow-md`}>
                  {bot.avatar}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-300">{bot.name}</span>
                  <p className="text-sm text-gray-200 mt-1">"{bot.clue}"</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleProceedToVoting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-black text-base hover:opacity-90 transition-all shadow-lg shadow-red-500/30 active:scale-98 flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-5 h-5" />
            <span>{isRtl ? 'بدء التصويت الطارئ لإسقاط المشتبه به!' : 'Call Emergency Vote!'}</span>
          </button>
        </div>
      )}

      {/* PHASE 3: VOTING */}
      {phase === 'voting' && (
        <div className="flex flex-col items-center gap-5 w-full p-6 rounded-3xl bg-gradient-to-b from-brand-cardBg to-black border border-brand-cardBorder shadow-2xl">
          <div className="text-center">
            <h3 className="text-xl font-black text-red-400 mb-1">
              {isRtl ? 'مجلس الطوارئ: من هو الجاسوس؟ 🚨' : 'Emergency Council: Who is the Impostor? 🚨'}
            </h3>
            <p className="text-xs text-gray-400">
              {isRtl ? 'صوّت للشخص الذي تشك في كلامه لإخراجه من المحطة' : 'Vote for the suspicious player to eject them'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {bots.map((bot) => (
              <button
                key={bot.id}
                disabled={userVotedId !== null}
                onClick={() => handleCastVote(bot.id)}
                className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  userVotedId === bot.id
                    ? 'border-red-500 bg-red-950/40 scale-102 shadow-xl shadow-red-500/20'
                    : 'border-white/10 bg-white/5 hover:bg-red-500/10 hover:border-red-500/50 active:scale-98'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{bot.avatar}</span>
                  <div>
                    <div className="text-sm font-black text-white">{bot.name}</div>
                    <div className="text-xs text-gray-400 line-clamp-1">"{bot.clue}"</div>
                  </div>
                </div>
                {userVotedId === bot.id && (
                  <CheckCircle className="w-5 h-5 text-red-400 animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {userVotedId && (
            <div className="flex items-center gap-2 text-sm text-amber-400 font-mono animate-pulse">
              <span>{isRtl ? 'جاري فرز الأصوات من الذكاء الاصطناعي...' : 'Tallies accumulating from neural network...'}</span>
            </div>
          )}
        </div>
      )}

      {/* PHASE 4: VERDICT */}
      {phase === 'verdict' && (
        <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-gradient-to-b from-brand-cardBg to-black border border-brand-cardBorder shadow-2xl w-full text-center">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-xl ${
            verdictResult === 'crew_win' || verdictResult === 'player_survived'
              ? 'bg-green-500/20 border border-green-500/40 text-green-400'
              : 'bg-red-500/20 border border-red-500/40 text-red-400'
          }`}>
            {verdictResult === 'crew_win' || verdictResult === 'player_survived' ? '🏆' : '💀'}
          </div>

          <div>
            <h3 className="text-2xl font-black text-white mb-2">
              {verdictResult === 'crew_win' && (isRtl ? 'فوز الطاقم! تم كشف الجاسوس بنجاح! 🎯' : 'Crew Victory! Impostor Ejected! 🎯')}
              {verdictResult === 'impostor_win' && (isRtl ? 'فوز الجاسوس! خدع الطاقم بالكامل! 🕶️' : 'Impostor Victory! Crew Fooled! 🕶️')}
              {verdictResult === 'player_survived' && (isRtl ? 'عبقري! نجوت كجاسوس وخدعت الجميع! 👑' : 'Mastermind! You fooled everyone as Impostor! 👑')}
              {verdictResult === 'player_caught' && (isRtl ? 'تم كشفك وطردك من المحطة! 🚀' : 'You were caught & ejected! 🚀')}
            </h3>
            <p className="text-sm text-gray-300">
              {isRtl
                ? `الكلمة السرية كانت: ${location.wordAr}`
                : `The secret word was: ${location.wordEn}`}
            </p>
          </div>

          {/* Player stats */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
              <span className="text-xs text-gray-400">{isRtl ? 'الجاسوس الحقيقي' : 'Real Impostor'}</span>
              <span className="text-sm font-black text-red-400 font-mono mt-1">
                {isPlayerImpostor ? (isRtl ? 'أنت 🕶️' : 'You 🕶️') : bots.find((b) => b.isImpostor)?.name}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
              <span className="text-xs text-gray-400">{isRtl ? 'النقاط المكتسبة' : 'Score Earned'}</span>
              <span className="text-xl font-black text-cyan-400 font-mono">+{score} XP</span>
            </div>
          </div>

          <button
            onClick={initGame}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black hover:opacity-90 transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{isRtl ? 'جولة جديدة بكلمة مختلفة' : 'Play Another Round'}</span>
          </button>
        </div>
      )}
    </div>
  )
}
