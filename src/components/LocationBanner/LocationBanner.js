import React from 'react'
import { SpeakButton } from '../SpeakButton/SpeakButton.js'

export function LocationBanner({ location, icon, scene }) {
  return React.createElement(
    'div',
    { className: 'banner', role: 'banner' },
    React.createElement('span', { className: 'location' }, location || 'Ardenveil'),
    React.createElement(
      'div',
      { className: 'right' },
      React.createElement(SpeakButton, { scene }),
      React.createElement('span', { className: 'icon', 'aria-hidden': 'true' }, icon || '🗺️')
    )
  )
}
