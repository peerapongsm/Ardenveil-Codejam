/**
 * Unit tests — gameHelpers (pure functions)
 * Run: node --test src/__tests__/gameHelpers.test.js
 */
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'

// Inline the pure helpers to avoid module resolution issues in raw node
function rollDie(sides = 6, rng = Math.random) {
  return Math.floor(rng() * sides) + 1
}
function rollCombat(speciesKey, rng = Math.random) {
  const BONUS = { human:0, elf:1, dragonborn:1, tiefling:0, goliath:2 }
  const bonus = BONUS[speciesKey] ?? 0
  const d1 = rollDie(6, rng)
  const d2 = rollDie(6, rng)
  return { d1, d2, bonus, total: d1 + d2 + bonus }
}
function combatSuccess(total, difficulty) { return total >= difficulty }
function clampHp(hp, maxHp) { return Math.min(maxHp, Math.max(0, hp)) }
function buildTTSText(scene, stripFn) {
  if (!scene) return ''
  const title  = scene.title || ''
  const body   = (scene.text || []).map(stripFn).join('. ')
  const combat = scene.combat ? `Combat encounter: ${scene.combat.desc}. ` : ''
  return `${title}. ${combat}${body}`.replace(/\s{2,}/g, ' ').trim()
}
function stripHtml(str) {
  return str.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}
function isChoiceAvailable(choice, state) {
  if (typeof choice.condition !== 'function') return true
  try { return Boolean(choice.condition(state)) } catch { return false }
}

describe('rollDie', () => {
  test('returns value between 1 and sides (inclusive)', () => {
    for (let i = 0; i < 200; i++) {
      const r = rollDie(6)
      assert.ok(r >= 1 && r <= 6, `Expected 1-6, got ${r}`)
    }
  })
  test('works with deterministic rng', () => {
    assert.equal(rollDie(6, () => 0),   1)  // floor(0*6)+1 = 1
    assert.equal(rollDie(6, () => 0.99), 6) // floor(0.99*6)+1 = 6
  })
  test('default sides is 6', () => {
    const r = rollDie(undefined, () => 0.5)
    assert.equal(r, 4)  // floor(0.5*6)+1 = 4
  })
})

describe('rollCombat', () => {
  test('adds species bonus to dice total', () => {
    const alwaysOne = () => 0  // rollDie returns 1 for each die
    const result = rollCombat('goliath', alwaysOne)
    assert.equal(result.d1, 1)
    assert.equal(result.d2, 1)
    assert.equal(result.bonus, 2)
    assert.equal(result.total, 4)  // 1+1+2
  })
  test('human has 0 bonus', () => {
    const r = rollCombat('human', () => 0)
    assert.equal(r.bonus, 0)
    assert.equal(r.total, 2)  // 1+1+0
  })
  test('elf has +1 bonus', () => {
    const r = rollCombat('elf', () => 0)
    assert.equal(r.bonus, 1)
    assert.equal(r.total, 3)
  })
  test('unknown species defaults to 0 bonus', () => {
    const r = rollCombat('wizard', () => 0)
    assert.equal(r.bonus, 0)
  })
})

describe('combatSuccess', () => {
  test('total >= difficulty is success', () => {
    assert.equal(combatSuccess(9, 9), true)
    assert.equal(combatSuccess(12, 9), true)
  })
  test('total < difficulty is failure', () => {
    assert.equal(combatSuccess(8, 9), false)
    assert.equal(combatSuccess(2, 10), false)
  })
})

describe('clampHp', () => {
  test('clamps to [0, maxHp]', () => {
    assert.equal(clampHp(-1, 5),  0)
    assert.equal(clampHp(6, 5),   5)
    assert.equal(clampHp(3, 5),   3)
    assert.equal(clampHp(0, 5),   0)
    assert.equal(clampHp(5, 5),   5)
  })
})

describe('stripHtml', () => {
  test('removes tags', () => {
    assert.equal(stripHtml('<em>hello</em>'), 'hello')
    assert.equal(stripHtml('<strong>bold</strong> text'), 'bold text')
  })
  test('handles nested tags', () => {
    assert.equal(stripHtml('<p><em>nested</em></p>'), 'nested')
  })
  test('collapses whitespace', () => {
    assert.equal(stripHtml('  a   b  '), 'a b')
  })
  test('empty string returns empty string', () => {
    assert.equal(stripHtml(''), '')
  })
})

describe('buildTTSText', () => {
  test('returns empty string for null scene', () => {
    assert.equal(buildTTSText(null, stripHtml), '')
  })
  test('combines title and text paragraphs', () => {
    const scene = { title: 'The Vault', text: ['First para.', '<em>Second</em>.'] }
    const result = buildTTSText(scene, stripHtml)
    assert.ok(result.startsWith('The Vault.'))
    assert.ok(result.includes('First para.'))
    assert.ok(result.includes('Second.'))
  })
  test('includes combat desc when present', () => {
    const scene = { title: 'Fight!', text: [], combat: { desc: 'Three bandits attack.' } }
    const result = buildTTSText(scene, stripHtml)
    assert.ok(result.includes('Three bandits attack.'))
  })
})

describe('isChoiceAvailable', () => {
  test('no condition → always available', () => {
    assert.equal(isChoiceAvailable({ text: 'Go' }, {}), true)
  })
  test('condition returning true → available', () => {
    const choice = { condition: s => s.species === 'dragonborn' }
    assert.equal(isChoiceAvailable(choice, { species: 'dragonborn' }), true)
  })
  test('condition returning false → not available', () => {
    const choice = { condition: s => s.species === 'dragonborn' }
    assert.equal(isChoiceAvailable(choice, { species: 'human' }), false)
  })
  test('throwing condition → not available (safe fallback)', () => {
    const choice = { condition: () => { throw new Error('boom') } }
    assert.equal(isChoiceAvailable(choice, {}), false)
  })
  test('item-check condition', () => {
    const choice = { condition: s => s.items.includes("Scholar's Notes") }
    assert.equal(isChoiceAvailable(choice, { items: [] }), false)
    assert.equal(isChoiceAvailable(choice, { items: ["Scholar's Notes"] }), true)
  })
})
