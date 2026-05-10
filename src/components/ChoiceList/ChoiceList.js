import React from 'react'
import { useGameContext } from '../../context/GameContext.js'
import { isChoiceAvailable } from '../../utils/gameHelpers.js'
import { SCENES } from '../../data/scenes.js'

export function ChoiceList({ choices }) {
  const { state, applyChoice } = useGameContext()
  const scene = SCENES[state.scene]

  if (!choices || choices.length === 0) return null

  return React.createElement(
    'div',
    { className: 'divider', role: 'group', 'aria-label': 'Your choices' },
    choices.map((choice, i) => {
      const available = isChoiceAvailable(choice, state)
      return React.createElement('button', {
        key: i,
        className: 'btn' + (available ? '' : ' btn--disabled'),
        onClick: available ? () => applyChoice(choice, scene?.title ?? '') : undefined,
        disabled: !available,
        'aria-disabled': !available,
        dangerouslySetInnerHTML: {
          __html: (choice.text || '') + (choice.req ? '<span class="req">' + choice.req + '</span>' : ''),
        },
      })
    })
  )
}
