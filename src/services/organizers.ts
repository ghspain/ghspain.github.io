import type { Organizer } from '../types/organizer'
import { getBasePath } from '../utils/publicUrl'

/**
 * Builds the data URL respecting PUBLIC_URL environment variable
 * @returns The constructed URL to the organizers data file
 */
export const buildOrganizerDataUrl = (): string => {
  const basePath = getBasePath()
  return `${basePath}/data/organizers.json`
}

/**
 * Builds the image URL for an organizer profile photo
 * Handles relative, absolute, and full URLs
 * @param imagePath Path or URL to the image
 * @returns Complete URL for the image
 */
export const getOrganizerImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
    return imagePath
  }
  const basePath = getBasePath()
  return `${basePath}/${imagePath}`
}

/**
 * Fetches organizers data from the API
 * @returns Promise with array of organizers
 * @throws Error if fetch fails or HTTP response is not ok
 */
export const fetchOrganizerData = async (): Promise<Organizer[]> => {
  const url = buildOrganizerDataUrl()
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Failed to load organizers`)
  }
  
  return response.json()
}
