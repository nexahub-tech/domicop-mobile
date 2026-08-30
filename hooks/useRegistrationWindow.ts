import { useQuery } from "@tanstack/react-query";
import { registration } from "@/lib/api/registration.api";
import type { RegistrationWindowResponse } from "@/lib/types/registration";

/** Openness turns over on the clock, so a long cache would offer a form nobody can submit. */
const STALE_TIME_MS = 60_000;

/**
 * The current registration window.
 *
 * Plain useQuery rather than usePersistedQuery: a stale cached "open" would
 * walk an applicant through six steps and a payment before the server rejected
 * them. Being wrong here is worse than being unavailable, so this never falls
 * back to disk.
 */
export function useRegistrationWindow() {
  const query = useQuery<RegistrationWindowResponse>({
    queryKey: ["registration-window"],
    queryFn: () => registration.getWindow(),
    staleTime: STALE_TIME_MS,
    retry: 1,
  });

  return {
    /** Treated as closed until proven open — a failed lookup must not open the gate. */
    isOpen: query.data?.is_open ?? false,
    window: query.data?.window ?? null,
    reason: query.data?.reason ?? null,
    lastWindow: query.data?.last_window ?? null,
    isLoading: query.isLoading,
    /**
     * Whether the lookup itself failed, as opposed to answering "closed".
     * The gate treats both as closed, but the two need different copy —
     * telling someone registration has ended when their signal dropped is a
     * lie they may act on.
     */
    isUnavailable: query.isError && query.data === undefined,
    error: query.error,
    refetch: query.refetch,
  };
}
