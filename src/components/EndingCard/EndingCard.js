import React from 'react'

const ENDING_COLORS = {
  hero:    '#2d8f4a',
  chaos:   '#8f2d2d',
  neutral: '#4a7a8f',
  traitor: '#6a3d8f',
  truth:   '#8f7a2d',
}

export function EndingCard({ endingType, endingLabel, onReplay }) {
  if (!endingType) return null
  const color = ENDING_COLORS[endingType] ?? '#888'

  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      {
        className: 'stamp',
        style: {
          background: color + '22',
          border: '1px solid ' + color,
          color,
        },
        'aria-label': 'Ending: ' + endingLabel,
      },
      endingLabel
    ),
    React.createElement(
      'button',
      { className: 'replayBtn', onClick: onReplay, 'aria-label': 'Play again' },
      '↺ Play Again'
    )
  )
}
