import React, { useState, useEffect, useRef } from 'react'
import { useGameContext } from '../../context/GameContext.js'

export function NotificationSystem() {
  const { state, dispatch } = useGameContext()
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  useEffect(() => {
    if (!state.notifications.length) return
    const newToasts = state.notifications.map(msg => ({ id: ++idRef.current, msg }))
    setToasts(prev => [...prev, ...newToasts])
    dispatch({ type: 'FLUSH_NOTIFICATIONS' })
    const timers = newToasts.map(t =>
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 3000)
    )
    return () => timers.forEach(clearTimeout)
  }, [state.notifications, dispatch])

  if (!toasts.length) return null

  return React.createElement(
    'div',
    { className: 'container', role: 'status', 'aria-live': 'polite', 'aria-label': 'Notifications' },
    toasts.map(t => React.createElement('div', { key: t.id, className: 'toast' }, t.msg))
  )
}
