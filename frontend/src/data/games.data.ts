/**
 * games.data.ts
 *
 * Central catalog of games, tests, and interactive challenges with strict World tags.
 */

import { NaghanishModeId } from '@components/common/ModeVisuals'

export interface GameItem {
  id: string
  title: string
  titleAr: string
  world: NaghanishModeId
  category: string
  categoryAr: string
  icon: string
  color: string
  plays: string
  stars: number
  isNew?: boolean
  isFeatured?: boolean
  xpReward: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  difficultyAr: 'سهل' | 'متوسط' | 'صعب'
  descAr: string
  descEn: string
  route: string
  bestScore?: string
  playersCount?: string
  tags?: string[]
}

export interface LiveRoomItem {
  code: string
  name: string
  nameEn: string
  world: 'shilla'
  players: number
  max: number
  host: string
  hostAvatar?: string
  icon: string
  category: string
  badge: string
  badgeColor: string
}

export interface QuizItem {
  id: string
  title: string
  titleEn: string
  world: 'iqlab'
  category: 'Personality' | 'General' | 'IQ' | 'Entertainment' | 'Logic'
  categoryAr: 'شخصية' | 'ثقافة عامة' | 'ذكاء' | 'ترفيه' | 'منطق'
  questions: number
  time: string
  completions: string
  rating: number
  badge?: string
  color: string
  xpReward: number
  descAr: string
  descEn: string
  route: string
}

