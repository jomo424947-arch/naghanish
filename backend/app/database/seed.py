from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.models.game import Game
from app.models.quiz import Quiz, QuizQuestion
from app.models.achievement import Achievement
from app.models.mission import DailyMission
from app.models.leaderboard import Tournament
from app.models.economy import StoreItem
from app.models.ai import AIQuestion

INITIAL_GAMES = [
    {
        "id": "g1",
        "title_ar": "بطاقات الذاكرة الخارقة 🃏",
        "title_en": "Memory Cards Master",
        "world": "arcade",
        "category": "Memory",
        "category_ar": "ذاكرة نيون",
        "icon": "🃏",
        "color": "from-purple-600 via-indigo-600 to-blue-700",
        "plays": "45.2k",
        "stars": 4.9,
        "is_featured": True,
        "xp_reward": 250,
        "difficulty": "Medium",
        "desc_ar": "طابق بطاقات الأشكال والرموز المتماثلة في أقل عدد من الحركات والوقت.",
        "desc_en": "Match all neon card pairs in record time with minimal moves.",
        "route": "/games/g1",
    },
    {
        "id": "g2",
        "title_ar": "اختبار سرعة ردة الفعل ⚡",
        "title_en": "Reaction Speed Test",
        "world": "reflex",
        "category": "Reflex",
        "category_ar": "سرعة البرق",
        "icon": "⚡",
        "color": "from-red-600 via-orange-600 to-amber-500",
        "plays": "52.1k",
        "stars": 4.9,
        "is_featured": True,
        "xp_reward": 300,
        "difficulty": "Hard",
        "desc_ar": "اضغط فور تحول الإشارة الخاطفة للأخضر واكتشف سرعة استجابتك بالمللي ثانية.",
        "desc_en": "Click as fast as humanly possible upon green flash.",
        "route": "/games/g2",
    },
    {
        "id": "g3",
        "title_ar": "تحدي الحساب الذهني الخارق 🧮",
        "title_en": "Rapid Math Challenge",
        "world": "iqlab",
        "category": "Brain",
        "category_ar": "حساب ذهني",
        "icon": "🧮",
        "color": "from-emerald-600 via-teal-600 to-cyan-700",
        "plays": "28.4k",
        "stars": 4.8,
        "is_featured": True,
        "xp_reward": 200,
        "difficulty": "Easy",
        "desc_ar": "حل المعادلات الحسابية بأسرع وقت واكتشف قدرة المعالجة السريعة لعقلك.",
        "desc_en": "Solve rapid arithmetic equations and test mental math throughput.",
        "route": "/games/g3",
    },
    {
        "id": "g10",
        "title_ar": "مبارزة أسئلة الشلة 🎤",
        "title_en": "Crew Trivia Showdown",
        "world": "shilla",
        "category": "Party",
        "category_ar": "تحدي جماعي",
        "icon": "🎤",
        "color": "from-orange-500 via-amber-500 to-yellow-500",
        "plays": "61.4k",
        "stars": 4.9,
        "is_featured": True,
        "xp_reward": 350,
        "difficulty": "Easy",
        "desc_ar": "ادخل غرفة لايف وتنافس مع أصحابك في أسئلة سريعة ومضحكة.",
        "desc_en": "Real-time live multiplayer quiz faceoff with friends.",
        "route": "/party",
    },
    {
        "id": "g12",
        "title_ar": "بطولة كأس الأسبوع الكبرى 🏆",
        "title_en": "Weekly Cup Tournament",
        "world": "champions",
        "category": "Tournament",
        "category_ar": "بطولة كبرى",
        "icon": "🏆",
        "color": "from-amber-400 via-yellow-500 to-amber-700",
        "plays": "18.2k",
        "stars": 5.0,
        "is_featured": True,
        "xp_reward": 1000,
        "difficulty": "Hard",
        "desc_ar": "نافس نخبة لاعبي نغنِش في جولات إقصائية أسبوعية للتربع على المنصة الذهبية.",
        "desc_en": "Compete in weekly knockout brackets for leaderboard glory.",
        "route": "/leaderboard",
    },
    {
        "id": "g13",
        "title_ar": "روليت الفوضى والتحديات المجنونة 🎲",
        "title_en": "Chaos Roulette & Dares",
        "world": "chaos",
        "category": "Chaos",
        "category_ar": "فوضى عشوائية",
        "icon": "🎲",
        "color": "from-lime-500 via-emerald-600 to-yellow-500",
        "plays": "39.5k",
        "stars": 4.9,
        "is_featured": True,
        "xp_reward": 400,
        "difficulty": "Medium",
        "desc_ar": "اضغط الزر ولا تسأل عما سيحدث! تحديات وقواعد مجنونة تتغير كل 10 ثوانٍ.",
        "desc_en": "Randomized game twists, funny conditions and chaotic micro-challenges.",
        "route": "/challenges",
    },
]

