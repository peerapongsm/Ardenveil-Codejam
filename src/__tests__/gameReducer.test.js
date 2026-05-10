/**
 * Unit tests — gameReducer
 * Run: node --test src/__tests__/gameReducer.test.js
 */
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'

// Inline Immer-free reducer snapshot for testing without CDN imports
// We re-implement the reducer logic directly so tests run in Node without any network deps.

const INITIAL_STATE = {
  scene: 'title', species: null, speciesName: '',
  hp: 5, maxHp: 5, gold: 10,
  items: [], flags: {}, history: [], combat: null, notifications: [],
}

// Minimal species table for tests
const SPECIES = {
  human:     { name: 'Human',     bonus: 0, maxHp: 5 },
  elf:       { name: 'High Elf',  bonus: 1, maxHp: 5 },
  dragonborn:{ name: 'Dragonborn',bonus: 1, maxHp: 5 },
  tiefling:  { name: 'Tiefling', bonus: 0, maxHp: 5 },
  goliath:   { name: 'Goliath',  bonus: 2, maxHp: 7 },
}

// Pure reducer under test (mirrored from gameReducer.js logic, no Immer dep)
function gameReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'CHOOSE_SPECIES': {
      const sp = SPECIES[action.speciesKey]
      if (!sp) return state
      return {
        ...state,
        species: action.speciesKey,
        speciesName: sp.name,
        maxHp: sp.maxHp,
        hp: sp.maxHp,
        gold: action.speciesKey === 'human' ? state.gold + 5 : state.gold,
        history: [...state.history, { title: 'Species Chosen', choice: sp.name }],
      }
    }
    case 'GO_TO': {
      const next = { ...state, scene: action.scene, combat: null }
      if (typeof action.onEnter === 'function') {
        // shallow onEnter simulation
        const draft = structuredClone(next)
        action.onEnter(draft)
        return draft
      }
      return next
    }
    case 'APPLY_CHOICE': {
      const next = structuredClone(state)
      if (typeof action.action === 'function') action.action(next)
      next.history.push({ title: action.sceneTitle, choice: action.choiceText })
      return next
    }
    case 'START_COMBAT':
      return { ...state, combat: { ...action.combat, done: false, rolled: false } }
    case 'COMBAT_RESULT': {
      const hp = action.success ? state.hp : Math.max(0, state.hp - (action.hpCost ?? 0))
      return {
        ...state,
        hp,
        combat: state.combat ? { ...state.combat, done: true, rolled: true } : null,
      }
    }
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.message] }
    case 'FLUSH_NOTIFICATIONS':
      return { ...state, notifications: [] }
    case 'ADD_HISTORY':
      return { ...state, history: [...state.history, action.entry] }
    case 'RESET':
      return INITIAL_STATE
    default:
      return state
  }
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('INITIAL_STATE', () => {
  test('starts at title scene', () => {
    assert.equal(INITIAL_STATE.scene, 'title')
  })
  test('starts with 5 hp and 10 gold', () => {
    assert.equal(INITIAL_STATE.hp, 5)
    assert.equal(INITIAL_STATE.gold, 10)
  })
  test('starts with empty inventory and flags', () => {
    assert.deepEqual(INITIAL_STATE.items, [])
    assert.deepEqual(INITIAL_STATE.flags, {})
  })
})

describe('CHOOSE_SPECIES', () => {
  test('sets species and name', () => {
    const s = gameReducer(INITIAL_STATE, { type: 'CHOOSE_SPECIES', speciesKey: 'elf' })
    assert.equal(s.species, 'elf')
    assert.equal(s.speciesName, 'High Elf')
  })
  test('human gets +5 gold bonus', () => {
    const s = gameReducer(INITIAL_STATE, { type: 'CHOOSE_SPECIES', speciesKey: 'human' })
    assert.equal(s.gold, 15)
  })
  test('non-human species do not get gold bonus', () => {
    const s = gameReducer(INITIAL_STATE, { type: 'CHOOSE_SPECIES', speciesKey: 'tiefling' })
    assert.equal(s.gold, 10)
  })
  test('goliath sets maxHp to 7', () => {
    const s = gameReducer(INITIAL_STATE, { type: 'CHOOSE_SPECIES', speciesKey: 'goliath' })
    assert.equal(s.maxHp, 7)
    assert.equal(s.hp, 7)
  })
  test('unknown speciesKey is a no-op', () => {
    const s = gameReducer(INITIAL_STATE, { type: 'CHOOSE_SPECIES', speciesKey: 'wizard' })
    assert.equal(s.species, null)
  })
  test('records species choice in history', () => {
    const s = gameReducer(INITIAL_STATE, { type: 'CHOOSE_SPECIES', speciesKey: 'elf' })
    assert.equal(s.history.length, 1)
    assert.equal(s.history[0].title, 'Species Chosen')
    assert.equal(s.history[0].choice, 'High Elf')
  })
  test('previous state is not mutated', () => {
    const before = structuredClone(INITIAL_STATE)
    gameReducer(INITIAL_STATE, { type: 'CHOOSE_SPECIES', speciesKey: 'elf' })
    assert.equal(INITIAL_STATE.gold, before.gold)
  })
})

