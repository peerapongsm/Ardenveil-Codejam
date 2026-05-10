/**
 * React hook — exposes ttsService state as React state.
 *
 * @module useTTS
 */
import { useState, useEffect, useCallback } from 'react'
import { ttsService } from '../services/ttsService.js'
import { buildTTSText } from '../utils/gameHelpers.js'
import { stripHtml } from '../utils/sanitize.js'

/**
 * @returns {{ speaking: boolean, toggle: (scene: object) => void, cancel: () => void }}
 */
export function useTTS() {
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    const off = ttsService.onStateChange(event => {
      setSpeaking(event === 'start')
    })
    return off
  }, [])

  const toggle = useCallback(scene => {
    if (ttsService.speaking) {
      ttsService.cancel()
    } else {
      const text = buildTTSText(scene, stripHtml)
      ttsService.speak(text)
    }
  }, [])

  const cancel = useCallback(() => ttsService.cancel(), [])

  return { speaking, toggle, cancel }
}
