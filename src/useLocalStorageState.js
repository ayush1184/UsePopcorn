import { useState, useEffect } from 'react';
export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(() =>
    JSON.parse(localStorage.getItem(key))
      ? JSON.parse(localStorage.getItem(key))
      : initialState
  );

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
