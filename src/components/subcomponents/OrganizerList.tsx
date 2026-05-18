import type { Organizer, OrganizerRecognition } from '../../types/organizer'
import { getOrganizerImageUrl } from '../../services/organizers'
import { River } from './River'
import { Heading, Text, Link } from '@primer/react-brand'
import styles from './OrganizerList.module.css'

type OrganizerListProps = Readonly<{ organizers: Organizer[] }>

type RecognitionBadgeProps = Readonly<{
  recognition: OrganizerRecognition
  organizerName: string
}>

function RecognitionBadge({ recognition, organizerName }: RecognitionBadgeProps) {
  const isMicrosoftMvp = recognition.kind === 'microsoft-mvp'

  return (
    <a
      className={`${styles.RecognitionBadge} ${isMicrosoftMvp ? styles['RecognitionBadge--microsoft-mvp'] : styles['RecognitionBadge--github-star']}`}
      href={recognition.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`${recognition.label} page for ${organizerName}`}
      title={`${recognition.label} · ${organizerName}`}
    >
      <span className={styles.RecognitionBadge__icon} aria-hidden="true">
        {isMicrosoftMvp ? (
          <span className={styles.MicrosoftGlyph}>
            <span />
            <span />
            <span />
            <span />
          </span>
        ) : (
          <span className={styles.GitHubStarGlyph}>★</span>
        )}
      </span>
      <span className={styles.RecognitionBadge__label}>{recognition.label}</span>
    </a>
  )
}

export function OrganizerList({ organizers }: OrganizerListProps) {
  if (!organizers || organizers.length === 0) {
    return <div>No organizers available</div>
  }

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
            <River.Visual className={styles.OrganizerVisual} style={{ aspectRatio: '1 / 1' }}>
              <img src={getOrganizerImageUrl(organizer.img)} alt={organizer.name} />
              {organizer.recognitions?.length ? (
                <div className={styles.RecognitionRail}>
                  {organizer.recognitions.map(recognition => (
                    <RecognitionBadge
                      key={`${organizer.id}-${recognition.kind}`}
                      recognition={recognition}
                      organizerName={organizer.name}
                    />
                  ))}
                </div>
              ) : null}
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
