from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.game import Game
from app.models.quiz import Quiz

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
        "questions_count": 10,
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
        "questions_count": 12,
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


async def seed_initial_data(db: AsyncSession):
    """Seed initial games and quizzes if database tables are empty."""
    res = await db.execute(select(Game))
    existing_games = res.scalars().all()

    if not existing_games:
        for item in INITIAL_GAMES:
            db.add(Game(**item))
        await db.commit()

    res_q = await db.execute(select(Quiz))
    existing_quizzes = res_q.scalars().all()

    if not existing_quizzes:
        for q_item in INITIAL_QUIZZES:
            db.add(Quiz(**q_item))
        await db.commit()
