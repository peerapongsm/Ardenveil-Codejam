/**
 * AppShell — top-level router for the Ardenveil game.
 *
 * Pages
 *   'home'         → HomePage       (title screen)
 *   'quest-select' → QuestSelectPage (pick an adventure)
 *   'game'         → GameContent     (the active quest)
 *
 * Quest state is held here so the quest-select page can control
 * whether the player resumes a save or starts fresh.
 */
import React, { useState, useEffect } from 'react'
import { HomePage }         from './pages/HomePage.js'
import { QuestSelectPage }  from './pages/QuestSelectPage.js'
import { GameProvider }     from './context/GameContext.js'
import { SceneCard }        from './components/SceneCard/SceneCard.js'
import { StatsBar }         from './components/StatsBar/StatsBar.js'
import { NotificationSystem } from './components/Notification/Notification.js'
import { HistoryLog }       from './components/HistoryLog/HistoryLog.js'
import { initSanitizer }    from './utils/sanitize.js'
import { getQuest }         from './data/quests.js'

// ─── Game layout (unchanged) ─────────────────────────────────────────────────

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

/**
 * Wrap GameProvider with the active quest's data.
 * @param {{ questId: string, resume: boolean }} props
 */
function GameContent({ questId, resume }) {
  const quest = getQuest(questId)
  if (!quest) return null

  return React.createElement(
    GameProvider,
    { scenes: quest.scenes, questId: quest.questId, startScene: quest.startScene, resume },
    React.createElement('div', { id: 'bg-art', 'aria-hidden': 'true' }),
    React.createElement(GameLayout, null)
  )
}

// ─── AppShell ────────────────────────────────────────────────────────────────

export function AppShell() {
  const [currentPage, setCurrentPage] = useState('home')
  // activeQuest: { questId: string, resume: boolean } | null
  const [activeQuest, setActiveQuest]  = useState(null)

  useEffect(() => {
    initSanitizer().catch(console.error)
  }, [])

  const handlePlayClick = () => {
    setCurrentPage('quest-select')
  }

  const handleQuestSelect = (questId, resume) => {
    setActiveQuest({ questId, resume })
    setCurrentPage('game')
  }

  const handleBackToHome = () => {
    setCurrentPage('home')
    setActiveQuest(null)
  }

  const handleBackToQuestSelect = () => {
    setCurrentPage('quest-select')
    setActiveQuest(null)
  }

  // Expose navigation helpers for in-game components
  useEffect(() => {
    window.goHome        = handleBackToHome
    window.goQuestSelect = handleBackToQuestSelect
  }, [])

  if (currentPage === 'home') {
    return React.createElement(HomePage, { onPlayClick: handlePlayClick })
  }

  if (currentPage === 'quest-select') {
    return React.createElement(QuestSelectPage, {
      onSelectQuest: handleQuestSelect,
      onBack:        handleBackToHome,
    })
  }

  // currentPage === 'game'
  if (!activeQuest) return null
  return React.createElement(GameContent, {
    questId: activeQuest.questId,
    resume:  activeQuest.resume,
  })
}
