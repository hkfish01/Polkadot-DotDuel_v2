import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 版本號顯示
const VERSION = 'v1.0.0-mvp'
console.log(`🚀 Polkadot Duel Platform Frontend - ${VERSION}`)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

