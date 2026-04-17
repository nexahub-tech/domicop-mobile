import { useState, useEffect, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { useFocusEffect } from "expo-router";
import { dashboard } from "@/lib/api/dashboard.api";
import { DashboardSummary } from "@/lib/types/dashboard";

const CACHE_KEY = "cached_savings_summary";

export function useSavingsSummary() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const netInfoSubRef = useRef<(() => void) | null>(null);

  const loadFromCache = async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as DashboardSummary;
        setSummary(parsed);
      }
    } catch {
      // ignore cache read errors
    }
  };

  const saveToCache = async (data: DashboardSummary) => {
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch {
      // ignore cache write errors
    }
  };

  const fetchSummary = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await dashboard.getSummary();
      setSummary(data);
      setIsOffline(false);
      await saveToCache(data);
    } catch (err: any) {
      const message = err?.message || "Failed to load savings summary";

      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as DashboardSummary;
        setSummary(parsed);
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
      fetchSummary();
    });
  }, [fetchSummary]);

  useFocusEffect(
    useCallback(() => {
      fetchSummary();
    }, [fetchSummary])
  );

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && isOffline) {
        fetchSummary(true);
      }
    });
    netInfoSubRef.current = unsubscribe;
    return () => {
      unsubscribe();
    };
  }, [isOffline, fetchSummary]);

  const refresh = useCallback(() => {
    return fetchSummary(true);
  }, [fetchSummary]);

  return {
    summary,
    isLoading,
    isRefreshing,
    error,
    isOffline,
    refresh,
  };
}