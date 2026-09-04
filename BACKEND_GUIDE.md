# 🧠 دليل وهندسة الباك إند الشامل — مشروع نغنِش (Naghanish Backend Guide & Report)

> **وثيقة توثيقية وتطبيقية شاملة** تشرح معمارية النظام، الكود المنجز، هيكل قاعدة البيانات، ودليل التشغيل خطوة بخطوة لإدراجه في التقرير الرسمي للمشروع.

---

## 📑 الفهرس (Table of Contents)
1. [المعمارية العامة والتقنيات (Architecture & Tech Stack)](#1-المعمارية-العامة-والتقنيات)
2. [هيكل المجلدات وتفاصيل الملفات (Project Structure)](#2-هيكل-المجلدات-وتفاصيل-الملفات)
3. [ما تم بناؤه وبرمجته بالفعل (Implemented Features)](#3-ما-تم-بناؤه-وبرمجته-بالفعل)
4. [دليل وهندسة قاعدة البيانات (Database Architecture & Schema)](#4-دليل-وهندسة-قاعدة-البيانات)
5. [خطوات بناء وربط قاعدة البيانات القادمة (Database Next Steps)](#5-خطوات-بناء-وربط-قاعدة-البيانات-القادمة)
6. [دليل التشغيل للتقرير (How to Run - Step by Step)](#6-دليل-التشغيل-للتقرير)
7. [روابط الاختبار والتوثيق التفاعلي (API Docs & Testing)](#7-روابط-الاختبار-والتوثيق-التفاعلي)

---

## 1. المعمارية العامة والتقنيات

يعتمد الباك إند على معمارية برمجية حديثة ونظيفة (**Clean Domain-Driven Architecture**) تعتمد كلياً على البرمجة غير المتزامنة (**Asynchronous Python**) لضمان سرعة الاستجابة ودعم آلاف الطلبات المتزامنة:

* **FastAPI (v0.115+)**: إطار عمل الويب الأساسي فائق السرعة، مبني على Starlette و Pydantic.
* **SQLAlchemy 2.0 (Async ORM)**: طبقة الوصول للبيانات والتعامل مع الكائنات البرمجية باستخدام `create_async_engine` و `AsyncSession`.
* **Database Drivers**:
  * `asyncpg`: محرك الاتصال غير المتزامن فائق الأداء لقواعد بيانات **PostgreSQL** (بيئة الإنتاج).
  * `aiosqlite`: محرك اتصال اختياري لقواعد بيانات **SQLite** المحلية السريعة للتطوير.
* **Pydantic v2**: التحقق التلقائي والوصفي من صحة البيانات الواردة والصادرة (Request/Response Schemas).
* **JWT & Passlib**: إدارة التوثيق والأمان وتشفير كلمات المرور عبر `pbkdf2_sha256` و `bcrypt`.
* **Alembic**: إدارة هجرات وتطور هيكل قاعدة البيانات (Database Migrations).
* **Uvicorn**: خادم الـ ASGI لتشغيل التطبيق.

---

## 2. هيكل المجلدات وتفاصيل الملفات

```
backend/
├── app/
│   ├── main.py               # نقطة الانطلاق الرئيسية وإعداد تطبيق FastAPI ودورة الحياة (Lifespan)
│   │
│   ├── config/
│   │   └── settings.py       # إدارة إعدادات وبيئة التطبيق عبر Pydantic Settings (.env)
│   │
│   ├── database/
│   │   ├── base.py           # الـ DeclarativeBase المشترك لجميع جداول الـ ORM
│   │   ├── engine.py         # إنشاء محرك الاتصال AsyncEngine ومصنع الجلسات AsyncSessionLocal
│   │   ├── session.py        # دالة حقن الجلسة get_db() لكل طلب API
│   │   └── seed.py           # دالة تعبئة البيانات الأولية (الألعاب والاختبارات) تلقائياً
│   │
│   ├── models/               # نماذج جداول قاعدة البيانات (14 ملف Model)
│   │   ├── user.py           # جدول المستخدمين (users)
│   │   ├── game.py           # جدول الألعاب وجلسات اللعب (games, game_sessions)
│   │   ├── quiz.py           # الاختبارات والأسئلة والمحاولات (quizzes, quiz_questions, quiz_attempts)
│   │   ├── leaderboard.py    # لوحة الصدارة والبطولات (leaderboard_ranks, tournaments)
│   │   ├── achievement.py    # الإنجازات وتقدم اللاعبين (achievements, user_achievements)
│   │   ├── mission.py        # المهام اليومية وتقدم المستخدم (daily_missions, user_mission_progress)
│   │   ├── room.py           # غرف اللعب الجماعي والمشاركين (party_rooms, room_participants)
│   │   ├── economy.py        # عناصر المتجر ومخزون اللاعبين (store_items, user_inventories)
│   │   ├── friend.py         # علاقات الصداقة (friendships)
│   │   └── notification.py   # إشعارات وتنبيهات النظام (notifications)
│   │
│   ├── schemas/              # تعريف هياكل البيانات (Pydantic Models / DTOs) للتحقق والتوثيق
│   │
│   ├── api/
│   │   ├── router.py         # مجمع المسارات الرئيسي لجميع الأقسام تحت /api/v1
│   │   └── routers/          # 15 مساراً تفصيلياً (auth, users, games, quizzes, party, etc.)
│   │
│   ├── dependencies/
│   │   └── auth.py           # استخراج هوية المستخدم الحالي من توكن JWT (مع ميزة Demo Fallback)
│   │
│   ├── core/
│   │   └── security.py       # دوال تشفير كلمات المرور وتوليد وفك تشفير رموز الـ JWT
│   │
│   ├── middleware/
│   │   ├── cors.py           # إعدادات السماح بالنطاقات المتقاطعة (CORS) للفرونت إند والموبايل
│   │   └── logging.py        # تسجيل ومتابعة الطلبات
│   │
│   ├── websocket/
│   │   └── manager.py        # مدير اتصالات الـ WebSockets الحية لغرف التحدي الجماعي
│   │
│   ├── repositories/         # قوالب طبقة الـ Repository لعزل استعلامات قاعدة البيانات
│   └── services/             # قوالب طبقة منطق الأعمال (Business Logic)
│
├── migrations/               # ملفات هجرة قاعدة البيانات Alembic
├── requirements.txt          # قائمة الحزم والاعتماديات الأساسية
├── Dockerfile                # إعداد حاوية الباك إند
└── .env                      # ملف المتغيرات البيئية المحلي
```

---

## 3. ما تم بناؤه وبرمجته بالفعل

### 1. الإقلاع والتهيئة الذكية (`app/main.py`)
* عند تشغيل الخادم، تُفعل دالة `lifespan`:
  1. تقوم بتنفيذ `Base.metadata.create_all` لإنشاء جميع الجداول تلقائياً إن لم تكن موجودة.
  2. تستدعي `seed_initial_data` في `app/database/seed.py` للتحقق من وجود بيانات، وإذا كانت الجداول فارغة، تقوم بحقن:
     - **6 ألعاب أساسية** موزعة على عوالم نغنِش (بطاقات الذاكرة، اختبار سرعة ردة الفعل، الحساب الذهني، مبارزة أسئلة الشلة، كأس الأسبوع، وروليت الفوضى).
     - **اختبارات الذكاء والشخصية** (مقياس نمط القيادة، مقياس الذكاء التحليلي والاستنتاج).

### 2. منظومة التوثيق والأمان (`app/api/routers/auth.py` & `app/core/security.py`)
* **التسجيل (`POST /api/v1/auth/register`)**: التحقق من فرادة الإيميل واسم المستخدم، تشفير كلمة المرور، وتوليد JWT Access Token فوري.
* **تسجيل الدخول (`POST /api/v1/auth/login`)**: مطابقة البريد/اسم المستخدم وكلمة المرور المشفرة وإرجاع بيانات اللاعب والتوكن.
* **جلسة الضيف الفورية (`POST /api/v1/auth/guest`)**: تتيح للاعبي الويب وتطبيقات الموبايل (Flutter/React Native) البدء في اللعب الفوري وجمع النقاط دون عوائق تسجيل مسبقة.
* **الدخول الاجتماعي (`POST /api/v1/auth/social`)**: معالجة طلبات التسجيل السريع بـ Google و Apple.
* **طبقة الـ Dev Fallback الذكية (`app/dependencies/auth.py`)**: في حالة إرسال توكن تجريبي (`demo-token`) أو بدون توكن في بيئة التطوير، يقوم النظام تلقائياً بإسناد لاعب تجريبي (`usr_101 - أحمد علي`) مع كامل بياناته حتى لا تتعطل تجارب الفرونت إند.

### 3. محرك الألعاب والتقدم الذكي (`app/api/routers/games.py`)
* استعراض قائمة الألعاب مع دعم الفلترة حسب العالم (`world`) أو التصنيف (`category`).
* إرسال نتائج الجولات عبر `POST /api/v1/games/{game_id}/submit`:
  - احتساب الـ **XP** ومكافآت الـ **Coins** بناءً على النقاط والأداء بدقة.
  - تسجيل الجولة في جدول `game_sessions`.
  - إدارة عتبات ارتقاء المستوى (**Level Up**) تلقائياً وزيادة الحد الأقصى للمستوى التالي.
  - تحديث ترتيب اللاعب في لوحة الصدارة العالمية وعالم اللعبة فورياً.
  - فحص تقدم المهام اليومية للمستخدم وزيادة عدادها.
  - فحص شروط فتح الإنجازات والميداليات وفتحها تلقائياً.

### 4. مسارات المنظومة الترفيهية المتكاملة
* **الاختبارات (`/api/v1/quizzes`)**: عرض الاختبارات، حل الأسئلة، حساب سمة الشخصية والنتيجة، ومكافأة اللاعب.
* **لوحات الصدارة (`/api/v1/leaderboard`)**: جلب الترتيب العام وترتيب العوالم مع دمج أبطال نغنِش الأسبوعيين.
* **غرف الشلة (`/api/v1/party`)**: إنشاء غرف لعب جماعي بكود عشوائي فريد (مثل `NAG123`)، الانضمام، تغيير حالة الاستعداد (`Ready/Not Ready`).
* **الإنجازات والمهام (`/api/v1/achievements`, `/api/v1/missions`)**: عرض المهام اليومية، الإنجازات المتاحة والمفتوحة، والمطالبة بالمكافآت (`Claim`).
* **الأصدقاء والإشعارات (`/api/v1/friends`, `/api/v1/notifications`)**: قائمة الأصدقاء وحالتهم، إرسال دعوات التحدي، واستقبال تنبيهات الترقية والجوائز.
* **توليد الأسئلة بالذكاء الاصطناعي (`/api/v1/ai`)**: بنك أسئلة ذكي للتحديات مع الإجابات الصحيحة وشرح أسباب الإجابة.

---

## 4. دليل وهندسة قاعدة البيانات (Database Architecture & Schema)

قاعدة البيانات مبنية بأسلوب علائقي متين (**Relational Schema**) يلبي جميع متطلبات المنصة الترفيهية:

### جدول النماذج والعلاقات (Database Models):

| اسم النموذج | اسم الجدول | الغرض الأساسي والحقول الهامة | العلاقات والروابط (Foreign Keys) |
| :--- | :--- | :--- | :--- |
| `User` | `users` | الحسابات، الأفاتار، الرتبة، المستوى، الكوينز، نقاط الـ XP | المالك الأساسي لجميع العمليات والأنشطة |
| `Game` | `games` | فهرس الألعاب، العوالم، درجات الصعوبة، الجوائز | ترتبط بـ `GameSession` |
| `GameSession` | `game_sessions` | سجل كل مباراة لعبها المستخدم، النقاط المحققة والـ XP المكتسب | يرتبط بـ `users.id` و `games.id` |
| `Quiz` | `quizzes` | بيانات اختبارات الشخصية والذكاء، عدد الأسئلة والوقت | يمتلك قائمة أسئلة `QuizQuestion` |
| `QuizQuestion` | `quiz_questions` | نصوص الأسئلة وخيارات الإجابة المخزنة كـ `JSON` | يرتبط بـ `quizzes.id` |
| `QuizAttempt` | `quiz_attempts` | سجل محاولات اللاعبين للاختبارات والسمة الناتجة | يرتبط بـ `users.id` و `quizzes.id` |
| `LeaderboardRank`| `leaderboard_ranks`| ترتيب اللاعب، النقاط، عدد الفوز لكل موسم وعالم | يرتبط بـ `users.id` |
| `Tournament` | `tournaments` | البطولات التنافسية الأسبوعية، الجوائز وحالة البطولة | مستقل يحدد مواعيد وتصفيات التحديات |
| `Achievement` | `achievements` | تعريف الإنجازات، الفئات، التيرات (برونزي، ذهبي، ماسي) | ترتبط بسجلات تقدم اللاعبين |
| `UserAchievement`| `user_achievements`| متابعة تقدم اللاعب نحو إنجاز معين وحالة المطالبة | يرتبط بـ `users.id` و `achievements.id` |
| `DailyMission` | `daily_missions` | التحديات اليومية المطلوبة والجوائز المخصصة لها | ترتبط بجدول تقدم المهام |
| `UserMissionProgress` | `user_mission_progress` | حالة إنجاز المهمة اليومية لكل لاعب وتاريخ اليوم | يرتبط بـ `users.id` و `daily_missions.id` |
| `PartyRoom` | `party_rooms` | غرف التحدي المباشر، كود الغرفة (Code)، المضيف والحالة | يرتبط بـ `users.id` (Host) والمشاركين |
| `RoomParticipant`| `room_participants`| اللاعبون داخل الغرفة، نقاطهم، وحالة جاهزيتهم | يرتبط بـ `party_rooms.id` و `users.id` |
| `StoreItem` | `store_items` | المتجر الاقتصادي: أفاتار، ألقاب، حزم صوتية، الندرة والأسعار | ترتبط بمخزون اللاعبين |
| `UserInventory` | `user_inventories` | العناصر التي اشتراها اللاعب وحالة ارتدائها (Equipped) | يرتبط بـ `users.id` و `store_items.id` |
| `Friendship` | `friendships` | علاقات الصداقة وطلبات الإضافة | يرتبط بـ `users.id` مع `users.id` (طرفي الصداقة) |
| `Notification` | `notifications` | إشعارات النظام وتنبيهات التحدي وترقيات المستوى | يرتبط بـ `users.id` |

---

## 5. خطوات بناء وربط قاعدة البيانات القادمة

لإكمال مرحلة قاعدة البيانات بشكل احترافي، اتبع الخطوات التالية:

### الخطوة 1: اختيار محرك قاعدة البيانات المناسب
1. **للإنتاج والتقييم النهائي (PostgreSQL)**:
   - شغل حاوية Postgres المعدة مسبقاً في `docker-compose.yml`:
     ```bash
     docker-compose up -d postgres
     ```
   - استخدم الرابط التالي في ملف `.env`:
     ```ini
     DATABASE_URL=postgresql+asyncpg://naghanish_user:naghanish_secret_password@localhost:5432/naghanish_db
     ```
2. **للتطوير المحلي السريع (SQLite)**:
   - ثبت مكتبة `aiosqlite`:
     ```bash
     pip install aiosqlite
     ```
   - استخدم الرابط التالي في ملف `.env`:
     ```ini
     DATABASE_URL=sqlite+aiosqlite:///./naghanish.db
     ```

### الخطوة 2: تفعيل هجرات Alembic الموثقة
ملف `migrations/env.py` جاهز في المشروع، كل ما عليك فعله هو إزالة التعليق من سطور الاستيراد وربطه بـ `Base.metadata` و `settings.DATABASE_URL`، ثم تشغيل:
```bash
# توليد ملف الهجرة الأولي
alembic revision --autogenerate -m "Initial schema setup"

# تطبيق الهجرة على قاعدة البيانات
alembic upgrade head
```

### الخطوة 3: نقل البيانات اللحظية (In-Memory) إلى الجداول
* نقل مصفوفة الغرف المؤقتة `ACTIVE_ROOMS` في `party.py` لتعتمد على جدولي `party_rooms` و `room_participants` (أو كاش Redis).
* إضافة بيانات الإنجازات والمهام اليومية إلى دالة الـ Seed في `app/database/seed.py` لتخزينها مباشرة في جدولي `achievements` و `daily_missions`.

---

## 6. دليل التشغيل للتقرير (How to Run - Step by Step)

### المتطلبات السابقة (Prerequisites)
* **Python 3.10+** (مُختبر ومعتمد على Python 3.14).
* مدير الحزم **pip**.
* (اختياري) **Docker & Docker Compose** لتشغيل قواعد البيانات والخدمات السحابية.

---

### الطريقة الأولى: التشغيل المحلي السريع (Local Development)

#### 1. فتح سطر الأوامر في مجلد الباك إند:
```powershell
cd backend
```

#### 2. إنشاء وتفعيل البيئة الافتراضية (مستحسن):
```powershell
# إنشاء البيئة الافتراضية
python -m venv venv

# تفعيل البيئة على نظام Windows PowerShell
.\venv\Scripts\Activate.ps1
```

#### 3. تثبيت المتطلبات:
```powershell
pip install -r requirements.txt
pip install aiosqlite
```

#### 4. ضبط ملف المتغيرات البيئية (`.env`):
أنشئ أو عدّل ملف `.env` داخل مجلد `backend/`:
```ini
APP_ENV=development
DEBUG=true
SECRET_KEY=naghanish-super-secret-key-change-in-production-2026

# للتشغيل بـ SQLite المحلي:
DATABASE_URL=sqlite+aiosqlite:///./naghanish.db

# للتشغيل بـ PostgreSQL (إذا كان متوفراً):
# DATABASE_URL=postgresql+asyncpg://naghanish_user:naghanish_secret_password@localhost:5432/naghanish_db

ACCESS_TOKEN_EXPIRE_MINUTES=1440
REFRESH_TOKEN_EXPIRE_DAYS=7
ALGORITHM=HS256
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173
```

#### 5. تشغيل السيرفر:
```powershell
python -m uvicorn app.main:app --reload --port 8000
```

---

### الطريقة الثانية: التشغيل الشامل عبر Docker Compose (الإنتاج)

تتيح هذه الطريقة تشغيل المنظومة متكاملة (الباك إند + الواجهة الأمامية + قاعدة بيانات PostgreSQL 16 + كاش Redis) بأمر واحد من المجلد الرئيسي للمشروع:

```powershell
# من المجلد الرئيسي للمشروع naghanish/
docker-compose up -d --build
```

---

### الطريقة الثالثة: التشغيل المباشر بنقرة واحدة (Scripts)

المشروع مزود باسكربتات جاهزة تشغل الفرونت إند والباك إند معاً وتفتح المتصفح تلقائياً:
* النقر المزدوج على ملف `start.bat`.
* أو تشغيل الاسكربت عبر PowerShell:
```powershell
.\run.ps1
```

---

## 7. روابط الاختبار والتوثيق التفاعلي (API Docs & Testing)

فور تشغيل السيرفر على المنفذ `8000`، تتاح الروابط التالية لاختبار وتجربة الـ Endpoints وتضمينها في التقرير:

| البوابة | الرابط المباشر | الغرض وفائدة التقرير |
| :--- | :--- | :--- |
| **Swagger UI (Interactive)** | `http://localhost:8000/api/docs` | واجهة تفاعلية كاملة تتيح تجربة جميع الـ Endpoints مباشرة بالضغط على `Try it out` وفحص الـ Requests و Responses. |
| **ReDoc Documentation** | `http://localhost:8000/api/redoc` | توثيق رسمي بتنسيق تقرير تقني احترافي يحتوي على مواصفات كل مسار وهيكل البيانات. |
| **Health Check** | `http://localhost:8000/` | فحص صحة واستجابة السيرفر (يُرجع `status: online`). |
| **OpenAPI JSON Spec** | `http://localhost:8000/api/openapi.json` | ملف مواصفات الـ API المعياري الجاهز للاستيراد في أدوات مثل **Postman** أو **Insomnia**. |

---
**تم إعداد هذا التقرير ليكون مرجعاً تقنياً وتنفيذياً متكاملاً لمنصة نغنِش (Naghanish API 🧠)**
