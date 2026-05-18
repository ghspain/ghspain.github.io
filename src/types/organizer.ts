export type OrganizerRecognitionKind = 'github-star' | 'microsoft-mvp'

export type OrganizerRecognition = {
  /** Recognition program shown on top of the organizer portrait */
  kind: OrganizerRecognitionKind
  /** Visible badge label */
  label: string
  /** External profile or public recognition page */
  url: string
}

/**
 * Organizer represents a community organizer's public profile.
 * Each organizer has a GitHub presence and a bio describing their role.
 */
export type Organizer = {
  /** Unique identifier, typically GitHub username */
  id: string
  /** Display name */
  name: string
  /** Path to profile image (WebP format recommended for performance) */
  img: string
  /** Optional recognitions displayed as portrait overlays */
  recognitions?: OrganizerRecognition[]
  /** Short biography describing their role and expertise */
  bio: string
  /** GitHub profile URL */
  link: string
}
