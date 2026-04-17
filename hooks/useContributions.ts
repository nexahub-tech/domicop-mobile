import { useState, useEffect, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { useFocusEffect } from "expo-router";
import { contributionsApi } from "@/lib/api/contributions.api";
import { Contribution } from "@/lib/types/contributions";

const CACHE_KEY = "cached_contributions";

export function useContributions() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const netInfoSubRef = useRef<(() => void) | null>(null);

  const loadFromCache = async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as Contribution[];
        setContributions(parsed);
      }
    } catch {
      // ignore cache read errors
    }
  };

  const saveToCache = async (data: Contribution[]) => {
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch {
      // ignore cache write errors
    }
  };

  const fetchContributions = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const currentYear = new Date().getFullYear();
      const response = await contributionsApi.getMyContributions({ year: currentYear });
      const data = response.data || [];
      setContributions(data);
      setIsOffline(false);
      await saveToCache(data);
    } catch (err: any) {
      const message = err?.message || "Failed to load contributions";

      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as Contribution[];
        setContributions(parsed);
        setIsOffline(true);
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFromCache().then(() => {
      fetchContributions();
    });
  }, [fetchContributions]);

  useFocusEffect(
    useCallback(() => {
      fetchContributions();
    }, [fetchContributions]),
  );

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && isOffline) {
        fetchContributions(true);
      }
    });
    netInfoSubRef.current = unsubscribe;
    return () => {
      unsubscribe();
    };
  }, [isOffline, fetchContributions]);

  const refresh = useCallback(() => {
    return fetchContributions(true);
  }, [fetchContributions]);

  return {
    contributions,
    isLoading,
    isRefreshing,
    error,
    isOffline,
    refresh,
  };
}
