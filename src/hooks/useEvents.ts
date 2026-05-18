import { useEffect, useState } from 'react'
import { fetchEventData } from '../services/events'
import type { EventData } from '../types/event'

interface UseEventsState {
  data: EventData[]
  loading: boolean
  error: string | null
}

export const useEvents = (): UseEventsState => {
  const [state, setState] = useState<UseEventsState>({
    data: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let mounted = true

    const loadEvents = async () => {
      try {
        const events = await fetchEventData()

        if (mounted) {
          setState({ data: events, loading: false, error: null })
        }
      } catch (err) {
        if (mounted) {
          const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
          setState({ data: [], loading: false, error: errorMessage })
        }
      }
    }

    loadEvents()

    return () => {
      mounted = false
    }
  }, [])

  return state
}
