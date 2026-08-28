import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@lib/utils'

export type GamerMascotVariant = 'hero' | 'winner' | 'empty' | 'loading' | 'avatar'
export type GamerMascotSize = 'sm' | 'md' | 'lg' | 'xl' | 'hero' | 'avatar'

export interface GamerMascotProps {
  variant?: GamerMascotVariant
  size?: GamerMascotSize
  animated?: boolean
  className?: string
  badgeText?: string
}

export const GamerMascot: React.FC<GamerMascotProps> = ({
  variant = 'hero',
  size = 'md',
  animated = true,
  className,
  badgeText,
}) => {
  const sizeStyles: Record<GamerMascotSize, string> = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
    hero: 'w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96',
    avatar: 'w-14 h-14 sm:w-16 sm:h-16',
  }

  // Render SVG based on pose variant
  const renderSVG = () => {
    switch (variant) {
      case 'winner':
        return (
          <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_15px_30px_rgba(249,115,22,0.45)]">
            <defs>
              <linearGradient id="hoodieGradWin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FB7A2B" />
                <stop offset="50%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
              <linearGradient id="headsetGradWin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="50%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
              <linearGradient id="glowGradWin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#F97316" />
              </linearGradient>
              <linearGradient id="goldTrophyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="40%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>
              <filter id="auraGlowWin" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Back Glow Aura */}
            <circle cx="160" cy="160" r="130" fill="#F97316" opacity="0.18" filter="url(#auraGlowWin)" />
            <circle cx="160" cy="160" r="100" fill="#FACC15" opacity="0.12" filter="url(#auraGlowWin)" />

            {/* Sparkles and Victory Stars */}
            <polygon points="60,60 65,75 80,80 65,85 60,100 55,85 40,80 55,75" fill="#FACC15" />
            <polygon points="260,70 264,80 275,84 264,88 260,98 256,88 245,84 256,80" fill="#F97316" />
            <polygon points="70,220 74,230 85,234 74,238 70,248 66,238 55,234 66,230" fill="#00D2FF" />
            <polygon points="255,210 258,218 266,220 258,223 255,231 252,223 244,220 252,218" fill="#FACC15" />

            {/* Character Base Torso (Orange Hoodie) */}
            <path
              d="M 90 310 C 90 240 110 215 160 215 C 210 215 230 240 230 310 Z"
              fill="url(#hoodieGradWin)"
            />
            {/* Hoodie Collar / Zipper */}
            <path d="M 140 215 L 160 260 L 180 215 Z" fill="#C2410C" />
            <line x1="160" y1="260" x2="160" y2="310" stroke="#7C2D12" strokeWidth="3" />
            {/* Hoodie Drawstrings */}
            <path d="M 145 225 Q 140 260 148 275" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 175 225 Q 180 260 172 275" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

            {/* Neck */}
            <rect x="144" y="185" width="32" height="35" rx="8" fill="#FDBA74" />
            <path d="M 144 200 C 144 210 176 210 176 200 Z" fill="#FB923C" opacity="0.4" />

            {/* Head Silhouette */}
            <circle cx="160" cy="145" r="54" fill="#FDBA74" />
            <ellipse cx="160" cy="148" rx="50" ry="46" fill="#FED7AA" />

            {/* Hair (Trendy Gamer Hair) */}
            <path
              d="M 106 140 C 104 100 125 76 160 76 C 195 76 216 100 214 140 C 205 125 195 110 175 108 C 155 106 140 115 125 120 C 115 124 108 132 106 140 Z"
              fill="#1E1B4B"
            />
            <path d="M 130 95 Q 145 78 160 88" stroke="#312E81" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 165 85 Q 185 80 195 95" stroke="#312E81" strokeWidth="4" strokeLinecap="round" fill="none" />

            {/* Face Features: Joyful Gamer Winking & Cheering */}
            {/* Right Eyebrow */}
            <path d="M 175 125 Q 188 120 196 128" stroke="#1E1B4B" strokeWidth="3.5" strokeLinecap="round" />
            {/* Left Eyebrow */}
            <path d="M 124 128 Q 132 120 145 125" stroke="#1E1B4B" strokeWidth="3.5" strokeLinecap="round" />
            {/* Left Eye (Happy Winking Arc) */}
            <path d="M 128 142 Q 138 134 148 142" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Right Eye (Big Sparkly Anime Gamer Eye) */}
            <ellipse cx="185" cy="142" rx="10" ry="12" fill="#1E1B4B" />
            <circle cx="182" cy="138" r="4.5" fill="#FFFFFF" />
            <circle cx="188" cy="146" r="2" fill="#FFFFFF" />
            {/* Rosy Cheeks */}
            <ellipse cx="125" cy="155" rx="8" ry="4.5" fill="#FB7185" opacity="0.6" />
            <ellipse cx="195" cy="155" rx="8" ry="4.5" fill="#FB7185" opacity="0.6" />
            {/* Big Smile */}
            <path
              d="M 142 160 Q 160 182 178 160 Z"
              fill="#BE123C"
              stroke="#1E1B4B"
              strokeWidth="2.5"
            />
            <path d="M 148 162 Q 160 166 172 162" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

            {/* Gaming Headset (Over-ear with neon orange accent) */}
            <path d="M 104 140 C 104 90 216 90 216 140" stroke="url(#headsetGradWin)" strokeWidth="12" strokeLinecap="round" fill="none" />
            {/* Left Earcup */}
            <rect x="96" y="125" width="16" height="38" rx="8" fill="#0F172A" stroke="#F97316" strokeWidth="2.5" />
            <circle cx="104" cy="144" r="4" fill="#F97316" />
            {/* Right Earcup */}
            <rect x="208" y="125" width="16" height="38" rx="8" fill="#0F172A" stroke="#F97316" strokeWidth="2.5" />
            <circle cx="216" cy="144" r="4" fill="#F97316" />
            {/* Headset Mic */}
            <path d="M 104 155 Q 115 180 140 175" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="142" cy="175" r="4" fill="#F97316" />

            {/* Raised Hands Holding Golden Trophy */}
            <g transform="translate(115, 175)">
              <path
                d="M 20 20 L 70 20 L 62 65 Q 45 80 28 65 Z"
                fill="url(#goldTrophyGrad)"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              {/* Trophy Handles */}
              <path d="M 20 28 Q 0 35 20 52" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 70 28 Q 90 35 70 52" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" fill="none" />
              {/* Stem & Base */}
              <rect x="38" y="74" width="14" height="14" fill="#CA8A04" />
              <rect x="26" y="86" width="38" height="10" rx="3" fill="#EAB308" />
              {/* Star on Trophy */}
              <polygon points="45,36 48,44 56,44 50,49 52,57 45,52 38,57 40,49 34,44 42,44" fill="#FFFFFF" />
            </g>
          </svg>
        )

      case 'empty':
        return (
          <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_15px_30px_rgba(249,115,22,0.35)]">
            <defs>
              <linearGradient id="hoodieGradEmp" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FB7A2B" />
                <stop offset="50%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
              <linearGradient id="glassGradEmp" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00D2FF" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
            </defs>

            {/* Ambient Searching Glow */}
            <circle cx="160" cy="160" r="120" fill="#F97316" opacity="0.12" />

            {/* Floating Question Particles */}
            <text x="70" y="90" fill="#F97316" fontSize="28" fontWeight="bold" opacity="0.6">?</text>
            <text x="240" y="100" fill="#00D2FF" fontSize="32" fontWeight="bold" opacity="0.7">?</text>
            <text x="260" y="220" fill="#FACC15" fontSize="22" fontWeight="bold" opacity="0.5">?</text>

            {/* Character Torso */}
            <path d="M 90 310 C 90 240 110 215 160 215 C 210 215 230 240 230 310 Z" fill="url(#hoodieGradEmp)" />
            <path d="M 140 215 L 160 260 L 180 215 Z" fill="#C2410C" />

            {/* Head & Neck */}
            <rect x="144" y="185" width="32" height="35" rx="8" fill="#FDBA74" />
            <circle cx="160" cy="145" r="54" fill="#FDBA74" />

            {/* Hair */}
            <path
              d="M 106 140 C 104 100 125 76 160 76 C 195 76 216 100 214 140 C 205 125 195 110 175 108 C 155 106 140 115 125 120 C 115 124 108 132 106 140 Z"
              fill="#1E1B4B"
            />

            {/* Curious Face: Raised Eyebrow & Searching Expression */}
            <path d="M 124 122 Q 134 116 144 124" stroke="#1E1B4B" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 174 128 Q 184 130 194 126" stroke="#1E1B4B" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="134" cy="142" r="7" fill="#1E1B4B" />
            <circle cx="132" cy="139" r="2.5" fill="#FFFFFF" />
            <circle cx="184" cy="142" r="7" fill="#1E1B4B" />
            <circle cx="182" cy="139" r="2.5" fill="#FFFFFF" />
            {/* Slight Inquisitive 'O' Mouth */}
            <ellipse cx="160" cy="165" rx="6" ry="7" fill="#1E1B4B" />

            {/* Gaming Headset */}
            <path d="M 104 140 C 104 90 216 90 216 140" stroke="#0F172A" strokeWidth="12" strokeLinecap="round" fill="none" />
            <rect x="96" y="125" width="16" height="38" rx="8" fill="#0F172A" stroke="#F97316" strokeWidth="2.5" />
            <rect x="208" y="125" width="16" height="38" rx="8" fill="#0F172A" stroke="#F97316" strokeWidth="2.5" />

            {/* Glowing Magnifying Glass / Scanning Lens */}
            <g transform="translate(165, 170) rotate(-15)">
              <circle cx="40" cy="40" r="32" fill="url(#glassGradEmp)" fillOpacity="0.25" stroke="#00D2FF" strokeWidth="4" />
              <circle cx="40" cy="40" r="24" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
              <path d="M 64 64 L 92 92" stroke="#F97316" strokeWidth="9" strokeLinecap="round" />
              <line x1="28" y1="28" x2="38" y2="28" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
            </g>
          </svg>
        )

      case 'loading':
        return (
          <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="loadOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FB7A2B" />
                <stop offset="100%" stopColor="#F97316" />
              </linearGradient>
            </defs>

            {/* Glowing Orbital Ring */}
            <circle cx="120" cy="120" r="95" stroke="#F97316" strokeWidth="3" strokeDasharray="16 12" opacity="0.6" />
            <circle cx="120" cy="120" r="75" stroke="#00D2FF" strokeWidth="2" strokeDasharray="8 8" opacity="0.4" />

            {/* Center Gaming Controller Icon */}
            <rect x="65" y="80" width="110" height="75" rx="28" fill="#0F172A" stroke="url(#loadOrangeGrad)" strokeWidth="3.5" />
            <circle cx="92" cy="116" r="14" fill="#1E293B" />
            <path d="M 92 108 L 92 124 M 84 116 L 100 116" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
            <circle cx="146" cy="110" r="5.5" fill="#F97316" />
            <circle cx="158" cy="122" r="5.5" fill="#00D2FF" />
            <circle cx="134" cy="122" r="5.5" fill="#FACC15" />
            <circle cx="146" cy="134" r="5.5" fill="#10B981" />

            {/* Energy Sparks */}
            <circle cx="45" cy="65" r="4" fill="#F97316" />
            <circle cx="195" cy="70" r="4.5" fill="#00D2FF" />
            <circle cx="185" cy="175" r="5" fill="#FACC15" />
            <circle cx="55" cy="170" r="3.5" fill="#F97316" />
          </svg>
        )

      case 'avatar':
        return (
          <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="avatarBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E1B4B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
              <linearGradient id="avatarHoodie" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FB7A2B" />
                <stop offset="100%" stopColor="#F97316" />
              </linearGradient>
            </defs>

            {/* Background Disc */}
            <rect width="160" height="160" rx="44" fill="url(#avatarBgGrad)" />
            <rect width="156" height="156" x="2" y="2" rx="42" stroke="#F97316" strokeWidth="2.5" strokeOpacity="0.8" />

            {/* Gamer Character Bust */}
            <path d="M 40 160 C 40 120 54 105 80 105 C 106 105 120 120 120 160 Z" fill="url(#avatarHoodie)" />
            <path d="M 70 105 L 80 128 L 90 105 Z" fill="#C2410C" />

            {/* Head */}
            <circle cx="80" cy="70" r="28" fill="#FDBA74" />
            {/* Hair */}
            <path
              d="M 52 68 C 50 46 62 34 80 34 C 98 34 108 46 108 68 C 102 60 96 52 86 51 C 76 50 68 56 62 58 Z"
              fill="#1E1B4B"
            />
            {/* Eyes */}
            <ellipse cx="70" cy="68" rx="4" ry="5.5" fill="#1E1B4B" />
            <circle cx="69" cy="66" r="1.5" fill="#FFFFFF" />
            <ellipse cx="90" cy="68" rx="4" ry="5.5" fill="#1E1B4B" />
            <circle cx="89" cy="66" r="1.5" fill="#FFFFFF" />
            {/* Smile */}
            <path d="M 74 78 Q 80 84 86 78" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Headset */}
            <path d="M 52 68 C 52 40 108 40 108 68" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" fill="none" />
            <rect x="47" y="60" width="8" height="20" rx="4" fill="#0F172A" stroke="#F97316" strokeWidth="1.5" />
            <rect x="105" y="60" width="8" height="20" rx="4" fill="#0F172A" stroke="#F97316" strokeWidth="1.5" />
          </svg>
        )

      case 'hero':
      default:
        return (
          <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_20px_40px_rgba(249,115,22,0.4)]">
            <defs>
              <linearGradient id="hoodieGradHero" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FB7A2B" />
                <stop offset="45%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#C2410C" />
              </linearGradient>
              <linearGradient id="hoodieShadeHero" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EA580C" />
                <stop offset="100%" stopColor="#9A3412" />
              </linearGradient>
              <linearGradient id="controllerGradHero" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="50%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
              <linearGradient id="neonOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FB7A2B" />
                <stop offset="100%" stopColor="#F97316" />
              </linearGradient>
              <filter id="heroSparkleGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Grand Energetic Background Aura */}
            <circle cx="200" cy="200" r="160" fill="#F97316" opacity="0.14" filter="url(#heroSparkleGlow)" />
            <circle cx="200" cy="200" r="120" fill="#FB7A2B" opacity="0.18" filter="url(#heroSparkleGlow)" />

            {/* Dynamic Speed & Motion Action Lines */}
            <line x1="30" y1="120" x2="85" y2="120" stroke="#F97316" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
            <line x1="45" y1="150" x2="90" y2="150" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
            <line x1="320" y1="100" x2="370" y2="100" stroke="#00D2FF" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
            <line x1="310" y1="130" x2="355" y2="130" stroke="#F97316" strokeWidth="3" strokeLinecap="round" opacity="0.6" />

            {/* Floating Energy Sparks & Geometric Confetti */}
            <polygon points="75,70 82,90 102,97 82,104 75,124 68,104 48,97 68,90" fill="#FACC15" filter="url(#heroSparkleGlow)" />
            <polygon points="325,75 330,88 343,93 330,98 325,111 320,98 307,93 320,88" fill="#F97316" />
            <polygon points="65,280 70,292 82,296 70,300 65,312 60,300 48,296 60,292" fill="#00D2FF" />
            <polygon points="330,270 334,280 344,284 334,288 330,298 326,288 316,284 326,280" fill="#FACC15" />
            <circle cx="105" cy="50" r="5" fill="#F97316" />
            <circle cx="295" cy="55" r="6" fill="#00D2FF" />
            <circle cx="365" cy="200" r="4.5" fill="#F97316" />
            <circle cx="35" cy="210" r="4.5" fill="#FACC15" />

            {/* Character Body / Torso in Orange Hoodie */}
            {/* Back Hood Volume */}
            <path
              d="M 120 160 C 110 110 290 110 280 160 Z"
              fill="url(#hoodieShadeHero)"
            />

            {/* Main Hoodie Torso */}
            <path
              d="M 110 390 C 110 290 135 250 200 250 C 265 250 290 290 290 390 Z"
              fill="url(#hoodieGradHero)"
            />

            {/* Hoodie Kangaroo Pocket & Seams */}
            <path
              d="M 140 340 L 260 340 L 245 390 L 155 390 Z"
              fill="#C2410C"
              stroke="#9A3412"
              strokeWidth="2"
            />
            {/* Hoodie Zipper & Strings */}
            <path d="M 175 250 L 200 300 L 225 250 Z" fill="#9A3412" />
            <line x1="200" y1="300" x2="200" y2="390" stroke="#7C2D12" strokeWidth="3" />
            <path d="M 180 260 Q 172 305 182 325" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 220 260 Q 228 305 218 325" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />

            {/* Neck */}
            <rect x="180" y="210" width="40" height="46" rx="10" fill="#FDBA74" />
            <path d="M 180 230 C 180 245 220 245 220 230 Z" fill="#FB923C" opacity="0.4" />

            {/* Head (Dynamic Angle) */}
            <circle cx="200" cy="165" r="66" fill="#FDBA74" />
            <ellipse cx="200" cy="168" rx="62" ry="58" fill="#FED7AA" />

            {/* Stylized Modern Anime Gamer Hair */}
            <path
              d="M 134 160 C 130 110 155 78 200 78 C 245 78 270 110 266 160 C 255 142 242 122 218 120 C 192 118 174 130 156 136 C 145 141 137 150 134 160 Z"
              fill="#1E1B4B"
            />
            {/* Hair Strands / Highlights */}
            <path d="M 165 102 Q 185 82 205 94" stroke="#4338CA" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 210 88 Q 235 84 246 102" stroke="#4338CA" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 148 130 Q 158 115 170 120" stroke="#4338CA" strokeWidth="3.5" strokeLinecap="round" fill="none" />

            {/* Face Details: High-Adrenaline Passionate Gamer Smile */}
            {/* Confident Eyebrows */}
            <path d="M 152 142 Q 165 132 180 138" stroke="#1E1B4B" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 220 138 Q 235 132 248 142" stroke="#1E1B4B" strokeWidth="4.5" strokeLinecap="round" />
            {/* Expressive Gaming Eyes */}
            <ellipse cx="166" cy="160" rx="12" ry="15" fill="#1E1B4B" />
            <circle cx="162" cy="154" r="5.5" fill="#FFFFFF" />
            <circle cx="170" cy="165" r="2.5" fill="#FFFFFF" />

            <ellipse cx="234" cy="160" rx="12" ry="15" fill="#1E1B4B" />
            <circle cx="230" cy="154" r="5.5" fill="#FFFFFF" />
            <circle cx="238" cy="165" r="2.5" fill="#FFFFFF" />

            {/* Rosy Action Cheeks */}
            <ellipse cx="152" cy="178" rx="10" ry="5.5" fill="#FB7185" opacity="0.6" />
            <ellipse cx="248" cy="178" rx="10" ry="5.5" fill="#FB7185" opacity="0.6" />

            {/* Confident Grin */}
            <path
              d="M 175 186 Q 200 214 225 186 Z"
              fill="#BE123C"
              stroke="#1E1B4B"
              strokeWidth="3.5"
            />
            <path d="M 182 188 Q 200 194 218 188" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />

            {/* Gaming Headset (Over-ear with glowing LED rings) */}
            <path d="M 130 160 C 130 95 270 95 270 160" stroke="#0F172A" strokeWidth="15" strokeLinecap="round" fill="none" />
            {/* Left Earcup with Orange Glowing Ring */}
            <rect x="120" y="140" width="20" height="48" rx="10" fill="#0F172A" stroke="#F97316" strokeWidth="3" />
            <circle cx="130" cy="164" r="5.5" fill="#F97316" />
            {/* Right Earcup with Orange Glowing Ring */}
            <rect x="260" y="140" width="20" height="48" rx="10" fill="#0F172A" stroke="#F97316" strokeWidth="3" />
            <circle cx="270" cy="164" r="5.5" fill="#F97316" />
            {/* Sleek Mic */}
            <path d="M 130 180 Q 145 210 175 204" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="178" cy="204" r="5" fill="#00D2FF" />

            {/* Arms Holding Futuristic Game Controller Forward */}
            {/* Left Forearm */}
            <path d="M 120 310 Q 140 280 165 295" stroke="url(#hoodieGradHero)" strokeWidth="32" strokeLinecap="round" fill="none" />
            {/* Right Forearm */}
            <path d="M 280 310 Q 260 280 235 295" stroke="url(#hoodieGradHero)" strokeWidth="32" strokeLinecap="round" fill="none" />

            {/* Gamer Controller */}
            <g transform="translate(135, 270)">
              {/* Controller Body */}
              <rect x="0" y="0" width="130" height="80" rx="30" fill="url(#controllerGradHero)" stroke="#F97316" strokeWidth="3.5" />
              {/* Controller Grips Underlay */}
              <path d="M 15 65 Q 10 90 28 92 Q 45 92 40 65" fill="#0F172A" stroke="#F97316" strokeWidth="2.5" />
              <path d="M 115 65 Q 120 90 102 92 Q 85 92 90 65" fill="#0F172A" stroke="#F97316" strokeWidth="2.5" />
              {/* Glowing Center Logo / Home Button */}
              <circle cx="65" cy="32" r="9" fill="#F97316" filter="url(#heroSparkleGlow)" />
              <circle cx="65" cy="32" r="5" fill="#FFFFFF" />

              {/* D-Pad on Left */}
              <path d="M 32 24 L 32 44 M 22 34 L 42 34" stroke="#00D2FF" strokeWidth="5" strokeLinecap="round" />

              {/* Action Buttons on Right */}
              <circle cx="98" cy="24" r="5" fill="#F97316" />
              <circle cx="108" cy="34" r="5" fill="#00D2FF" />
              <circle cx="88" cy="34" r="5" fill="#FACC15" />
              <circle cx="98" cy="44" r="5" fill="#10B981" />

              {/* Dual Analog Thumbsticks with Neon Rims */}
              <circle cx="48" cy="52" r="10" fill="#0F172A" stroke="#00D2FF" strokeWidth="2.5" />
              <circle cx="82" cy="52" r="10" fill="#0F172A" stroke="#F97316" strokeWidth="2.5" />
            </g>
          </svg>
        )
    }
  }

  return (
    <motion.div
      animate={
        animated
          ? {
              y: [0, -8, 0],
              rotate: [0, 1.2, -1.2, 0],
            }
          : undefined
      }
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      className={cn('relative select-none shrink-0 flex items-center justify-center', sizeStyles[size], className)}
    >
      {renderSVG()}

      {badgeText && (
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute -bottom-2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-[11px] shadow-glow-orange border border-orange-300/60"
        >
          {badgeText}
        </motion.div>
      )}
    </motion.div>
  )
}
