/**
 * State management using localStorage and modern reactive patterns
 */

type Listener<T> = (value: T) => void;

export class State<T> {
  private value: T;
  private listeners: Set<Listener<T>> = new Set();
  private storageKey?: string;

  constructor(initialValue: T, storageKey?: string) {
    this.storageKey = storageKey;
    
    if (storageKey) {
      const stored = localStorage.getItem(storageKey);
      this.value = stored ? JSON.parse(stored) : initialValue;
    } else {
      this.value = initialValue;
    }
  }

  get(): T {
    return this.value;
  }

  set(newValue: T): void {
    this.value = newValue;
    
    if (this.storageKey) {
      localStorage.setItem(this.storageKey, JSON.stringify(newValue));
    }
    
    this.listeners.forEach(listener => listener(newValue));
  }

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  update(updater: (current: T) => T): void {
    this.set(updater(this.value));
  }
}

// Theme state
export const themeState = new State<'light' | 'dark'>('light', 'theme');

// Navigation state
export const navigationState = new State<string>('home', 'currentTab');

// Settings state
export interface Settings {
  darkMode: boolean;
  language: string;
  animations: boolean;
}

export const settingsState = new State<Settings>(
  {
    darkMode: false,
    language: 'en',
    animations: true,
  },
  'settings'
);
