
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import './index.css';

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
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Unregister any active service worker
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });

    // Explicitly delete any caches to ensure old clients get fresh data
    if ('caches' in window) {
      caches.keys().then((names) => {
        for (const name of names) {
          caches.delete(name);
        }
      });
    }
  });
}
