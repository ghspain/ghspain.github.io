import { useEffect, useState } from 'react';
import type { EventData } from '../utils/eventFilters';

/**
 * Fetch events from public/data/issues.json with loading & error state.
 * Uses PUBLIC_URL so it works in dev and on GitHub Pages.
 */
export function useEvents() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const jsonUrl = `${process.env.PUBLIC_URL}/data/issues.json`;
        const res = await fetch(jsonUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: EventData[] = await res.json();
        if (!cancelled) setEvents(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { events, loading, error };
}

export default useEvents;