INITIAL_QUIZZES = [
    {
        "id": "q1",
        "title_ar": "اختبار نمط القيادة واتخاذ القرار 👑",
        "title_en": "Executive Leadership Style 👑",
        "world": "iqlab",
        "category": "Personality",
        "category_ar": "شخصية",
        "questions_count": 3,
        "time_limit": "5m",
        "completions": "14.2k",
        "rating": 4.9,
        "badge": "Popular",
        "color": "from-amber-500 via-orange-600 to-yellow-600",
        "xp_reward": 250,
        "desc_ar": "اكتشف نمط قيادتك وقدرتك على توجيه الفريق وصناعة القرارات تحت الضغط.",
        "desc_en": "Discover your strategic leadership style and decision agility.",
        "route": "/quizzes/q1",
    },
    {
        "id": "q3",
        "title_ar": "مقياس الذكاء التحليلي والاستنتاج 🧠",
        "title_en": "Analytical Cognitive Scale 🧠",
        "world": "iqlab",
        "category": "IQ",
        "category_ar": "ذكاء",
        "questions_count": 3,
        "time_limit": "6m",
        "completions": "19.4k",
        "rating": 4.9,
        "badge": "Hot",
        "color": "from-violet-600 via-purple-700 to-pink-600",
        "xp_reward": 350,
        "desc_ar": "ألغاز هندسية ومنطقية عميقة لقياس مرونة عقلك وسرعة الاستنتاج الرياضي.",
        "desc_en": "Geometric and logical mind puzzles measuring pure deduction agility.",
        "route": "/quizzes/q3",
    },
]

INITIAL_QUIZ_QUESTIONS = [
    {
        "id": "qq_1",
        "quiz_id": "q1",
        "question_ar": "عندما يواجه فريقك موعد تسليم حرج ومفاجئ، ما هو تصرفك التلقائي؟",
        "question_en": "When facing a critical tight deadline, what is your default reaction?",
        "options": [
            {"id": "o1", "text": "أوزع المهام فوراً بناء على نقاط قوة كل عضو 📋", "trait": "الموجّه الاستراتيجي"},
            {"id": "o2", "text": "أتحمل الجزء الأكبر بنفسي لضمان الجودة والسرعة ⚡", "trait": "القائد التنفيذي"},
            {"id": "o3", "text": "أجتمع بالفريق لإيجاد حلول مبتكرة خارج الصندوق 💡", "trait": "القائد الملهم"},
        ],
    },
    {
        "id": "qq_2",
        "quiz_id": "q1",
        "question_ar": "كيف تتعامل مع اختلاف وجهات النظر داخل نقاشات العمل؟",
        "question_en": "How do you handle conflicting opinions in project discussions?",
        "options": [
            {"id": "o1", "text": "أستمع للجميع ثم أتخذ القرار النهائي الحاسم ⚖️", "trait": "الموجّه الاستراتيجي"},
            {"id": "o2", "text": "أعتمد على الأرقام والبيانات لحسم النقاش 📊", "trait": "القائد التحليلي"},
            {"id": "o3", "text": "أوفق بين الآراء للوصول لإجماع مشترك 🤝", "trait": "القائد التوافقي"},
        ],
    },
    {
        "id": "qq_3",
        "quiz_id": "q3",
        "question_ar": "إذا كان 3 عمال يبنون 3 كراسي في 3 دقائق، كم دقيقة يحتاج 100 عامل لبناء 100 كرسي؟",
        "question_en": "If 3 workers build 3 chairs in 3 minutes, how many minutes do 100 workers need to build 100 chairs?",
        "options": [
            {"id": "o1", "text": "3 دقائق ⏱️", "isCorrect": True},
            {"id": "o2", "text": "100 دقيقة ⏳", "isCorrect": False},
            {"id": "o3", "text": "33 دقيقة 🕒", "isCorrect": False},
        ],
    },
]

