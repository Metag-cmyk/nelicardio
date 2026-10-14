import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'
import { migrateStorageKeys } from './lib/storageKeys'

// One-time migration of storage keys after the ManiRythm -> NeliCardio rename.
migrateStorageKeys()

// High-Fidelity Silent Update Logic
registerSW({ 
  immediate: true,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
