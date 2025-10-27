import type { Organizer } from '../types/organizer'

/**
 * Builds the data URL respecting PUBLIC_URL environment variable
 * @returns The constructed URL to the organizers data file
 */
export const buildOrganizerDataUrl = (): string => {
  const publicUrl = (typeof process.env.PUBLIC_URL === 'string' && process.env.PUBLIC_URL.trim() !== '' 
    ? process.env.PUBLIC_URL 
    : '')
  const basePath = publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl
  return `${basePath}/data/organizers.json`
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