export const ALL_GAMES: GameItem[] = [
  // ── ARCADE WORLD GAMES ──
  {
    id: 'g1',
    title: 'Memory Cards Master',
    titleAr: 'بطاقات الذاكرة الخارقة 🃏',
    world: 'arcade',
    category: 'Memory',
    categoryAr: 'ذاكرة نيون',
    icon: '🃏',
    color: 'from-purple-600 via-indigo-600 to-blue-700',
    plays: '45.2k',
    stars: 4.9,
    isFeatured: true,
    xpReward: 250,
    difficulty: 'Medium',
    difficultyAr: 'متوسط',
    descAr: 'طابق بطاقات الأشكال والرموز المتماثلة في أقل عدد من الحركات والوقت وحطم الأرقام القياسية.',
    descEn: 'Match all neon card pairs in record time with minimal moves.',
    route: '/games/g1',
    bestScore: '14 moves',
    tags: ['arcade', 'retro', 'neon'],
  },
  {
    id: 'g4',
    title: 'Neon Color Rush',
    titleAr: 'سباق مطابقة الألوان 🎨',
    world: 'arcade',
    category: 'Arcade',
    categoryAr: 'أركيد كلاسيك',
    icon: '🎨',
    color: 'from-pink-600 via-rose-600 to-purple-700',
    plays: '19.3k',
    stars: 4.6,
    isNew: true,
    xpReward: 180,
    difficulty: 'Medium',
    difficultyAr: 'متوسط',
    descAr: 'طابق اسم اللون مع إضاءته الحقيقية وتجنب الخدع البصرية والسرعة المتزايدة.',
    descEn: 'Match color names to neon shades and beat the timer clock.',
    route: '/games/g4',
    bestScore: '1,840 pts',
    tags: ['arcade', 'colors', 'speed'],
  },
  {
    id: 'g7',
    title: 'Retro Pixel Runner',
    titleAr: 'عدّاء البكسل الكلاسيكي 👾',
    world: 'arcade',
    category: 'Retro',
    categoryAr: 'ريترو بكسل',
    icon: '👾',
    color: 'from-cyan-600 via-blue-700 to-purple-800',
    plays: '38.6k',
    stars: 4.8,
    isNew: true,
    xpReward: 320,
    difficulty: 'Hard',
    difficultyAr: 'صعب',
    descAr: 'اركض وتفادَ العوائق الرقمية في عالم البكسل القديم بأسلوب كابينات الأركيد.',
    descEn: 'Dodge retro digital obstacles in a nostalgic arcade environment.',
    route: '/games/g1',
    bestScore: '9,450 pts',
    tags: ['arcade', 'pixel', 'retro'],
  },

  // ── REFLEX WORLD GAMES ──
  {
    id: 'g2',
    title: 'Reaction Speed Test',
    titleAr: 'اختبار سرعة ردة الفعل ⚡',
    world: 'reflex',
    category: 'Reflex',
    categoryAr: 'سرعة البرق',
    icon: '⚡',
    color: 'from-red-600 via-orange-600 to-amber-500',
    plays: '52.1k',
    stars: 4.9,
    isFeatured: true,
    isNew: true,
    xpReward: 300,
    difficulty: 'Hard',
    difficultyAr: 'صعب',
    descAr: 'اضغط فور تحول الإشارة الخاطفة للأخضر واكتشف سرعة استجابتك بالمللي ثانية بدقة متناهية.',
    descEn: 'Click as fast as humanly possible upon green flash (sub-ms timing).',
    route: '/games/g2',
    bestScore: '187 ms',
    tags: ['reflex', 'speed', 'sub-ms'],
  },
  {
    id: 'g8',
    title: 'Target Precision Blitz',
    titleAr: 'قناص الأهداف الخاطفة 🎯',
    world: 'reflex',
    category: 'Reflex',
    categoryAr: 'دقة وتوقيت',
    icon: '🎯',
    color: 'from-red-700 via-rose-600 to-orange-600',
    plays: '27.4k',
    stars: 4.7,
    xpReward: 260,
    difficulty: 'Hard',
    difficultyAr: 'صعب',
    descAr: 'اضغط على الأهداف الدائرية فور ظهورها على الشاشة قبل أن تختفي خلال أجزاء من الثانية.',
    descEn: 'Hit rapidly appearing micro-targets before they vanish in milliseconds.',
    route: '/games/g2',
    bestScore: '0.24s avg',
    tags: ['reflex', 'aim', 'focus'],
  },
  {
    id: 'g9',
    title: 'Rhythm Reaction Strike',
    titleAr: 'ضربة التوقيت والإيقاع 🥁',
    world: 'reflex',
    category: 'Timing',
    categoryAr: 'إيقاع وسرعة',
    icon: '🥁',
    color: 'from-orange-600 via-amber-600 to-red-600',
    plays: '16.9k',
    stars: 4.8,
    isNew: true,
    xpReward: 290,
    difficulty: 'Medium',
    difficultyAr: 'متوسط',
    descAr: 'طابق النبضات السريعة في اللحظة المحددة بالضبط لبناء أعلى سلسلة كومبو.',
    descEn: 'Strike incoming beats at the exact millisecond mark for combo streaks.',
    route: '/games/g2',
    bestScore: 'Combo x42',
    tags: ['reflex', 'rhythm', 'combo'],
  },

  // ── IQ LAB WORLD GAMES ──
  {
    id: 'g3',
    title: 'Rapid Math Challenge',
    titleAr: 'تحدي الحساب الذهني الخارق 🧮',
    world: 'iqlab',
    category: 'Brain',
    categoryAr: 'حساب ذهني',
    icon: '🧮',
    color: 'from-emerald-600 via-teal-600 to-cyan-700',
    plays: '28.4k',
    stars: 4.8,
    isFeatured: true,
    xpReward: 200,
    difficulty: 'Easy',
    difficultyAr: 'سهل',
    descAr: 'حل المعادلات الحسابية بأسرع وقت واكتشف قدرة المعالجة السريعة لعقلك.',
    descEn: 'Solve rapid arithmetic equations and test mental math throughput.',
    route: '/games/g3',
    bestScore: '38 solved/min',
    tags: ['iqlab', 'math', 'brain'],
  },
  {
    id: 'g5',
    title: 'Word Matrix Search',
    titleAr: 'مصفوفة الكلمات الذكية 🔤',
    world: 'iqlab',
    category: 'Logic',
    categoryAr: 'منطق لغوي',
    icon: '🔤',
    color: 'from-violet-600 via-purple-600 to-indigo-700',
    plays: '22.7k',
    stars: 4.7,
    xpReward: 220,
    difficulty: 'Medium',
    difficultyAr: 'متوسط',
    descAr: 'استخرج الأنماط اللغوية المترابطة من شبكة الحروف المعقدة في زمن قياسي.',
    descEn: 'Connect complex word patterns in a strategic semantic matrix.',
    route: '/games/g5',
    bestScore: '100% accurate',
    tags: ['iqlab', 'words', 'logic'],
  },
  {
    id: 'g6',
    title: 'Pattern Sequence Master',
    titleAr: 'سيد الأنماط المتسلسلة 🧩',
    world: 'iqlab',
    category: 'Logic',
    categoryAr: 'تحليل منطقي',
    icon: '🧩',
    color: 'from-brand-purple via-violet-700 to-indigo-900',
    plays: '31.8k',
    stars: 4.9,
    isNew: true,
    xpReward: 350,
    difficulty: 'Hard',
    difficultyAr: 'صعب',
    descAr: 'احفظ تتابع الأنماط الهندسية المعقدة وتوقع الحركة التالية بدون أي خطأ.',
    descEn: 'Memorize neural sequence patterns and predict succeeding movements.',
    route: '/games/g6',
    bestScore: 'Stage 18',
    tags: ['iqlab', 'patterns', 'iq'],
  },

  // ── SHILLA WORLD GAMES ──
  {
    id: 'g10',
    title: 'Crew Trivia Showdown',
    titleAr: 'مبارزة أسئلة الشلة 🎤',
    world: 'shilla',
    category: 'Party',
    categoryAr: 'تحدي جماعي',
    icon: '🎤',
    color: 'from-orange-500 via-amber-500 to-yellow-500',
    plays: '61.4k',
    stars: 4.9,
    isFeatured: true,
    xpReward: 350,
    difficulty: 'Easy',
    difficultyAr: 'سهل',
    descAr: 'ادخل غرفة لايف وتنافس مع أصحابك في أسئلة سريعة ومضحكة تكشف معلوماتكم العامة.',
    descEn: 'Real-time live multiplayer quiz faceoff with friends & group lobbies.',
    route: '/party',
    playersCount: '2-8 Players',
    tags: ['shilla', 'multiplayer', 'party'],
  },
  {
    id: 'g11',
    title: 'Laugh Or Out',
    titleAr: 'تحدي الضحك والمقالب 🎭',
    world: 'shilla',
    category: 'Party',
    categoryAr: 'ضحك ووناسة',
    icon: '🎭',
    color: 'from-amber-500 via-orange-600 to-cyan-600',
    plays: '42.8k',
    stars: 4.8,
    isNew: true,
    xpReward: 280,
    difficulty: 'Medium',
    difficultyAr: 'متوسط',
    descAr: 'تحديات مواقف محرجة وأسئلة غير متوقعة بين الأصدقاء مع تصويت مباشر.',
    descEn: 'Social voting, hilarious dares and live party interactions.',
    route: '/party',
    playersCount: '3-12 Players',
    tags: ['shilla', 'dares', 'fun'],
  },

  // ── CHAMPIONS WORLD CHALLENGES ──
  {
    id: 'g12',
    title: 'Weekly Cup Tournament',
    titleAr: 'بطولة كأس الأسبوع الكبرى 🏆',
    world: 'champions',
    category: 'Tournament',
    categoryAr: 'بطولة كبرى',
    icon: '🏆',
    color: 'from-amber-400 via-yellow-500 to-amber-700',
    plays: '18.2k',
    stars: 5.0,
    isFeatured: true,
    xpReward: 1000,
    difficulty: 'Hard',
    difficultyAr: 'صعب',
    descAr: 'نافس نخبة لاعبي نغنِش في جولات إقصائية أسبوعية للتربع على المنصة الذهبية.',
    descEn: 'Compete in weekly knockout brackets for leaderboard glory and trophies.',
    route: '/leaderboard',
    bestScore: 'Rank #1 Trophy',
    tags: ['champions', 'ranked', 'tournament'],
  },

  // ── CHAOS WORLD CHALLENGES ──
  {
    id: 'g13',
    title: 'Chaos Roulette & Dares',
    titleAr: 'روليت الفوضى والتحديات المجنونة 🎲',
    world: 'chaos',
    category: 'Chaos',
    categoryAr: 'فوضى عشوائية',
    icon: '🎲',
    color: 'from-lime-500 via-emerald-600 to-yellow-500',
    plays: '39.5k',
    stars: 4.9,
    isFeatured: true,
    isNew: true,
    xpReward: 400,
    difficulty: 'Medium',
    difficultyAr: 'متوسط',
    descAr: 'اضغط الزر ولا تسأل عما سيحدث! تحديات وقواعد مجنونة تتغير كل 10 ثوانٍ.',
    descEn: 'Randomized game twists, funny conditions and chaotic micro-challenges.',
    route: '/challenges',
    bestScore: '12 Chaos Streaks',
    tags: ['chaos', 'random', 'crazy'],
  },
]

