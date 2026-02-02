import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Suppress benign ResizeObserver errors
// This captures "ResizeObserver loop limit exceeded" and "ResizeObserver loop completed with undelivered notifications"
window.addEventListener('error', (e) => {
  if (e.message && e.message.includes('ResizeObserver loop')) {
    // Prevent the error from being reported to the console or showing in overlays
    e.stopImmediatePropagation();
    e.preventDefault();
    
    // Hide webpack-dev-server overlay if it exists
    const overlay = document.getElementById('webpack-dev-server-client-overlay');
    if (overlay) overlay.style.display = 'none';
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
        // Silently fail in dev or restricted environments
        if (window.location.hostname !== 'localhost') {
            console.warn('SW registration failed:', registrationError);
        }
    });
  });
}