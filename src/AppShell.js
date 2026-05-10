import React, { useState, useEffect } from 'react'
import { HomePage } from './pages/HomePage.js'
import { GameProvider } from './context/GameContext.js'
import { SceneCard } from './components/SceneCard/SceneCard.js'
import { StatsBar } from './components/StatsBar/StatsBar.js'
import { NotificationSystem } from './components/Notification/Notification.js'
import { HistoryLog } from './components/HistoryLog/HistoryLog.js'
import { initSanitizer } from './utils/sanitize.js'

function GameLayout() {
  return React.createElement(
    'div',
    {
      style: {
        position: 'relative',
        zIndex: 1,
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem',
        gap: '0',
      },
    },
    React.createElement(NotificationSystem, null),
    React.createElement(StatsBar, null),
    React.createElement(SceneCard, null),
    React.createElement(HistoryLog, null)
  )
}

function GameContent() {
  return React.createElement(
    GameProvider,
    null,
    React.createElement('div', { id: 'bg-art', 'aria-hidden': 'true' }),
    React.createElement(GameLayout, null)
  )
}

export function AppShell() {
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    initSanitizer().catch(console.error)
  }, [])

  const handlePlayClick = () => {
    setCurrentPage('game')
  }

  const handleBackToHome = () => {
    setCurrentPage('home')
  }

  // Expose back-to-home via window for game components if needed
  useEffect(() => {
    window.goHome = handleBackToHome
  }, [])

  return currentPage === 'home'
    ? React.createElement(HomePage, { onPlayClick: handlePlayClick })
    : React.createElement(GameContent, null)
}
