import { useEffect, useMemo, useRef, useState } from "react";

const FN_URL = "https://snwoerqlngclcfdokhwo.functions.supabase.co/functions/v1/trends-stream";

export type TrendEvent = {
  type: string;
  ts: number;
  trend?: any;
};

export const useTrendsStream = () => {
  const [events, setEvents] = useState<TrendEvent[]>([]);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource(FN_URL);
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setEvents((prev) => [...prev.slice(-100), data]);
      } catch (err) {
        // ignore
      }
    };

    es.onerror = () => {
      es.close();
      esRef.current = null;
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, []);

  const latestTrends = useMemo(() => {
    return events.filter((e) => e.type === 'trend_update').map((e) => e.trend);
  }, [events]);

  return { events, latestTrends };
};
