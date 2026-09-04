# 🧠 Naghanish Backend (FastAPI + SQLAlchemy)

للدليل الكامل باللغة العربية لشرح المعمارية، وتفاصيل الـ Database Models، وخطوات التشغيل للتقرير، يرجى مراجعة الملف الرئيسي:
👉 **[BACKEND_GUIDE.md](../BACKEND_GUIDE.md)**

---

## 🚀 Quick Run (التشغيل السريع)

```powershell
# 1. Install dependencies
pip install -r requirements.txt
pip install aiosqlite

# 2. Run backend
python -m uvicorn app.main:app --reload --port 8000
```

* **Swagger Docs**: http://localhost:8000/api/docs
* **ReDoc**: http://localhost:8000/api/redoc
* **Health Check**: http://localhost:8000/
