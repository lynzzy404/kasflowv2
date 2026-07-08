import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'

// PWA Service Worker - disabled until Vite PWA plugin is configured.
// Registration removed to prevent 404 console error.
// Future: add vite-plugin-pwa configuration, then register:
//   navigator.serviceWorker.register('/sw.js')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
