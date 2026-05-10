import React, { useCallback } from 'react'
import { useGameContext } from '../../context/GameContext.js'
import { useCombat } from '../../hooks/useCombat.js'

export function CombatBox({ combat }) {
  const { state, dispatch, goTo } = useGameContext()

  const onResult = useCallback((success, nextScene) => {
    dispatch({ type: 'COMBAT_RESULT', success, hpCost: combat.hp_cost })
    dispatch({ type: 'ADD_HISTORY', entry: { title: state.scene, choice: success ? 'Victory' : 'Defeat' } })
    if (!success) dispatch({ type: 'ADD_NOTIFICATION', message: '-' + combat.hp_cost + ' HP from the fight' })
    goTo(nextScene)
  }, [state.scene, combat, dispatch, goTo])

  const { rolling, d1, d2, bonus, total, result, roll } = useCombat(
    { combat, speciesKey: state.species },
    onResult
  )

  const resClass = result === 'success' ? 'result result--success'
                 : result === 'fail'    ? 'result result--fail'
                 : 'result'

  const rollLabel = total !== null
    ? (result === 'success'
        ? '✓ ' + total + ' vs ' + combat.difficulty + ' — Success!'
        : '✗ ' + total + ' vs ' + combat.difficulty + ' — Failed.')
    : ''

  return React.createElement(
    'div',
    { className: 'box', role: 'region', 'aria-label': 'Combat encounter' },
    React.createElement('div', { className: 'enemy', 'aria-label': 'Enemy' }, '⚔️ ' + combat.enemy),
    React.createElement('p', { className: 'desc' }, combat.desc),
    React.createElement(
      'div',
      { className: 'diceRow', 'aria-label': 'Dice roll' },
      React.createElement('div', { className: 'die' + (rolling ? ' die--rolling' : ''), 'aria-label': 'Die 1: ' + (d1 ?? '?') }, d1 ?? '?'),
      React.createElement('span', { className: 'op', 'aria-hidden': 'true' }, '+'),
      React.createElement('div', { className: 'die' + (rolling ? ' die--rolling' : ''), 'aria-label': 'Die 2: ' + (d2 ?? '?') }, d2 ?? '?'),
      React.createElement('span', { className: 'op', 'aria-hidden': 'true' }, '+'),
      React.createElement('div', { className: 'die', 'aria-label': 'Species bonus: +' + bonus }, '+' + bonus),
      React.createElement('span', { className: 'op', 'aria-hidden': 'true' }, '='),
      React.createElement('span', { className: 'total', 'aria-live': 'polite' }, total ?? '?')
    ),
    React.createElement('p', { className: resClass, 'aria-live': 'assertive' }, rollLabel),
    React.createElement(
      'button',
      {
        className: 'rollBtn',
        onClick: roll,
        disabled: rolling || combat.done || total !== null,
        'aria-label': 'Roll the dice',
      },
      'Roll the Dice'
    )
  )
}
