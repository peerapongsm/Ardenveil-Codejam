/**
 * Game context — provides state + dispatch to the component tree.
 * Uses htm tagged templates so no JSX compilation is required.
 */
import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { gameReducer, INITIAL_STATE } from './gameReducer.js'
import { SCENES } from '../data/scenes.js'
import { ttsService } from '../services/ttsService.js'

/** @type {React.Context<{ state: import('./gameReducer').GameState, dispatch: Function, goTo: Function, applyChoice: Function }>} */
const GameCtx = createContext(null)

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE)

  /**
   * Navigate to a scene, running its onEnter hook if present.
   * @param {string} sceneName
   */
  const goTo = useCallback(sceneName => {
    ttsService.cancel()
    if (sceneName === '__replay__') {
      dispatch({ type: 'RESET' })
      return
    }
    const scene = SCENES[sceneName]
    if (!scene) { console.error(`[GameContext] Unknown scene: ${sceneName}`); return }
    dispatch({ type: 'GO_TO', scene: sceneName, onEnter: scene.onEnter ?? null })
  }, [])

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

  return React.createElement(GameCtx.Provider, { value: { state, dispatch, goTo, applyChoice } }, children)
}

/** @returns {{ state: import('./gameReducer').GameState, dispatch: Function, goTo: Function, applyChoice: Function }} */
export function useGameContext() {
  const ctx = useContext(GameCtx)
  if (!ctx) throw new Error('useGameContext must be used inside <GameProvider>')
  return ctx
}

/** Strip HTML tags for plain-text history entries */
function stripHtml(str) {
  return str.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ').trim()
}
