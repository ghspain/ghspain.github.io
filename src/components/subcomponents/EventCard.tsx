import React from 'react'
import { Card } from './Card'
import type { EventData } from '../../utils/eventFilters'
import { EVENT_CONFIG } from '../../utils/events.constants'
import cardStyles from '../css/Card.module.css'
import { formatDateEs } from '../../utils/date'

export type EventCardProps = {
  event: EventData
  /**
   * When true, links open in a new tab (adds target="_blank" and rel="noopener noreferrer").
   * Defaults to true to match Timeline behavior.
   */
  openInNewTab?: boolean
}

/**
 * Presentation component for a single event card,
 * using the shared Card and the same CTA style as HeroSection.
 */
export const EventCard: React.FC<EventCardProps> = ({ event, openInNewTab = true }) => {
  const target = openInNewTab ? '_blank' : undefined
  const rel = openInNewTab ? 'noopener noreferrer' : undefined
  return (
    <Card
      href={event.event_link}
      hasBorder
      ctaText={EVENT_CONFIG.CTA_TEXT}
      align="center"
      className={cardStyles['Card--event']}
      style={{ width: '100%', margin: '0 auto' }}
      target={target}
      rel={rel}
    >
      <Card.Image src={event.event_image || EVENT_CONFIG.DEFAULT_LOGO} alt={event.event_name} />
      <Card.Heading>{event.event_name}</Card.Heading>
      <Card.Description>{formatDateEs(event.event_date)}</Card.Description>
    </Card>
  )
}

export default EventCard
