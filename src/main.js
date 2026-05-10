import React from 'react'
import { createRoot } from 'react-dom/client'
import { AppShell } from './AppShell.js'

const container = document.getElementById('root')
if (!container) throw new Error('Root element #root not found')
createRoot(container).render(React.createElement(AppShell))
