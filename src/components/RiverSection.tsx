import { useState, useEffect } from 'react'
import { Section, Stack, AnimationProvider, SectionIntro } from '@primer/react-brand'
import type { Organizer } from '../types/organizer'
import { OrganizerList } from './subcomponents/OrganizerList'

interface LoadState {
  data: Organizer[]
  loading: boolean
  error: string | null
}

const buildDataUrl = (): string => {
  const publicUrl = (typeof process.env.PUBLIC_URL === 'string' && process.env.PUBLIC_URL.trim() !== '' 
    ? process.env.PUBLIC_URL 
    : '')
  const basePath = publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl
  return `${basePath}/data/organizers.json`
}

const fetchOrganizers = async (): Promise<Organizer[]> => {
  const url = buildDataUrl()
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Failed to load organizers`)
  }
  
  return response.json()
}

const RiverSection: React.FC = () => {
  const [state, setState] = useState<LoadState>({
    data: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let mounted = true

    const loadOrganizers = async () => {
      try {
        const organizers = await fetchOrganizers()
        
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

  const { data, loading, error } = state

  return (
    <Section paddingBlockStart="none" paddingBlockEnd="spacious" id="quienes-somos">
      <SectionIntro align="center">
        <SectionIntro.Heading size="3">¿Quiénes somos?</SectionIntro.Heading>
        <SectionIntro.Description>
          Un pequeño equipo voluntario que organiza los encuentros de la comunidad.
        </SectionIntro.Description>
      </SectionIntro>

      <Stack>
        <AnimationProvider>
          {loading && <div role="status">Cargando…</div>}
          {error && <div role="alert">Error: {error}</div>}
          {!loading && !error && <OrganizerList organizers={data} />}
        </AnimationProvider>
      </Stack>
    </Section>
  )
}

export default RiverSection
