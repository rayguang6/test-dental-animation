import { useState, useEffect } from 'react';

/**
 * Custom hook for safely using localStorage with SSR/hydration support
 * This is the industry standard pattern used by libraries like usehooks, react-use, etc.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Always start with initialValue to prevent hydration mismatch
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after hydration
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        const parsedValue = JSON.parse(item);
        setStoredValue(parsedValue);
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    } finally {
      setIsHydrated(true);
    }
  }, [key]);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage only after hydration
      if (isHydrated) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
