/**
 * Service Worker registration using Workbox
 */

import { Workbox } from 'workbox-window';

export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');

    wb.addEventListener('installed', event => {
      if (event.isUpdate) {
        // Show update notification
        if (confirm('New version available! Reload to update?')) {
          window.location.reload();
        }
      }
    });

    wb.addEventListener('waiting', () => {
      console.log('Service worker is waiting');
    });

    wb.addEventListener('controlling', () => {
      console.log('Service worker is controlling');
      window.location.reload();
    });

    wb.addEventListener('activated', event => {
      if (!event.isUpdate) {
        console.log('Service worker activated for the first time!');
      }
    });

    wb.register()
      .then(registration => {
        console.log('Service worker registered:', registration);
      })
      .catch(error => {
        console.error('Service worker registration failed:', error);
      });
  }
}
