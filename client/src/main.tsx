import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/**
 * main.tsx — the entry point of the React app.
 *
 * StrictMode: Helps catch common bugs during development by:
 * - Running effects twice to find side-effect issues
 * - Warning about deprecated API usage
 * - Does NOT affect production builds
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
