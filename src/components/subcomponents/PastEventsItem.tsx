import React from 'react'
import { Timeline, Link, Animate } from '@primer/react-brand'
import type { EventData } from '../../utils/eventFilters'
import { formatDateEs } from '../../utils/date'

export type PastEventsItemProps = {
  event: EventData
  /** Open link in a new tab. Defaults true to match public site behavior. */
  openInNewTab?: boolean
}

/**
 * Small timeline item for past events to unify date + link rendering.
 */
const PastEventsItem: React.FC<PastEventsItemProps> = ({ event, openInNewTab = true }) => {
  const target = openInNewTab ? '_blank' : undefined
  const rel = openInNewTab ? 'noopener noreferrer' : undefined

  return (
    <Timeline.Item>
      <Animate animate="fade-in">{formatDateEs(event.event_date)} </Animate>
      <Animate animate="slide-in-right">
        <Link arrowDirection="none" href={event.event_link} target={target} rel={rel}>
          {event.event_name}
        </Link>
      </Animate>
    </Timeline.Item>
  )
}

export default PastEventsItem
