import React from 'react'
import { useGameContext } from '../../context/GameContext.js'
import { SPECIES } from '../../data/species.js'

export function StatsBar() {
  const { state } = useGameContext()
  const { hp, maxHp, gold, species, items } = state
  const speciesName = species ? SPECIES[species].name : '—'

  return React.createElement(
    'div',
    { className: 'statsBar', role: 'status', 'aria-label': 'Game status' },
    React.createElement(
      'div',
      { className: 'section' },
      React.createElement('span', { className: 'label', 'aria-hidden': 'true' }, '♥ HP'),
      React.createElement(
        'div',
        { className: 'pips', role: 'img', 'aria-label': hp + ' of ' + maxHp + ' HP' },
        Array.from({ length: maxHp }, (_, i) =>
          React.createElement('div', { key: i, className: 'pip' + (i >= hp ? ' pip--empty' : '') })
        )
      ),
      React.createElement('span', { className: 'label value' }, hp + '/' + maxHp)
    ),
    React.createElement(
      'div',
      { className: 'section' },
      React.createElement('span', { className: 'label' }, '⛏ Gold:'),
      React.createElement('span', { className: 'value' }, gold + 'g')
    ),
    React.createElement(
      'div',
      { className: 'section' },
      React.createElement('span', { className: 'label' }, '◆'),
      React.createElement('span', { className: 'value' }, speciesName)
    ),
    items.length > 0 && React.createElement(
      'div',
      { className: 'items', role: 'list', 'aria-label': 'Inventory' },
      items.map((item, i) =>
        React.createElement('span', { key: i, className: 'badge', role: 'listitem' }, item)
      )
    )
  )
}
