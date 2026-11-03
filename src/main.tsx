import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { captureAttribution } from './lib/attribution';
import './index.css';

// Record where this visit came from before anything renders. A visitor who
// lands and leaves without booking still tells us which channel is working,
// and the first touch is what a later booking will be credited to.
captureAttribution();

window.addEventListener('vite:preloadError', (event) => {
  try {
    if (sessionStorage.getItem('reloaded-for-new-build')) return;
    sessionStorage.setItem('reloaded-for-new-build', '1');
  } catch {
    return;
  }
  event.preventDefault();
  window.location.reload();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
