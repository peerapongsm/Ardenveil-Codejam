/**
 * QuestSelectPage — lets the player pick an adventure before entering the game.
 *
 * Shows every quest defined in quests.js as a card. If a save exists for a
 * quest the card surfaces "Continue" (resume) and "New Game" (clear + start)
 * options; otherwise it shows a single "Begin Adventure" button.
 *
 * Props:
 *   onSelectQuest(questId, resume: boolean) — called when the player commits
 *   onBack()                                — returns to the home page
 *
 * @module QuestSelectPage
 */
import React, { useState, useEffect } from 'react'
import { QUESTS }                       from '../data/quests.js'
import { hasSave, getSaveSummary, clearState } from '../utils/saveManager.js'

// ─── helpers ────────────────────────────────────────────────────────────────

function formatSaveDate(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function difficultyColor(difficulty) {
  if (!difficulty) return '#888'
  const d = difficulty.toLowerCase()
  if (d.includes('easy'))       return '#5cb85c'
  if (d.includes('moderate'))   return '#d4ab2d'
  if (d.includes('challenging')) return '#e08030'
  if (d.includes('hard'))        return '#c0392b'
  return '#aaa'
}

// ─── SaveBadge ──────────────────────────────────────────────────────────────

function SaveBadge({ questId }) {
  const summary = getSaveSummary(questId)
  if (!summary) return null

  return React.createElement(
    'div',
    { className: 'qs-save-badge' },
    React.createElement('span', { className: 'qs-save-icon' }, '💾'),
    React.createElement(
      'span',
      { className: 'qs-save-text' },
      `${summary.historyLength} choice${summary.historyLength !== 1 ? 's' : ''} · saved ${formatSaveDate(summary.savedAt)}`
    )
  )
}

// ─── QuestCard ──────────────────────────────────────────────────────────────

function QuestCard({ quest, onBegin, onContinue, onNewGame }) {
  const [hasProgress, setHasProgress] = useState(false)

  useEffect(() => {
    setHasProgress(hasSave(quest.questId))
  }, [quest.questId])

  const handleNewGame = () => {
    clearState(quest.questId)
    setHasProgress(false)
    onNewGame(quest.questId)
  }

  const handleContinue = () => {
    onContinue(quest.questId)
  }

  const handleBegin = () => {
    onBegin(quest.questId)
  }

  return React.createElement(
    'article',
    { className: 'qs-card' },

    // ── art block ──────────────────────────────────────────────────────────
    React.createElement(
      'div',
      { className: 'qs-card-art' },
      React.createElement('pre', { className: 'qs-card-ascii', 'aria-hidden': 'true' }, quest.art),
      React.createElement('span', { className: 'qs-card-icon', 'aria-hidden': 'true' }, quest.icon)
    ),

    // ── body ───────────────────────────────────────────────────────────────
    React.createElement(
      'div',
      { className: 'qs-card-body' },

      // subtitle + title
      React.createElement('p',  { className: 'qs-card-subtitle' }, quest.subtitle),
      React.createElement('h2', { className: 'qs-card-title'    }, quest.title),

      // region + meta row
      React.createElement(
        'div',
        { className: 'qs-card-meta' },
        React.createElement(
          'span',
          { className: 'qs-meta-tag' },
          quest.regionIcon, ' ', quest.region
        ),
        React.createElement(
          'span',
          {
            className: 'qs-meta-tag qs-difficulty',
            style: { color: difficultyColor(quest.difficulty) },
          },
          '⚔ ', quest.difficulty
        ),
        React.createElement(
          'span',
          { className: 'qs-meta-tag' },
          '⏱ ', quest.estimatedTime
        )
      ),

      // description
      React.createElement('p', { className: 'qs-card-desc' }, quest.description),

      // save badge (only when progress exists)
      hasProgress ? React.createElement(SaveBadge, { questId: quest.questId }) : null,

      // ── action buttons ─────────────────────────────────────────────────
      React.createElement(
        'div',
        { className: 'qs-card-actions' },

        hasProgress
          ? React.createElement(
              React.Fragment,
              null,
              React.createElement(
                'button',
                { className: 'qs-btn qs-btn-primary', onClick: handleContinue },
                '▶ Continue'
              ),
              React.createElement(
                'button',
                { className: 'qs-btn qs-btn-ghost', onClick: handleNewGame },
                '↺ New Game'
              )
            )
          : React.createElement(
              'button',
              { className: 'qs-btn qs-btn-primary', onClick: handleBegin },
              '✦ Begin Adventure'
            )
      )
    )
  )
}

// ─── QuestSelectPage ────────────────────────────────────────────────────────

/**
 * @param {{ onSelectQuest: (questId: string, resume: boolean) => void, onBack: () => void }} props
 */
export function QuestSelectPage({ onSelectQuest, onBack }) {
  return React.createElement(
    'div',
    { className: 'qs-container' },

    // ambient background layer
    React.createElement('div', { className: 'qs-bg', 'aria-hidden': 'true' }),

    // scrollable inner
    React.createElement(
      'div',
      { className: 'qs-inner' },

      // ── header ──────────────────────────────────────────────────────────
      React.createElement(
        'header',
        { className: 'qs-header' },
        React.createElement(
          'button',
          { className: 'qs-back-btn', onClick: onBack, 'aria-label': 'Back to home' },
          '← Back'
        ),
        React.createElement(
          'div',
          { className: 'qs-header-text' },
          React.createElement('h1', { className: 'qs-heading' }, 'Choose Your Quest'),
          React.createElement(
            'p',
            { className: 'qs-subheading' },
            'The Adventure Guild awaits. Select your next commission.'
          )
        )
      ),

      // ── quest grid ──────────────────────────────────────────────────────
      React.createElement(
        'div',
        { className: 'qs-grid' },
        QUESTS.map(quest =>
          React.createElement(QuestCard, {
            key:        quest.questId,
            quest,
            onBegin:    (id) => onSelectQuest(id, false),
            onContinue: (id) => onSelectQuest(id, true),
            onNewGame:  (id) => onSelectQuest(id, false),
          })
        )
      ),

      // ── footer note ─────────────────────────────────────────────────────
      React.createElement(
        'footer',
        { className: 'qs-footer' },
        React.createElement(
          'p',
          null,
          '✦ Progress is saved automatically. You may return to the Guild at any time. ✦'
        )
      )
    )
  )
}
