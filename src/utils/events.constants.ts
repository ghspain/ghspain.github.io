/**
 * Centralized constants for the events section
 * Eliminates magic numbers scattered throughout the codebase
 */

export const EVENT_CONFIG = {
  // Default logo when event has no image
  DEFAULT_LOGO: `${process.env.PUBLIC_URL}/images/logos/svg/Meetup.svg`,

  // Card width constraints
  MIN_CARD_WIDTH: 320,      // Minimum width in px
  MAX_CARD_WIDTH: 900,      // Maximum width in px

  // Breakpoint for responsive design
  RESPONSIVE_BREAKPOINT: 640,  // In px, below uses %

  // Image dimensions within card
  CARD_IMAGE_HEIGHT: 260,   // Image height in px
  CARD_MIN_HEIGHT: 320,     // Minimum card height

  // Text labels
  CTA_TEXT: 'Ver evento',
  UPCOMING_TITLE: 'Próximos eventos',
  PAST_TITLE: 'Eventos pasados',

  // Animation timing
  ANIMATION_DURATION: 220,  // ms
} as const;

export type EventConfig = typeof EVENT_CONFIG;
