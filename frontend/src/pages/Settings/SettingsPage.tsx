import React from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Globe, Moon, Sun, Bell, Volume2, ShieldCheck, HelpCircle, Info, LogOut } from 'lucide-react'
import { SettingsCard } from '@components/common/SettingsCard'
import { SectionTitle } from '@components/common/SectionTitle'
import { Button } from '@components/common/Button'
import { ROUTES } from '@constants/routes'
import { useAuthStore } from '@store/authStore'
import { useThemeStore } from '@store/themeStore'

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme, language, setLanguage, soundEnabled, setSoundEnabled, notificationsEnabled, setNotificationsEnabled, dir } = useThemeStore()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
      <SectionTitle
        title={dir === 'rtl' ? 'الإعدادات والخيارات ⚙️' : 'Settings ⚙️'}
        subtitle={dir === 'rtl' ? 'تخصيص الحساب والمظهر والإشعارات' : 'Manage your account settings and preferences'}
        badgeText={dir === 'rtl' ? 'الحساب' : 'Account'}
        badgeColor="purple"
      />

      {/* Group 1: Account Info Card */}
      <div className="p-6 rounded-3xl bg-brand-card border border-brand-cardBorder flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-3xl shadow-glow">
            🧠
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{user?.name || 'Ahmed Ali'}</h3>
            <p className="text-xs text-slate-400 font-medium">@{user?.username || 'ahmed_naghanish'} • {user?.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-blue/20 text-cyan-300 border border-cyan-400/30">
              Level {user?.level || 12}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/profile-setup')}
        >
          {dir === 'rtl' ? 'تعديل' : 'Edit'}
        </Button>
      </div>

      {/* Group 2: Preferences */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-1">
          {dir === 'rtl' ? 'تفضيلات التطبيق' : 'App Preferences'}
        </h3>

        <SettingsCard
          icon={<Globe className="w-5 h-5" />}
          iconBgColor="bg-cyan-500/20 text-cyan-300"
          title={dir === 'rtl' ? 'اللغة' : 'Language'}
          description={language === 'ar' ? 'العربية (RTL)' : 'English (LTR)'}
          onClick={() => navigate('/language')}
        />

        <SettingsCard
          icon={theme === 'dark' ? <Moon className="w-5 h-5 text-purple-300" /> : <Sun className="w-5 h-5 text-amber-400" />}
          iconBgColor="bg-purple-500/20 text-purple-300"
          title={dir === 'rtl' ? 'المظهر والوضع' : 'Theme'}
          description={theme === 'dark' ? (dir === 'rtl' ? 'الوضع الداكن (الرسمي)' : 'Dark Theme') : (dir === 'rtl' ? 'الوضع الفاتح' : 'Light Theme')}
          onClick={() => toggleTheme()}
        />

        <SettingsCard
          icon={<Volume2 className="w-5 h-5" />}
          iconBgColor="bg-emerald-500/20 text-emerald-300"
          title={dir === 'rtl' ? 'الأصوات المؤثرة' : 'Sound Effects'}
          description={soundEnabled ? (dir === 'rtl' ? 'المؤثرات الصوتية مفعلة' : 'Enabled') : (dir === 'rtl' ? 'معطلة' : 'Disabled')}
          action={
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-5 h-5 accent-brand-purple cursor-pointer"
            />
          }
        />

        <SettingsCard
          icon={<Bell className="w-5 h-5" />}
          iconBgColor="bg-orange-500/20 text-orange-300"
          title={dir === 'rtl' ? 'الإشعارات' : 'Notifications'}
          description={notificationsEnabled ? (dir === 'rtl' ? 'التنبيهات مفعلة' : 'Enabled') : (dir === 'rtl' ? 'معطلة' : 'Disabled')}
          action={
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-5 h-5 accent-brand-blue cursor-pointer"
            />
          }
        />
      </div>

      {/* Group 3: Support & Information */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-1">
          {dir === 'rtl' ? 'المساعدة والدعم' : 'Help & Support'}
        </h3>

        <SettingsCard
          icon={<HelpCircle className="w-5 h-5" />}
          iconBgColor="bg-blue-500/20 text-blue-300"
          title={dir === 'rtl' ? 'مركز المساعدة والأسئلة' : 'Help Center'}
          description={dir === 'rtl' ? 'الإجابات على الأسئلة الشائعة والدعم الفني' : 'FAQs & technical support'}
          onClick={() => navigate(ROUTES.HELP)}
        />

        <SettingsCard
          icon={<Info className="w-5 h-5" />}
          iconBgColor="bg-pink-500/20 text-pink-300"
          title={dir === 'rtl' ? 'عن نغانيش' : 'About Naghanish'}
          description="Version 1.0.0 • Production Build"
          onClick={() => navigate(ROUTES.ABOUT)}
        />
      </div>

      {/* Group 4: Logout */}
      <div className="mt-4">
        <SettingsCard
          icon={<LogOut className="w-5 h-5" />}
          iconBgColor="bg-red-500/20 text-red-400"
          title={dir === 'rtl' ? 'تسجيل الخروج' : 'Logout'}
          description={dir === 'rtl' ? 'الخروج الأمان من حسابك' : 'Sign out from this device'}
          isDanger={true}
          onClick={handleLogout}
        />
      </div>
    </div>
  )
}
