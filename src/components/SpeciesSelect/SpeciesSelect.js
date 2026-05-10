import React from 'react'
import { useGameContext } from '../../context/GameContext.js'
import { SPECIES } from '../../data/species.js'

export function SpeciesSelect() {
  const { state, dispatch, goTo, scenes } = useGameContext()

  const choose = (key) => {
    // Read the next scene from the current scene definition so this component
    // works for any quest, not just the original Chromatic Seal.
    const currentScene = scenes[state.scene]
    const nextScene = currentScene?.speciesNext ?? 'intro_ottari'

    dispatch({ type: 'CHOOSE_SPECIES', speciesKey: key })
    dispatch({ type: 'ADD_NOTIFICATION', message: 'You are ' + SPECIES[key].name + '. ' + SPECIES[key].trait + ' active.' })
    goTo(nextScene)
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
