import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function usePersistentState<T>(
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from AsyncStorage on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const stored = await AsyncStorage.getItem(key);
        if (stored !== null) {
          setState(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Error loading state:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadState();
  }, [key]);

  // Save to AsyncStorage on change
  useEffect(() => {
    if (isLoaded) {
      const saveState = async () => {
        try {
          await AsyncStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
          console.error("Error saving state:", error);
        }
      };
      saveState();
    }
  }, [state, key, isLoaded]);

  return [state, setState];
}

export default usePersistentState;
