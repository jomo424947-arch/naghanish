# 🎨 Naghanish (نغنِش) - Frontend Developer Prompt & Specification Guide

Welcome to the **Naghanish Frontend Architecture Guide**. This document contains everything you need to build, style, optimize, and maintain the frontend of the **Naghanish (نغنِش)** interactive gaming & personality quiz web application.

---

## 🛠️ 1. Tech Stack Overview

| Category | Technology |
| :--- | :--- |
| **Core Framework** | React 18 (TypeScript) + Vite 6 |
| **Routing** | React Router v6 (`src/constants/routes.ts`) |
| **State Management** | Zustand (`useAuthStore`, `useThemeStore`) |
| **Styling & Design System** | Tailwind CSS + Vanilla CSS Variables (`globals.css`) |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **HTTP Client** | Axios (`src/api/httpClient.ts` with auto Bearer Token & 401 refresh) |
| **Localization & Theme** | RTL/LTR toggle (Arabic & English), Light & Dark mode support |

---

## 🎨 2. Design System & Contrast Standards (WCAG AA Compliance)

### Light Mode Color Tokens (`:root.light, html.light`)
- **Page Background**: Crisp Slate Off-White (`#F8FAFC`)
- **Card / Surface Background**: Pure White (`#FFFFFF`)
- **Card Borders**: Soft Slate Border (`#E2E8F0`)
- **Primary Text (Headings / Names)**: Deep Navy Charcoal (`#0F172A`)
- **Secondary Text (Subtitles / Labels)**: Dark Slate (`#475569` or `#334155`)
- **Accent Purple**: `#7C3AED`
- **Accent Cyan / Blue**: `#00D2FF` / `#0284C7`
- **Accent Amber / Gold**: `#F59E0B` / `#D97706`
- **Accent Orange**: `#FF7315` / `#EA580C`

### Dark Mode Color Tokens (`:root, html.dark`)
- **Page Background**: Deep Midnight Purple (`#0D0B18`)
- **Card / Surface Background**: Dark Purple-Navy (`#1D1D36`)
- **Card Borders**: Subtle Translucent Border (`#2E2E54`)
- **Primary Text**: Pure White (`#FFFFFF`)
- **Secondary Text**: Light Slate (`#94A3B8` / `#CBD5E1`)

---

## 📱 3. Core Page Architecture & Responsibilities

### A. Home Page (`src/pages/Home/HomePage.tsx`)
- **Top Greeting Bar**: Displays player name (`user?.name`), avatar icon, Level badge (`LVL 12`), and XP progress bar with high-contrast text.
- **Daily Challenge Hero Banner**: High-visibility banner promoting the daily IQ & Speed challenge with direct play triggers.
- **Main Categories Grid**: 8 interactive category cards:
  - 🧠 *Brain Games* (`/games`)
  - ✨ *Quizzes* (`/quizzes`)
  - 👥 *Party Night* (`/party`)
  - 🏆 *Leaderboard* (`/leaderboard`)
  - 🎁 *Achievements* (`/achievements`)
  - 🛍️ *Store* (`/store`)
  - 🤖 *AI Assistant* (`/ai`)
  - 👤 *Profile* (`/profile`)

### B. Profile Page (`src/pages/Profile/ProfilePage.tsx`)
- **Electric Gamer Pass Hero Header**: Vibrant purple-blue gradient banner featuring avatar ring, `@username`, bio, and XP level progress bar. Text uses high-contrast `#FFFFFF` and `#38BDF8`.
- **4 Stat Cards**: Clean 3X-large cards displaying `Games Played`, `Wins`, `Awards`, and `Coins` with distinct colored icon badges and `#0F172A` values.
- **Selected Interests Tags**: Badge list displaying user-selected interests (`Brain Games`, `Party Night`, `Memory`, `Speed`, `Relationships`).

### C. Authentication Pages (`LoginPage.tsx` & `RegisterPage.tsx`)
- **1-Click OAuth**: Clean card featuring Google OAuth and Apple OAuth buttons.
- **Auth Guard**: Integrates with `useAuthStore` to set persistent session state and redirect to `/welcome` or `/home`.

### D. Party Night & Room Pages (`JoinRoomPage.tsx`, `CreateRoomPage.tsx`, `PartyPage.tsx`)
- **Room Join**: Input field with regex sanitization restricting input to 6 uppercase alphanumeric characters.
- **Room Create**: Room settings form for max players, quiz topics, and round limits.
- **Lobby**: Real-time room participant list with host controls.

---

## 🔌 4. API Integration & Service Architecture

### HTTP Client (`src/api/httpClient.ts`)
- Pre-configured Axios instance using `import.meta.env.VITE_API_BASE_URL` (default: `http://localhost:8000/api/v1`).
- Request Interceptor automatically attaches `Authorization: Bearer <token>` from `useAuthStore`.
- Response Interceptor catches `401 Unauthorized` responses to clear auth state and trigger clean logout.

### AuthService (`src/services/AuthService.ts`)
```ts
export const AuthService = {
  socialLogin: async (provider: 'google' | 'apple', idToken: string) => {
    const response = await httpClient.post('/auth/social-login', { provider, idToken })
    return response.data
  },
  getCurrentUser: async () => {
    const response = await httpClient.get('/auth/me')
    return response.data
  },
  logout: async () => {
    const response = await httpClient.post('/auth/logout')
    return response.data
  }
}
```

---

## ⚡ 5. How to Run & Verify

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Local Dev Server**:
   ```bash
   npm run dev
   ```
   *Access the app at: `http://localhost:3000`*

3. **Verify Build & Types**:
   ```bash
   npm run build
   ```
   *Runs `tsc --noEmit && vite build` to ensure 0 TypeScript or bundling errors.*
