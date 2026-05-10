import React from 'react'
import { useTTS } from '../../hooks/useTTS.js'

export function SpeakButton({ scene }) {
  const { speaking, toggle, cancel } = useTTS()

  const handleClick = () => {
    if (speaking) cancel()
    else toggle(scene)
  }

  return React.createElement(
    'button',
    {
      className: 'btn' + (speaking ? ' btn--speaking' : ''),
      onClick: handleClick,
      'aria-label': speaking ? 'Stop narration' : 'Read scene aloud',
      'aria-pressed': speaking,
      title: speaking ? 'Stop' : 'Listen',
    },
    React.createElement('span', { className: 'icon', 'aria-hidden': 'true' }, speaking ? '⏹' : '🔊'),
    speaking ? 'Stop' : 'Listen'
  )
}
