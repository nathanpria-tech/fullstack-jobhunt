import { useState, useEffect } from 'react';

/**
 * Custom hook untuk debounce suatu value (default 300ms sesuai requirement)
 * @param {any} value - Nilai yang ingin di-debounce
 * @param {number} delay - Durasi delay dalam milidetik (default 300ms)
 * @returns {any} debouncedValue
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
