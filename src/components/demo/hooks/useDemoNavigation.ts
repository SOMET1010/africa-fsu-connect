import { useState } from 'react';

export function useDemoNavigation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const togglePlaying = () => {
    setIsPlaying(!isPlaying);
  };

  return {
    isPlaying,
    elapsedTime,
    setElapsedTime,
    togglePlaying,
  };
}