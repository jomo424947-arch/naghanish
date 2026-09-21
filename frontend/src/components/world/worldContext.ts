/**
 * worldContext.ts
 *
 * Context and accessor hook for the active world shell. Split out of
 * `WorldShell.tsx` so that file only exports components (Fast Refresh).
 */

import { createContext, useContext } from 'react'
import { WorldThemeConfig } from '@theme/world.theme'

export interface WorldContextType {
  world: WorldThemeConfig
  activeTab: string
  setActiveTab: (tabId: string) => void
}

export const WorldContext = createContext<WorldContextType | null>(null)

export const useWorld = (): WorldContextType => {
  const context = useContext(WorldContext)
  if (!context) {
    throw new Error('useWorld must be used within a WorldShell')
  }
  return context
}
