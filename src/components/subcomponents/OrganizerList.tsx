import type { Organizer, OrganizerRecognition } from '../../types/organizer'
import { getOrganizerImageUrl } from '../../services/organizers'
import { River } from './River'
import { Heading, Text, Link } from '@primer/react-brand'
import styles from './OrganizerList.module.css'

const recognitionLogoByKind = {
  'github-star': {
    src: `${process.env.PUBLIC_URL}/images/logos/recognitions/github-stars-logo.png`,
    imageStyle: { width: 'min(56px, 18vw)' },
  },
  'microsoft-mvp': {
    src: `${process.env.PUBLIC_URL}/images/logos/recognitions/microsoft-mvp-banner.png`,
    imageStyle: { width: 'min(168px, 42vw)', borderRadius: '12px' },
  },
} as const

type OrganizerListProps = Readonly<{ organizers: Organizer[] }>

type RecognitionBadgeProps = Readonly<{
  recognition: OrganizerRecognition
  organizerName: string
}>

function RecognitionBadge({ recognition, organizerName }: RecognitionBadgeProps) {
  const logo = recognitionLogoByKind[recognition.kind]
  const variantClassName = styles[`RecognitionBadge--${recognition.kind}`]

  return (
    <a
      className={`${styles.RecognitionBadge} ${variantClassName}`}
      href={recognition.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`${recognition.label} page for ${organizerName}`}
      title={`${recognition.label} · ${organizerName}`}
    >
      <img className={styles.RecognitionBadge__image} src={logo.src} alt="" style={logo.imageStyle} />
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