INITIAL_ACHIEVEMENTS = [
    {
        "id": "ach_first_game",
        "title_ar": "الخطوة الأولى 🚀",
        "title_en": "First Step 🚀",
        "desc_ar": "العب أول لعبة لك في أي عالم من عوالم نغنِش.",
        "desc_en": "Play your very first game in any Naghanish world.",
        "icon": "🚀",
        "category": "games",
        "tier": "bronze",
        "xp_reward": 250,
        "coins_reward": 50,
        "required_count": 1,
    },
    {
        "id": "ach_speed_demon",
        "title_ar": "شيطان السرعة ⚡",
        "title_en": "Speed Demon ⚡",
        "desc_ar": "حقق وقت استجابة أقل من 250ms في عالم ردة الفعل.",
        "desc_en": "Score under 250ms reaction time in Reflex World.",
        "icon": "⚡",
        "category": "reflex",
        "tier": "silver",
        "xp_reward": 500,
        "coins_reward": 100,
        "required_count": 1,
    },
    {
        "id": "ach_brain_power",
        "title_ar": "العقل المدبر 🧠",
        "title_en": "Mastermind 🧠",
        "desc_ar": "أجب على 10 معادلات رياضية متتالية بدون أي خطأ.",
        "desc_en": "Solve 10 consecutive math problems with 0 mistakes.",
        "icon": "🧠",
        "category": "iqlab",
        "tier": "gold",
        "xp_reward": 750,
        "coins_reward": 150,
        "required_count": 10,
    },
    {
        "id": "ach_memory_titan",
        "title_ar": "عملاق الذاكرة 🃏",
        "title_en": "Memory Titan 🃏",
        "desc_ar": "أكمل لعبة بطاقات الذاكرة في أقل من 15 حركة.",
        "desc_en": "Finish the Memory Cards game in fewer than 15 moves.",
        "icon": "🃏",
        "category": "arcade",
        "tier": "gold",
        "xp_reward": 800,
        "coins_reward": 200,
        "required_count": 1,
    },
    {
        "id": "ach_party_host",
        "title_ar": "روح الشلة 🎉",
        "title_en": "Party Animal 🎉",
        "desc_ar": "أنشئ غرفة والعب جولة كاملة مع أصدقائك في عالم الشلة.",
        "desc_en": "Host a room and play a full match with friends.",
        "icon": "🎉",
        "category": "party",
        "tier": "silver",
        "xp_reward": 500,
        "coins_reward": 100,
        "required_count": 1,
    },
    {
        "id": "ach_champion_throne",
        "title_ar": "عرش الأبطال 👑",
        "title_en": "Champion Throne 👑",
        "desc_ar": "ادخل قائمة أفضل 10 لاعبين في لوحة الصدارة العالمية.",
        "desc_en": "Reach the Top 10 on the Global Leaderboard.",
        "icon": "👑",
        "category": "champions",
        "tier": "diamond",
        "xp_reward": 2000,
        "coins_reward": 500,
        "required_count": 1,
    },
]

