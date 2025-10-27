import { useState, useEffect } from 'react'
import type { Organizer } from '../types/organizer'
import { fetchOrganizerData } from '../services/organizers'

interface UseOrganizersState {
  data: Organizer[]
  loading: boolean
  error: string | null
}

/**
 * Custom hook for loading organizers data
 * Handles fetching, loading state, and error management
 * @returns State object with data, loading, and error
 */
export const useOrganizers = (): UseOrganizersState => {
  const [state, setState] = useState<UseOrganizersState>({
    data: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let mounted = true

    const loadOrganizers = async () => {
      try {
        const organizers = await fetchOrganizerData()
        
        if (mounted) {
          setState({ data: organizers, loading: false, error: null })
        }
      } catch (err) {
        if (mounted) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error'
          setState({ data: [], loading: false, error: errorMessage })
        }
      }
    }

    loadOrganizers()

    return () => {
      mounted = false
    }
  }, [])

  return state
}
