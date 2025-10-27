import type { Organizer } from '../../types/organizer'
import { River } from './River'
import { Heading, Text, Link } from '@primer/react-brand'

export function OrganizerList({ organizers }: { organizers: Organizer[] }) {
  return (
    <>
      {organizers.map((organizer, index) => {
        const isEvenIndex = index % 2 === 0
        const animationDirection = isEvenIndex ? 'slide-in-right' : 'slide-in-left'
        
        return (
          <River 
            key={organizer.id} 
            align={isEvenIndex ? undefined : 'end'} 
            imageTextRatio="40:60"
          >
            <River.Visual>
              <img src={organizer.img} alt={organizer.name} />
            </River.Visual>
            <River.Content animate={animationDirection}>
              <Heading>{organizer.name}</Heading>
              <Text>{organizer.bio}</Text>
              <Link href={organizer.link}>GitHub</Link>
            </River.Content>
          </River>
        )
      })}
    </>
  )
}
