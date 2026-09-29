// Safeguard against libraries reassigning window.fetch in environments with getter-only fetch
try {
  let _currentFetch = window.fetch;
  Object.defineProperty(window, 'fetch', {
    get() {
      return _currentFetch;
    },
    set(newFetch) {
      _currentFetch = newFetch;
    },
    configurable: true,
    enumerable: true,
  });
} catch (_) {}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
