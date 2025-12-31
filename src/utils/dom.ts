/**
 * Utility functions for DOM manipulation and element management
 */

export function fadeIn(element: HTMLElement, duration: number = 300): Promise<void> {
  return new Promise(resolve => {
    element.style.opacity = '0';
    element.style.display = '';
    
    let start: number | null = null;
    
    const animate = (timestamp: number) => {
      if (!start) {
        start = timestamp;
      }
      
      const progress = Math.min((timestamp - start) / duration, 1);
      element.style.opacity = String(progress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };
    
    requestAnimationFrame(animate);
  });
}

export function fadeOut(element: HTMLElement, duration: number = 300): Promise<void> {
  return new Promise(resolve => {
    let start: number | null = null;
    const initialOpacity = parseFloat(getComputedStyle(element).opacity);
    
    const animate = (timestamp: number) => {
      if (!start) {
        start = timestamp;
      }
      
      const progress = Math.min((timestamp - start) / duration, 1);
      element.style.opacity = String(initialOpacity * (1 - progress));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.style.display = 'none';
        resolve();
      }
    };
    
    requestAnimationFrame(animate);
  });
}

export function waitForElement(selector: string, timeout: number = 5000): Promise<Element> {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    
    if (element) {
      resolve(element);
      return;
    }
    
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        clearTimeout(timeoutId);
        resolve(element);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    const timeoutId = setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes: Partial<HTMLElementTagNameMap[K]> = {},
  children: (string | Node)[] = []
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  
  Object.assign(element, attributes);
  
  for (const child of children) {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  }
  
  return element;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function (...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
