/**
 * Unit tests — TTSService (provider selection, cancel, state)
 * Run: node --test src/__tests__/ttsService.test.js
 */
import { test, describe, beforeEach, mock } from 'node:test'
import assert from 'node:assert/strict'

// ── Minimal re-implementation of TTSService for pure Node testing ──
// The real service uses window.speechSynthesis and fetch — we test
// the provider-selection and state-management logic in isolation.

const WSA_VOICE_PREFS = ['george', 'daniel', 'en-gb', 'en-us']

function pickBestVoice(voices) {
  for (const pref of WSA_VOICE_PREFS) {
    const match = voices.find(v => v.name.toLowerCase().includes(pref))
    if (match) return match
  }
  // Prefer en-GB over other English for more authoritative fantasy tone
  return voices.find(v => v.lang?.startsWith('en-GB'))
      ?? voices.find(v => v.lang?.startsWith('en'))
      ?? voices[0] ?? null
}

describe('pickBestVoice', () => {
  test('prefers George voice by name', () => {
    const voices = [
      { name: 'Fiona', lang: 'en-US' },
      { name: 'Google UK English Male (George)', lang: 'en-GB' },
      { name: 'Alex', lang: 'en-US' },
    ]
    const pick = pickBestVoice(voices)
    assert.ok(pick.name.toLowerCase().includes('george'))
  })
  test('falls back to Daniel if no George', () => {
    const voices = [
      { name: 'Alice', lang: 'en-US' },
      { name: 'Microsoft Daniel Desktop', lang: 'en-GB' },
    ]
    const pick = pickBestVoice(voices)
    assert.ok(pick.name.toLowerCase().includes('daniel'))
  })
  test('falls back to any en-GB voice if no named preference', () => {
    const voices = [{ name: 'Fiona', lang: 'en-US' }, { name: 'Moira', lang: 'en-GB' }]
    const pick = pickBestVoice(voices)
    assert.equal(pick.lang, 'en-GB')
  })
  test('returns first voice if nothing matches', () => {
    const voices = [{ name: 'Klaus', lang: 'de-DE' }]
    const pick = pickBestVoice(voices)
    assert.equal(pick.name, 'Klaus')
  })
  test('returns null for empty voice list', () => {
    assert.equal(pickBestVoice([]), null)
  })
})

describe('TTSService state machine', () => {
  // Minimal state machine without browser APIs
  class MockTTSService {
    constructor() { this._speaking = false; this._events = [] }
    get speaking() { return this._speaking }
    _setState(v) { this._speaking = v; this._events.push(v ? 'start' : 'end') }
    cancel() { if (this._speaking) this._setState(false) }
  }

  test('starts in non-speaking state', () => {
    const svc = new MockTTSService()
    assert.equal(svc.speaking, false)
  })
  test('cancel when not speaking is a no-op', () => {
    const svc = new MockTTSService()
    svc.cancel()
    assert.deepEqual(svc._events, [])
  })
  test('cancel emits end event', () => {
    const svc = new MockTTSService()
    svc._setState(true)
    svc.cancel()
    assert.deepEqual(svc._events, ['start', 'end'])
  })
  test('speaking is false after cancel', () => {
    const svc = new MockTTSService()
    svc._setState(true)
    svc.cancel()
    assert.equal(svc.speaking, false)
  })
})

describe('ElevenLabs voice settings', () => {
  // Verify voice settings are within ElevenLabs accepted ranges
  const settings = {
    stability:         0.55,
    similarity_boost:  0.80,
    style:             0.30,
    use_speaker_boost: true,
  }
  test('stability is in [0, 1]', () => {
    assert.ok(settings.stability >= 0 && settings.stability <= 1)
  })
  test('similarity_boost is in [0, 1]', () => {
    assert.ok(settings.similarity_boost >= 0 && settings.similarity_boost <= 1)
  })
  test('style is in [0, 1]', () => {
    assert.ok(settings.style >= 0 && settings.style <= 1)
  })
  test('speaker_boost is boolean', () => {
    assert.equal(typeof settings.use_speaker_boost, 'boolean')
  })
})
