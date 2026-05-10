/**
 * Pure helper functions for game logic.
 * No side-effects — all functions are safe to unit-test in isolation.
 *
 * @module gameHelpers
 */
import { SPECIES, getSpeciesBonus } from '../data/species.js'

export { getSpeciesBonus }

/**
 * Roll a single die with `sides` faces.
 * Accepts an optional RNG for deterministic tests.
 *
 * @param {number}   sides   - number of faces (default 6)
 * @param {Function} [rng]   - () => number in [0,1), defaults to Math.random
 * @returns {number}          - result in [1, sides]
 */
export function rollDie(sides = 6, rng = Math.random) {
  return Math.floor(rng() * sides) + 1
}

/**
 * Roll two d6 and add the species bonus.
 *
 * @param {string}   speciesKey
 * @param {Function} [rng]
 * @returns {{ d1: number, d2: number, bonus: number, total: number }}
 */
export function rollCombat(speciesKey, rng = Math.random) {
  const d1    = rollDie(6, rng)
  const d2    = rollDie(6, rng)
  const bonus = getSpeciesBonus(speciesKey)
  return { d1, d2, bonus, total: d1 + d2 + bonus }
}

/**
 * Determine combat outcome.
 *
 * @param {number} total
 * @param {number} difficulty
 * @returns {boolean}
 */
export function combatSuccess(total, difficulty) {
  return total >= difficulty
}

/**
 * Evaluate whether a choice is available given current game state.
 *
 * @param {{ condition?: Function }} choice
 * @param {import('../context/gameReducer').GameState} state
 * @returns {boolean}
 */
export function isChoiceAvailable(choice, state) {
  if (typeof choice.condition !== 'function') return true
  try {
    return Boolean(choice.condition(state))
  } catch {
    return false
  }
}

/**
 * Clamp hp between 0 and maxHp.
 * @param {number} hp
 * @param {number} maxHp
 * @returns {number}
 */
export function clampHp(hp, maxHp) {
  return Math.min(maxHp, Math.max(0, hp))
}

/**
 * Build the plain-text string that the TTS service should read
 * for a given scene.
 *
 * @param {{ title: string, text: string[], combat?: object }} scene
 * @param {Function} stripFn  - stripHtml utility
 * @returns {string}
 */
export function buildTTSText(scene, stripFn) {
  if (!scene) return ''
  const title = scene.title || ''
  const body  = (scene.text || []).map(stripFn).join('. ')
  const combat = scene.combat ? `Combat encounter: ${scene.combat.desc}. ` : ''
  return `${title}. ${combat}${body}`.replace(/\s{2,}/g, ' ').trim()
}
