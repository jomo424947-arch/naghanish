"""
stats.py - Naghanish Live Monitoring & Database Inspection Tool
Run anytime from the backend directory:
    python stats.py
"""

import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "naghanish.db")

def format_num(n):
    return f"{n:,}"

def main():
    if not os.path.exists(DB_PATH):
        print(f"❌ قاعدة البيانات غير موجودة في: {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    print("\n" + "═" * 70)
    print(" 🧠 لوحة متابعة نغنِش المباشرة — NAGHANISH LIVE DASHBOARD")
    print(f" 📅 الوقت الحالي: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f" 📁 ملف قاعدة البيانات: {DB_PATH}")
    print("═" * 70)

    # 1. إحصائيات عامة سريعة
    def count_table(table_name):
        try:
            c.execute(f"SELECT COUNT(*) FROM [{table_name}]")
            return c.fetchone()[0]
        except Exception:
            return 0

    total_users = count_table("users")
    total_sessions = count_table("game_sessions")
    total_quizzes = count_table("quiz_attempts")
    total_rooms = count_table("party_rooms")
    total_purchases = count_table("user_inventories")
    total_friends = count_table("friendships")

    print("\n📊 1. ملخص المنظومة والأرقام العامة:")
    print(f"  • إجمالي المستخدمين (Users):            {format_num(total_users)}")
    print(f"  • جلسات الألعاب الملعوبة (Game Sessions): {format_num(total_sessions)}")
    print(f"  • محاولات الاختبارات (Quiz Attempts):     {format_num(total_quizzes)}")
    print(f"  • غرف اللعب الجماعي (Party Rooms):      {format_num(total_rooms)}")
    print(f"  • عمليات شراء المتجر (Purchases):        {format_num(total_purchases)}")
    print(f"  • علاقات الصداقة (Friendships):         {format_num(total_friends)}")

    # 2. قائمة المستخدمين
    print("\n👥 2. أحدث المستخدمين المسجلين (Users List):")
    c.execute("""
        SELECT id, name, username, level, xp, coins, rank, provider, created_at 
        FROM users 
        ORDER BY created_at DESC 
        LIMIT 20
    """)
    users = c.fetchall()

    if not users:
        print("  (لا يوجد مستخدمين مسجلين حتى الآن - قاعدة البيانات نظيفة)")
    else:
        header = f"  {'الاسم':<18} | {'اسم المستخدم':<18} | {'LVL':<4} | {'XP':<6} | {'الكوينز':<7} | {'الرتبة':<12} | {'تاريخ التسجيل'}"
        print(header)
        print("  " + "-" * (len(header) + 5))
        for u in users:
            name = (u["name"] or "")[:16]
            uname = (u["username"] or "")[:16]
            created = str(u["created_at"])[:19] if u["created_at"] else "-"
            print(f"  {name:<18} | {uname:<18} | {u['level']:<4} | {u['xp']:<6} | {u['coins']:<7} | {u['rank'] or '-':<12} | {created}")

    # 3. آخر النشاطات المباشرة (Recent Game Sessions)
    print("\n🕹️ 3. آخر الجلسات والألعاب الملعوبة (Recent Game Sessions):")
    c.execute("""
        SELECT gs.id, gs.user_id, u.name as user_name, gs.game_id, gs.score, gs.xp_earned, gs.coins_earned, gs.created_at
        FROM game_sessions gs
        LEFT JOIN users u ON u.id = gs.user_id
        ORDER BY gs.created_at DESC
        LIMIT 10
    """)
    sessions = c.fetchall()
    if not sessions:
        print("  (لا توجد جلسات لعب مسجلة بعد)")
    else:
        for s in sessions:
            u_name = s["user_name"] or s["user_id"]
            created = str(s["created_at"])[:19] if s["created_at"] else "-"
            print(f"  • [{created}] اللاعب: {u_name} | لعبة: {s['game_id']} | النقاط: {s['score']} | +{s['xp_earned']} XP | +{s['coins_earned']} Coins")

    # 4. غرف اللعب الجماعي النشطة
    print("\n🎉 4. غرف اللعب الجماعي (Party Rooms):")
    c.execute("""
        SELECT pr.code, pr.name, u.name as host_name, pr.status, pr.max_players, pr.created_at
        FROM party_rooms pr
        LEFT JOIN users u ON u.id = pr.host_id
        ORDER BY pr.created_at DESC
        LIMIT 10
    """)
    rooms = c.fetchall()
    if not rooms:
        print("  (لا توجد غرف لعب مفتوحة حالياً)")
    else:
        for r in rooms:
            host = r["host_name"] or "غير معروف"
            print(f"  • كود: #{r['code']} | اسم الغرفة: {r['name']} | المضيف: {host} | الحالة: {r['status']}")

    # 5. جداول قاعدة البيانات الكاملة وعدد السجلات
    print("\n📋 5. جدول البيانات الكامل (Database Tables & Row Counts):")
    c.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    tables = [t[0] for t in c.fetchall()]
    col_w = 28
    for i in range(0, len(tables), 2):
        t1 = tables[i]
        cnt1 = count_table(t1)
        line = f"  • {t1:<24}: {format_num(cnt1):<6}"
        if i + 1 < len(tables):
            t2 = tables[i + 1]
            cnt2 = count_table(t2)
            line += f" | • {t2:<24}: {format_num(cnt2)}"
        print(line)

    print("\n" + "═" * 70)
    print(" 💡 نصائح:")
    print("  • يمكنك فتح ملف 'naghanish.db' في برنامج DB Browser for SQLite لعرض الجداول كواجهة رسومية.")
    print("  • يمكنك متابعة الـ API والمستخدمين مباشرة عبر المتصفح: http://localhost:8000/api/docs")
    print("═" * 70 + "\n")

    conn.close()

if __name__ == "__main__":
    main()
