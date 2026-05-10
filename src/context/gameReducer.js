/**
 * Pure game reducer using Immer for immutable state updates.
 * All state mutations happen via Immer draft — scenes can use
 * familiar assignment syntax while keeping state truly immutable.
 *
 * @module gameReducer
 */
import { produce } from 'immer'
import { SPECIES } from '../data/species.js'

/**
 * @typedef {Object} CombatState
 * @property {string}  enemy
 * @property {number}  difficulty
 * @property {number}  hp_cost
 * @property {string}  win
 * @property {string}  lose
 * @property {string}  desc
 * @property {boolean} done
 * @property {boolean} rolled
 */

/**
 * @typedef {Object} GameState
 * @property {string}       scene
 * @property {string}       startScene  – the scene this quest begins from (used by RESET)
 * @property {string|null}  species
 * @property {string}       speciesName
 * @property {number}       hp
 * @property {number}       maxHp
 * @property {number}       gold
 * @property {string[]}     items
 * @property {Object}       flags
 * @property {Object[]}     history
 * @property {CombatState|null} combat
 * @property {string[]}     notifications
 */

/** @type {GameState} */
export const INITIAL_STATE = {
  scene: 'title',
  startScene: 'title',
  species: null,
  speciesName: '',
  hp: 5,
  maxHp: 5,
  gold: 10,
  items: [],
  flags: {},
  history: [],
  combat: null,
  notifications: [],
}

/**
 * @param {GameState} state
 * @param {{ type: string, [key: string]: any }} action
 * @returns {GameState}
 */
export function gameReducer(state, action) {
  switch (action.type) {

    case 'CHOOSE_SPECIES': {
      const sp = SPECIES[action.speciesKey]
      if (!sp) return state
      return produce(state, draft => {
        draft.species    = action.speciesKey
        draft.speciesName = sp.name
        draft.maxHp      = sp.maxHp
        draft.hp         = sp.maxHp
        if (action.speciesKey === 'human') draft.gold += 5
        draft.history.push({ title: 'Species Chosen', choice: sp.name })
      })
    }

    case 'GO_TO': {
      return produce(state, draft => {
        draft.scene  = action.scene
        draft.combat = null
        // Run onEnter hook if provided
        if (typeof action.onEnter === 'function') {
          action.onEnter(draft)
        }
      })
    }

    case 'APPLY_CHOICE': {
      return produce(state, draft => {
        if (typeof action.action === 'function') {
          action.action(draft)
        }
        draft.history.push({
          title:  action.sceneTitle,
          choice: action.choiceText,
        })
      })
    }

    case 'START_COMBAT': {
      return produce(state, draft => {
        draft.combat = { ...action.combat, done: false, rolled: false }
      })
    }

    case 'COMBAT_RESULT': {
      return produce(state, draft => {
        if (!action.success && action.hpCost) {
          draft.hp = Math.max(0, draft.hp - action.hpCost)
        }
        if (draft.combat) {
          draft.combat.done   = true
          draft.combat.rolled = true
        }
      })
    }

    case 'ADD_NOTIFICATION': {
      return produce(state, draft => {
        draft.notifications.push(action.message)
      })
    }

    case 'FLUSH_NOTIFICATIONS': {
      return produce(state, draft => { draft.notifications = [] })
    }

    case 'ADD_HISTORY': {
      return produce(state, draft => {
        draft.history.push(action.entry)
      })
    }

    case 'RESET': {
      // Reset to initial values but preserve the quest's start scene
      const sc = action.startScene ?? INITIAL_STATE.scene
      return { ...INITIAL_STATE, scene: sc, startScene: sc }
    }

    case 'LOAD_SAVE': {
      // Hydrate state from a persisted save; keep startScene from action
      const loaded = action.savedState ?? {}
      return {
        ...INITIAL_STATE,
        ...loaded,
        startScene: action.startScene ?? loaded.startScene ?? INITIAL_STATE.startScene,
        notifications: [],   // never restore transient notifications
        combat: null,        // never restore mid-combat state
      }
    }

    default:
      return state
  }
}
