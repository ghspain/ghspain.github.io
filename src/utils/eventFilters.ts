import { EVENT_CONFIG } from './events.constants';

/**
 * Interface for event data structure
 */
export interface EventData {
  event_id: string;
  event_name: string;
  event_link: string;
  event_date: string;
  event_image?: string;
}

/**
 * Interface for grouped events
 */
export interface EventsGrouped {
  upcomingEvents: EventData[];
  pastEvents: EventData[];
}

/**
 * Filters and sorts events into two groups: upcoming and past
 * @param events - Array of events to filter
 * @returns Object with upcoming and past events, each sorted appropriately
 */
export const filterAndSortEvents = (events: EventData[]): EventsGrouped => {
  const now = new Date();

  const upcomingEvents = events
    .filter(event => new Date(event.event_date) > now)
    .sort((a, b) =>
      new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
    );

  const pastEvents = events
    .filter(event => new Date(event.event_date) <= now)
    .sort((a, b) =>
      new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
    );

  return { upcomingEvents, pastEvents };
};

/**
 * Calculates responsive card width based on viewport and card width
 * @param cardWidth - Natural width of card in px (null = not measured)
 * @param viewportWidth - Viewport width
 * @param breakpoint - Breakpoint for responsive switching (defaults to RESPONSIVE_BREAKPOINT)
 * @returns CSS value string (px or %)
 */
export const calculateResponsiveWidth = (
  cardWidth: number | null,
  viewportWidth: number,
  breakpoint: number = EVENT_CONFIG.RESPONSIVE_BREAKPOINT
): string => {
  if (!cardWidth) return '100%';

  // Use percentage on small screens
  if (viewportWidth < breakpoint) {
    return '90%';
  }

  // Use measured px on large screens
  return `${cardWidth}px`;
};
