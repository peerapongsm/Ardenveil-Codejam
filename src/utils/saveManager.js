/**
 * saveManager — per-quest client-side persistence via localStorage.
 *
 * Each quest saves under its own key so multiple quests can have
 * independent progress states.
 *
 * @module saveManager
 */

const PREFIX = 'ardenveil_save_'

/**
 * Save the current game state for a quest.
 * @param {string} questId
 * @param {import('../context/gameReducer').GameState} state
 */
export function saveState(questId, state) {
  try {
    const key = PREFIX + questId
    const payload = JSON.stringify({ state, savedAt: Date.now() })
    localStorage.setItem(key, payload)
  } catch (e) {
    console.warn('[saveManager] Could not save state:', e)
  }
}

/**
 * Load a previously saved game state for a quest.
 * Returns null if no save exists or the save is corrupted.
 * @param {string} questId
 * @returns {{ state: import('../context/gameReducer').GameState, savedAt: number } | null}
 */
export function loadState(questId) {
  try {
    const key = PREFIX + questId
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.state?.scene) return null
    return parsed
  } catch (e) {
    console.warn('[saveManager] Could not load state:', e)
    return null
  }
}

/**
 * Delete the saved state for a quest (used when replaying from scratch).
 * @param {string} questId
 */
export function clearState(questId) {
  try {
    localStorage.removeItem(PREFIX + questId)
  } catch (e) {
    console.warn('[saveManager] Could not clear state:', e)
  }
}

/**
 * Check whether a saved game exists for a quest.
 * @param {string} questId
 * @returns {boolean}
 */
export function hasSave(questId) {
  try {
    const raw = localStorage.getItem(PREFIX + questId)
    if (!raw) return false
    const parsed = JSON.parse(raw)
    // Only count saves where the player has actually made a choice
    // (not just the title screen)
    return parsed?.state?.history?.length > 0
  } catch {
    return false
  }
}

/**
 * Return a human-readable summary of saved progress for display in the quest-select UI.
 * @param {string} questId
 * @returns {{ scene: string, historyLength: number, savedAt: number } | null}
 */
export function getSaveSummary(questId) {
  const save = loadState(questId)
  if (!save) return null
  return {
    scene: save.state.scene,
    historyLength: save.state.history?.length ?? 0,
    savedAt: save.savedAt,
  }
}
