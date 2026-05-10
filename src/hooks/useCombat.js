/**
 * React hook — manages animated dice rolling and combat resolution.
 *
 * @module useCombat
 */
import { useState, useCallback, useRef } from 'react'
import { rollCombat, combatSuccess } from '../utils/gameHelpers.js'

const ROLL_FRAMES    = 12   // animation frames before final result
const FRAME_INTERVAL = 80   // ms between frames

/**
 * @param {{ combat: import('../context/gameReducer').CombatState|null, speciesKey: string|null }} props
 * @param {Function} onResult   – called with (success: boolean, nextScene: string) after roll
 * @returns {{ rolling: boolean, d1: number|null, d2: number|null, bonus: number, total: number|null, result: 'success'|'fail'|null, roll: () => void }}
 */
export function useCombat({ combat, speciesKey }, onResult) {
  const [rolling, setRolling]   = useState(false)
  const [d1, setD1]             = useState(null)
  const [d2, setD2]             = useState(null)
  const [total, setTotal]       = useState(null)
  const [result, setResult]     = useState(null)
  const intervalRef             = useRef(null)

  const roll = useCallback(() => {
    if (!combat || rolling || combat.done) return

    setRolling(true)
    setResult(null)
    let frame = 0

    intervalRef.current = setInterval(() => {
      // Show animated random values while rolling
      setD1(Math.ceil(Math.random() * 6))
      setD2(Math.ceil(Math.random() * 6))
      frame++

      if (frame >= ROLL_FRAMES) {
        clearInterval(intervalRef.current)

        // Final deterministic roll
        const finalRoll = rollCombat(speciesKey)
        setD1(finalRoll.d1)
        setD2(finalRoll.d2)
        setTotal(finalRoll.total)
        setRolling(false)

        const success = combatSuccess(finalRoll.total, combat.difficulty)
        setResult(success ? 'success' : 'fail')

        // Notify parent after a short pause for drama
        setTimeout(() => {
          onResult(success, success ? combat.win : combat.lose, finalRoll)
        }, 1200)
      }
    }, FRAME_INTERVAL)
  }, [combat, rolling, speciesKey, onResult])

  return { rolling, d1, d2, bonus: combat ? (rollCombat(speciesKey).bonus) : 0, total, result, roll }
}
