/**
 * App.tsx
 *
 * Root application component. Composes all providers and the router.
 * Add new global providers here in the correct order.
 */

import { AppProviders } from '@providers/AppProviders'
import { AppRouter } from '@routes/AppRouter'
import { PWAInstallPrompt } from '@components/common/PWAInstallPrompt'

export default function App() {
  return (
    <AppProviders>
      <AppRouter />
      <PWAInstallPrompt />
    </AppProviders>
  )
}