INITIAL_DAILY_MISSIONS = [
    {
        "id": "m_play_3_arcade",
        "title_ar": "بطل الأركيد اليومي 🕹️",
        "title_en": "Daily Arcade Hero 🕹️",
        "desc_ar": "العب 3 مباريات في كابينات عالم الأركيد.",
        "desc_en": "Play 3 matches in Arcade World cabinets.",
        "icon": "🕹️",
        "target_count": 3,
        "xp_reward": 350,
        "coins_reward": 75,
        "category": "daily",
        "target_action": "play_arcade_game",
    },
    {
        "id": "m_reflex_lightning",
        "title_ar": "صاعقة ردة الفعل ⚡",
        "title_en": "Reflex Lightning Strike ⚡",
        "desc_ar": "حقق 3 محاولات استجابة سريعة في حلبة السرعة.",
        "desc_en": "Achieve 3 fast reaction rounds in Speed Arena.",
        "icon": "⚡",
        "target_count": 3,
        "xp_reward": 400,
        "coins_reward": 80,
        "category": "daily",
        "target_action": "play_reflex_game",
    },
    {
        "id": "m_math_rapid",
        "title_ar": "تمرين العقل الصباحي 🧮",
        "title_en": "Morning Math Sprint 🧮",
        "desc_ar": "أكمل جولة حساب ذهني واحدة بنجاح.",
        "desc_en": "Complete 1 mental math calculation sprint.",
        "icon": "🧮",
        "target_count": 1,
        "xp_reward": 250,
        "coins_reward": 50,
        "category": "daily",
        "target_action": "play_any_game",
    },
    {
        "id": "m_shilla_invite",
        "title_ar": "اجتماع الشلة 🎉",
        "title_en": "Crew Gathering 🎉",
        "desc_ar": "ادخل غرفة لعب جماعي مع صديق.",
        "desc_en": "Join a party room with a friend.",
        "icon": "🎉",
        "target_count": 1,
        "xp_reward": 500,
        "coins_reward": 100,
        "category": "daily",
        "target_action": "join_party_room",
    },
]

INITIAL_TOURNAMENTS = [
    {
        "id": "t1",
        "title_ar": "كأس نغنِش الأسبوعي الكبرى 🏆",
        "title_en": "Weekly Grand Cup 🏆",
        "world": "champions",
        "prize_pool_xp": 25000,
        "prize_pool_coins": 5000,
        "participants_count": 256,
        "status": "active",
        "starts_at": datetime.utcnow(),
        "icon": "🏆",
        "color": "from-amber-400 via-yellow-500 to-amber-700",
    },
    {
        "id": "t2",
        "title_ar": "دوري سرعة البرق ⚡",
        "title_en": "Lightning Reflex League ⚡",
        "world": "reflex",
        "prize_pool_xp": 15000,
        "prize_pool_coins": 3000,
        "participants_count": 128,
        "status": "active",
        "starts_at": datetime.utcnow(),
        "icon": "⚡",
        "color": "from-red-500 via-rose-600 to-orange-500",
    },
    {
        "id": "t3",
        "title_ar": "بطولة عباقرة الحساب والمنطق 🧠",
        "title_en": "Mastermind IQ Open 🧠",
        "world": "iqlab",
        "prize_pool_xp": 18000,
        "prize_pool_coins": 3500,
        "participants_count": 96,
        "status": "upcoming",
        "starts_at": datetime.utcnow(),
        "icon": "🧠",
        "color": "from-purple-600 via-indigo-600 to-blue-600",
    },
]

INITIAL_STORE_ITEMS = [
    {
        "id": "item_avatar_robot",
        "title_ar": "أفاتار الروبوت الذهبي 🤖",
        "title_en": "Golden Bot Avatar 🤖",
        "desc_ar": "أفاتار حصري للاعبين المحترفين.",
        "desc_en": "Exclusive golden bot avatar for pro players.",
        "category": "avatar",
        "price_coins": 1000,
        "icon": "🤖",
        "rarity": "epic",
        "is_featured": True,
    },
    {
        "id": "item_title_legend",
        "title_ar": "لقب: أسطورة الصدارة 👑",
        "title_en": "Title: Leaderboard Legend 👑",
        "desc_ar": "لقب بريميوم يظهر بجوار اسمك في كل الغرف.",
        "desc_en": "Premium badge title appearing beside your nickname.",
        "category": "title",
        "price_coins": 2500,
        "icon": "👑",
        "rarity": "legendary",
        "is_featured": True,
    },
]

