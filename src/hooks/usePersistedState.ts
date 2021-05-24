// src: https://dev.to/selbekk/persisting-your-react-state-in-9-lines-of-code-9go

import { useEffect, useState } from 'react';

const usePersistedState = (key, defaultValue) => {
  const [state, setState] = useState(
    () => JSON.parse(localStorage.getItem(key)) || defaultValue
  );
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
};

export default usePersistedState;
