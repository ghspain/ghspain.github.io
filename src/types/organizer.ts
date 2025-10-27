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
  /** Short biography describing their role and expertise */
  bio: string
  /** GitHub profile URL */
  link: string
}
