import { Dispatch, SetStateAction, useEffect, useState } from 'react';

/**
 * Persist state in localStorage once the component hydrates on the client.
 *
 * @param key The localStorage key
 * @param initialValue The fallback value used before hydration
 * @returns The state tuple with an extra hydration flag
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(key);

      if (storedValue !== null) {
        setValue(JSON.parse(storedValue) as T);
      }
    } catch {
      setValue(initialValue);
    } finally {
      setIsHydrated(true);
    }
  }, [key]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  }, [isHydrated, key, value]);

  return [value, setValue, isHydrated];
}
