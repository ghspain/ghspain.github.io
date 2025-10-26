import React from 'react'
import type { Organizer } from '../../types/organizer'
import { River } from './River'
import { Heading, Text, Link } from '@primer/react-brand'

export function OrganizerList({ organizers }: { organizers: Organizer[] }) {
  return (
    <>
      {organizers.map((o, idx) => (
        // Render using the original River layout (no compact override)
        <River key={o.id} align={idx % 2 === 0 ? undefined : 'end'} imageTextRatio="40:60">
          <River.Visual>
            <img src={o.img} alt={o.name} />
          </River.Visual>
          <River.Content animate={idx % 2 === 0 ? 'slide-in-right' : 'slide-in-left'}>
            <Heading>{o.name}</Heading>
            <Text>{o.bio}</Text>
            <Link href={o.link}>GitHub</Link>
          </River.Content>
        </River>
      ))}
    </>
  )
}
