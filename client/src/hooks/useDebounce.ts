import { useState, useEffect } from 'react';

/**
 * useDebounce — delays updating a value until the user stops typing.
 *
 * WHY debounce search?
 * Without debounce, typing "rahul" fires 5 API requests:
 *   "r" → "ra" → "rah" → "rahu" → "rahul"
 *
 * With debounce (500ms), it waits until the user STOPS typing
 * for 500ms, then fires ONE request with "rahul".
 *
 * HOW IT WORKS:
 * 1. User types → value changes → timer starts (500ms)
 * 2. User types again → old timer cancelled → new timer starts
 * 3. User stops → timer completes → debouncedValue updates
 * 4. Component re-renders → API call fires with final value
 */
const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // Cleanup on value change
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
