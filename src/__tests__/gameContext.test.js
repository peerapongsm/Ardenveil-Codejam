/**
 * Unit tests — GameContext utilities (pure logic, no browser APIs)
 * Run: node --test src/__tests__/gameContext.test.js
 */
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'

// Inline the private stripHtml from GameContext.js.
// This function is used to sanitise choice text before it is stored in
// the history log (applyChoice truncates to 80 chars after stripping).
// It intentionally replaces HTML entities with a space rather than
// decoding them — history entries are plain text, not rendered HTML.
function stripHtml(str) {
  return str.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ').trim()
}

describe('GameContext.stripHtml', () => {
  test('strips HTML tags', () => {
    assert.equal(stripHtml('<strong>Buy the map</strong>'), 'Buy the map')
    assert.equal(stripHtml('<em>Sneak</em> past the guards'), 'Sneak past the guards')
  })

  test('strips nested tags', () => {
    assert.equal(stripHtml('<p><em>nested</em></p>'), 'nested')
  })

  test('replaces named HTML entities with a space', () => {
    // Entities become spaces (not decoded) — plain text context
    assert.equal(stripHtml('Gold&amp;Glory'), 'Gold Glory')
    assert.equal(stripHtml('5&lt;10'), '5 10')
  })

  test('trims leading and trailing whitespace', () => {
    assert.equal(stripHtml('  plain text  '), 'plain text')
  })

  test('returns empty string unchanged', () => {
    assert.equal(stripHtml(''), '')
  })

  test('leaves plain text untouched', () => {
    assert.equal(stripHtml('Pay the innkeeper 3 gold'), 'Pay the innkeeper 3 gold')
  })

  test('choice text is truncatable to 80 chars after stripping', () => {
    const long = '<em>' + 'A'.repeat(100) + '</em>'
    const stripped = stripHtml(long)
    assert.equal(stripped.substring(0, 80).length, 80)
  })
})
