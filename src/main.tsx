import './sentry/instruments.ts'
import { SENTRY_CONFIG } from './sentry/config.ts';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router';

const container = document.getElementById('root')!;

const root = createRoot(container, SENTRY_CONFIG);

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
