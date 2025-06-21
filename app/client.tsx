/// <reference types="vinxi/types/client" />
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { StartClient } from '@tanstack/start'
import { createRouter } from './router'

const router = createRouter()

ReactDOM.hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <StartClient router={router} />
  </StrictMode>,
)