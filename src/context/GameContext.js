/**
 * Game context — provides state + dispatch to the component tree.
 *
 * Now quest-aware: accepts `scenes`, `questId`, `startScene`, and `resume`
 * as props so multiple quests can share the same runtime with independent
 * save slots.
 *
 * Auto-saves to localStorage whenever state changes (after the first choice).
 */
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { gameReducer, INITIAL_STATE } from './gameReducer.js'
import { saveState, loadState }       from '../utils/saveManager.js'
import { ttsService }                 from '../services/ttsService.js'

/** @type {React.Context<{ state: import('./gameReducer').GameState, dispatch: Function, goTo: Function, applyChoice: Function, scenes: Object }>} */
const GameCtx = createContext(null)

/**
 * @param {{
 *   scenes:     Object,   – the scene map for the active quest
 *   questId:    string,   – used for localStorage key
 *   startScene: string,   – first scene key (e.g. 'title' or 'ember_title')
 *   resume:     boolean,  – if true, hydrate from saved state
 *   children:   React.ReactNode
 * }} props
 */
export function GameProvider({ scenes, questId, startScene, resume, children }) {
  // Build initial state — either a saved game or a fresh start
  function makeInitialState() {
    if (resume) {
      const saved = loadState(questId)
      if (saved?.state) {
        return {
          ...INITIAL_STATE,
          ...saved.state,
          startScene,
          notifications: [],
          combat: null,
        }
      }
    }
    return { ...INITIAL_STATE, scene: startScene, startScene }
  }

  const [state, dispatch] = useReducer(gameReducer, undefined, makeInitialState)

  // Auto-save whenever state changes (skip title/start screen saves)
  useEffect(() => {
    if (state.history.length > 0) {
      saveState(questId, state)
    }
  }, [state, questId])

  /**
   * Navigate to a scene, running its onEnter hook if present.
   * @param {string} sceneName
   */
  const goTo = useCallback(sceneName => {
    ttsService.cancel()
    if (sceneName === '__replay__') {
      dispatch({ type: 'RESET', startScene })
      return
    }
    const scene = scenes[sceneName]
    if (!scene) { console.error(`[GameContext] Unknown scene: ${sceneName}`); return }
    dispatch({ type: 'GO_TO', scene: sceneName, onEnter: scene.onEnter ?? null })
  }, [scenes, startScene])

  /**
   * Execute a choice: run its action, add history, then navigate.
   * @param {{ text: string, action?: Function, next: string }} choice
   * @param {string} sceneTitle  – current scene title for history log
   */
  const applyChoice = useCallback((choice, sceneTitle) => {
    dispatch({
      type:       'APPLY_CHOICE',
      action:     choice.action ?? null,
      sceneTitle,
      choiceText: stripHtml(choice.text).substring(0, 80),
    })
    goTo(choice.next)
  }, [goTo])

  return React.createElement(
    GameCtx.Provider,
    { value: { state, dispatch, goTo, applyChoice, scenes } },
    children
  )
}

/** @returns {{ state: import('./gameReducer').GameState, dispatch: Function, goTo: Function, applyChoice: Function, scenes: Object }} */
export function useGameContext() {
  const ctx = useContext(GameCtx)
  if (!ctx) throw new Error('useGameContext must be used inside <GameProvider>')
  return ctx
}

/** Strip HTML tags for plain-text history entries */
function stripHtml(str) {
  return str.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ').trim()
}
