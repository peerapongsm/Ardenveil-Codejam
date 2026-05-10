import React, { useState } from 'react'
import { useGameContext } from '../../context/GameContext.js'

export function HistoryLog() {
  const { state } = useGameContext()
  const [open, setOpen] = useState(false)

  if (!state.history.length) return null

  return React.createElement(
    'div',
    {
      style: {
        width: '100%',
        maxWidth: 'var(--max-content)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      },
    },
    React.createElement(
      'button',
      {
        className: 'toggle',
        onClick: () => setOpen((o) => !o),
        'aria-expanded': open,
        'aria-controls': 'history-log',
      },
      open ? '▲ Journal' : '▼ Journal'
    ),
    open &&
      React.createElement(
        'div',
        {
          id: 'history-log',
          className: 'log',
          role: 'log',
          'aria-label': 'Adventure journal',
        },
        state.history.map((entry, i) =>
          React.createElement(
            'div',
            { key: i, className: 'entry' },
            React.createElement('strong', null, entry.title),
            entry.choice ? ' → ' + entry.choice : null
          )
        )
      )
  )
}
