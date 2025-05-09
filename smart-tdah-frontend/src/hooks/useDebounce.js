import { useState, useEffect } from 'react';

/**
 * Hook personalizado para aplicar debounce a un valor.
 * @param {any} value - Valor que será debounced.
 * @param {number} delay - Tiempo de espera en milisegundos.
 * @returns {any} - Valor debounced.
 */
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler); // Limpia el timeout si el valor cambia antes de que se complete el delay
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