INITIAL_AI_QUESTIONS = [
    {
        "id": "aiq_1",
        "topic": "علوم وفضاء",
        "difficulty": "medium",
        "world": "iqlab",
        "question": "ما هو الكوكب الذي يمتلك أقوى مجال مغناطيسي في المجموعة الشمسية؟",
        "options": [
            {"id": "o1", "text": "كوكب المشتري 🪐", "isCorrect": True},
            {"id": "o2", "text": "كوكب زحل 🪐", "isCorrect": False},
            {"id": "o3", "text": "كوكب المريخ 🔴", "isCorrect": False},
            {"id": "o4", "text": "كوكب الأرض 🌍", "isCorrect": False},
        ],
        "explanation": "المشتري يمتلك مجالاً مغناطيسياً أقوى بنحو 20 ألف مرة من المجال المغناطيسي للأرض!",
        "xp_reward": 200,
    },
    {
        "id": "aiq_2",
        "topic": "تاريخ وحضارات",
        "difficulty": "medium",
        "world": "iqlab",
        "question": "ما هي أقدم مكتبة عامة معروفة في التاريخ لا تزال تعمل حتى اليوم؟",
        "options": [
            {"id": "o1", "text": "مكتبة القرويين بفاس 🏛️", "isCorrect": True},
            {"id": "o2", "text": "مكتبة الإسكندرية 📜", "isCorrect": False},
            {"id": "o3", "text": "مكتبة الفاتيكان 📚", "isCorrect": False},
            {"id": "o4", "text": "مكتبة الكونغرس 🏛️", "isCorrect": False},
        ],
        "explanation": "تأسست مكتبة جامعة القرويين في المغرب عام 859م على يد فاطمة الفهرية.",
        "xp_reward": 250,
    },
    {
        "id": "aiq_3",
        "topic": "ذكاء وألغاز",
        "difficulty": "easy",
        "world": "iqlab",
        "question": "شيء يزداد كلما أخذت منه، فما هو؟",
        "options": [
            {"id": "o1", "text": "الحفرة 🕳️", "isCorrect": True},
            {"id": "o2", "text": "الوقت ⏳", "isCorrect": False},
            {"id": "o3", "text": "العمر 🎂", "isCorrect": False},
            {"id": "o4", "text": "المال 💰", "isCorrect": False},
        ],
        "explanation": "الحفرة تتسع وتكبر كلما حفرت وأخذت منها تراباً!",
        "xp_reward": 150,
    },
]


async def seed_initial_data(db: AsyncSession):
    """Seed initial data into database tables if they are empty."""
    # 1. Games
    res_g = await db.execute(select(Game))
    if not res_g.scalars().first():
        for item in INITIAL_GAMES:
            db.add(Game(**item))

    # 2. Quizzes
    res_q = await db.execute(select(Quiz))
    if not res_q.scalars().first():
        for item in INITIAL_QUIZZES:
            db.add(Quiz(**item))

    # 3. Quiz Questions
    res_qq = await db.execute(select(QuizQuestion))
    if not res_qq.scalars().first():
        for item in INITIAL_QUIZ_QUESTIONS:
            db.add(QuizQuestion(**item))

    # 4. Achievements
    res_ach = await db.execute(select(Achievement))
    if not res_ach.scalars().first():
        for item in INITIAL_ACHIEVEMENTS:
            db.add(Achievement(**item))

    # 5. Daily Missions
    res_m = await db.execute(select(DailyMission))
    if not res_m.scalars().first():
        for item in INITIAL_DAILY_MISSIONS:
            db.add(DailyMission(**item))

    # 6. Tournaments
    res_t = await db.execute(select(Tournament))
    if not res_t.scalars().first():
        for item in INITIAL_TOURNAMENTS:
            db.add(Tournament(**item))

    # 7. Store Items
    res_s = await db.execute(select(StoreItem))
    if not res_s.scalars().first():
        for item in INITIAL_STORE_ITEMS:
            db.add(StoreItem(**item))

    # 8. AI Questions Bank
    res_ai = await db.execute(select(AIQuestion))
    if not res_ai.scalars().first():
        for item in INITIAL_AI_QUESTIONS:
            db.add(AIQuestion(**item))

    await db.commit()
