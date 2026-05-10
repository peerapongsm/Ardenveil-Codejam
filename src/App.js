import React, { useEffect } from 'react'
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

export function App() {
  useEffect(() => {
    initSanitizer().catch(console.error)
  }, [])

  return React.createElement(
    GameProvider,
    null,
    React.createElement('div', { id: 'bg-art', 'aria-hidden': 'true' }),
    React.createElement(GameLayout, null)
  )
}
