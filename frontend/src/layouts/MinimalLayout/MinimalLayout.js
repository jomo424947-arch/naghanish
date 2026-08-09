import { jsx as _jsx } from "react/jsx-runtime";
/**
 * MinimalLayout.tsx
 *
 * Bare-bones layout used for the Splash screen and error pages.
 * No navigation chrome.
 */
import { Outlet } from 'react-router-dom';
export function MinimalLayout() {
    // TODO: Implement minimal layout wrapper
    return _jsx(Outlet, {});
}
