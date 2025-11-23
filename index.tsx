
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

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
    // Construct absolute URL to force resolution against current origin, 
    // bypassing any <base> tags or environment redirects in previews
    const swUrl = new URL('sw.js', window.location.origin + window.location.pathname).href;

    navigator.serviceWorker.register(swUrl)
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        // Silently log warning instead of error to avoid alarming user in preview envs
        console.warn('SW registration info:', registrationError.message);
      });
  });
}
