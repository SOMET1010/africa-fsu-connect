import { useState, useCallback, useRef } from "react";

interface UndoRedoState<T> {
  history: T[];
  currentIndex: number;
}

export function useUndoRedo<T>(initialState: T, maxHistorySize = 50) {
  const [state, setState] = useState<UndoRedoState<T>>({
    history: [initialState],
    currentIndex: 0
  });

  const timeoutRef = useRef<NodeJS.Timeout>();

  const addToHistory = useCallback((newState: T, debounceMs = 1000) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce rapid changes
    timeoutRef.current = setTimeout(() => {
      setState(prev => {
        // Remove any future history if we're not at the end
        const newHistory = prev.history.slice(0, prev.currentIndex + 1);
        
        // Add new state
        newHistory.push(newState);
        
        // Limit history size
        if (newHistory.length > maxHistorySize) {
          newHistory.shift();
        }
        
        return {
          history: newHistory,
          currentIndex: newHistory.length - 1
        };
      });
    }, debounceMs);
  }, [maxHistorySize]);

  const undo = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIndex: Math.max(0, prev.currentIndex - 1)
    }));
  }, []);

  const redo = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIndex: Math.min(prev.history.length - 1, prev.currentIndex + 1)
    }));
  }, []);

  const canUndo = state.currentIndex > 0;
  const canRedo = state.currentIndex < state.history.length - 1;
  const currentState = state.history[state.currentIndex];

  const reset = useCallback((newInitialState: T) => {
    setState({
      history: [newInitialState],
      currentIndex: 0
    });
  }, []);

  return {
    currentState,
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    historySize: state.history.length
  };
}