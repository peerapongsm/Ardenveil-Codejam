import React from 'react'
import { useGameContext } from '../../context/GameContext.js'
import { sanitizeHtml } from '../../utils/sanitize.js'
import { LocationBanner } from '../LocationBanner/LocationBanner.js'
import { ChoiceList } from '../ChoiceList/ChoiceList.js'
import { CombatBox } from '../CombatBox/CombatBox.js'
import { SpeciesSelect } from '../SpeciesSelect/SpeciesSelect.js'
import { EndingCard } from '../EndingCard/EndingCard.js'

export function SceneCard() {
  const { state, goTo, scenes } = useGameContext()
  const scene = scenes[state.scene]
  if (!scene) return null

  const showCombat = scene.combat && (!state.combat || !state.combat.done)
  const showChoices = !showCombat && !scene.speciesSelect
  const showSpecies = scene.speciesSelect

  return React.createElement(
    'div',
    { className: 'card', 'aria-label': 'Scene: ' + scene.title },
    React.createElement(LocationBanner, { location: scene.loc, icon: scene.icon, scene }),
    React.createElement(
      'div',
      { className: 'body' },
      React.createElement(
        'div',
        { className: 'scene-header', 'aria-hidden': 'true' },
        scene.art && React.createElement('pre', { className: 'art' }, scene.art),
        React.createElement('div', { className: 'image' }, scene.image || '⚔️')
      ),
      React.createElement('h1', { className: 'title' }, scene.title),
      scene.endingType &&
        React.createElement(EndingCard, {
          endingType: scene.endingType,
          endingLabel: scene.endingLabel,
          onReplay: () => goTo('__replay__'),
        }),
      React.createElement(
        'div',
        { className: 'text' },
        (scene.text || []).map((para, i) =>
          React.createElement('p', {
            key: i,
            dangerouslySetInnerHTML: { __html: sanitizeHtml(para) },
          })
        )
      ),
      showCombat && React.createElement(CombatBox, { combat: scene.combat }),
      showSpecies && React.createElement(SpeciesSelect, null),
      showChoices && React.createElement(ChoiceList, { choices: scene.choices || [] })
    )
  )
}
