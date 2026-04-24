import { useEffect } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Subscription = {
  table: string;
  queryKeys: QueryKey[];
};

/**
 * Subscribe to Supabase Realtime changes on one or more tables and
 * invalidate the matching React Query caches whenever a row changes.
 * UI re-fetches automatically — no manual refresh required.
 */
export function useRealtimeInvalidate(subscriptions: Subscription[]) {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase.channel(
      `rt-${subscriptions.map((s) => s.table).join("-")}-${Math.random().toString(36).slice(2, 8)}`
    );

    for (const sub of subscriptions) {
      (channel as unknown as { on: (...args: unknown[]) => unknown }).on(
        "postgres_changes",
        { event: "*", schema: "public", table: sub.table },
        () => {
          for (const key of sub.queryKeys) {
            qc.invalidateQueries({ queryKey: key });
          }
        }
      );
    }

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qc, JSON.stringify(subscriptions.map((s) => [s.table, s.queryKeys]))]);
}