export const LIVE_ROOMS: LiveRoomItem[] = [
  {
    code: 'SHILLA99',
    name: 'تحدي الأسئلة السريعة والنار ⚡',
    nameEn: 'Rapid Fire Crew Challenge ⚡',
    world: 'shilla',
    players: 6,
    max: 8,
    host: 'أحمد السعدني',
    icon: '⚡',
    category: 'Trivia & Speed',
    badge: 'LIVE MATCH',
    badgeColor: 'bg-orange-500',
  },
  {
    code: 'WARRIOR',
    name: 'صالة مبارزة الذاكرة الخارقة 🃏',
    nameEn: 'Champions Memory Arena 🃏',
    world: 'shilla',
    players: 4,
    max: 6,
    host: 'ليلى منصور',
    icon: '🏆',
    category: 'Memory Battle',
    badge: 'FIERCE',
    badgeColor: 'bg-amber-500',
  },
  {
    code: 'LAUGH101',
    name: 'جلسة الضحك واختبارات الشخصية 🎭',
    nameEn: 'Personality & Dares Lounge 🎭',
    world: 'shilla',
    players: 5,
    max: 8,
    host: 'يوسف خالد',
    icon: '🧠',
    category: 'Social Lounge',
    badge: 'CHILL',
    badgeColor: 'bg-cyan-500',
  },
  {
    code: 'CHAMPION',
    name: 'تصفيات صدارة الأسبوع 👑',
    nameEn: 'Weekly Crew Qualifiers 👑',
    world: 'shilla',
    players: 7,
    max: 8,
    host: 'سارة عبد الله',
    icon: '👑',
    category: 'Ranked Cup',
    badge: 'FINAL SLOT',
    badgeColor: 'bg-red-500',
  },
]

