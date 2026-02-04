
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Capturar y silenciar errores de ResizeObserver (comunes en widgets de terceros y layouts complejos)
const isResizeObserverError = (message: string) => 
  message.includes('ResizeObserver loop limit exceeded') || 
  message.includes('ResizeObserver loop completed with undelivered notifications');

window.addEventListener('error', (e) => {
  if (e.message && isResizeObserverError(e.message)) {
    e.stopImmediatePropagation();
    e.preventDefault();
    const overlay = document.getElementById('webpack-dev-server-client-overlay');
    if (overlay) overlay.style.display = 'none';
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

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(registrationError => {
        if (window.location.hostname !== 'localhost') {
            console.warn('SW registration failed:', registrationError);
        }
    });
  });
}
