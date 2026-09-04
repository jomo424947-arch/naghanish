# دليل التشغيل والنشر الشامل لمنصة نغنِش (Naghanish Production & Docker Guide)

هذا الدليل يشرح لك خطوة بخطوة:
1. **كيف تشغل المشروع محلياً باستخدام Docker على جهازك (Windows)**
2. **كيف ترفع وتشغل المنصة كاملة على سيرفرك الحقيقي (VPS / Cloud Server)**
3. **أوامر الإدارة، فحص السجلات (Logs)، والنسخ الاحتياطي للبيانات**

---

## 🏗️ البنية المعمارية للنظام (Architecture Overview)

المنصة تعمل كمنظومة متكاملة من 4 حاويات رئيسية عبر Docker Compose:
- **`naghanish_frontend`**: واجهة المستخدم المبنية بـ React + Vite والمقدمة عبر سيرفر Nginx فائق السرعة مع دعم WebSocket Proxying.
- **`naghanish_backend`**: خادم FastAPI عالي الأداء يدعم الـ Async/Await، التوثيق بالـ JWT، والاتصال اللحظي بـ WebSockets.
- **`naghanish_postgres`**: قاعدة بيانات PostgreSQL 16 مزودة بـ Connection Pooling وفهارس سريعة لدعم 100,000+ مستخدم.
- **`naghanish_redis`**: ذاكرة تخزين مؤقت لإدارة غرف اللعب الجماعية (Rooms) والتزامن اللحظي.

---

## أولاً: التشغيل المحلي على جهازك (Local Development on Windows)

### 1. تشغيل Docker Desktop
- تأكد أن برنامج **Docker Desktop** مفتوح ويعمل في شريط المهام بالأسفل.
- (إذا ظهرت رسالة `failed to connect to docker API`، فهذا يعني فقط أن برنامج Docker Desktop لم يتم فتحه بعد).

### 2. تجهيز ملف البيئة (.env)
قم بإنشاء ملف `.env` في مجلد المشروع الرئيسي عن طريق نسخ `.env.example`:
```powershell
Copy-Item .env.example .env
```

### 3. بناء وتشغيل الحاويات بضغطة زر
افتح PowerShell داخل مجلد `naghanish-main` واكتب:
```powershell
docker compose up --build
```
> **ملاحظة:** للتشغيل في الخلفية (Background) أضف `-d`:
> ```powershell
> docker compose up -d --build
> ```

### 4. الروابط المتاحة بعد التشغيل:
- 🌐 **واجهة الموقع الرئيسية**: `http://localhost` أو `http://localhost:3000`
- 📚 **لوحة تحكم وتوثيق الـ API (Swagger)**: `http://localhost:8000/api/docs`
- ⚡ **فحص صحة السيرفر**: `http://localhost:8000/health`

---

## ثانياً: كيفية رفع وتشغيل المشروع على السيرفر (Production Server Deployment)

سواء كان سيرفرك على **Hetzner، DigitalOcean، AWS، Contabo أو أي سيرفر Linux (Ubuntu 22.04 / 24.04)**:

### الخطوة 1: تجهيز السيرفر وتثبيت Docker
اتصل بسيرفرك عبر SSH:
```bash
ssh root@YOUR_SERVER_IP
```

قم بتحديث السيرفر وتثبيت Docker بضغطة واحدة:
```bash
# تحديث الحزم
sudo apt update && sudo apt upgrade -y

# تثبيت Docker & Docker Compose
curl -fsSL https://get.docker.com | sh

# التحقق من نجاح التثبيت
docker --version
docker compose version
```

---

### الخطوة 2: رفع ملفات المشروع إلى السيرفر
يمكنك اختيار إحدى الطريقتين:

#### الطريقة (أ) عبر Git (مستحسنة):
```bash
cd /var/www
git clone https://github.com/YOUR_REPO/naghanish.git
cd naghanish
```

#### الطريقة (ب) عبر الرفع المباشر من جهازك (SCP أو Rsync):
من موجه الأوامر على جهازك:
```powershell
scp -r C:\Users\jomo4\OneDrive\Desktop\naghanish-main root@YOUR_SERVER_IP:/var/www/naghanish
```

---

### الخطوة 3: ضبط متغيرات الإنتاج (.env)
على السيرفر، انتقل لمجلد المشروع:
```bash
cd /var/www/naghanish
cp .env.example .env
nano .env
```
قم بتعديل الآتي:
1. `POSTGRES_PASSWORD`: ضع كلمة مرور قوية ومعقدة.
2. `SECRET_KEY`: ولد مفتاح أمان عشوائي عبر تشغيل الأمر:
   ```bash
   openssl rand -hex 32
   ```
3. `CORS_ORIGINS`: أضف نطاق موقعك الفعلي (مثال: `["https://naghanish.com"]`).

---

### الخطوة 4: إطلاق المشروع على السيرفر
قم ببناء الحاويات وتشغيلها في الخلفية:
```bash
docker compose up -d --build
```

---

### الخطوة 5: تطبيق جداول قاعدة البيانات وتغذية البيانات الأولية (Seeding)
لتشغيل الـ Migrations وملء الألعاب والمستويات تلقائياً داخل قاعدة بيانات PostgreSQL:
```bash
# إنشاء الجداول عبر Alembic
docker compose exec backend alembic upgrade head

# تغذية الألعاب، الاختبارات، والإنجازات الأولية
docker compose exec backend python -m app.database.seed
```

---

### الخطوة 6: تفعيل شهادة الأمان المجانية (SSL / HTTPS)

لتأمين موقعك بشهادة SSL رسمية من Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🛠️ أهم أوامر الصيانة والإدارة (Cheat Sheet)

| الأمر | الوظيفة |
| :--- | :--- |
| `docker compose ps` | عرض حالة جميع الحاويات (هل تعمل أم متوقفة) |
| `docker compose logs -f backend` | متابعة سجلات الباك إند والريكوستات لحظياً |
| `docker compose logs -f` | متابعة سجلات كل الخدمات معاً |
| `docker compose restart` | إعادة تشغيل جميع الخدمات |
| `docker compose restart backend` | إعادة تشغيل الباك إند فقط بعد تعديل كود |
| `docker compose down` | إيقاف جميع الحاويات |
| `docker compose down -v` | ⚠️ إيقاف الحاويات مع حذف وحدات التخزين (قاعدة البيانات) |

---

## 💾 النسخ الاحتياطي التلقائي لقاعدة البيانات (PostgreSQL Backup)

لأخذ نسخة احتياطية من قاعدة البيانات في أي وقت:
```bash
docker compose exec -t db pg_dump -U naghanish_admin naghanish_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

لاستعادة نسخة احتياطية:
```bash
cat backup_file.sql | docker compose exec -T db psql -U naghanish_admin -d naghanish_db
```