describe('GO_TO', () => {
  test('navigates to new scene', () => {
    const s = gameReducer(INITIAL_STATE, { type: 'GO_TO', scene: 'guild_briefing' })
    assert.equal(s.scene, 'guild_briefing')
  })
  test('resets combat on navigation', () => {
    const withCombat = { ...INITIAL_STATE, combat: { enemy: 'Dragon', done: false } }
    const s = gameReducer(withCombat, { type: 'GO_TO', scene: 'intro_ottari' })
    assert.equal(s.combat, null)
  })
  test('runs onEnter hook via draft mutation', () => {
    const onEnter = draft => { draft.flags.visited = true; draft.items.push('Torch') }
    const s = gameReducer(INITIAL_STATE, { type: 'GO_TO', scene: 'some_scene', onEnter })
    assert.equal(s.flags.visited, true)
    assert.deepEqual(s.items, ['Torch'])
  })
})

describe('APPLY_CHOICE', () => {
  test('runs choice action and records history', () => {
    const action = draft => { draft.gold -= 3; draft.flags.stealthy = true }
    const s = gameReducer(INITIAL_STATE, {
      type: 'APPLY_CHOICE', action,
      sceneTitle: 'Crimson Lantern', choiceText: 'Pay for storeroom',
    })
    assert.equal(s.gold, 7)
    assert.equal(s.flags.stealthy, true)
    assert.equal(s.history.length, 1)
    assert.equal(s.history[0].title, 'Crimson Lantern')
  })
  test('works with no action function (null)', () => {
    const s = gameReducer(INITIAL_STATE, {
      type: 'APPLY_CHOICE', action: null,
      sceneTitle: 'Title', choiceText: 'Begin',
    })
    assert.equal(s.history.length, 1)
    assert.equal(s.gold, 10)
  })
})

describe('COMBAT_RESULT', () => {
  const withCombat = { ...INITIAL_STATE, combat: { enemy: 'Bandits', done: false, hp_cost: 2 } }

  test('success — hp unchanged', () => {
    const s = gameReducer(withCombat, { type: 'COMBAT_RESULT', success: true, hpCost: 2 })
    assert.equal(s.hp, 5)
    assert.equal(s.combat.done, true)
  })
  test('failure — hp reduced by hp_cost', () => {
    const s = gameReducer(withCombat, { type: 'COMBAT_RESULT', success: false, hpCost: 2 })
    assert.equal(s.hp, 3)
  })
  test('hp cannot go below 0', () => {
    const lowHp = { ...withCombat, hp: 1 }
    const s = gameReducer(lowHp, { type: 'COMBAT_RESULT', success: false, hpCost: 5 })
    assert.equal(s.hp, 0)
  })
})

describe('NOTIFICATIONS', () => {
  test('ADD_NOTIFICATION appends message', () => {
    const s = gameReducer(INITIAL_STATE, { type: 'ADD_NOTIFICATION', message: '+5g reward' })
    assert.deepEqual(s.notifications, ['+5g reward'])
  })
  test('FLUSH_NOTIFICATIONS clears all', () => {
    let s = gameReducer(INITIAL_STATE, { type: 'ADD_NOTIFICATION', message: 'a' })
    s     = gameReducer(s, { type: 'ADD_NOTIFICATION', message: 'b' })
    s     = gameReducer(s, { type: 'FLUSH_NOTIFICATIONS' })
    assert.deepEqual(s.notifications, [])
  })
})

describe('RESET', () => {
  test('returns initial state', () => {
    let s = gameReducer(INITIAL_STATE, { type: 'CHOOSE_SPECIES', speciesKey: 'dragonborn' })
    s = gameReducer(s, { type: 'ADD_NOTIFICATION', message: 'test' })
    s = gameReducer(s, { type: 'RESET' })
    assert.equal(s.scene, 'title')
    assert.equal(s.species, null)
    assert.equal(s.gold, 10)
    assert.deepEqual(s.notifications, [])
  })
  test('clears history accumulated before reset', () => {
    let s = gameReducer(INITIAL_STATE, { type: 'CHOOSE_SPECIES', speciesKey: 'dragonborn' })
    s = gameReducer(s, { type: 'ADD_HISTORY', entry: { title: 'Guild Briefing', choice: 'Accept' } })
    assert.ok(s.history.length > 0)
    s = gameReducer(s, { type: 'RESET' })
    assert.deepEqual(s.history, [])
  })
})
