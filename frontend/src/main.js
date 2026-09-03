import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './app/App';
const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Root element not found. Did you forget to add <div id="root"> to index.html?');
}
createRoot(rootElement).render(_jsx(StrictMode, { children: _jsx(App, {}) }));
