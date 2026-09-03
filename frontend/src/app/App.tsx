/**
 * App.tsx
 *
 * Root application component. Composes all providers and the router.
 * Add new global providers here in the correct order.
 */

import { AppProviders } from '@providers/AppProviders'
import { AppRouter } from '@routes/AppRouter'

export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}
