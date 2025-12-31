/**
 * Device and browser detection utilities
 */

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  os: string;
  browser: string;
  orientation: 'portrait' | 'landscape';
}

export function detectDevice(): DeviceInfo {
  const ua = navigator.userAgent;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // OS Detection
  let os = 'Unknown';
  if (/Windows NT/i.test(ua)) {
    os = 'Windows';
  } else if (/Mac OS X/i.test(ua)) {
    os = 'macOS';
  } else if (/Android/i.test(ua)) {
    os = 'Android';
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    os = 'iOS';
  } else if (/Linux/i.test(ua)) {
    os = 'Linux';
  }
  
  // Browser Detection
  let browser = 'Unknown';
  if (/Edg/i.test(ua)) {
    browser = 'Edge';
  } else if (/Chrome/i.test(ua)) {
    browser = 'Chrome';
  } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    browser = 'Safari';
  } else if (/Firefox/i.test(ua)) {
    browser = 'Firefox';
  } else if (/MSIE|Trident/i.test(ua)) {
    browser = 'IE';
  }
  
  // Device Type
  const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua);
  const isDesktop = !isMobile && !isTablet;
  
  // Orientation
  const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    os,
    browser,
    orientation,
  };
}

export function isOnline(): boolean {
  return navigator.onLine;
}

export function supportsServiceWorker(): boolean {
  return 'serviceWorker' in navigator;
}

export function supportsWebP(): Promise<boolean> {
  return new Promise(resolve => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

export function getPWADisplayMode(): string {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return 'standalone';
  }
  if (window.matchMedia('(display-mode: fullscreen)').matches) {
    return 'fullscreen';
  }
  if (window.matchMedia('(display-mode: minimal-ui)').matches) {
    return 'minimal-ui';
  }
  return 'browser';
}

export function isFoldableDevice(): boolean {
  return (
    'getWindowSegments' in window ||
    CSS.supports('(viewport-segment-width 0 0: 100vw)') ||
    matchMedia('(vertical-viewport-segments: 2)').matches ||
    matchMedia('(horizontal-viewport-segments: 2)').matches
  );
}
