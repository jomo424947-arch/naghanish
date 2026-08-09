# 🚀 دليل وتعليمات مطور الباك إند (Backend Developer Task Prompt)

عزيزي المطور، تم إعداد الفرونت إند بالكامل وبيئة **Docker Compose** للمشروع. يرجى استكمال الأجزاء المتبقية في الباك إند (**FastAPI + SQLAlchemy / AsyncPG**) وفق الخطوات التالية:

---

## 📌 1. ربط قاعدة البيانات (Database Configuration & Migration)

1. **إعداد الاتصال (Database Connection)**:
   - تم ضبط المتغير `DATABASE_URL` ليقرأ من بيئة النظام أو `.env`:
     `postgresql+asyncpg://naghanish_user:naghanish_secret_password@localhost:5432/naghanish_db`
   - التأكد من إعداد `session.py` للتعامل مع `AsyncSession`.

2. **تشغيل الهجرات (Alembic Migrations)**:
   ```bash
   cd backend
   alembic revision --autogenerate -m "Initial schema setup"
   alembic upgrade head
   ```

---

## 🔐 2. توثيق Google & Apple OAuth (`/api/v1/auth/social`)

الفرونت إند يستدعي الـ Endpoint الآتي عند ضغط المستخدم على زر الدخول بـ Google أو Apple:

* **Endpoint**: `POST /api/v1/auth/social`
* **Request Body**:
  ```json
  {
    "provider": "google", // أو "apple"
    "idToken": "STRING_OAUTH_TOKEN_FROM_CLIENT",
    "user": {
      "name": "أحمد علي",
      "email": "user@gmail.com",
      "username": "ahmed_player"
    }
  }
  ```

* **الاستجابة المطلوبة (Expected Response)**:
  ```json
  {
    "user": {
      "id": "usr_101",
      "name": "أحمد علي",
      "email": "user@gmail.com",
      "username": "ahmed_player",
      "avatar": "/avatars/mascot-1.svg",
      "level": 1,
      "xp": 0,
      "maxXp: 1000,
      "coins": 100,
      "rank": "مبتدئ"
    },
    "token": "JWT_ACCESS_TOKEN_HERE"
  }
  ```

* **التحقق من الـ Token**:
  - بالنسبة لـ **Google**: استخدام مكتبة `google-auth` لتأكيد الـ `idToken`.
  - بالنسبة لـ **Apple**: التحقق من التوقيع العام عبر مفاتيح Apple المعيارية (`pyjwt` + Apple Public Keys).

---

## 🎮 3. الـ Endpoints الأساسية المطلوبة للعبة والمجموعات

يرجى إكمال تشغيل وتوثيق الجداول التالية في `app/api/v1/`:
1. **`GET /api/v1/auth/me`**: إرجاع بيانات الحساب المسجل عبر الـ Bearer Token.
2. **`GET /api/v1/games`**: قائمة الألعاب المتاحة (لعبة الذاكرة، اختبار السرعة، الأسئلة).
3. **`POST /api/v1/rooms/create`**: إنشاء غرف التحدي الجماعي وإرجاع `roomCode`.
4. **`POST /api/v1/rooms/join`**: للانضمام لغرفة عبر الكود وتوفير اتصال WebSocket على `WS /api/v1/ws/room/{roomCode}`.

---

## 🐳 4. التشغيل والرفع عبر Docker

لتشغيل السيرفر وقواعد البيانات بالكامل محلياً أو على سيرفر الإنتاج:

```bash
# تشغيل كل الخدمات (Backend + Frontend + Postgres + Redis)
docker-compose up -d --build
```
