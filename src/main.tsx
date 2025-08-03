import './lib/sentry/instruments.ts'
import { SENTRY_CONFIG } from './lib/sentry/config.ts';

import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router';

const container = document.getElementById('root')!;

const root = createRoot(container, SENTRY_CONFIG);


// SSE Test 때문에 Strict Mode 제거
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>

);
