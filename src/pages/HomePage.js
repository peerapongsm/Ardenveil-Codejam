import React, { useState } from 'react'

export function HomePage({ onPlayClick }) {
  const [loading, setLoading] = useState(false)

  const handlePlayClick = () => {
    setLoading(true)
    onPlayClick()
  }

  const buttonClass = 'home-play-btn ' + (loading ? 'loading' : '')

  return React.createElement(
    'div',
    { className: 'home-container' },
    React.createElement(
      'div',
      { className: 'home-content' },
      React.createElement(
        'div',
        { className: 'home-header' },
        React.createElement('h1', { className: 'home-title' }, 'Ardenveil'),
        React.createElement('p', { className: 'home-subtitle' }, 'A Text Adventure Game')
      ),
      React.createElement(
        'div',
        { className: 'home-description' },
        React.createElement(
          'p',
          null,
          'Embark on an epic journey through a mystical realm filled with danger and wonder.'
        ),
        React.createElement('p', null, 'Your choices shape your destiny. Who will you become?')
      ),
      React.createElement(
        'button',
        {
          className: buttonClass,
          onClick: handlePlayClick,
          disabled: loading,
        },
        loading ? 'Loading...' : 'PLAY'
      ),
      React.createElement(
        'div',
        { className: 'home-features' },
        React.createElement(
          'div',
          { className: 'feature' },
          React.createElement('span', { className: 'feature-icon' }, '⚔️'),
          React.createElement('p', null, 'Epic Combat System')
        ),
        React.createElement(
          'div',
          { className: 'feature' },
          React.createElement('span', { className: 'feature-icon' }, '🎭'),
          React.createElement('p', null, 'Choice-Driven Story')
        ),
        React.createElement(
          'div',
          { className: 'feature' },
          React.createElement('span', { className: 'feature-icon' }, '🎤'),
          React.createElement('p', null, 'Text-to-Speech Narration')
        )
      )
    ),
    React.createElement('div', {
      id: 'bg-art-home',
      className: 'home-bg',
      'aria-hidden': 'true',
    })
  )
}
