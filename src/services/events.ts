import type { EventData } from '../types/event'
import { getBasePath } from '../utils/publicUrl'

export const buildEventDataUrl = (): string => {
  const basePath = getBasePath()
  return `${basePath}/data/issues.json`
}

export const fetchEventData = async (): Promise<EventData[]> => {
  const response = await fetch(buildEventDataUrl())

  if (!response.ok) {
    throw new Error(`Error loading events: ${response.status}`)
  }

  return response.json()
}
