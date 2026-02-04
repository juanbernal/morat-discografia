
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Capturar y silenciar errores de ResizeObserver
const isResizeObserverError = (message: string) => 
  message.includes('ResizeObserver loop limit exceeded') || 
  message.includes('ResizeObserver loop completed with undelivered notifications');

// Redefinir el manejador global de errores para ser más agresivo con ResizeObserver
const originalError = console.error;
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string' && isResizeObserverError(args[0])) return;
  originalError.apply(console, args);
};

window.addEventListener('error', (e) => {
  if (e.message && isResizeObserverError(e.message)) {
    e.stopImmediatePropagation();
    e.preventDefault();
    // Intentar ocultar overlays de error comunes
    const overlays = [
      'webpack-dev-server-client-overlay',
      'vite-error-overlay'
    ];
    overlays.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  }
});

window.addEventListener('unhandledrejection', (e) => {
  if (e.reason && e.reason.message && isResizeObserverError(e.reason.message)) {
    e.preventDefault();
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(registrationError => {
        if (window.location.hostname !== 'localhost') {
            console.warn('SW registration failed:', registrationError);
        }
    });
  });
}
