import React from 'react'
import { useGameContext } from '../../context/GameContext.js'
import { SPECIES } from '../../data/species.js'

export function SpeciesSelect() {
  const { dispatch, goTo } = useGameContext()

  const choose = (key) => {
    dispatch({ type: 'CHOOSE_SPECIES', speciesKey: key })
    dispatch({ type: 'ADD_NOTIFICATION', message: 'You are ' + SPECIES[key].name + '. ' + SPECIES[key].trait + ' active.' })
    goTo('intro_ottari')
  }

  return React.createElement(
    'div',
    { className: 'wrapper' },
    React.createElement(
      'div',
      { className: 'grid', role: 'list', 'aria-label': 'Choose your species' },
      Object.entries(SPECIES).map(([key, sp]) =>
        React.createElement(
          'button',
          {
            key,
            className: 'card',
            role: 'listitem',
            onClick: () => choose(key),
            'aria-label': 'Choose ' + sp.name + ': ' + sp.trait,
          },
          React.createElement('span', { className: 'icon', 'aria-hidden': 'true' }, sp.icon),
          React.createElement('div', { className: 'name' }, sp.name),
          React.createElement('div', { className: 'trait' }, sp.trait),
          React.createElement('p', { className: 'desc' }, sp.desc)
        )
      )
    )
  )
}
