/**
 * Main application entry point
 */

import { registerServiceWorker } from './registerSW';
import { themeState } from './utils/state';
import { detectDevice } from './utils/device';
import { LoadingScreen } from './components/LoadingScreen';

// Initialize loading screen
const loadingScreen = new LoadingScreen();
loadingScreen.setMessage('Initializing...');

// Initialize device detection
const deviceInfo = detectDevice();
console.log('Device Info:', deviceInfo);

// Apply saved theme
const applyTheme = (theme: 'light' | 'dark') => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.body.classList.toggle('dark', theme === 'dark');
};

// Subscribe to theme changes
themeState.subscribe(applyTheme);
applyTheme(themeState.get());

// Detect system theme preference
if (!localStorage.getItem('theme')) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  themeState.set(prefersDark ? 'dark' : 'light');
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('theme')) {
    themeState.set(e.matches ? 'dark' : 'light');
  }
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  registerServiceWorker();
}

// Handle page visibility
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('Page hidden');
  } else {
    console.log('Page visible');
  }
});

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
    
    // Hide loading screen after page load
    setTimeout(() => {
      loadingScreen.setMessage('Ready!');
      setTimeout(() => {
        loadingScreen.hide();
      }, 300);
    }, 500);
  });
}

// Export for global access if needed
export { deviceInfo, themeState };