export const IQ_QUIZZES: QuizItem[] = [
  {
    id: 'q1',
    title: 'اختبار نمط القيادة واتخاذ القرار 👑',
    titleEn: 'Executive Leadership Style 👑',
    world: 'iqlab',
    category: 'Personality',
    categoryAr: 'شخصية',
    questions: 10,
    time: '5m',
    completions: '14.2k',
    rating: 4.9,
    badge: 'Popular',
    color: 'from-amber-500 via-orange-600 to-yellow-600',
    xpReward: 250,
    descAr: 'اكتشف نمط قيادتك وقدرتك على توجيه الفريق وصناعة القرارات تحت الضغط.',
    descEn: 'Discover your strategic leadership style and decision agility.',
    route: '/quizzes/q1',
  },
  {
    id: 'q3',
    title: 'مقياس الذكاء التحليلي والاستنتاج 🧠',
    titleEn: 'Analytical Cognitive Scale 🧠',
    world: 'iqlab',
    category: 'IQ',
    categoryAr: 'ذكاء',
    questions: 12,
    time: '6m',
    completions: '19.4k',
    rating: 4.9,
    badge: 'Hot',
    color: 'from-violet-600 via-purple-700 to-pink-600',
    xpReward: 350,
    descAr: 'ألغاز هندسية ومنطقية عميقة لقياس مرونة عقلك وسرعة الاستنتاج الرياضي.',
    descEn: 'Geometric and logical mind puzzles measuring pure deduction agility.',
    route: '/quizzes/q3',
  },
  {
    id: 'q4',
    title: 'خريطة التفكير السائد: تحليلي أم إبداعي؟ 💡',
    titleEn: 'Dominant Thinking Matrix 💡',
    world: 'iqlab',
    category: 'Personality',
    categoryAr: 'شخصية',
    questions: 8,
    time: '4m',
    completions: '18.5k',
    rating: 4.8,
    badge: 'New',
    color: 'from-pink-500 via-rose-600 to-purple-600',
    xpReward: 200,
    descAr: 'هل تحكمك الخوارزميات المنطقية أم الحدس الإبداعي؟ اكتشف نصف دماغك المهيمن.',
    descEn: 'Are you an analytical, lateral, or intuitive problem solver?',
    route: '/quizzes/q4',
  },
  {
    id: 'q2',
    title: 'تحدي الثقافة والموسوعة العالمية 🌍',
    titleEn: 'Universal Knowledge Encyclopedia 🌍',
    world: 'iqlab',
    category: 'General',
    categoryAr: 'ثقافة عامة',
    questions: 15,
    time: '8m',
    completions: '28.9k',
    rating: 4.8,
    badge: 'Trending',
    color: 'from-cyan-500 via-blue-600 to-indigo-700',
    xpReward: 300,
    descAr: 'اختبر حصيلتك المعرفية في تاريخ الحضارات، العلوم الطبيعية، واكتشافات الفضاء.',
    descEn: 'Test your knowledge across world history, physics and geography.',
    route: '/quizzes/q2',
  },
]

// Helper Functions
export const getGamesByWorld = (worldId: NaghanishModeId): GameItem[] => {
  return ALL_GAMES.filter((g) => g.world === worldId)
}

export const getAllGames = (): GameItem[] => {
  return ALL_GAMES
}

export const getFeaturedGame = (): GameItem => {
  return ALL_GAMES.find((g) => g.isFeatured) || ALL_GAMES[0]
}

export const getRandomGame = (): GameItem => {
  const index = Math.floor(Math.random() * ALL_GAMES.length)
  return ALL_GAMES[index]
}
